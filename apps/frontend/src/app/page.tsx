"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Workflow, Bot, Sparkles, Globe, GitBranch, Webhook, Clock,
  ArrowRight, Github, Zap, Boxes, Radio, ShieldCheck, Layers, PlayCircle
} from "lucide-react"

const NODES = [
  { Icon: Bot,       title: "AI Agent",  desc: "ReAct reasoning loop that thinks, then uses tools (calculator, web).", color: "text-blue-400",   ring: "border-blue-500/30" },
  { Icon: Sparkles,  title: "LLM",       desc: "Direct prompt to GPT-4o, Claude 3.5, or Groq Llama via OpenRouter.",    color: "text-purple-400", ring: "border-purple-500/30" },
  { Icon: Globe,     title: "HTTP",      desc: "Fetch data from any external REST API and pipe it downstream.",         color: "text-green-400",  ring: "border-green-500/30" },
  { Icon: GitBranch, title: "Condition", desc: "Branch the flow on a true/false expression (safely sandboxed).",        color: "text-amber-400",  ring: "border-amber-500/30" },
  { Icon: Webhook,   title: "Webhook",   desc: "Trigger a workflow from any external service via a POST.",              color: "text-orange-400", ring: "border-orange-500/30" },
  { Icon: Clock,     title: "Cron",      desc: "Run a workflow automatically on a recurring schedule.",                 color: "text-sky-400",    ring: "border-sky-500/30" }
]

const FEATURES = [
  { Icon: Boxes,      title: "Microservices",     desc: "3 independent services — Auth, Workflow, Execution Engine — each scales and fails on its own." },
  { Icon: Zap,        title: "Message Queue",     desc: "BullMQ + Redis run workflows asynchronously with automatic retries & exponential backoff." },
  { Icon: Radio,      title: "Real-time",         desc: "Socket.io streams each node's status to the canvas live as it executes." },
  { Icon: Bot,        title: "Multi-model AI",    desc: "Swap between GPT-4o, Claude 3.5 Sonnet, and Groq Llama 3 per node." },
  { Icon: ShieldCheck,title: "Secure by default", desc: "JWT auth, bcrypt hashing, helmet, rate-limiting, and expression sandboxing." },
  { Icon: Layers,     title: "DAG engine",        desc: "Topological sort (Kahn's algorithm) runs nodes in dependency order & detects cycles." }
]

const STACK = ["Next.js 14", "TypeScript", "Node.js", "Express", "MongoDB", "Redis", "BullMQ", "Socket.io", "React Flow", "Zustand", "Docker", "Turborepo", "Vitest", "Prometheus"]

export default function Landing() {
  const [authed, setAuthed] = useState(false)
  useEffect(() => { setAuthed(!!localStorage.getItem("token")) }, [])

  return (
    <main className="min-h-screen bg-ink-900 text-slate-200">
      {/* NAV */}
      <nav className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center glow-indigo">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">AgentFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/jeetupal31/agentflow" target="_blank" rel="noreferrer"
               className="hidden sm:flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <Link href={authed ? "/app" : "/login"} className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">Sign in</Link>
            <Link href={authed ? "/app" : "/signup"}
                  className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-fuchsia-600 hover:from-brand-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-600/30">
              {authed ? "Open App" : "Get started"}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Visual AI Workflow Automation
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            Build & run <span className="gradient-text">AI agent pipelines</span><br className="hidden sm:block" /> with a drag-and-drop canvas
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Connect AI agents, LLMs, HTTP calls, and logic into automated workflows — then watch
            them execute in real time. An open-source, n8n-style automation engine powered by a
            microservice backend and a Redis-backed job queue.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={authed ? "/app" : "/signup"}
                  className="group flex items-center gap-2 bg-gradient-to-r from-brand-600 to-fuchsia-600 hover:from-brand-500 hover:to-fuchsia-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-brand-600/30">
              <PlayCircle className="w-5 h-5" /> {authed ? "Open the app" : "Try it free"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="https://github.com/jeetupal31/agentflow" target="_blank" rel="noreferrer"
               className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium px-6 py-3 rounded-xl">
              <Github className="w-5 h-5" /> View source
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">No credit card required · Free to use</p>
        </div>
      </section>

      {/* PIPELINE STRIP */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { Icon: Webhook, label: "Trigger", c: "text-orange-400" },
              { Icon: Globe, label: "HTTP fetch", c: "text-green-400" },
              { Icon: Sparkles, label: "LLM analyze", c: "text-purple-400" },
              { Icon: Bot, label: "Agent reason", c: "text-blue-400" },
              { Icon: GitBranch, label: "Condition", c: "text-amber-400" }
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <s.Icon className={`w-4 h-4 ${s.c}`} /> <span className="text-slate-200">{s.label}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">Chain nodes together → press Run → see each one light up live.</p>
        </div>
      </section>

      {/* NODE TYPES */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">Six building blocks</h2>
        <p className="text-center text-slate-400 mt-2">Drag any of these onto the canvas and connect them.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {NODES.map((n) => (
            <div key={n.title} className={`bg-white/5 border ${n.ring} rounded-2xl p-5 hover:bg-white/10 transition-colors`}>
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <n.Icon className={`w-5 h-5 ${n.color}`} />
              </div>
              <h3 className="font-semibold text-slate-100">{n.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{n.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENGINEERING FEATURES */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">Built like production software</h2>
        <p className="text-center text-slate-400 mt-2">The engineering behind the canvas.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/20 to-fuchsia-500/10 flex items-center justify-center mb-3">
                <f.Icon className="w-5 h-5 text-brand-300" />
              </div>
              <h3 className="font-semibold text-slate-100">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-5 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">How a run works</h2>
        <div className="mt-10 space-y-4">
          {[
            ["1", "You press Run", "The browser sends your nodes + edges to the Execution Engine with your JWT."],
            ["2", "Job is queued", "BullMQ pushes the job into Redis so it's durable and retried on failure."],
            ["3", "Worker executes", "A worker sorts nodes by dependency (topological sort) and runs them in order."],
            ["4", "Live updates stream", "Each finished node emits a Socket.io event → the canvas turns it green instantly."],
            ["5", "Results persist", "The full run (status, outputs, timings) is saved to MongoDB as an ExecutionLog."]
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white font-bold flex items-center justify-center">{n}</div>
              <div>
                <h3 className="font-semibold text-slate-100">{t}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="max-w-4xl mx-auto px-5 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Tech stack</h2>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {STACK.map((t) => (
            <span key={t} className="text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">{t}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="glass rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-40 bg-brand-500/20 rounded-full blur-3xl" />
          <h2 className="relative text-2xl sm:text-3xl font-bold text-white">Ready to build your first AI workflow?</h2>
          <p className="relative text-slate-400 mt-2">Sign up and run a live pipeline in under a minute.</p>
          <Link href={authed ? "/app" : "/signup"}
                className="relative inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-brand-600 to-fuchsia-600 hover:from-brand-500 hover:to-fuchsia-500 text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-brand-600/30">
            {authed ? "Open the app" : "Get started free"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-brand-400" />
            <span>AgentFlow — Visual AI Workflow Automation</span>
          </div>
          <a href="https://github.com/jeetupal31/agentflow" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-300">
            <Github className="w-4 h-4" /> jeetupal31/agentflow
          </a>
        </div>
      </footer>
    </main>
  )
}
