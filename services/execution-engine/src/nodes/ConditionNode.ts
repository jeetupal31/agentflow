import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"

export class ConditionNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { condition, trueValue = "true", falseValue = "false" } = input.parameters

    if (!condition) return this.failure("Condition expression is required")

    try {
      // Safe evaluation: replace {{previous.output}} with actual value
      const expr = condition
        .replace(/\{\{previous\.output\}\}/g, JSON.stringify(input.previousOutput))
        .replace(/\{\{previous\.output\.(\w+)\}\}/g, (_: string, key: string) => {
          const val = typeof input.previousOutput === "object" ? input.previousOutput?.[key] : undefined
          return JSON.stringify(val)
        })

      // Only allow safe expressions (no exec, eval, require, etc.)
      const forbidden = ["require", "import", "exec", "spawn", "process", "global", "__dirname"]
      if (forbidden.some(f => expr.includes(f))) {
        return this.failure("Condition contains forbidden keywords")
      }

      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${expr})`)()
      const branch = result ? "true" : "false"

      return this.success({ result: Boolean(result), branch, value: result ? trueValue : falseValue })
    } catch (err: any) {
      return this.failure(`Condition evaluation failed: ${err.message}`)
    }
  }
}
