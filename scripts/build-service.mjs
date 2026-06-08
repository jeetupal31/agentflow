/**
 * Production bundler for AgentFlow backend services.
 * Run from a service directory: `node ../../scripts/build-service.mjs`
 *
 * - Bundles the service + all @agentflow/* workspace source into dist/server.js
 * - Externalizes every real npm dependency (resolved from node_modules at runtime)
 * - No type-checking → fast, and avoids monorepo rootDir cross-package errors
 */
import { build } from "esbuild"

const externalizeNodeModules = {
  name: "externalize-node-modules",
  setup(b) {
    b.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === "entry-point") return
      // bundle relative imports, absolute paths, and our workspace packages
      if (
        args.path.startsWith(".") ||
        args.path.startsWith("/") ||
        args.path.startsWith("@agentflow/")
      ) {
        return
      }
      // everything else (express, mongoose, winston, bullmq, …) stays external
      return { path: args.path, external: true }
    })
  }
}

await build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "dist/server.js",
  sourcemap: false,
  logLevel: "info",
  plugins: [externalizeNodeModules]
})

console.log("✅ bundled dist/server.js")
