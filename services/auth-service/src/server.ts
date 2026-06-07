import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { connectDB } from "./config/db"
import authRoutes from "./routes/authRoutes"
import { createLogger, AppError } from "@agentflow/shared-utils"

dotenv.config()

const logger = createLogger("auth-service")
const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(morgan("combined"))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" })
app.use(limiter)

app.use("/auth", authRoutes)

app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }))

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  logger.error(err.message, { stack: err.stack })
  res.status(statusCode).json({ success: false, error: err.message })
})

const PORT = process.env.AUTH_PORT || 4001

connectDB().then(() => {
  app.listen(PORT, () => logger.info(`Auth service running on port ${PORT}`))
})

export { app }
