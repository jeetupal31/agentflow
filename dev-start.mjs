/**
 * AgentFlow Dev Startup Script
 * Starts: MongoDB (in-memory) + all 3 backend services + frontend
 * Usage: node dev-start.mjs
 */

import { MongoMemoryServer } from "mongodb-memory-server"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m"
}

function log(service, color, msg) {
  console.log(`${color}[${service}]${colors.reset} ${msg}`)
}

function startProcess(name, color, cmd, args, cwd, env = {}) {
  const proc = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
    stdio: ["ignore", "pipe", "pipe"]
  })

  proc.stdout.on("data", d => {
    d.toString().split("\n").filter(Boolean).forEach(line =>
      log(name, color, line)
    )
  })
  proc.stderr.on("data", d => {
    d.toString().split("\n").filter(Boolean).forEach(line =>
      log(name, colors.yellow, line)
    )
  })
  proc.on("error", err => log(name, colors.red, `Error: ${err.message}`))
  proc.on("exit", code => {
    if (code !== 0 && code !== null) log(name, colors.red, `Exited with code ${code}`)
  })

  return proc
}

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}
  ╔═══════════════════════════════════════╗
  ║    🤖  AgentFlow Dev Server           ║
  ║    Starting all services...           ║
  ╚═══════════════════════════════════════╝
  ${colors.reset}`)

  // ── 1. Start MongoDB in-memory ────────────────────────────────────────────
  log("MongoDB", colors.green, "Starting in-memory MongoDB...")
  const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } })
  const mongoUri = mongod.getUri()
  log("MongoDB", colors.green, `✅ MongoDB running at ${mongoUri}`)

  const MONGO_LOGS_URI = mongoUri.replace("27017/", "27017/") + "agentflow_logs"
  const MONGO_URI = mongoUri + "agentflow"

  // ── 2. Start Redis 8 on port 6380 ────────────────────────────────────────
  const redis8Paths = [
    "C:/Users/jeetu Pal cr/AppData/Local/Microsoft/WinGet/Packages/taizod1024.redis-windows-fork_Microsoft.Winget.Source_8wekyb3d8bbwe/Redis-8.8.0-Windows-x64-msys2/redis-server.exe",
  ]
  let redisStarted = false
  for (const rp of redis8Paths) {
    if (fs.existsSync(rp)) {
      log("Redis8 ", colors.green, "Starting Redis 8 on port 6380...")
      startProcess("Redis8 ", colors.green, rp, ["--port", "6380"], __dirname)
      await sleep(2000)
      redisStarted = true
      log("Redis8 ", colors.green, "✅ Redis 8 running on port 6380")
      break
    }
  }
  if (!redisStarted) log("Redis8 ", colors.yellow, "⚠️  Redis 8 not found — BullMQ may fail if Redis < 5")

  // ── 3. Service env vars ───────────────────────────────────────────────────
  const sharedEnv = {
    JWT_SECRET: "agentflow-dev-secret-key",
    NODE_ENV: "development",
    LOG_LEVEL: "info"
  }

  const tsNodeBin = path.join(__dirname, "node_modules", ".bin", "ts-node")
  const tsNode = process.platform === "win32" ? `${tsNodeBin}.cmd` : tsNodeBin

  const services = [
    {
      name: "AUTH   ",
      color: colors.blue,
      cwd: path.join(__dirname, "services/auth-service"),
      env: { ...sharedEnv, AUTH_PORT: "4001", CORS_ORIGIN: "http://localhost:3000", MONGO_URI }
    },
    {
      name: "WORKFLOW",
      color: colors.magenta,
      cwd: path.join(__dirname, "services/workflow-service"),
      env: { ...sharedEnv, WORKFLOW_PORT: "4002", CORS_ORIGIN: "http://localhost:3000", MONGO_URI }
    },
    {
      name: "ENGINE ",
      color: colors.cyan,
      cwd: path.join(__dirname, "services/execution-engine"),
      env: {
        ...sharedEnv,
        ENGINE_PORT: "4003",
        CORS_ORIGIN: "http://localhost:3000",
        MONGO_URI: MONGO_LOGS_URI,
        REDIS_URL: "redis://localhost:6380",
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || readEnvKey()
      }
    }
  ]

  // ── 3. Start backend services ─────────────────────────────────────────────
  const procs = []

  for (const svc of services) {
    log(svc.name, svc.color, `Starting on port ${svc.env[Object.keys(svc.env).find(k => k.includes("PORT"))]}...`)
    const proc = startProcess(
      svc.name, svc.color,
      "node",
      ["../../node_modules/ts-node/dist/bin.js", "--project", "tsconfig.json", "src/server.ts"],
      svc.cwd,
      svc.env
    )
    procs.push(proc)
    await sleep(1500) // stagger startup
  }

  // ── 4. Start frontend ─────────────────────────────────────────────────────
  await sleep(2000)
  log("FRONTEND", colors.green, "Starting Next.js on port 3000...")
  const frontendProc = startProcess(
    "FRONTEND", colors.green,
    "node",
    ["../../node_modules/next/dist/bin/next", "dev", "--port", "3000"],
    path.join(__dirname, "apps/frontend"),
    {
      NEXT_PUBLIC_AUTH_URL: "http://localhost:4001",
      NEXT_PUBLIC_WORKFLOW_URL: "http://localhost:4002",
      NEXT_PUBLIC_ENGINE_URL: "http://localhost:4003"
    }
  )
  procs.push(frontendProc)

  // ── 5. Print URLs ─────────────────────────────────────────────────────────
  await sleep(4000)
  console.log(`\n${colors.bold}${colors.green}
  ╔══════════════════════════════════════════════════╗
  ║  ✅  AgentFlow is running!                        ║
  ║                                                   ║
  ║  🎨 Frontend   →  http://localhost:3000           ║
  ║  🔐 Auth API   →  http://localhost:4001           ║
  ║  📁 Workflows  →  http://localhost:4002           ║
  ║  ⚡ Engine     →  http://localhost:4003           ║
  ║                                                   ║
  ║  Press Ctrl+C to stop all services                ║
  ╚══════════════════════════════════════════════════╝
  ${colors.reset}`)

  // ── 6. Graceful shutdown ──────────────────────────────────────────────────
  process.on("SIGINT", async () => {
    console.log(`\n${colors.yellow}Shutting down...${colors.reset}`)
    procs.forEach(p => p.kill())
    await mongod.stop()
    console.log(`${colors.green}✅ All services stopped.${colors.reset}`)
    process.exit(0)
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function readEnvKey() {
  try {
    const envPath = path.join(process.cwd(), "services/execution-engine/.env")
    const content = fs.readFileSync(envPath, "utf8")
    const match = content.match(/OPENROUTER_API_KEY=(.+)/)
    return match ? match[1].trim() : ""
  } catch { return "" }
}

main().catch(err => {
  console.error("Startup error:", err)
  process.exit(1)
})
