import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.headers["x-user"];

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = JSON.parse(user as string);
  next();
};