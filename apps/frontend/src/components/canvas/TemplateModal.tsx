"use client"
import { useEffect, useState } from "react"
import { useWorkflowStore } from "@/stores/workflowStore"
import { workflowApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { toast } from "sonner"

export default function TemplateModal() {
  const { showTemplates, setShowTemplates, setNodes, setEdges, setCurrentWorkflow } = useWorkflowStore()
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    if (showTemplates) {
      workflowApi.templates()
        .then(res => setTemplates(res.data.data))
        .catch(() => toast.error("Failed to load templates"))
    }
  }, [showTemplates])

  function loadTemplate(tpl: any) {
    setNodes(tpl.nodes || [])
    setEdges(tpl.edges || [])
    setCurrentWorkflow(null, tpl.name)
    setShowTemplates(false)
    toast.success(`Loaded template: ${tpl.name}`)
  }

  return (
    <AnimatePresence>
      {showTemplates && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowTemplates(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="glass rounded-2xl shadow-panel max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white">Workflow Templates</h2>
                  <p className="text-sm text-slate-400">Start from a pre-built workflow</p>
                </div>
                <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl)}
                    className="text-left p-4 bg-white/5 border border-white/10 hover:border-brand-500/60 hover:bg-white/10 rounded-xl transition-all duration-150 group"
                  >
                    <h3 className="font-semibold text-slate-100 group-hover:text-brand-300">{tpl.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{tpl.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {tpl.nodes.map((n: any) => (
                        <span key={n.id} className="text-xs bg-brand-500/15 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded-full capitalize">
                          {n.type}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
