import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../agents/llm", () => ({
  callLLM: vi.fn()
}))

import { callLLM } from "../../agents/llm"
import { agentExecutor } from "../../agents/agentExecutor"

describe("agentExecutor (ReAct loop)", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("returns final answer on first step", async () => {
    vi.mocked(callLLM).mockResolvedValueOnce('{"action":"final","answer":"The answer is 42"}')
    const result = await agentExecutor("What is 6 * 7?")
    expect(result).toBe("The answer is 42")
    expect(callLLM).toHaveBeenCalledTimes(1)
  })

  it("uses calculator tool then returns final answer", async () => {
    vi.mocked(callLLM)
      .mockResolvedValueOnce('{"action":"tool","tool":"calculator","input":"45*20"}')
      .mockResolvedValueOnce('{"action":"final","answer":"900"}')

    const result = await agentExecutor("What is 45 times 20?")
    expect(result).toBe("900")
    expect(callLLM).toHaveBeenCalledTimes(2)
  })

  it("returns plain text when LLM doesn't return JSON", async () => {
    vi.mocked(callLLM).mockResolvedValueOnce("Here is the answer: 42")
    const result = await agentExecutor("What is the meaning of life?")
    expect(result).toBe("Here is the answer: 42")
  })

  it("handles unknown tool gracefully and continues", async () => {
    vi.mocked(callLLM)
      .mockResolvedValueOnce('{"action":"tool","tool":"nonexistent","input":"test"}')
      .mockResolvedValueOnce('{"action":"final","answer":"fallback"}')

    const result = await agentExecutor("Test with bad tool")
    expect(result).toBe("fallback")
  })

  it("returns max steps message when loop exhausted", async () => {
    vi.mocked(callLLM).mockResolvedValue('{"action":"tool","tool":"calculator","input":"1+1"}')
    const result = await agentExecutor("Never ending", "openai/gpt-3.5-turbo", 3)
    expect(result).toContain("Max reasoning steps")
  })
})
