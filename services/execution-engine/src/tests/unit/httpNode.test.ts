import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock axios before importing the node
vi.mock("axios", () => ({
  default: vi.fn()
}))

import axios from "axios"
import { HttpNode } from "../../nodes/HttpNode"

const node = new HttpNode()

describe("HttpNode", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("returns failure when URL is missing", async () => {
    const result = await node.execute({ id: "1", type: "http", parameters: {} })
    expect(result.success).toBe(false)
    expect(result.error).toContain("URL is required")
  })

  it("makes a GET request and returns data", async () => {
    vi.mocked(axios).mockResolvedValue({ data: { name: "test" } } as any)
    const result = await node.execute({ id: "1", type: "http", parameters: { url: "https://example.com/api", method: "GET" } })
    expect(result.success).toBe(true)
    expect(result.data).toEqual({ name: "test" })
  })

  it("handles network errors gracefully", async () => {
    vi.mocked(axios).mockRejectedValue(new Error("Network error"))
    const result = await node.execute({ id: "1", type: "http", parameters: { url: "https://example.com/api" } })
    expect(result.success).toBe(false)
    expect(result.error).toContain("Network error")
  })
})
