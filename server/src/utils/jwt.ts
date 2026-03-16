import jwt from "jsonwebtoken";
import type { AuthTokenPayload, User } from "../types/index.js";

const DEFAULT_JWT_SECRET = "dev-jwt-secret";
const DEFAULT_JWT_EXPIRES_IN = "1h";

export function signAuthToken(user: User): string {
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const expiresIn = (process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN) as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, process.env.JWT_SECRET || DEFAULT_JWT_SECRET, {
    expiresIn,
  });
}