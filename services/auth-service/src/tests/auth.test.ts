import { describe, it, expect, beforeAll, afterAll, vi } from "vitest"

// Mock mongoose before importing anything
vi.mock("mongoose", async () => {
  const actual = await vi.importActual("mongoose")
  return {
    ...actual as object,
    connect: vi.fn().mockResolvedValue(undefined)
  }
})

vi.mock("../models/User", () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn()
  }
}))

import request from "supertest"
import { app } from "../server"
import { User } from "../models/User"
import bcrypt from "bcryptjs"

describe("Auth API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-12345"
    process.env.MONGO_URI = "mongodb://localhost:27017/test"
  })

  describe("POST /auth/signup", () => {
    it("returns 400 if email missing", async () => {
      const res = await request(app).post("/auth/signup").send({ password: "123456" })
      expect(res.status).toBe(400)
    })

    it("returns 400 if password too short", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null)
      const res = await request(app).post("/auth/signup").send({ email: "test@test.com", password: "123" })
      expect(res.status).toBe(400)
    })

    it("creates user and returns token", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null)
      vi.mocked(User.create).mockResolvedValue({ _id: "abc123", email: "new@test.com", name: "Test" } as any)

      const res = await request(app).post("/auth/signup").send({ email: "new@test.com", password: "password123" })
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
    })
  })

  describe("POST /auth/login", () => {
    it("returns 400 for unknown email", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null)
      const res = await request(app).post("/auth/login").send({ email: "nope@test.com", password: "abc123" })
      expect(res.status).toBe(400)
    })

    it("returns 400 for wrong password", async () => {
      const hashed = await bcrypt.hash("correctpass", 12)
      vi.mocked(User.findOne).mockResolvedValue({ _id: "1", email: "u@u.com", password: hashed } as any)
      const res = await request(app).post("/auth/login").send({ email: "u@u.com", password: "wrongpass" })
      expect(res.status).toBe(400)
    })

    it("returns token on successful login", async () => {
      const hashed = await bcrypt.hash("mypassword", 12)
      vi.mocked(User.findOne).mockResolvedValue({ _id: "1", email: "u@u.com", password: hashed, name: "User" } as any)
      const res = await request(app).post("/auth/login").send({ email: "u@u.com", password: "mypassword" })
      expect(res.status).toBe(200)
      expect(res.body.data.token).toBeDefined()
    })
  })
})
