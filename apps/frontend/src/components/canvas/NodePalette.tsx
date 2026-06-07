"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { WorkflowNode, NodeType } from "@agentflow/shared-types"
import { cn } from "@/lib/utils"
import { LayoutTemplate, Layers } from "lucide-react"

const NODE_DEFS = [
  { type: "agent",     label: "Agent",     icon: "🤖", desc: "ReAct AI reasoning loop",    color: "bg-blue-50 border-blue-300 hover:bg-blue-100" },
  { type: "llm",       label: "LLM",       icon: "✨", desc: "Direct LLM prompt call",     color: "bg-purple-50 border-purple-300 hover:bg-purple-100" },
  { type: "http",      label: "HTTP",      icon: "🌐", desc: "Fetch external API data",     color: "bg-green-50 border-green-300 hover:bg-green-100" },
  { type: "condition", label: "Condition", icon: "⚡", desc: "Branch on true/false logic",  color: "bg-amber-50 border-amber-300 hover:bg-amber-100" },
  { type: "webhook",   label: "Webhook",   icon: "🔗", desc: "Receive external triggers",   color: "bg-orange-50 border-orange-300 hover:bg-orange-100" },
  { type: "cron",      label: "Cron",      icon: "🕐", desc: "Schedule workflow on timer",  color: "bg-sky-50 border-sky-300 hover:bg-sky-100" }
]

export default function NodePalette() {
  const { addNode, nodes, setShowTemplates } = useWorkflowStore()

  function handleAddNode(type: NodeType, label: string) {
    const id = `${type}-${Date.now()}`
    const node: WorkflowNode = {
      id,
      type,
      data: { label: `${label} Node`, type },
      position: { x: 200 + Math.random() * 200, y: 150 + nodes.length * 80 }
    }
    addNode(node)
  }

  return (
    <aside className="absolute left-0 top-0 h-full w-52 bg-gray-900 text-white flex flex-col z-20 shadow-xl">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" />
          <h1 className="font-bold text-sm tracking-wide">AgentFlow</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">Drag nodes to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nodes</p>

        {NODE_DEFS.map((def) => (
          <button
            key={def.type}
            onClick={() => handleAddNode(def.type as NodeType, def.label)}
            className={cn(
              "w-full text-left p-2.5 rounded-lg border transition-all duration-150",
              "text-gray-800",
              def.color
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{def.icon}</span>
              <span className="font-medium text-sm">{def.label}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 pl-6">{def.desc}</p>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => setShowTemplates(true)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          <LayoutTemplate className="w-4 h-4 text-yellow-400" />
          Templates
        </button>
      </div>
    </aside>
  )
}
