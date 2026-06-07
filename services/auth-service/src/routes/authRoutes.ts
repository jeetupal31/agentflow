import { Router, Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { ValidationError } from "@agentflow/shared-utils"

const router = Router()

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) throw new ValidationError("Email and password are required")
    if (password.length < 6) throw new ValidationError("Password must be at least 6 characters")

    const exists = await User.findOne({ email })
    if (exists) throw new ValidationError("Email already registered")

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ email, password: hashed, name })

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, email: user.email, name: user.name } }
    })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new ValidationError("Email and password are required")

    const user = await User.findOne({ email })
    if (!user) throw new ValidationError("Invalid credentials")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new ValidationError("Invalid credentials")

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      data: { token, user: { id: user._id, email: user.email, name: user.name } }
    })
  } catch (err) {
    next(err)
  }
})

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) throw new Error("No token")
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const user = await User.findById(decoded.id).select("-password")
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
})

export default router
