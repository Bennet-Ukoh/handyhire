/**
 * File-backed mock quote store — SERVER ONLY.
 *
 * A single StoredQuote satisfies both the ReceivedQuote shape (client view)
 * and the ActiveQuote shape (worker view). Each service maps the fields it
 * needs at read time.
 *
 * Persistence: globalThis.__hhQuotes (HMR-safe) + .mock-quotes.json (restart-safe).
 *
 * Swap strategy: delete this file and replace all imports with API calls.
 */

import fs from "fs";
import path from "path";

export interface StoredQuote {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  workerTrade: string;
  workerAverageRating: number;
  workerReviewCount: number;
  workerIsVerified: boolean;
  amountNgn: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  submittedAt: string;      // ISO
  clientName: string;
  location: string;
  note?: string;
  conversationId?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __hhQuotes: StoredQuote[] | undefined;
}

const STORE_PATH = path.join(process.cwd(), ".mock-quotes.json");

const SEED_QUOTES: StoredQuote[] = [
  {
    id: "rq_001",
    jobId: "cj_001",
    jobTitle: "Complete bathroom retiling and plumbing fix",
    workerId: "usr_worker_tunde",
    workerName: "Tunde Fashola",
    workerTrade: "Plumbing",
    workerAverageRating: 4.9,
    workerReviewCount: 32,
    workerIsVerified: true,
    amountNgn: 62_000,
    status: "pending",
    submittedAt: "2026-05-18T14:30:00Z",
    clientName: "Mrs. Aisha Bello",
    location: "Surulere, Lagos",
    note: "I've completed over 40 bathroom renovations across Lagos. This job looks straightforward — I can start Thursday.",
  },
  {
    id: "rq_002",
    jobId: "cj_001",
    jobTitle: "Complete bathroom retiling and plumbing fix",
    workerId: "usr_worker_bola",
    workerName: "Bola Adekunle",
    workerTrade: "Plumbing",
    workerAverageRating: 4.6,
    workerReviewCount: 15,
    workerIsVerified: true,
    amountNgn: 55_000,
    status: "pending",
    submittedAt: "2026-05-19T08:00:00Z",
    clientName: "Mrs. Aisha Bello",
    location: "Surulere, Lagos",
    note: "Price includes all materials and labour. I can provide photos of previous work.",
  },
  {
    id: "rq_003",
    jobId: "cj_001",
    jobTitle: "Complete bathroom retiling and plumbing fix",
    workerId: "usr_worker_chidi",
    workerName: "Chidi Nwosu",
    workerTrade: "Plumbing",
    workerAverageRating: 4.3,
    workerReviewCount: 8,
    workerIsVerified: false,
    amountNgn: 41_000,
    status: "pending",
    submittedAt: "2026-05-19T11:00:00Z",
    clientName: "Mrs. Aisha Bello",
    location: "Surulere, Lagos",
  },
  {
    id: "q_001",
    jobId: "job_ext_001",
    jobTitle: "Kitchen pipe burst repair",
    workerId: "usr_worker_001",
    workerName: "Emeka Okonkwo",
    workerTrade: "Plumbing",
    workerAverageRating: 4.8,
    workerReviewCount: 21,
    workerIsVerified: true,
    amountNgn: 18_000,
    status: "pending",
    submittedAt: "2026-05-19T08:30:00Z",
    clientName: "Mrs. Aisha Bello",
    location: "Ikeja, Lagos",
  },
  {
    id: "q_002",
    jobId: "cj_002",
    jobTitle: "Air conditioner installation — 2 units",
    workerId: "usr_worker_001",
    workerName: "Emeka Okonkwo",
    workerTrade: "Plumbing",
    workerAverageRating: 4.8,
    workerReviewCount: 21,
    workerIsVerified: true,
    amountNgn: 35_000,
    status: "accepted",
    submittedAt: "2026-05-15T15:00:00Z",
    clientName: "Aisha Bello",
    location: "Surulere, Lagos",
    conversationId: "conv_seed_001",
  },
  {
    id: "q_003",
    jobId: "job_ext_003",
    jobTitle: "Water heater installation",
    workerId: "usr_worker_001",
    workerName: "Emeka Okonkwo",
    workerTrade: "Plumbing",
    workerAverageRating: 4.8,
    workerReviewCount: 21,
    workerIsVerified: true,
    amountNgn: 35_000,
    status: "pending",
    submittedAt: "2026-05-17T10:15:00Z",
    clientName: "Kolade Properties",
    location: "Lekki, Lagos",
  },
];

function loadFromFile(): StoredQuote[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoredQuote[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // File missing or malformed — fall through to seed
  }
  return [...SEED_QUOTES];
}

function getQuotes(): StoredQuote[] {
  if (!global.__hhQuotes) {
    global.__hhQuotes = loadFromFile();
  }
  return global.__hhQuotes;
}

function persistToFile(quotes: StoredQuote[]): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(quotes, null, 2), "utf-8");
  } catch {
    // Non-fatal in dev
  }
}

export function findQuotesByJobId(jobId: string): StoredQuote[] {
  return getQuotes().filter((q) => q.jobId === jobId);
}

export function findQuotesByWorkerId(workerId: string): StoredQuote[] {
  return getQuotes().filter((q) => q.workerId === workerId);
}

export function findQuoteById(id: string): StoredQuote | undefined {
  return getQuotes().find((q) => q.id === id);
}

export function insertQuote(quote: StoredQuote): void {
  const quotes = getQuotes();
  quotes.unshift(quote);
  persistToFile(quotes);
}

export function updateQuoteStatus(
  quoteId: string,
  status: StoredQuote["status"]
): void {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === quoteId);
  if (idx !== -1) {
    quotes[idx] = { ...quotes[idx], status };
    persistToFile(quotes);
  }
}

export function updateQuoteConversationId(
  quoteId: string,
  conversationId: string
): void {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === quoteId);
  if (idx !== -1) {
    quotes[idx] = { ...quotes[idx], conversationId };
    persistToFile(quotes);
  }
}

export function rejectOtherQuotes(jobId: string, acceptedQuoteId: string): void {
  const quotes = getQuotes();
  let changed = false;
  for (let i = 0; i < quotes.length; i++) {
    if (
      quotes[i].jobId === jobId &&
      quotes[i].id !== acceptedQuoteId &&
      quotes[i].status === "pending"
    ) {
      quotes[i] = { ...quotes[i], status: "rejected" };
      changed = true;
    }
  }
  if (changed) persistToFile(quotes);
}
