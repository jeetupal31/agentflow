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
    <div className="w-full h-screen relative overflow-hidden bg-slate-50">
      <NodePalette />
      <Toolbar onLogout={handleLogout} />
      <WorkflowList />
      <NodeConfigPanel />
      <ExecutionLogDrawer />
      <TemplateModal />

      <div className="ml-52 h-full">
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
          <MiniMap nodeStrokeWidth={3} zoomable pannable className="!bottom-4 !right-4" />
          <Controls className="!bottom-4 !left-4" />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        </ReactFlow>
      </div>
    </div>
  )
}
