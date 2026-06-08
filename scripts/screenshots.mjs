/**
 * AgentFlow screenshot generator
 * Captures real PNG screenshots of the running app for the README.
 * Prereq: frontend on :3000, auth/workflow/engine on :4001-:4003
 * Usage: node scripts/screenshots.mjs
 */
import puppeteer from "puppeteer"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, "..", "apps", "frontend", "public", "screenshots")
fs.mkdirSync(OUT, { recursive: true })

const BASE = "http://localhost:3000"
const AUTH = "http://localhost:4001"
const KILL_ANIM = `*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important}`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getToken() {
  const creds = { email: "demo@agentflow.dev", password: "Demo1234!" }
  // try login, else signup
  for (const route of ["login", "signup"]) {
    try {
      const r = await fetch(`${AUTH}/auth/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route === "signup" ? { ...creds, name: "Demo User" } : creds)
      })
      const j = await r.json()
      if (j?.data?.token) return j.data.token
    } catch {}
  }
  throw new Error("could not obtain token")
}

async function main() {
  const token = await getToken()
  console.log("✓ token acquired")

  const browser = await puppeteer.launch({
    headless: "shell",
    args: [
      "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu",
      "--disable-dev-shm-usage"
    ],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  })
  const page = await browser.newPage()

  // ── 1. Login ──────────────────────────────────────────────────────────────
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle2" })
  await page.addStyleTag({ content: KILL_ANIM })
  await page.type('input[type="email"]', "demo@agentflow.dev")
  await page.type('input[type="password"]', "Demo1234!")
  await sleep(400)
  await page.screenshot({ path: path.join(OUT, "01-login.png") })
  console.log("✓ 01-login.png")

  // ── 2. Signup ─────────────────────────────────────────────────────────────
  await page.goto(`${BASE}/signup`, { waitUntil: "networkidle2" })
  await page.addStyleTag({ content: KILL_ANIM })
  await sleep(300)
  await page.screenshot({ path: path.join(OUT, "02-signup.png") })
  console.log("✓ 02-signup.png")

  // ── 3. Canvas with a built workflow ───────────────────────────────────────
  // set token then load canvas
  await page.evaluateOnNewDocument((t) => localStorage.setItem("token", t), token)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2" })
  await sleep(2500)
  await page.addStyleTag({ content: KILL_ANIM })

  // Open Templates and load the first template (pre-positioned, connected nodes)
  await page.evaluate(() => {
    const tb = Array.from(document.querySelectorAll("aside button")).find((b) =>
      b.textContent.includes("Templates")
    )
    tb && tb.click()
  })
  await sleep(1200)
  await page.evaluate(() => {
    const card = document.querySelector(".fixed .glass button, [class*='z-50'] button")
    // click first template card (has an h3)
    const cards = Array.from(document.querySelectorAll("button")).filter((b) => b.querySelector("h3"))
    if (cards[0]) cards[0].click()
  })
  await sleep(1500)
  // fit view
  await page.evaluate(() => {
    const fit = document.querySelector(".react-flow__controls-fitview")
    fit && fit.click()
  })
  await sleep(1200)
  await page.addStyleTag({ content: KILL_ANIM })
  await page.screenshot({ path: path.join(OUT, "03-canvas.png") })
  console.log("✓ 03-canvas.png")

  // ── 4. Run a workflow → capture execution log drawer ──────────────────────
  await page.evaluate(() => {
    const run = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent.trim().startsWith("Run")
    )
    run && run.click()
  })
  await sleep(6000) // let nodes execute and statuses stream in
  await page.addStyleTag({ content: KILL_ANIM })
  await page.screenshot({ path: path.join(OUT, "04-execution.png") })
  console.log("✓ 04-execution.png")

  await browser.close()
  console.log("\n✅ All screenshots saved to", OUT)
}

main().catch((e) => {
  console.error("screenshot error:", e.message)
  process.exit(1)
})
