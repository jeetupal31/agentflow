import { NodeType } from "@agentflow/shared-types"
import { BaseNode } from "./base/BaseNode"
import { HttpNode } from "./HttpNode"
import { LLMNode } from "./LLMNode"
import { AgentNode } from "./AgentNode"
import { ConditionNode } from "./ConditionNode"
import { WebhookNode } from "./WebhookNode"
import { CronNode } from "./CronNode"

const registry: Record<NodeType, BaseNode> = {
  http:      new HttpNode(),
  llm:       new LLMNode(),
  agent:     new AgentNode(),
  condition: new ConditionNode(),
  webhook:   new WebhookNode(),
  cron:      new CronNode()
}

export function getNodeExecutor(type: NodeType): BaseNode | undefined {
  return registry[type]
}
