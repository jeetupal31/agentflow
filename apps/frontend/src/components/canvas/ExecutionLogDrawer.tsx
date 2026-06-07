"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ExecutionLogDrawer() {
  const { showLogDrawer, setShowLogDrawer, nodeStates, executionId, nodes, isRunning } = useWorkflowStore()

  const entries = Object.entries(nodeStates).map(([nodeId, state]) => {
    const node = nodes.find(n => n.id === nodeId)
    return { nodeId, label: node?.data.label || nodeId, type: node?.data.type || "unknown", ...state }
  })

  return (
    <AnimatePresence>
      {showLogDrawer && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-52 right-0 z-30 bg-gray-900 text-white rounded-t-2xl shadow-2xl max-h-72 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Execution Log</span>
              {executionId && <code className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{executionId.slice(0, 8)}…</code>}
              {isRunning && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            </div>
            <button onClick={() => setShowLogDrawer(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {entries.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No execution data yet. Run a workflow to see logs here.</p>
            )}

            {entries.map((entry) => (
              <div key={entry.nodeId} className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                entry.status === "success" && "bg-green-900/30 border-green-700/50",
                entry.status === "error"   && "bg-red-900/30 border-red-700/50",
                entry.status === "running" && "bg-blue-900/30 border-blue-700/50",
                entry.status === "idle"    && "bg-gray-800 border-gray-700"
              )}>
                <span className="mt-0.5">
                  {entry.status === "success" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {entry.status === "error"   && <XCircle className="w-4 h-4 text-red-400" />}
                  {entry.status === "running" && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                  {entry.status === "idle"    && <Clock className="w-4 h-4 text-gray-500" />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{entry.label}</span>
                    <span className="text-xs text-gray-500 uppercase">{entry.type}</span>
                  </div>

                  {entry.output && (
                    <pre className="text-xs text-green-300 mt-1 whitespace-pre-wrap break-all max-h-20 overflow-y-auto">
                      {typeof entry.output === "string" ? entry.output : JSON.stringify(entry.output, null, 2)}
                    </pre>
                  )}

                  {entry.error && (
                    <p className="text-xs text-red-300 mt-1">{entry.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
