import { randomUUID } from "node:crypto";
import { UserModel } from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/jwt.js";
import type { AuthUser, User } from "../types/index.js";

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthServiceError";
    this.statusCode = statusCode;
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await UserModel.scan("email").eq(normalizeEmail(email)).limit(1).exec();
  return users[0]?.toJSON() as User | undefined;
}

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser(input: RegisterInput): Promise<{ token: string; user: AuthUser }> {
  const email = normalizeEmail(input.email);
  const password = input.password;
  const name = (input.name || "").trim();

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AuthServiceError("Email is already registered", 409);
  }

  const createdUser = await UserModel.create({
    id: randomUUID(),
    email,
    passwordHash: hashPassword(password),
    name: name || email.split("@")[0] || "Student",
    role: "student",
    status: "active",
  });

  const user = createdUser.toJSON() as User;
  const token = signAuthToken(user);

  return {
    token,
    user: toAuthUser(user),
  };
}