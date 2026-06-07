import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: { reporter: ["text", "json", "html"], include: ["src/**/*.ts"], exclude: ["src/tests/**"] }
  },
  resolve: {
    alias: {
      "@agentflow/shared-types": path.resolve(__dirname, "../../packages/shared-types/src"),
      "@agentflow/shared-utils": path.resolve(__dirname, "../../packages/shared-utils/src")
    }
  }
})
