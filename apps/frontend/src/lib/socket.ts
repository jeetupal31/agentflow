import { io, Socket } from "socket.io-client"
import { getRuntimeEnv } from "./runtimeEnv"

const ENGINE_URL = getRuntimeEnv("NEXT_PUBLIC_ENGINE_URL", "http://localhost:4003")

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(ENGINE_URL, { autoConnect: false, transports: ["websocket"] })
  }
  return socket
}

export function joinExecution(executionId: string) {
  const s = getSocket()
  if (!s.connected) s.connect()
  s.emit("join_execution", executionId)
}

export function leaveExecution() {
  socket?.disconnect()
  socket = null
}
