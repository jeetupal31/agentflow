"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { AIModel } from "@agentflow/shared-types"
import { X, Trash2, Settings2 } from "lucide-react"

const MODELS: { value: AIModel; label: string }[] = [
  { value: "openai/gpt-3.5-turbo",        label: "GPT-3.5 Turbo" },
  { value: "openai/gpt-4o",               label: "GPT-4o" },
  { value: "anthropic/claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "groq/llama-3-70b-versatile",  label: "Groq Llama 3 70B" }
]

const field = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/60 transition-all"
const lbl = "text-[11px] font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider"
const hint = "text-[11px] text-slate-500 mt-1.5"

export default function NodeConfigPanel() {
  const { selectedNode, updateNodeData, setSelectedNode, removeNode } = useWorkflowStore()

  if (!selectedNode) return null

  const { type, label, query, url, model, condition, cronExpression, webhookPath } = selectedNode.data

  return (
    <div className="absolute top-20 right-4 z-20 glass shadow-panel rounded-2xl w-80 animate-float-up">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-white leading-none">Configure Node</h2>
            <p className="text-[10px] text-brand-400 uppercase tracking-widest mt-1">{type}</p>
          </div>
        </div>
        <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className={lbl}>Label</label>
          <input
            value={label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className={field}
          />
        </div>

        {(type === "agent" || type === "llm") && (
          <>
            <div>
              <label className={lbl}>{type === "agent" ? "Agent Query" : "Prompt"}</label>
              <textarea
                value={query || ""}
                onChange={(e) => updateNodeData(selectedNode.id, { query: e.target.value })}
                rows={3}
                placeholder={type === "agent" ? "What is 45 * 20?" : "Summarize {{previous.output}}"}
                className={field + " resize-none font-mono"}
              />
              <p className={hint}>Use <code className="text-brand-400">{`{{previous.output}}`}</code> to reference previous node</p>
            </div>
            <div>
              <label className={lbl}>AI Model</label>
              <select
                value={model || "openai/gpt-3.5-turbo"}
                onChange={(e) => updateNodeData(selectedNode.id, { model: e.target.value as AIModel })}
                className={field}
              >
                {MODELS.map(m => <option key={m.value} value={m.value} className="bg-ink-800">{m.label}</option>)}
              </select>
            </div>
          </>
        )}

        {type === "http" && (
          <div>
            <label className={lbl}>URL</label>
            <input
              value={url || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { url: e.target.value })}
              placeholder="https://api.example.com/data"
              className={field + " font-mono"}
            />
          </div>
        )}

        {type === "condition" && (
          <div>
            <label className={lbl}>Condition</label>
            <input
              value={condition || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
              placeholder={`{{previous.output}} > 100`}
              className={field + " font-mono"}
            />
            <p className={hint}>JavaScript expression. Returns true/false.</p>
          </div>
        )}

        {type === "cron" && (
          <div>
            <label className={lbl}>Cron Expression</label>
            <input
              value={cronExpression || "0 9 * * *"}
              onChange={(e) => updateNodeData(selectedNode.id, { cronExpression: e.target.value })}
              placeholder="0 9 * * *"
              className={field + " font-mono"}
            />
            <p className={hint}>e.g. &quot;0 9 * * *&quot; = every day at 9am</p>
          </div>
        )}

        {type === "webhook" && (
          <div>
            <label className={lbl}>Webhook Path</label>
            <input
              value={webhookPath || "/my-webhook"}
              onChange={(e) => updateNodeData(selectedNode.id, { webhookPath: e.target.value })}
              placeholder="/my-webhook"
              className={field + " font-mono"}
            />
            <p className={hint}>POST to /webhook{webhookPath || "/path"} to trigger</p>
          </div>
        )}

        <button
          onClick={() => { removeNode(selectedNode.id); setSelectedNode(null) }}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors mt-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete node
        </button>
      </div>
    </div>
  )
}
