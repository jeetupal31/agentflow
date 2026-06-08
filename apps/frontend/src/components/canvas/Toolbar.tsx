"use client"
import { useState } from "react"
import { useWorkflowStore } from "@/stores/workflowStore"
import { executionApi, workflowApi } from "@/lib/api"
import { getSocket, joinExecution } from "@/lib/socket"
import { toast } from "sonner"
import { Play, Save, LogOut, Terminal, Moon, Sun, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Toolbar({ onLogout }: { onLogout: () => void }) {
  const {
    nodes, edges, currentWorkflowId, currentWorkflowName, setCurrentWorkflow,
    isRunning, setIsRunning, setExecutionId, setNodeState, setExecutionResults,
    setShowLogDrawer, showLogDrawer, resetExecution, darkMode, toggleDarkMode
  } = useWorkflowStore()

  const [workflowName, setWorkflowName] = useState(currentWorkflowName || "")
  const [saving, setSaving] = useState(false)

  async function handleRun() {
    if (!nodes.length) { toast.error("Add at least one node before running"); return }
    resetExecution()
    setIsRunning(true)
    setShowLogDrawer(true)

    try {
      const payload = {
        workflowId: currentWorkflowId || undefined,
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.data.type,
          parameters: {
            query: n.data.query,
            url: n.data.url,
            method: "GET",
            model: n.data.model || "openai/gpt-3.5-turbo",
            condition: n.data.condition,
            cronExpression: n.data.cronExpression,
            webhookPath: n.data.webhookPath
          }
        })),
        edges
      }

      const res = await executionApi.run(payload)
      const { executionId } = res.data.data
      setExecutionId(executionId)

      // Subscribe to Socket.io for real-time updates
      const socket = getSocket()
      joinExecution(executionId)

      socket.on("node_started", ({ nodeId }: any) => {
        setNodeState(nodeId, { status: "running" })
      })

      socket.on("node_completed", ({ nodeId, output }: any) => {
        setNodeState(nodeId, { status: "success", output })
      })

      socket.on("node_failed", ({ nodeId, error }: any) => {
        setNodeState(nodeId, { status: "error", error })
        toast.error(`Node failed: ${error.slice(0, 80)}`)
      })

      socket.on("workflow_completed", ({ results }: any) => {
        setExecutionResults(results)
        setIsRunning(false)
        toast.success("Workflow completed successfully!")
      })

      socket.on("workflow_failed", ({ error }: any) => {
        setIsRunning(false)
        toast.error(`Workflow failed: ${error}`)
      })
    } catch (err: any) {
      setIsRunning(false)
      toast.error(err.response?.data?.error || "Failed to start workflow")
    }
  }

  async function handleSave() {
    if (!workflowName.trim()) { toast.error("Enter a workflow name"); return }
    setSaving(true)
    try {
      const data = { name: workflowName, nodes, edges }
      if (currentWorkflowId) {
        await workflowApi.update(currentWorkflowId, data)
        toast.success("Workflow updated!")
      } else {
        const res = await workflowApi.create(data)
        setCurrentWorkflow(res.data.data._id, workflowName)
        toast.success("Workflow saved!")
      }
    } catch {
      toast.error("Failed to save workflow")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="absolute top-4 left-64 right-4 z-10 flex items-center gap-2 glass rounded-2xl px-3 py-2.5 shadow-panel">
      <input
        type="text"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        placeholder="Untitled workflow…"
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm w-48 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/60 transition-all"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save
      </button>

      <button
        onClick={handleRun}
        disabled={isRunning}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg",
          isRunning
            ? "bg-slate-600 text-slate-300 cursor-not-allowed"
            : "bg-gradient-to-r from-brand-600 to-fuchsia-600 hover:from-brand-500 hover:to-fuchsia-500 text-white shadow-brand-600/30"
        )}
      >
        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
        {isRunning ? "Running…" : "Run"}
      </button>

      <button
        onClick={() => setShowLogDrawer(!showLogDrawer)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors",
          showLogDrawer ? "bg-brand-500/20 text-brand-300 border-brand-500/40" : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
        )}
      >
        <Terminal className="w-4 h-4" />
        Logs
      </button>

      <button onClick={toggleDarkMode} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 hover:bg-white/10 transition-colors">
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="ml-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
