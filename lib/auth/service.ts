/**
 * Auth service — mock implementation.
 *
 * Swap strategy: replace the body of each function with a real API call.
 * The signatures, return shapes, and import paths stay identical — callers
 * (server actions) never need to change.
 *
 * User storage is handled by mock-store.ts. Delete that file and update
 * the three imports below when wiring up a real backend.
 */

import type { User, AuthOutcome } from "./types";
import type { SignInInput, SignUpInput } from "./schemas";
import { findByEmail, findById, insertUser, type StoredUser } from "./mock-store";

function stripPassword({ password: _password, ...user }: StoredUser): User {
  return user;
}

function simulateDelay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Authenticate with email + password.
 * Replace body with: POST /api/auth/signin
 */
export async function signIn(input: SignInInput): Promise<AuthOutcome> {
  await simulateDelay();

  const match = findByEmail(input.email.trim());

  if (!match || match.password !== input.password) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true, user: stripPassword(match) };
}

/**
 * Register a new account.
 * Replace body with: POST /api/auth/signup
 */
export async function signUp(input: SignUpInput): Promise<AuthOutcome> {
  await simulateDelay(900);

  if (findByEmail(input.email)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser: StoredUser = {
    id: `usr_${input.role}_${Date.now()}`,
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role,
    trade: input.trade,
    createdAt: new Date().toISOString(),
  };

  insertUser(newUser);

  return { success: true, user: stripPassword(newUser) };
}

/**
 * Fetch a user by ID (for session refresh).
 * Replace body with: GET /api/users/:id
 */
export async function getUserById(id: string): Promise<User | null> {
  await simulateDelay(200);
  const match = findById(id);
  return match ? stripPassword(match) : null;
}
