"use client"
import { useWorkflowStore } from "@/stores/workflowStore"
import { AIModel } from "@agentflow/shared-types"
import { X } from "lucide-react"

const MODELS: { value: AIModel; label: string }[] = [
  { value: "openai/gpt-3.5-turbo",        label: "GPT-3.5 Turbo" },
  { value: "openai/gpt-4o",               label: "GPT-4o" },
  { value: "anthropic/claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "groq/llama-3-70b-versatile",  label: "Groq Llama 3 70B" }
]

export default function NodeConfigPanel() {
  const { selectedNode, updateNodeData, setSelectedNode, removeNode } = useWorkflowStore()

  if (!selectedNode) return null

  const { type, label, query, url, model, condition, cronExpression, webhookPath } = selectedNode.data

  return (
    <div className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 shadow-2xl rounded-xl w-80 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Configure Node</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{type}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { removeNode(selectedNode.id); setSelectedNode(null) }}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
          <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Label</label>
          <input
            value={label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {(type === "agent" || type === "llm") && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                {type === "agent" ? "Agent Query" : "Prompt"}
              </label>
              <textarea
                value={query || ""}
                onChange={(e) => updateNodeData(selectedNode.id, { query: e.target.value })}
                rows={3}
                placeholder={type === "agent" ? "What is 45 * 20?" : "Summarize {{previous.output}}"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-gray-400 mt-1">Use {`{{previous.output}}`} to reference previous node</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">AI Model</label>
              <select
                value={model || "openai/gpt-3.5-turbo"}
                onChange={(e) => updateNodeData(selectedNode.id, { model: e.target.value as AIModel })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </>
        )}

        {type === "http" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">URL</label>
              <input
                value={url || ""}
                onChange={(e) => updateNodeData(selectedNode.id, { url: e.target.value })}
                placeholder="https://api.example.com/data"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </>
        )}

        {type === "condition" && (
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Condition</label>
            <input
              value={condition || ""}
              onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
              placeholder={`{{previous.output}} > 100`}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-400 mt-1">JavaScript expression. Returns true/false.</p>
          </div>
        )}

        {type === "cron" && (
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Cron Expression</label>
            <input
              value={cronExpression || "0 9 * * *"}
              onChange={(e) => updateNodeData(selectedNode.id, { cronExpression: e.target.value })}
              placeholder="0 9 * * *"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-400 mt-1">e.g. "0 9 * * *" = every day at 9am</p>
          </div>
        )}

        {type === "webhook" && (
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Webhook Path</label>
            <input
              value={webhookPath || "/my-webhook"}
              onChange={(e) => updateNodeData(selectedNode.id, { webhookPath: e.target.value })}
              placeholder="/my-webhook"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-400 mt-1">POST to /webhook{webhookPath || "/path"} to trigger</p>
          </div>
        )}
      </div>
    </div>
  )
}
