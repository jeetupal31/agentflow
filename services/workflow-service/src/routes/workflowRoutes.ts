import { Router, Response, NextFunction } from "express"
import { Workflow } from "../models/Workflow"
import { authMiddleware, AuthRequest } from "../middleware/auth"
import { NotFoundError, ValidationError } from "@agentflow/shared-utils"

const router = Router()
router.use(authMiddleware)

// GET all workflows for user
router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workflows = await Workflow.find({ userId: req.user!.id }).sort({ updatedAt: -1 })
    res.json({ success: true, data: workflows })
  } catch (err) { next(err) }
})

// GET single workflow
router.get("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wf = await Workflow.findOne({ _id: req.params.id, userId: req.user!.id })
    if (!wf) throw new NotFoundError("Workflow")
    res.json({ success: true, data: wf })
  } catch (err) { next(err) }
})

// POST create workflow
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, nodes, edges, description, tags } = req.body
    if (!name) throw new ValidationError("Workflow name is required")
    const wf = await Workflow.create({ userId: req.user!.id, name, nodes, edges, description, tags })
    res.status(201).json({ success: true, data: wf })
  } catch (err) { next(err) }
})

// PUT update workflow
router.put("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wf = await Workflow.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!wf) throw new NotFoundError("Workflow")
    res.json({ success: true, data: wf })
  } catch (err) { next(err) }
})

// DELETE workflow
router.delete("/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wf = await Workflow.findOneAndDelete({ _id: req.params.id, userId: req.user!.id })
    if (!wf) throw new NotFoundError("Workflow")
    res.json({ success: true, message: "Workflow deleted" })
  } catch (err) { next(err) }
})

// GET workflow templates
router.get("/meta/templates", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const templates = [
      {
        id: "weather-report",
        name: "Daily Weather Report",
        description: "Fetch weather and summarize with AI",
        nodes: [
          { id: "1", type: "http", data: { label: "HTTP Node", type: "http", url: "https://wttr.in/London?format=j1" }, position: { x: 100, y: 100 } },
          { id: "2", type: "llm", data: { label: "LLM Node", type: "llm", query: "Summarize this weather data in one sentence: {{1.output}}" }, position: { x: 400, y: 100 } }
        ],
        edges: [{ id: "e1-2", source: "1", target: "2" }]
      },
      {
        id: "ai-calculator",
        name: "AI Math Solver",
        description: "Solve complex math problems with ReAct agent",
        nodes: [
          { id: "1", type: "agent", data: { label: "Agent Node", type: "agent", query: "Calculate compound interest for $1000 at 8% for 5 years" }, position: { x: 200, y: 150 } }
        ],
        edges: []
      },
      {
        id: "research-agent",
        name: "Research Pipeline",
        description: "HTTP fetch + LLM analysis + Agent reasoning",
        nodes: [
          { id: "1", type: "http", data: { label: "Fetch Data", type: "http", url: "https://api.github.com/repos/vercel/next.js" }, position: { x: 50, y: 150 } },
          { id: "2", type: "llm", data: { label: "Analyze", type: "llm", query: "Analyze this GitHub repo data and give 3 key insights" }, position: { x: 350, y: 150 } },
          { id: "3", type: "agent", data: { label: "Reason", type: "agent", query: "Based on the analysis, what should a developer know?" }, position: { x: 650, y: 150 } }
        ],
        edges: [{ id: "e1-2", source: "1", target: "2" }, { id: "e2-3", source: "2", target: "3" }]
      }
    ]
    res.json({ success: true, data: templates })
  } catch (err) { next(err) }
})

export default router
