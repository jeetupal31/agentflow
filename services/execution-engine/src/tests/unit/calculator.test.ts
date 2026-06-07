import { describe, it, expect } from "vitest"
import { calculator } from "../../tools/calculator"

describe("calculator tool", () => {
  it("adds two numbers", async () => {
    expect(await calculator.execute("2 + 3")).toBe("5")
  })

  it("multiplies correctly", async () => {
    expect(await calculator.execute("45 * 20")).toBe("900")
  })

  it("handles division", async () => {
    expect(await calculator.execute("100 / 4")).toBe("25")
  })

  it("handles parentheses", async () => {
    expect(await calculator.execute("(2 + 3) * 4")).toBe("20")
  })

  it("returns 'Invalid expression' for garbage input", async () => {
    expect(await calculator.execute("not a number")).toBe("Invalid expression")
  })

  it("sanitizes dangerous input", async () => {
    const result = await calculator.execute("require('fs').readFileSync('/etc/passwd')")
    expect(result).toBe("Invalid expression")
  })
})
