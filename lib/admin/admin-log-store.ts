/**
 * File-backed admin audit log — SERVER ONLY.
 *
 * Persistence: globalThis.__hhAdminLog + .mock-admin-log.json.
 * Swap strategy: delete this file and replace imports with API calls.
 */

import fs from "fs";
import path from "path";
import type { AdminActionRecord } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __hhAdminLog: AdminActionRecord[] | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-admin-log.json");

function loadFromFile(): AdminActionRecord[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as AdminActionRecord[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // File missing or malformed
  }
  return [];
}

function getLog(): AdminActionRecord[] {
  if (!global.__hhAdminLog) {
    global.__hhAdminLog = loadFromFile();
  }
  return global.__hhAdminLog;
}

function persistToFile(log: AdminActionRecord[]): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(log, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev
  }
}

export function insertAdminAction(record: AdminActionRecord): void {
  const log = getLog();
  log.unshift(record);
  persistToFile(log);
}

export function getAdminLog(workerId?: string): AdminActionRecord[] {
  const log = getLog();
  if (!workerId) return log;
  return log.filter((r) => r.workerId === workerId);
}
