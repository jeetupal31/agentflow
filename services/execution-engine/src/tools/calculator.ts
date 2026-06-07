export const calculator = {
  execute: async (input: string): Promise<string> => {
    try {
      const sanitized = input.replace(/[^0-9+\-*/().\s%]/g, "")
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${sanitized})`)()
      return String(result)
    } catch {
      return "Invalid expression"
    }
  }
}
