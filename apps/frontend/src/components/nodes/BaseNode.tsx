"use client"
import { Handle, Position } from "reactflow"
import { cn } from "@/lib/utils"
import { useWorkflowStore } from "@/stores/workflowStore"
import { Loader2, CheckCircle2, XCircle, Circle } from "lucide-react"

interface BaseNodeProps {
  id: string
  data: { label: string; type: string; query?: string; url?: string }
  selected?: boolean
  colorClass: string
  borderClass: string
  icon: React.ReactNode
}

const STATUS_ICONS = {
  idle:    <Circle className="w-3 h-3 text-gray-400" />,
  running: <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />,
  success: <CheckCircle2 className="w-3 h-3 text-green-500" />,
  error:   <XCircle className="w-3 h-3 text-red-500" />
}

export default function BaseNode({ id, data, selected, colorClass, borderClass, icon }: BaseNodeProps) {
  const nodeState = useWorkflowStore((s) => s.nodeStates[id])
  const status = nodeState?.status || "idle"

  return (
    <div
      className={cn(
        "min-w-[160px] rounded-xl border-2 px-4 py-3 shadow-md transition-all duration-200",
        colorClass,
        borderClass,
        selected && "ring-2 ring-offset-2 ring-brand-500 scale-105",
        status === "running" && "animate-pulse-slow",
        status === "error" && "border-red-500"
      )}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-gray-400" />

      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-sm leading-tight">{data.label}</span>
        <span className="ml-auto">{STATUS_ICONS[status]}</span>
      </div>

      {data.query && (
        <p className="text-xs text-gray-500 truncate max-w-[140px]" title={data.query}>
          {data.query.length > 30 ? data.query.slice(0, 30) + "…" : data.query}
        </p>
      )}
      {data.url && (
        <p className="text-xs text-gray-500 truncate max-w-[140px]" title={data.url}>
          {data.url}
        </p>
      )}

      {nodeState?.output && status === "success" && (
        <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded p-1 max-h-12 overflow-hidden">
          <span className="text-green-700 line-clamp-2">
            {typeof nodeState.output === "string"
              ? nodeState.output
              : JSON.stringify(nodeState.output).slice(0, 60) + "…"}
          </span>
        </div>
      )}

      {nodeState?.error && status === "error" && (
        <div className="mt-2 text-xs bg-red-50 border border-red-200 rounded p-1">
          <span className="text-red-700 line-clamp-2">{nodeState.error}</span>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-gray-400" />
    </div>
  )
}
