import { Router, Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import { enqueueWorkflow } from "../queue/producer"
import { ExecutionLog } from "../models/ExecutionLog"
import { ValidationError, UnauthorizedError } from "@agentflow/shared-utils"

const router = Router()

function getUserFromToken(req: Request): { id: string; email: string } {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) throw new UnauthorizedError("No token")
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
  return { id: decoded.id, email: decoded.email }
}

// POST /run-workflow — enqueue execution, returns executionId immediately
router.post("/run-workflow", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUserFromToken(req)
    const { nodes, edges, workflowId } = req.body

    if (!nodes?.length) throw new ValidationError("Nodes array is required and cannot be empty")

    const executionId = uuidv4()

    await enqueueWorkflow({ executionId, userId: user.id, workflowId, nodes, edges: edges || [], trigger: "manual" })

    res.status(202).json({ success: true, data: { executionId, message: "Workflow queued for execution" } })
  } catch (err) { next(err) }
})

// POST /webhook/:path — trigger workflow via webhook
router.post("/webhook/:path", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nodes, edges, userId, workflowId } = req.body
    if (!nodes?.length) throw new ValidationError("Workflow payload is required")

    const executionId = uuidv4()
    const webhookNode = nodes.find((n: any) => n.type === "webhook")
    if (webhookNode) {
      webhookNode.parameters.webhookPayload = req.body
      webhookNode.parameters.webhookPath = `/${req.params.path}`
    }

    await enqueueWorkflow({ executionId, userId: userId || "anonymous", workflowId, nodes, edges: edges || [], trigger: "webhook" })

    res.status(202).json({ success: true, data: { executionId, triggered: true } })
  } catch (err) { next(err) }
})

// GET /executions — get execution history for user
router.get("/executions", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUserFromToken(req)
    const { limit = 20, page = 1, status } = req.query

    const filter: any = { userId: user.id }
    if (status) filter.status = status

    const logs = await ExecutionLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("-nodeResults")

    const total = await ExecutionLog.countDocuments(filter)

    res.json({ success: true, data: { logs, total, page: Number(page), limit: Number(limit) } })
  } catch (err) { next(err) }
})

// GET /executions/:id — get single execution with full node results
router.get("/executions/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getUserFromToken(req)
    const log = await ExecutionLog.findOne({ executionId: req.params.id, userId: user.id })
    if (!log) throw new ValidationError("Execution not found")
    res.json({ success: true, data: log })
  } catch (err) { next(err) }
})

export default router
