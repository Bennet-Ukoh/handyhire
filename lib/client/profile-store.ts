/**
 * File-backed mock store for client profile data — SERVER ONLY.
 *
 * Persistence strategy:
 *   1. globalThis.__hhClientProfiles — survives Next.js HMR module re-evaluations.
 *   2. .mock-client-profiles.json   — survives dev-server restarts.
 *
 * Swap strategy: delete this file and replace imports in service.ts / actions.ts
 * with real API calls. Signatures stay identical — callers never change.
 */

import fs from "fs";
import path from "path";

interface StoredClientProfile {
  userId: string;
  location: string;
  phone: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __hhClientProfiles: StoredClientProfile[] | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-client-profiles.json");

// Seed the test account so `client@test.com` is not gated out of the box.
const SEED_PROFILES: StoredClientProfile[] = [
  { userId: "usr_client_001", location: "Lagos, Surulere", phone: "+234 801 234 5678" },
];

function loadFromFile(): StoredClientProfile[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoredClientProfile[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // File missing or malformed — fall through to seed
  }
  return [...SEED_PROFILES];
}

function getProfiles(): StoredClientProfile[] {
  if (!global.__hhClientProfiles) {
    global.__hhClientProfiles = loadFromFile();
  }
  return global.__hhClientProfiles;
}

function persistToFile(profiles: StoredClientProfile[]): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(profiles, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev
  }
}

export function getStoredClientProfile(userId: string): StoredClientProfile | null {
  return getProfiles().find((p) => p.userId === userId) ?? null;
}

export function upsertClientProfile(
  userId: string,
  data: { location: string; phone: string }
): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex((p) => p.userId === userId);
  const entry: StoredClientProfile = { userId, ...data };
  if (idx !== -1) {
    profiles[idx] = entry;
  } else {
    profiles.push(entry);
  }
  persistToFile(profiles);
}

export function isClientProfileComplete(userId: string): boolean {
  const p = getStoredClientProfile(userId);
  return !!p && p.location.trim().length > 0 && p.phone.trim().length > 0;
}
