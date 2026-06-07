import mongoose from "mongoose"
import { createLogger } from "@agentflow/shared-utils"

const logger = createLogger("workflow-service")

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/agentflow"
  await mongoose.connect(uri)
  logger.info("MongoDB connected")
}
