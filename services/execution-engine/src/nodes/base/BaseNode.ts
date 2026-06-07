export interface NodeInput {
  id: string
  type: string
  parameters: Record<string, any>
  previousOutput?: any
}

export interface NodeOutput {
  success: boolean
  data?: any
  error?: string
}

export abstract class BaseNode {
  abstract execute(input: NodeInput): Promise<NodeOutput>

  protected success(data: any): NodeOutput {
    return { success: true, data }
  }

  protected failure(error: string): NodeOutput {
    return { success: false, error }
  }
}
