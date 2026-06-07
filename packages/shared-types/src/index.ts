// ─── Node Types ───────────────────────────────────────────────────────────────

export type NodeType = "agent" | "llm" | "http" | "condition" | "webhook" | "cron"

export type AIModel =
  | "openai/gpt-3.5-turbo"
  | "openai/gpt-4o"
  | "anthropic/claude-3-5-sonnet"
  | "groq/llama-3-70b-versatile"

export interface WorkflowNode {
  id: string
  type: NodeType
  data: {
    label: string
    type: NodeType
    query?: string
    url?: string
    method?: string
    model?: AIModel
    condition?: string
    cronExpression?: string
    webhookPath?: string
  }
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

export interface Workflow {
  _id?: string
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface WorkflowRunRequest {
  workflowId?: string
  nodes: Array<{
    id: string
    type: NodeType
    parameters: Record<string, any>
  }>
  edges: WorkflowEdge[]
}

// ─── Execution ────────────────────────────────────────────────────────────────

export type ExecutionStatus = "pending" | "running" | "completed" | "failed"
export type NodeStatus = "idle" | "running" | "success" | "error"

export interface NodeExecutionResult {
  nodeId: string
  status: NodeStatus
  output?: any
  error?: string
  startedAt: string
  completedAt?: string
  durationMs?: number
}

export interface ExecutionLog {
  _id?: string
  executionId: string
  workflowId?: string
  userId: string
  status: ExecutionStatus
  nodeResults: NodeExecutionResult[]
  startedAt: string
  completedAt?: string
  totalDurationMs?: number
}

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface SocketEvents {
  // server → client
  execution_started: { executionId: string }
  node_started: { executionId: string; nodeId: string }
  node_completed: { executionId: string; nodeId: string; output: any }
  node_failed: { executionId: string; nodeId: string; error: string }
  workflow_completed: { executionId: string; results: Record<string, any> }
  workflow_failed: { executionId: string; error: string }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: { id: string; email: string }
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
