import { Server as SocketServer } from "socket.io"
import { createLogger } from "@agentflow/shared-utils"
import { getNodeExecutor } from "../nodes/registry"
import { ExecutionLog } from "../models/ExecutionLog"
import { NodeType } from "@agentflow/shared-types"

const logger = createLogger("workflow-executor")

export interface WorkflowPayload {
  executionId: string
  userId: string
  workflowId?: string
  trigger?: "manual" | "webhook" | "cron"
  nodes: Array<{ id: string; type: string; parameters: Record<string, any> }>
  edges: Array<{ source: string; target: string }>
}

// Kahn's algorithm topological sort
function topologicalSort(
  nodes: WorkflowPayload["nodes"],
  edges: WorkflowPayload["edges"]
): WorkflowPayload["nodes"] {
  const inDegree = new Map<string, number>()
  const graph = new Map<string, string[]>()

  for (const node of nodes) {
    inDegree.set(node.id, 0)
    graph.set(node.id, [])
  }

  for (const edge of edges) {
    graph.get(edge.source)?.push(edge.target)
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  }

  const queue = nodes.filter(n => inDegree.get(n.id) === 0)
  const sorted: WorkflowPayload["nodes"] = []

  while (queue.length) {
    const node = queue.shift()!
    sorted.push(node)
    for (const neighbor of graph.get(node.id) || []) {
      const deg = (inDegree.get(neighbor) || 1) - 1
      inDegree.set(neighbor, deg)
      if (deg === 0) {
        const neighborNode = nodes.find(n => n.id === neighbor)
        if (neighborNode) queue.push(neighborNode)
      }
    }
  }

  if (sorted.length !== nodes.length) {
    throw new Error("Workflow contains a cycle — cannot execute")
  }

  return sorted
}

// Get the source node's id for a given target
function getSourceId(nodeId: string, edges: WorkflowPayload["edges"]): string | undefined {
  return edges.find(e => e.target === nodeId)?.source
}

export async function executeWorkflow(
  payload: WorkflowPayload,
  io?: SocketServer
): Promise<Record<string, any>> {
  const { executionId, userId, workflowId, nodes, edges, trigger = "manual" } = payload
  const results: Record<string, any> = {}
  const startedAt = new Date()

  // Create execution log entry
  const log = await ExecutionLog.create({
    executionId,
    workflowId,
    userId,
    status: "running",
    nodeResults: [],
    startedAt,
    trigger
  })

  io?.to(executionId).emit("execution_started", { executionId })
  logger.info("Workflow execution started", { executionId, nodeCount: nodes.length })

  let sortedNodes: WorkflowPayload["nodes"]
  try {
    sortedNodes = topologicalSort(nodes, edges)
  } catch (err: any) {
    await log.updateOne({ status: "failed", completedAt: new Date() })
    io?.to(executionId).emit("workflow_failed", { executionId, error: err.message })
    throw err
  }

  const nodeResults: any[] = []

  for (const node of sortedNodes) {
    const nodeStart = new Date()
    io?.to(executionId).emit("node_started", { executionId, nodeId: node.id })

    const executor = getNodeExecutor(node.type as NodeType)

    if (!executor) {
      const result = { nodeId: node.id, nodeType: node.type, status: "error", error: `Unknown node type: ${node.type}`, startedAt: nodeStart, completedAt: new Date(), durationMs: 0 }
      nodeResults.push(result)
      results[node.id] = { error: result.error }
      io?.to(executionId).emit("node_failed", { executionId, nodeId: node.id, error: result.error })
      continue
    }

    const sourceId = getSourceId(node.id, edges)
    const previousOutput = sourceId ? results[sourceId] : undefined

    try {
      const output = await executor.execute({ id: node.id, type: node.type, parameters: node.parameters, previousOutput })
      const completedAt = new Date()
      const durationMs = completedAt.getTime() - nodeStart.getTime()

      if (output.success) {
        results[node.id] = output.data
        nodeResults.push({ nodeId: node.id, nodeType: node.type, status: "success", output: output.data, startedAt: nodeStart, completedAt, durationMs })
        io?.to(executionId).emit("node_completed", { executionId, nodeId: node.id, output: output.data })
        logger.info("Node completed", { executionId, nodeId: node.id, durationMs })
      } else {
        results[node.id] = { error: output.error }
        nodeResults.push({ nodeId: node.id, nodeType: node.type, status: "error", error: output.error, startedAt: nodeStart, completedAt, durationMs })
        io?.to(executionId).emit("node_failed", { executionId, nodeId: node.id, error: output.error })
        logger.warn("Node failed", { executionId, nodeId: node.id, error: output.error })
      }
    } catch (err: any) {
      const completedAt = new Date()
      const durationMs = completedAt.getTime() - nodeStart.getTime()
      results[node.id] = { error: err.message }
      nodeResults.push({ nodeId: node.id, nodeType: node.type, status: "error", error: err.message, startedAt: nodeStart, completedAt, durationMs })
      io?.to(executionId).emit("node_failed", { executionId, nodeId: node.id, error: err.message })
      logger.error("Node threw exception", { executionId, nodeId: node.id, error: err.message })
    }
  }

  const completedAt = new Date()
  const totalDurationMs = completedAt.getTime() - startedAt.getTime()

  await log.updateOne({ status: "completed", nodeResults, completedAt, totalDurationMs })
  io?.to(executionId).emit("workflow_completed", { executionId, results })
  logger.info("Workflow completed", { executionId, totalDurationMs })

  return results
}
