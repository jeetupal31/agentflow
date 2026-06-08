"use client"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  BackgroundVariant
} from "reactflow"
import "reactflow/dist/style.css"

import { useWorkflowStore } from "@/stores/workflowStore"
import NodePalette from "@/components/canvas/NodePalette"
import Toolbar from "@/components/canvas/Toolbar"
import NodeConfigPanel from "@/components/canvas/NodeConfigPanel"
import ExecutionLogDrawer from "@/components/canvas/ExecutionLogDrawer"
import WorkflowList from "@/components/canvas/WorkflowList"
import TemplateModal from "@/components/canvas/TemplateModal"

import AgentNode from "@/components/nodes/AgentNode"
import LLMNode from "@/components/nodes/LLMNode"
import HttpNode from "@/components/nodes/HttpNode"
import ConditionNode from "@/components/nodes/ConditionNode"
import WebhookNode from "@/components/nodes/WebhookNode"
import CronNode from "@/components/nodes/CronNode"

const NODE_TYPES = {
  agent: AgentNode,
  llm: LLMNode,
  http: HttpNode,
  condition: ConditionNode,
  webhook: WebhookNode,
  cron: CronNode
}

export default function CanvasPage() {
  const router = useRouter()
  const { nodes, edges, setNodes, setEdges, setSelectedNode } = useWorkflowStore()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
  }, [router])

  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge({ ...connection, animated: true }, edges)),
    [edges, setEdges]
  )

  function handleLogout() {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-ink-900">
      {/* edge gradient definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>

      <NodePalette />
      <Toolbar onLogout={handleLogout} />
      <WorkflowList />
      <NodeConfigPanel />
      <ExecutionLogDrawer />
      <TemplateModal />

      <div className="ml-60 h-full">
        <ReactFlow
          nodes={nodes as any}
          edges={edges as any}
          onNodesChange={(changes) => {
            setNodes(
              changes.reduce((acc: any[], change: any) => {
                if (change.type === "remove") return acc.filter((n: any) => n.id !== change.id)
                if (change.type === "position" && change.position) {
                  return acc.map((n: any) => n.id === change.id ? { ...n, position: change.position } : n)
                }
                return acc
              }, nodes as any[])
            )
          }}
          onEdgesChange={(changes) => {
            setEdges(
              changes.reduce((acc: any[], change: any) => {
                if (change.type === "remove") return acc.filter((e: any) => e.id !== change.id)
                return acc
              }, edges as any[])
            )
          }}
          onConnect={onConnect}
          nodeTypes={NODE_TYPES as any}
          onNodeClick={(_event, node) => setSelectedNode(node as any)}
          onPaneClick={() => setSelectedNode(null)}
          fitView
        >
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="!bottom-4 !right-4"
            maskColor="rgba(10, 10, 15, 0.7)"
            style={{ background: "#11121c" }}
            nodeColor="#6366f1"
          />
          <Controls className="!bottom-4 !left-4" />
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#2a2d44" />
        </ReactFlow>
      </div>
    </div>
  )
}
