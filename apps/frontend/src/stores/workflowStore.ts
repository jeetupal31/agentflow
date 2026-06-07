import { create } from "zustand"
import { WorkflowNode, WorkflowEdge, NodeStatus } from "@agentflow/shared-types"

interface NodeExecutionState {
  status: NodeStatus
  output?: any
  error?: string
}

interface WorkflowStore {
  // Canvas state
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: WorkflowNode | null
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  setSelectedNode: (node: WorkflowNode | null) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void
  addNode: (node: WorkflowNode) => void
  removeNode: (nodeId: string) => void

  // Execution state
  isRunning: boolean
  executionId: string | null
  executionResults: Record<string, any>
  nodeStates: Record<string, NodeExecutionState>
  setIsRunning: (v: boolean) => void
  setExecutionId: (id: string | null) => void
  setNodeState: (nodeId: string, state: NodeExecutionState) => void
  setExecutionResults: (results: Record<string, any>) => void
  resetExecution: () => void

  // UI state
  showLogDrawer: boolean
  showTemplates: boolean
  darkMode: boolean
  setShowLogDrawer: (v: boolean) => void
  setShowTemplates: (v: boolean) => void
  toggleDarkMode: () => void

  // Workflow metadata
  currentWorkflowName: string
  currentWorkflowId: string | null
  setCurrentWorkflow: (id: string | null, name: string) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
      selectedNode: state.selectedNode?.id === nodeId
        ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } }
        : state.selectedNode
    })),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
    })),

  isRunning: false,
  executionId: null,
  executionResults: {},
  nodeStates: {},
  setIsRunning: (v) => set({ isRunning: v }),
  setExecutionId: (id) => set({ executionId: id }),
  setNodeState: (nodeId, state) =>
    set((s) => ({ nodeStates: { ...s.nodeStates, [nodeId]: state } })),
  setExecutionResults: (results) => set({ executionResults: results }),
  resetExecution: () => set({ executionId: null, executionResults: {}, nodeStates: {}, isRunning: false }),

  showLogDrawer: false,
  showTemplates: false,
  darkMode: false,
  setShowLogDrawer: (v) => set({ showLogDrawer: v }),
  setShowTemplates: (v) => set({ showTemplates: v }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  currentWorkflowName: "",
  currentWorkflowId: null,
  setCurrentWorkflow: (id, name) => set({ currentWorkflowId: id, currentWorkflowName: name })
}))
