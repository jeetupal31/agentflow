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
    <div className="absolute top-16 left-56 z-10 bg-white rounded-xl shadow-lg border border-gray-100 w-64">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-sm text-gray-800">My Workflows</h3>
        <button
          onClick={() => { setNodes([]); setEdges([]); setCurrentWorkflow(null, "") }}
          className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {isLoading && <p className="text-xs text-gray-400 text-center py-4">Loading…</p>}

        {!isLoading && (!data || data.length === 0) && (
          <p className="text-xs text-gray-400 text-center py-4">No workflows yet. Create one!</p>
        )}

        {data?.map((wf: any) => (
          <div key={wf._id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 group">
            <button onClick={() => loadWorkflow(wf)} className="flex items-center gap-2 flex-1 text-left min-w-0">
              <FolderOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{wf.name}</span>
            </button>
            <button
              onClick={() => deleteMut.mutate(wf._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
