"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { WorkflowNode, NodeType } from "@agentflow/shared-types"
import { cn } from "@/lib/utils"
import { LayoutTemplate, Workflow, Bot, Sparkles, Globe, GitBranch, Webhook, Clock } from "lucide-react"

const NODE_DEFS = [
  { type: "agent",     label: "Agent",     Icon: Bot,       desc: "ReAct AI reasoning loop",   grad: "from-blue-500/20 to-blue-600/5",     ring: "hover:border-blue-400/60",   ic: "text-blue-400" },
  { type: "llm",       label: "LLM",       Icon: Sparkles,  desc: "Direct LLM prompt call",    grad: "from-purple-500/20 to-purple-600/5", ring: "hover:border-purple-400/60", ic: "text-purple-400" },
  { type: "http",      label: "HTTP",      Icon: Globe,     desc: "Fetch external API data",   grad: "from-green-500/20 to-green-600/5",   ring: "hover:border-green-400/60",  ic: "text-green-400" },
  { type: "condition", label: "Condition", Icon: GitBranch, desc: "Branch on true/false",      grad: "from-amber-500/20 to-amber-600/5",   ring: "hover:border-amber-400/60",  ic: "text-amber-400" },
  { type: "webhook",   label: "Webhook",   Icon: Webhook,   desc: "Receive external triggers", grad: "from-orange-500/20 to-orange-600/5", ring: "hover:border-orange-400/60", ic: "text-orange-400" },
  { type: "cron",      label: "Cron",      Icon: Clock,     desc: "Schedule on a timer",       grad: "from-sky-500/20 to-sky-600/5",       ring: "hover:border-sky-400/60",    ic: "text-sky-400" }
]

export default function NodePalette() {
  const { addNode, nodes, setShowTemplates } = useWorkflowStore()

  function handleAddNode(type: NodeType, label: string) {
    const id = `${type}-${Date.now()}`
    const node: WorkflowNode = {
      id,
      type,
      data: { label: `${label} Node`, type },
      position: { x: 220 + Math.random() * 180, y: 140 + nodes.length * 70 }
    }
    addNode(node)
  }

  return (
    <aside className="absolute left-0 top-0 h-full w-60 glass border-r border-white/10 flex flex-col z-20">
      {/* Brand header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center glow-indigo">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight gradient-text leading-none">AgentFlow</h1>
            <p className="text-[10px] text-slate-500 mt-1">AI workflow builder</p>
          </div>
        </div>
      </div>

      {/* Nodes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">
          Drag or click to add
        </p>

        {NODE_DEFS.map((def) => (
          <button
            key={def.type}
            onClick={() => handleAddNode(def.type as NodeType, def.label)}
            className={cn(
              "group w-full text-left p-3 rounded-xl border border-white/10 transition-all duration-200",
              "bg-gradient-to-br hover:scale-[1.02] active:scale-[0.99]",
              def.grad,
              def.ring
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <def.Icon className={cn("w-4 h-4", def.ic)} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-slate-100 block leading-none">{def.label}</span>
                <p className="text-[11px] text-slate-400 mt-1 truncate">{def.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setShowTemplates(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-slate-200 transition-colors"
        >
          <LayoutTemplate className="w-4 h-4 text-brand-400" />
          Templates
        </button>
      </div>
    </aside>
  )
}
