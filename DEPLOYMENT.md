# 🚀 Deploying AgentFlow (100% Free Tier)

This guide deploys the full stack — 3 microservices, a real-time engine, MongoDB,
Redis, and the Next.js frontend — **without paying for anything**. It also covers
an AWS path if you'd rather host it yourself.

Everything in this repo is already wired for deployment: `render.yaml` (Render
Blueprint), `apps/frontend/vercel.json` (Vercel), `docker-compose.yml` (any VPS),
and multi-stage Dockerfiles for every service.

> ⚠️ Account creation, repo authorization, and entering API keys must be done by
> you in each provider's dashboard — those steps need your login.

---

## Architecture recap

| Component          | Port | Free host                         |
|--------------------|------|-----------------------------------|
| Frontend (Next.js) | 3000 | Vercel **or** Render              |
| Auth service       | 4001 | Render Free web service           |
| Workflow service   | 4002 | Render Free web service           |
| Execution engine   | 4003 | Render Free web service           |
| MongoDB            | —    | MongoDB Atlas **M0** (512 MB)     |
| Redis (BullMQ)     | —    | Render Key Value (25 MB) / Upstash|

---

## Option A — Render Blueprint (recommended, one repo, one click)

**1. Create the free databases**

- **MongoDB Atlas** → create a free **M0** cluster → *Database Access* add a user
  → *Network Access* allow `0.0.0.0/0` → copy the connection string. You'll use it
  twice:
  - `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/agentflow`        (auth + workflow)
  - `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/agentflow_logs`   (engine)
- **OpenRouter** → grab a key at <https://openrouter.ai/keys> (free models available).

**2. Deploy the Blueprint**

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to <https://dashboard.render.com> → **New ➜ Blueprint**.
3. Select your `agentflow` repo. Render reads [`render.yaml`](./render.yaml) and
   plans all 5 services (4 web + 1 Key Value).
4. When prompted, fill the secrets marked `sync:false`:
   - `MONGO_URI` on **auth**, **workflow** → the `/agentflow` URI
   - `MONGO_URI` on **engine** → the `/agentflow_logs` URI
   - `OPENROUTER_API_KEY` on **engine**
5. Click **Apply**. `JWT_SECRET`, `REDIS_URL`, and all cross-service URLs are wired
   automatically via `fromService` references.

First build takes ~5 min. Your app is live at
`https://agentflow-frontend.onrender.com`.

> 💡 Free web services sleep after 15 min idle and cold-start in ~30 s — perfect
> for a portfolio/demo project.

---

## Option B — Vercel (frontend) + Render (backend)

Vercel gives the snappiest frontend. Deploy the 3 backend services + Redis with the
Render Blueprint above (the frontend service there is harmless/optional), then:

1. <https://vercel.com/new> → import the repo.
2. **Root Directory** → `apps/frontend`.
3. Add environment variables (Production):
   ```
   NEXT_PUBLIC_AUTH_URL=https://agentflow-auth.onrender.com
   NEXT_PUBLIC_WORKFLOW_URL=https://agentflow-workflow.onrender.com
   NEXT_PUBLIC_ENGINE_URL=https://agentflow-engine.onrender.com
   ```
4. Deploy. Update each backend's `CORS_ORIGIN` to your Vercel URL.

---

## Option C — Any VPS / your own machine (Docker Compose)

```bash
git clone https://github.com/jeetupal31/agentflow.git
cd agentflow
cp .env.example .env        # set JWT_SECRET + OPENROUTER_API_KEY
docker compose up --build   # full stack incl. Mongo, Redis, Prometheus, Grafana
```

Frontend → http://localhost:3000 · Grafana → http://localhost:3001 ·
Prometheus → http://localhost:9090

---

## Option D — AWS (free tier)

If you specifically want AWS:

- **Frontend** → AWS Amplify Hosting (free tier) or S3 + CloudFront.
- **Backends** → a single `t2.micro`/`t3.micro` EC2 (free tier, 750 h/mo) running
  `docker compose up -d` from this repo. Open ports 3000–4003 in the security group.
- **MongoDB** → MongoDB Atlas M0 (free, works fine on AWS region) or DocumentDB
  (not free).
- **Redis** → run the bundled `redis:7` container, or ElastiCache (not free).
- **TLS / domain** → put everything behind an Application Load Balancer or Caddy/
  Nginx with Let's Encrypt.

For a single-box setup, EC2 + Docker Compose + Atlas is the cheapest and matches
local dev exactly.

---

## Post-deploy checklist

- [ ] `GET /health` returns `{"status":"ok"}` on all three backends
- [ ] Sign up works (writes to Atlas)
- [ ] Create + run a workflow; node statuses stream live (Socket.io)
- [ ] Engine logs show `BullMQ worker started` (Redis reachable, v5+)
- [ ] `CORS_ORIGIN` on each backend matches the deployed frontend URL
