import { Queue } from "bullmq"
import { redisConnection } from "../config/redis"
import { WorkflowPayload } from "../engine/WorkflowExecutor"

export const workflowQueue = new Queue<WorkflowPayload>("workflow-execution", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  }
})

export async function enqueueWorkflow(payload: WorkflowPayload) {
  const job = await workflowQueue.add("execute", payload, { jobId: payload.executionId })
  return job
}
