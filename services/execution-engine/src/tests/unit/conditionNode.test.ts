import { describe, it, expect } from "vitest"
import { ConditionNode } from "../../nodes/ConditionNode"

const node = new ConditionNode()

describe("ConditionNode", () => {
  it("evaluates true condition", async () => {
    const result = await node.execute({ id: "1", type: "condition", parameters: { condition: "5 > 3" } })
    expect(result.success).toBe(true)
    expect(result.data.result).toBe(true)
    expect(result.data.branch).toBe("true")
  })

  it("evaluates false condition", async () => {
    const result = await node.execute({ id: "1", type: "condition", parameters: { condition: "2 > 10" } })
    expect(result.success).toBe(true)
    expect(result.data.result).toBe(false)
    expect(result.data.branch).toBe("false")
  })

  it("interpolates previous output", async () => {
    const result = await node.execute({
      id: "1", type: "condition",
      parameters: { condition: "{{previous.output}} > 5" },
      previousOutput: 10
    })
    expect(result.success).toBe(true)
    expect(result.data.result).toBe(true)
  })

  it("blocks dangerous keywords", async () => {
    const result = await node.execute({ id: "1", type: "condition", parameters: { condition: "require('fs')" } })
    expect(result.success).toBe(false)
    expect(result.error).toContain("forbidden")
  })

  it("fails gracefully on invalid syntax", async () => {
    const result = await node.execute({ id: "1", type: "condition", parameters: { condition: "!!!" } })
    expect(result.success).toBe(false)
  })
})
