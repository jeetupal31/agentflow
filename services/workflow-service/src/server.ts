import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import { connectDB } from "./config/db"
import workflowRoutes from "./routes/workflowRoutes"
import { createLogger, AppError } from "@agentflow/shared-utils"

dotenv.config()

const logger = createLogger("workflow-service")
const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(morgan("combined"))

app.use("/workflows", workflowRoutes)
app.get("/health", (_req, res) => res.json({ status: "ok", service: "workflow-service" }))

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  logger.error(err.message, { stack: err.stack })
  res.status(statusCode).json({ success: false, error: err.message })
})

const PORT = process.env.WORKFLOW_PORT || 4002

connectDB().then(() => {
  app.listen(PORT, () => logger.info(`Workflow service running on port ${PORT}`))
})

export { app }
