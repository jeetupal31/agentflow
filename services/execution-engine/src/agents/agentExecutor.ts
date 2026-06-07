import { AIModel } from "@agentflow/shared-types"
import { createLogger } from "@agentflow/shared-utils"
import { callLLM } from "./llm"
import { calculator } from "../tools/calculator"
import { weather } from "../tools/weather"

const logger = createLogger("agent-executor")

const TOOLS: Record<string, { description: string; execute: (input: string) => Promise<string> }> = {
  calculator: { description: "Perform mathematical calculations. Input: math expression string.", execute: calculator.execute },
  weather:    { description: "Get current weather for a city. Input: city name.", execute: weather.execute }
}

const TOOL_DESCRIPTIONS = Object.entries(TOOLS)
  .map(([name, t]) => `- ${name}: ${t.description}`)
  .join("\n")

export async function agentExecutor(
  query: string,
  model: AIModel = "openai/gpt-3.5-turbo",
  maxSteps = 5
): Promise<string> {
  let context = `User query: ${query}\n`

  for (let step = 0; step < maxSteps; step++) {
    const prompt = `
You are a ReAct AI agent. Reason step-by-step and use tools when needed.

Available tools:
${TOOL_DESCRIPTIONS}

Rules:
- Use tools for calculations, weather lookups, or factual data
- NEVER guess numerical answers — always use calculator
- Respond ONLY with valid JSON

Formats:
Tool call:   {"action":"tool","tool":"calculator","input":"45*20"}
Final answer: {"action":"final","answer":"The answer is 900"}

Current context:
${context}
`

    logger.info(`Agent step ${step + 1}`, { model })
    const raw = await callLLM(prompt, model)
    const cleaned = raw.replace(/```json|```/g, "").trim()

    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      // LLM gave plain text — treat as final
      return cleaned
    }

    if (parsed.action === "final") {
      logger.info("Agent finished", { steps: step + 1 })
      return parsed.answer
    }

    if (parsed.action === "tool") {
      const tool = TOOLS[parsed.tool]
      if (!tool) {
        context += `\nTool "${parsed.tool}" not found. Available: ${Object.keys(TOOLS).join(", ")}\n`
        continue
      }

      const result = await tool.execute(parsed.input)
      logger.info("Tool executed", { tool: parsed.tool, input: parsed.input, result })
      context += `\nStep ${step + 1}: Used tool "${parsed.tool}" with input "${parsed.input}". Result: ${result}\n`
    }
  }

  return "Max reasoning steps reached without a final answer."
}
