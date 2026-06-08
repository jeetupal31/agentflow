/**
 * Reads config at RUNTIME (from window.__ENV__, injected by /env.js) first, then
 * falls back to build-time NEXT_PUBLIC_* vars, then to localhost for dev.
 *
 * This lets the same Docker image work against any backend URLs the host assigns
 * (e.g. Render's random *.onrender.com suffixes) without rebuilding.
 */
declare global {
  interface Window {
    __ENV__?: Record<string, string>
  }
}

type EnvKey =
  | "NEXT_PUBLIC_AUTH_URL"
  | "NEXT_PUBLIC_WORKFLOW_URL"
  | "NEXT_PUBLIC_ENGINE_URL"

const BUILD_ENV: Record<EnvKey, string | undefined> = {
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_WORKFLOW_URL: process.env.NEXT_PUBLIC_WORKFLOW_URL,
  NEXT_PUBLIC_ENGINE_URL: process.env.NEXT_PUBLIC_ENGINE_URL
}

export function getRuntimeEnv(key: EnvKey, fallback: string): string {
  if (typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]
  }
  return BUILD_ENV[key] || fallback
}
