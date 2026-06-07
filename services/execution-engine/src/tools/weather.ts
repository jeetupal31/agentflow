import axios from "axios"

export const weather = {
  execute: async (city: string): Promise<string> => {
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`, { timeout: 5000 })
      return res.data as string
    } catch {
      return `Could not fetch weather for ${city}`
    }
  }
}
