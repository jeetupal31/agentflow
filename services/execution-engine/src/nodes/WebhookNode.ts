import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"

// Webhook node is a trigger — during execution it returns whatever webhook payload was passed in
export class WebhookNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { webhookPayload, webhookPath } = input.parameters

    return this.success({
      triggered: true,
      path: webhookPath || "/webhook",
      payload: webhookPayload || {},
      receivedAt: new Date().toISOString()
    })
  }
}
