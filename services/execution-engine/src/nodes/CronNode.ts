import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"

export class CronNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { cronExpression = "0 9 * * *", timezone = "UTC" } = input.parameters

    return this.success({
      triggered: true,
      cronExpression,
      timezone,
      triggeredAt: new Date().toISOString()
    })
  }
}
