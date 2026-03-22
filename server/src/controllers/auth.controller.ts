import { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { verifyPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/jwt.js";
import type { AuthUser, User } from "../types/index.js";
import {
  AuthServiceError,
  findUserByEmail,
  normalizeEmail,
  registerUser,
  toAuthUser,
} from "../services/auth.service.js";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

interface RegisterRequestBody {
  email?: string;
  password?: string;
  name?: string;
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginRequestBody;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    const user = await findUserByEmail(normalizedEmail);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    if (user.status !== "active") {
      res.status(403).json({ error: "User account is inactive" });
      return;
    }

    const token = signAuthToken(user);

    res.json({
      token,
      user: toAuthUser(user),
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as RegisterRequestBody;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  try {
    const result = await registerUser({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function me(req: Request, res: Response) {
  if (!req.auth?.sub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const userDoc = await UserModel.get(req.auth.sub);
    const user = userDoc?.toJSON() as User | undefined;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.status !== "active") {
      res.status(403).json({ error: "User account is inactive" });
      return;
    }

    res.json({ user: toAuthUser(user) });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}