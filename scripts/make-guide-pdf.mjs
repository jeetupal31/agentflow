/**
 * Renders docs/INTERVIEW_GUIDE.md into a styled PDF at docs/AgentFlow-Interview-Guide.pdf
 * Usage: node scripts/make-guide-pdf.mjs
 */
import { marked } from "marked"
import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const mdPath = path.join(root, "docs", "INTERVIEW_GUIDE.md")
const outPath = path.join(root, "docs", "AgentFlow-Interview-Guide.pdf")

const md = fs.readFileSync(mdPath, "utf8")
const body = marked.parse(md)

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b; line-height: 1.6; font-size: 12px; max-width: 820px; margin: 0 auto; padding: 8px 24px;
  }
  h1 { font-size: 26px; color: #4f46e5; border-bottom: 3px solid #6366f1; padding-bottom: 8px; margin-top: 28px; }
  h2 { font-size: 19px; color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 26px; page-break-after: avoid; }
  h3 { font-size: 15px; color: #5b21b6; margin-top: 18px; page-break-after: avoid; }
  h1, h2, h3 { page-break-inside: avoid; }
  p, li { font-size: 12px; }
  a { color: #4f46e5; text-decoration: none; }
  code { background: #f1f5f9; color: #be185d; padding: 1px 5px; border-radius: 4px; font-size: 11px;
         font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; }
  pre { background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; overflow-x: auto;
        page-break-inside: avoid; font-size: 10.5px; line-height: 1.45; }
  pre code { background: none; color: #e2e8f0; padding: 0; font-size: 10.5px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 11px; page-break-inside: avoid; }
  th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; vertical-align: top; }
  th { background: #eef2ff; color: #3730a3; }
  blockquote { border-left: 4px solid #6366f1; background: #f5f3ff; margin: 12px 0; padding: 8px 14px;
               border-radius: 0 6px 6px 0; color: #4c1d95; page-break-inside: avoid; }
  blockquote p { margin: 4px 0; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 22px 0; }
  ul, ol { padding-left: 22px; }
  strong { color: #1e293b; }
</style></head>
<body>${body}</body></html>`

const tmpHtml = path.join(root, "docs", "_guide.tmp.html")
fs.writeFileSync(tmpHtml, html)

const browser = await puppeteer.launch({
  headless: "shell",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
})
const page = await browser.newPage()
await page.goto("file://" + tmpHtml.replace(/\\/g, "/"), { waitUntil: "networkidle0" })
await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: '<div style="width:100%;font-size:8px;color:#94a3b8;text-align:center;">AgentFlow — Interview Guide · Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>'
})
await browser.close()
fs.unlinkSync(tmpHtml)
const kb = (fs.statSync(outPath).size / 1024).toFixed(0)
console.log(`✅ PDF generated: ${outPath} (${kb} KB)`)
