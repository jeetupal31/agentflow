import axios from "axios"
import { getRuntimeEnv } from "./runtimeEnv"

const AUTH_URL = getRuntimeEnv("NEXT_PUBLIC_AUTH_URL", "http://localhost:4001")
const WORKFLOW_URL = getRuntimeEnv("NEXT_PUBLIC_WORKFLOW_URL", "http://localhost:4002")
const ENGINE_URL = getRuntimeEnv("NEXT_PUBLIC_ENGINE_URL", "http://localhost:4003")

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (data: { email: string; password: string; name?: string }) =>
    axios.post(`${AUTH_URL}/auth/signup`, data),
  login: (data: { email: string; password: string }) =>
    axios.post(`${AUTH_URL}/auth/login`, data),
  me: () => axios.get(`${AUTH_URL}/auth/me`, { headers: authHeader() })
}

// ─── Workflows ────────────────────────────────────────────────────────────────
export const workflowApi = {
  list: () => axios.get(`${WORKFLOW_URL}/workflows`, { headers: authHeader() }),
  get: (id: string) => axios.get(`${WORKFLOW_URL}/workflows/${id}`, { headers: authHeader() }),
  create: (data: any) => axios.post(`${WORKFLOW_URL}/workflows`, data, { headers: authHeader() }),
  update: (id: string, data: any) => axios.put(`${WORKFLOW_URL}/workflows/${id}`, data, { headers: authHeader() }),
  delete: (id: string) => axios.delete(`${WORKFLOW_URL}/workflows/${id}`, { headers: authHeader() }),
  templates: () => axios.get(`${WORKFLOW_URL}/workflows/meta/templates`, { headers: authHeader() })
}

// ─── Execution ────────────────────────────────────────────────────────────────
export const executionApi = {
  run: (payload: { nodes: any[]; edges: any[]; workflowId?: string }) =>
    axios.post(`${ENGINE_URL}/run-workflow`, payload, { headers: authHeader() }),
  history: (params?: { limit?: number; page?: number; status?: string }) =>
    axios.get(`${ENGINE_URL}/executions`, { headers: authHeader(), params }),
  getExecution: (id: string) =>
    axios.get(`${ENGINE_URL}/executions/${id}`, { headers: authHeader() })
}
