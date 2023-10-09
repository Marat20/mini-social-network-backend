import { Request } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

export { AuthRequest };
