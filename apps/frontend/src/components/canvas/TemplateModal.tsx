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
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowTemplates(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-lg font-bold">Workflow Templates</h2>
                  <p className="text-sm text-gray-500">Start from a pre-built workflow</p>
                </div>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => loadTemplate(tpl)}
                    className="text-left p-4 border-2 border-gray-100 hover:border-brand-500 rounded-xl transition-all duration-150 group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">{tpl.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tpl.description}</p>
                    <div className="flex gap-2 mt-3">
                      {tpl.nodes.map((n: any) => (
                        <span key={n.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
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
