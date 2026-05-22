/**
 * Server-side session management via HTTP-only cookies.
 *
 * Swap strategy: replace JSON cookie storage with JWT decoding
 * or a server-side session store lookup — function signatures stay the same.
 *
 * This file is SERVER ONLY — never import it in client components.
 */

import { cookies } from "next/headers";
import type { SessionData } from "./types";

const COOKIE_NAME = "hh_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getSession(): Promise<SessionData | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
