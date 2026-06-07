import axios from "axios"
import { BaseNode, NodeInput, NodeOutput } from "./base/BaseNode"

export class HttpNode extends BaseNode {
  async execute(input: NodeInput): Promise<NodeOutput> {
    const { url, method = "GET", body, headers = {} } = input.parameters

    if (!url) return this.failure("URL is required for HTTP node")

    try {
      const response = await axios({
        method: method.toUpperCase(),
        url,
        data: method !== "GET" ? body : undefined,
        headers,
        timeout: 10000
      })

      return this.success(response.data)
    } catch (err: any) {
      return this.failure(`HTTP ${method} ${url} failed: ${err.message}`)
    }
  }
}
