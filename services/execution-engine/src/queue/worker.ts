import { Worker } from "bullmq"
import { Server as SocketServer } from "socket.io"
import { redisConnection } from "../config/redis"
import { executeWorkflow, WorkflowPayload } from "../engine/WorkflowExecutor"
import { createLogger } from "@agentflow/shared-utils"

const logger = createLogger("queue-worker")

export function startWorker(io: SocketServer) {
  const worker = new Worker<WorkflowPayload>(
    "workflow-execution",
    async (job) => {
      logger.info("Processing job", { jobId: job.id, executionId: job.data.executionId })
      return executeWorkflow(job.data, io)
    },
    {
      connection: redisConnection,
      concurrency: 5
    }
  )

  worker.on("completed", (job) => {
    logger.info("Job completed", { jobId: job.id })
  })

  worker.on("failed", (job, err) => {
    logger.error("Job failed", { jobId: job?.id, error: err.message })
  })

  worker.on("error", (err) => {
    logger.error("Worker error", { error: err.message })
  })

  logger.info("BullMQ worker started with concurrency 5")
  return worker
}
