"use server";

import { redirect } from "next/navigation";
import { signIn, signUp } from "./service";
import { setSession, clearSession } from "./session";
import { signInSchema, signUpSchema } from "./schemas";
import type { ActionState } from "./types";
import { ROLE_REDIRECTS } from "./types";

/* ── Sign In ─────────────────────────────────────────────────────────── */

export async function signInAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let result;
  try {
    result = await signIn(parsed.data);
  } catch (err) {
    console.error("[signInAction] service error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  if (!result.success) {
    return { error: result.error };
  }

  const { user } = result;
  await setSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    trade: user.trade,
  });

  redirect(ROLE_REDIRECTS[user.role]);
}

/* ── Sign Up ─────────────────────────────────────────────────────────── */

export async function signUpAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    trade: formData.get("trade") || undefined,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await signUp(parsed.data);
  if (!result.success) {
    return { error: result.error };
  }

  redirect("/auth/signin?registered=true");
}

/* ── Sign Out ─────────────────────────────────────────────────────────── */

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
