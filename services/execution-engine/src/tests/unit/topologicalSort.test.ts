import { describe, it, expect } from "vitest"

// Extract the sort function for testing (copy here to avoid server bootstrap)
function topologicalSort(
  nodes: Array<{ id: string; type: string; parameters: any }>,
  edges: Array<{ source: string; target: string }>
) {
  const inDegree = new Map<string, number>()
  const graph = new Map<string, string[]>()

  for (const node of nodes) {
    inDegree.set(node.id, 0)
    graph.set(node.id, [])
  }

  for (const edge of edges) {
    graph.get(edge.source)?.push(edge.target)
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  }

  const queue = nodes.filter(n => inDegree.get(n.id) === 0)
  const sorted: typeof nodes = []

  while (queue.length) {
    const node = queue.shift()!
    sorted.push(node)
    for (const neighbor of graph.get(node.id) || []) {
      const deg = (inDegree.get(neighbor) || 1) - 1
      inDegree.set(neighbor, deg)
      if (deg === 0) {
        const neighborNode = nodes.find(n => n.id === neighbor)
        if (neighborNode) queue.push(neighborNode)
      }
    }
  }

  if (sorted.length !== nodes.length) throw new Error("Cycle detected")
  return sorted
}

const makeNode = (id: string) => ({ id, type: "llm", parameters: {} })

describe("topologicalSort", () => {
  it("sorts linear chain A→B→C correctly", () => {
    const nodes = [makeNode("A"), makeNode("B"), makeNode("C")]
    const edges = [{ source: "A", target: "B" }, { source: "B", target: "C" }]
    const sorted = topologicalSort(nodes, edges)
    expect(sorted.map(n => n.id)).toEqual(["A", "B", "C"])
  })

  it("handles single node with no edges", () => {
    const nodes = [makeNode("A")]
    const sorted = topologicalSort(nodes, [])
    expect(sorted.map(n => n.id)).toEqual(["A"])
  })

  it("handles parallel branches", () => {
    const nodes = [makeNode("A"), makeNode("B"), makeNode("C"), makeNode("D")]
    const edges = [{ source: "A", target: "C" }, { source: "B", target: "C" }, { source: "C", target: "D" }]
    const sorted = topologicalSort(nodes, edges)
    const idxA = sorted.findIndex(n => n.id === "A")
    const idxB = sorted.findIndex(n => n.id === "B")
    const idxC = sorted.findIndex(n => n.id === "C")
    const idxD = sorted.findIndex(n => n.id === "D")
    expect(idxA).toBeLessThan(idxC)
    expect(idxB).toBeLessThan(idxC)
    expect(idxC).toBeLessThan(idxD)
  })

  it("throws on cyclic graph", () => {
    const nodes = [makeNode("A"), makeNode("B")]
    const edges = [{ source: "A", target: "B" }, { source: "B", target: "A" }]
    expect(() => topologicalSort(nodes, edges)).toThrow("Cycle detected")
  })
})
