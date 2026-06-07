import axios from "axios"
import { AIModel } from "@agentflow/shared-types"

const MODEL_CONFIGS: Record<string, { baseUrl: string; envKey: string }> = {
  "openai/gpt-3.5-turbo": { baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" },
  "openai/gpt-4o":        { baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" },
  "anthropic/claude-3-5-sonnet": { baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" },
  "groq/llama-3-70b-versatile":  { baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" }
}

export async function callLLM(
  prompt: string,
  model: AIModel = "openai/gpt-3.5-turbo",
  systemPrompt = "You must ONLY return JSON. No text outside JSON."
): Promise<string> {
  const config = MODEL_CONFIGS[model]
  if (!config) throw new Error(`Unsupported model: ${model}`)

  const apiKey = process.env[config.envKey]
  if (!apiKey) throw new Error(`Missing API key for ${model}. Set ${config.envKey} in .env`)

  const response = await axios.post(
    `${config.baseUrl}/chat/completions`,
    {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://agentflow.dev",
        "X-Title": "AgentFlow"
      },
      timeout: 30000
    }
  )

  return response.data.choices[0].message.content
}
