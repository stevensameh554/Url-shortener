import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";
import { createRefreshSession, findRefreshSession, revokeRefreshSession } from "../repositories/refresh-session.repository.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";

export type JwtPayload = { sub: string; email: string; name: string };

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL as any });
}

function createRefreshToken() {
  return crypto.randomBytes(48).toString("base64url");
}

export async function register(input: { name: string; email: string; password: string }) {
  if (await findUserByEmail(input.email)) throw new HttpError(409, "Email is already registered");
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await createUser({ name: input.name, email: input.email, passwordHash });
  return createSession(user);
}

export async function login(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new HttpError(401, "Invalid email or password");
  return createSession(user);
}

export async function createSession(user: { id: string; email: string; name: string }) {
  const payload = { sub: user.id, email: user.email, name: user.name };
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await createRefreshSession({ userId: user.id, tokenHash: hashToken(refreshToken), expiresAt });
  return { user: payload, accessToken: signAccessToken(payload), refreshToken, expiresAt };
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch {
    throw new HttpError(401, "Invalid or expired access token");
  }
}

export async function refresh(refreshToken: string) {
  const session = await findRefreshSession(hashToken(refreshToken));
  if (!session || session.revokedAt || session.expiresAt <= new Date()) throw new HttpError(401, "Refresh session is invalid");
  await revokeRefreshSession(session.id);
  return createSession(session.user);
}

export async function logout(refreshToken: string) {
  const session = await findRefreshSession(hashToken(refreshToken));
  if (session && !session.revokedAt) await revokeRefreshSession(session.id);
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}
