import { AIModel } from "@agentflow/shared-types"
import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"
import { callLLM } from "../agents/llm"

export class LLMNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { query, model = "openai/gpt-3.5-turbo", systemPrompt } = input.parameters

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
