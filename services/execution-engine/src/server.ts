import express, { Request, Response, NextFunction } from "express"
import { createServer } from "http"
import { Server as SocketServer } from "socket.io"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"

import { connectDB } from "./config/db"
import { startWorker } from "./queue/worker"
import executionRoutes from "./routes/executionRoutes"
import { createLogger, AppError } from "@agentflow/shared-utils"

dotenv.config()

const logger = createLogger("execution-engine")
const app = express()
const httpServer = createServer(app)

// Socket.io setup
const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }
})

io.on("connection", (socket) => {
  logger.info("Client connected", { socketId: socket.id })

  // Client joins room by executionId to receive updates
  socket.on("join_execution", (executionId: string) => {
    socket.join(executionId)
    logger.info("Client joined execution room", { socketId: socket.id, executionId })
  })

  socket.on("disconnect", () => {
    logger.info("Client disconnected", { socketId: socket.id })
  })
})

// Export io so routes can use it
export { io }

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(morgan("combined"))

app.use("/", executionRoutes)
app.get("/health", (_req, res) => res.json({ status: "ok", service: "execution-engine" }))

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  logger.error(err.message, { stack: err.stack })
  res.status(statusCode).json({ success: false, error: err.message })
})

const PORT = process.env.ENGINE_PORT || 4003

connectDB().then(() => {
  startWorker(io)
  httpServer.listen(PORT, () => logger.info(`Execution engine running on port ${PORT}`))
})

export { app }
