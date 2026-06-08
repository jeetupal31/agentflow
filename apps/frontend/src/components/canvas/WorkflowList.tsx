"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { workflowApi } from "@/lib/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Trash2, FolderOpen, Plus } from "lucide-react"

export default function WorkflowList() {
  const { setNodes, setEdges, setCurrentWorkflow } = useWorkflowStore()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: () => workflowApi.list().then(r => r.data.data)
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => workflowApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workflows"] }); toast.success("Deleted") },
    onError: () => toast.error("Failed to delete")
  })

  function loadWorkflow(wf: any) {
    setNodes(wf.nodes || [])
    setEdges(wf.edges || [])
    setCurrentWorkflow(wf._id, wf.name)
    toast.success(`Loaded: ${wf.name}`)
  }

  return (
    <div className="absolute top-20 left-64 z-10 glass rounded-2xl shadow-panel w-64">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm text-white">My Workflows</h3>
        <button
          onClick={() => { setNodes([]); setEdges([]); setCurrentWorkflow(null, "") }}
          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      <div className="max-h-52 overflow-y-auto p-1.5">
        {isLoading && <p className="text-xs text-slate-500 text-center py-4">Loading…</p>}

        {!isLoading && (!data || data.length === 0) && (
          <p className="text-xs text-slate-500 text-center py-4">No workflows yet. Create one!</p>
        )}

        {data?.map((wf: any) => (
          <div key={wf._id} className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/5 group transition-colors">
            <button onClick={() => loadWorkflow(wf)} className="flex items-center gap-2 flex-1 text-left min-w-0">
              <FolderOpen className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              <span className="text-sm text-slate-200 truncate">{wf.name}</span>
            </button>
            <button
              onClick={() => deleteMut.mutate(wf._id)}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
