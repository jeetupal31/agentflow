import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "@agentflow/shared-utils"

export interface AuthRequest extends Request {
  user?: { id: string; email: string }
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return next(new UnauthorizedError("No token provided"))
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    req.user = { id: decoded.id, email: decoded.email }
    next()
  } catch {
    next(new UnauthorizedError("Invalid or expired token"))
  }
}
