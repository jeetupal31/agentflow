import { AIModel } from "@agentflow/shared-types"
import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"
import { agentExecutor } from "../agents/agentExecutor"

export class AgentNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { query, model = "openai/gpt-3.5-turbo", maxSteps = 5 } = input.parameters

    if (!query) return this.failure("Query is required for Agent node")

    const resolvedQuery = input.previousOutput
      ? query.replace(/\{\{previous\.output\}\}/g, JSON.stringify(input.previousOutput))
      : query

    try {
      const result = await agentExecutor(resolvedQuery, model as AIModel, maxSteps)
      return this.success(result)
    } catch (err: any) {
      return this.failure(`Agent execution failed: ${err.message}`)
    }
  }
}
