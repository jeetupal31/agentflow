import { AIModel } from "@agentflow/shared-types"
import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"
import { callLLM } from "../agents/llm"

export class LLMNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    let { query, model = "openai/gpt-3.5-turbo", systemPrompt } = input.parameters

    // Normalize short model names to OpenRouter format
    const modelMap: Record<string, string> = {
      "gpt-3.5-turbo": "openai/gpt-3.5-turbo",
      "gpt-4o": "openai/gpt-4o",
      "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet",
      "llama-3": "meta-llama/llama-3-8b-instruct"
    }
    if (modelMap[model]) model = modelMap[model]

    if (!query) return this.failure("Query is required for LLM node")

    // Support {{previousNode.output}} interpolation
    const resolvedQuery = input.previousOutput
      ? query.replace(/\{\{previous\.output\}\}/g, JSON.stringify(input.previousOutput))
      : query

    try {
      const result = await callLLM(
        resolvedQuery,
        model as AIModel,
        systemPrompt || "You are a helpful AI assistant. Answer clearly and concisely."
      )
      return this.success(result)
    } catch (err: any) {
      return this.failure(`LLM call failed: ${err.message}`)
    }
  }
}
