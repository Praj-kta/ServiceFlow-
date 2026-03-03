import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { userId: string; role?: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireSelfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const targetId = req.params.id || req.params.userId;

  if (!req.user) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  if (req.user.role === "admin" || req.user.userId === targetId)
    return next();

  return res.status(403).json({ message: "Forbidden" });
};