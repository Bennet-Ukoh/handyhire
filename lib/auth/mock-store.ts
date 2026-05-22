/**
 * File-backed mock user store — SERVER ONLY.
 *
 * Persistence strategy:
 *   1. globalThis.__hhUsers — survives Next.js HMR module re-evaluations.
 *   2. .mock-store.json    — survives dev-server restarts.
 *
 * Next.js re-evaluates server modules on every request in development,
 * which resets any module-level variables. globalThis is NOT reset by
 * module re-evaluation, making it the reliable in-process store.
 * The JSON file is only consulted on cold server start.
 *
 * Swap strategy: delete this file and its three imports in service.ts
 * when wiring up a real backend. Nothing else changes.
 */

import fs from "fs";
import path from "path";
import type { User } from "./types";

export interface StoredUser extends User {
  password: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __hhUsers: StoredUser[] | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-store.json");

const SEED_USERS: StoredUser[] = [
  {
    id: "usr_client_001",
    name: "Aisha Bello",
    email: "client@test.com",
    password: "password",
    role: "client",
    location: "Lagos, Surulere",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "usr_worker_001",
    name: "Emeka Okonkwo",
    email: "worker@test.com",
    password: "password",
    role: "worker",
    trade: "Plumbing",
    location: "Abuja, Wuse II",
    createdAt: "2025-02-01T10:30:00Z",
  },
  {
    id: "usr_admin_001",
    name: "Admin User",
    email: "admin@test.com",
    password: "password",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "usr_worker_tunde",
    name: "Tunde Fashola",
    email: "tunde@test.com",
    password: "password",
    role: "worker",
    trade: "Plumbing",
    location: "Lagos, Surulere",
    createdAt: "2026-04-10T09:00:00Z",
  },
  {
    id: "usr_worker_bola",
    name: "Bola Adekunle",
    email: "bola@test.com",
    password: "password",
    role: "worker",
    trade: "Plumbing",
    location: "Lagos, Yaba",
    createdAt: "2026-04-20T11:00:00Z",
  },
  {
    id: "usr_worker_chidi",
    name: "Chidi Nwosu",
    email: "chidi@test.com",
    password: "password",
    role: "worker",
    trade: "Plumbing",
    location: "Lagos, Ikeja",
    createdAt: "2026-05-01T14:00:00Z",
  },
  {
    id: "usr_worker_amaka",
    name: "Amaka Eze",
    email: "amaka@test.com",
    password: "password",
    role: "worker",
    trade: "Electrical",
    location: "Abuja, Maitama",
    createdAt: "2026-05-05T10:00:00Z",
  },
  {
    id: "usr_worker_bayo",
    name: "Bayo Rasheed",
    email: "bayo@test.com",
    password: "password",
    role: "worker",
    trade: "Electrical",
    location: "Lagos, Surulere",
    createdAt: "2026-03-15T08:00:00Z",
  },
];

function loadFromFile(): StoredUser[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoredUser[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // File missing or malformed — fall through to seed
  }
  return [...SEED_USERS];
}

function getUsers(): StoredUser[] {
  if (!global.__hhUsers) {
    global.__hhUsers = loadFromFile();
  }
  return global.__hhUsers;
}

function persistToFile(users: StoredUser[]): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev — globalThis is still the source of truth
  }
}

export function findByEmail(email: string): StoredUser | undefined {
  const lc = email.toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === lc);
}

export function findById(id: string): StoredUser | undefined {
  return getUsers().find((u) => u.id === id);
}

export function insertUser(user: StoredUser): void {
  const users = getUsers();
  users.push(user);
  persistToFile(users);
}

export function findAllByRole(role: User["role"]): StoredUser[] {
  return getUsers().filter((u) => u.role === role);
}
