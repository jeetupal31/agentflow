"use client"
import { Handle, Position } from "reactflow"
import { cn } from "@/lib/utils"
import { useWorkflowStore } from "@/stores/workflowStore"
import { Loader2, CheckCircle2, XCircle, Circle } from "lucide-react"

interface BaseNodeProps {
  id: string
  data: { label: string; type: string; query?: string; url?: string }
  selected?: boolean
  accent: string        // e.g. "blue", "purple"
  icon: React.ReactNode
}

const STATUS = {
  idle:    { icon: <Circle className="w-3.5 h-3.5 text-slate-500" />,                 label: "Idle" },
  running: { icon: <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />,   label: "Running" },
  success: { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,         label: "Done" },
  error:   { icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,                  label: "Error" }
}

const ACCENT: Record<string, { ring: string; chip: string; icon: string; glow: string }> = {
  blue:   { ring: "border-blue-500/40",   chip: "bg-blue-500/15 text-blue-300",     icon: "from-blue-500 to-blue-600",     glow: "shadow-blue-500/20" },
  purple: { ring: "border-purple-500/40", chip: "bg-purple-500/15 text-purple-300", icon: "from-purple-500 to-purple-600", glow: "shadow-purple-500/20" },
  green:  { ring: "border-green-500/40",  chip: "bg-green-500/15 text-green-300",   icon: "from-green-500 to-green-600",   glow: "shadow-green-500/20" },
  amber:  { ring: "border-amber-500/40",  chip: "bg-amber-500/15 text-amber-300",   icon: "from-amber-500 to-amber-600",   glow: "shadow-amber-500/20" },
  orange: { ring: "border-orange-500/40", chip: "bg-orange-500/15 text-orange-300", icon: "from-orange-500 to-orange-600", glow: "shadow-orange-500/20" },
  sky:    { ring: "border-sky-500/40",    chip: "bg-sky-500/15 text-sky-300",       icon: "from-sky-500 to-sky-600",       glow: "shadow-sky-500/20" }
}

export default function BaseNode({ id, data, selected, accent, icon }: BaseNodeProps) {
  const nodeState = useWorkflowStore((s) => s.nodeStates[id])
  const status = (nodeState?.status || "idle") as keyof typeof STATUS
  const a = ACCENT[accent] || ACCENT.blue

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-2xl border bg-ink-800/90 backdrop-blur px-3.5 py-3 shadow-node transition-all duration-200",
        a.ring,
        `shadow-lg ${a.glow}`,
        selected && "ring-2 ring-brand-500 ring-offset-2 ring-offset-ink-900 scale-[1.03]",
        status === "running" && "glow-indigo animate-pulse-slow",
        status === "success" && "glow-success",
        status === "error" && "glow-error border-red-500/60"
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-brand-400 !border-2 !border-ink-900" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-base shrink-0", a.icon)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-slate-100 block leading-tight truncate">{data.label}</span>
          <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md mt-0.5 font-medium", a.chip)}>
            {data.type}
          </span>
        </div>
        <span className="shrink-0">{STATUS[status].icon}</span>
      </div>

      {/* Config preview */}
      {data.query && (
        <p className="text-[11px] text-slate-400 truncate mt-1.5 font-mono bg-white/5 rounded px-1.5 py-1" title={data.query}>
          {data.query.length > 32 ? data.query.slice(0, 32) + "…" : data.query}
        </p>
      )}
      {data.url && (
        <p className="text-[11px] text-slate-400 truncate mt-1.5 font-mono bg-white/5 rounded px-1.5 py-1" title={data.url}>
          {data.url}
        </p>
      )}

      {/* Output / error */}
      {nodeState?.output && status === "success" && (
        <div className="mt-2 text-[11px] bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-1.5">
          <span className="text-emerald-300 line-clamp-2">
            {typeof nodeState.output === "string"
              ? nodeState.output
              : JSON.stringify(nodeState.output).slice(0, 70) + "…"}
          </span>
        </div>
      )}
      {nodeState?.error && status === "error" && (
        <div className="mt-2 text-[11px] bg-red-500/10 border border-red-500/30 rounded-lg p-1.5">
          <span className="text-red-300 line-clamp-2">{nodeState.error}</span>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-brand-400 !border-2 !border-ink-900" />
    </div>
  )
}
