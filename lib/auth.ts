import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { CurrentUser } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "dummyflix-dev-secret-change-in-prod";
const COOKIE_NAME = "dummyflix_token";

export function signToken(user: CurrentUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): CurrentUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CurrentUser;
    return { name: decoded.name, email: decoded.email, isAdmin: decoded.isAdmin ?? false };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie) return null;
  return verifyToken(tokenCookie.value);
}

export async function setSessionCookie(user: CurrentUser) {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
