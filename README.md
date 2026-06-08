<div align="center">

# 🤖 AgentFlow

### Visual AI Workflow Automation Platform

**Build, connect, and execute AI agent pipelines on a drag-and-drop canvas — with a microservice backend, a Redis-backed job queue, and real-time execution streaming.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_App-6366f1?style=for-the-badge)](https://agentflow-frontend-2nhh.onrender.com)
[![Interview Guide](https://img.shields.io/badge/📘_Interview_Guide-PDF-be185d?style=for-the-badge)](./docs/AgentFlow-Interview-Guide.pdf)

[![CI](https://github.com/jeetupal31/agentflow/actions/workflows/ci.yml/badge.svg)](https://github.com/jeetupal31/agentflow/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/BullMQ%2FRedis-DC382D?logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

**🌐 [agentflow-frontend-2nhh.onrender.com](https://agentflow-frontend-2nhh.onrender.com)** &nbsp;·&nbsp; *(free tier — first load may take ~30–50s to wake up)*

</div>

---

## 📸 Screenshots

**Live execution** — an HTTP node fetches real data, an LLM node summarizes it, statuses stream live over WebSockets:

![Workflow execution](./apps/frontend/public/screenshots/04-execution.png)

<table>
<tr>
<td width="50%"><img src="./apps/frontend/public/screenshots/03-canvas.png" alt="Canvas"/><br/><sub><b>Drag-and-drop canvas</b></sub></td>
<td width="50%"><img src="./apps/frontend/public/screenshots/01-login.png" alt="Login"/><br/><sub><b>JWT authentication</b></sub></td>
</tr>
</table>

---

## ✨ Features

- 🎨 **Visual canvas** — drag, drop, and connect nodes (React Flow)
- 🧩 **6 node types** — HTTP, LLM, AI Agent, Condition, Webhook, Cron
- 🤖 **ReAct AI agents** — reason + act loop that can use tools
- 🧠 **Multi-model AI** — GPT-4o, Claude 3.5 Sonnet, Groq Llama (via OpenRouter)
- ⚡ **Async execution** — Redis/BullMQ queue with retries & exponential backoff
- 📡 **Real-time streaming** — per-node status pushed live via Socket.io
- 🔀 **DAG engine** — topological sort (Kahn's algorithm) with cycle detection
- 🔐 **Secure** — JWT auth, bcrypt, helmet, rate-limiting, expression sandboxing
- 🐳 **Production-ready** — Docker, CI/CD, Prometheus/Grafana, 29 tests

---

## 🏗 Architecture

```
                         ┌──────────────────────────────┐
                         │       Browser (Next.js)      │
                         │  React Flow canvas + Zustand │
                         └──────┬───────────────┬───────┘
                      REST/JWT  │               │  WebSocket (Socket.io)
            ┌───────────────────┼───────────────┼────────────────────┐
       ┌────▼─────┐      ┌──────▼──────┐   ┌─────▼──────────────────┐
       │  Auth    │      │  Workflow   │   │   Execution Engine     │
       │  :4001   │      │  :4002      │   │   :4003                │
       │ JWT/bcrypt│     │  CRUD/tmpl  │   │  BullMQ producer+worker│
       └────┬─────┘      └──────┬──────┘   │  Socket.io · executors │
            │                   │          └──────┬──────────┬──────┘
            └─────────┬─────────┘                 │      ┌───▼───┐
                 ┌────▼─────┐                      │      │ Redis │
                 │ MongoDB  │◄─── execution logs ──┘      │BullMQ │
                 └──────────┘                             └───────┘
                              LLM/Agent nodes → OpenRouter → GPT / Claude / Groq
```

**Request flow when you press “Run”:**
`POST /run-workflow` → enqueue job in Redis → worker topologically sorts the DAG →
executes each node → emits live Socket.io events → saves an `ExecutionLog` to MongoDB.

> 📘 A full, plain-English explanation of every part (with diagrams, code, and interview
> Q&A) is in **[docs/INTERVIEW_GUIDE.md](./docs/INTERVIEW_GUIDE.md)** (also as a [PDF](./docs/AgentFlow-Interview-Guide.pdf)).

---

## 🧰 Tech Stack

| Area | Technologies |
|------|-------------|
| **Frontend** | Next.js 14, TypeScript, React Flow, Zustand, React Query, Tailwind CSS, Socket.io-client |
| **Backend** | Node.js, Express, TypeScript (3 microservices) |
| **Data** | MongoDB (Mongoose), Redis |
| **Queue / Realtime** | BullMQ, Socket.io |
| **AI** | OpenRouter (GPT-4o · Claude 3.5 · Groq Llama) |
| **Monorepo** | Turborepo + npm workspaces |
| **DevOps** | Docker (multi-stage), GitHub Actions, Prometheus, Grafana |
| **Testing** | Vitest (29 unit + integration tests) |

---

## 📂 Project Structure

```
agentflow/
├── apps/frontend/              # Next.js UI (landing + canvas)
├── services/
│   ├── auth-service/           # JWT login/signup           (:4001)
│   ├── workflow-service/       # workflow CRUD + templates   (:4002)
│   └── execution-engine/       # queue, worker, executors    (:4003)
├── packages/
│   ├── shared-types/           # shared TypeScript interfaces
│   └── shared-utils/           # logger, error classes
├── infrastructure/docker/      # Dockerfile per service
├── docs/                       # interview guide (md + pdf)
├── render.yaml                 # one-click cloud deploy
└── docker-compose.yml          # full local stack
```

---

## 🚀 Getting Started

### Option 1 — Zero-config local (no DB install)
Spins up an in-memory MongoDB + all services + frontend. Needs Node 20+ and Redis 5+.
```bash
git clone https://github.com/jeetupal31/agentflow.git
cd agentflow && npm install
echo "OPENROUTER_API_KEY=sk-or-..." > services/execution-engine/.env
node dev-start.mjs            # → http://localhost:3000
```

### Option 2 — Docker Compose (full stack)
```bash
cp .env.example .env          # set OPENROUTER_API_KEY + JWT_SECRET
docker compose up --build     # → http://localhost:3000
```

### Option 3 — Deploy to the cloud (free tier)
One-click via [`render.yaml`](./render.yaml) + MongoDB Atlas + Redis. Full guide: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 🧪 Testing

```bash
npm test          # run all Vitest suites (29 tests)
```
Coverage focuses on the risky logic: the topological sort (incl. cycle detection), the
ReAct agent loop, the HTTP node, and the security sandboxes.

---

## 📡 API Overview

| Service | Endpoint | Description |
|---------|----------|-------------|
| Auth | `POST /auth/signup` · `POST /auth/login` · `GET /auth/me` | JWT auth |
| Workflow | `GET/POST/PUT/DELETE /workflows` · `GET /workflows/meta/templates` | CRUD + templates |
| Engine | `POST /run-workflow` · `GET /executions` · `GET /executions/:id` | run + history |
| All | `GET /health` | health check |

---

## 📚 Documentation

- 📘 **[Interview Guide (Markdown)](./docs/INTERVIEW_GUIDE.md)** · **[PDF](./docs/AgentFlow-Interview-Guide.pdf)** — every concept explained, basic → advanced, with Q&A
- 🚀 **[Deployment Guide](./DEPLOYMENT.md)** — Render / Vercel / AWS, all free tier

---

## 📄 License

MIT © Jeetu Pal
