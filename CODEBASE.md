# HandyHire — Codebase Guide

A complete walkthrough of how the app is structured and how every part connects.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Directory Structure](#2-directory-structure)
3. [How a Request Travels Through the App](#3-how-a-request-travels-through-the-app)
4. [Authentication & Session](#4-authentication--session)
5. [Route Protection — Two Layers](#5-route-protection--two-layers)
6. [The Four-Layer Architecture](#6-the-four-layer-architecture)
7. [Mock Data Persistence](#7-mock-data-persistence)
8. [Domain Walkthrough](#8-domain-walkthrough)
9. [The UI Shell](#9-the-ui-shell)
10. [Full Data Flow — Posting a Job](#10-full-data-flow--posting-a-job)
11. [Full Data Flow — Accepting a Quote](#11-full-data-flow--accepting-a-quote)
12. [Wiring Diagram](#12-wiring-diagram)
13. [How to Swap Mock for Real Backend](#13-how-to-swap-mock-for-real-backend)

---

## 1. Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Forms | React Hook Form + `useActionState` |
| Fonts | Geist Sans, Geist Mono, DM Serif Display |
| Auth | HTTP-only cookies (custom, no NextAuth) |
| State | Server Components + file-backed mock stores |
| Middleware | `middleware.ts` at project root |

There is **no database**. All data lives in `globalThis` (in-memory, survives HMR) and syncs to `.mock-*.json` files on disk (survives dev server restarts). The entire mock layer is designed to be deleted and replaced with API calls — signatures stay identical.

---

## 2. Directory Structure

```
handyhire/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root HTML shell (fonts, body class)
│   ├── page.tsx                # Landing page (public)
│   ├── globals.css             # Tailwind + design tokens
│   ├── auth/
│   │   ├── layout.tsx          # Centred auth card layout
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── (protected)/            # Route group — all require auth
│       ├── layout.tsx          # Auth guard (server-side session check)
│       ├── dashboard/page.tsx  # Role redirect hub
│       ├── client/
│       │   ├── layout.tsx      # Role guard + DashboardShell
│       │   ├── dashboard/
│       │   ├── jobs/
│       │   ├── post-job/
│       │   └── profile/
│       ├── worker/
│       │   ├── layout.tsx      # Role guard + DashboardShell
│       │   ├── dashboard/
│       │   ├── jobs/
│       │   ├── quotes/
│       │   ├── earnings/
│       │   ├── verification/
│       │   └── profile/
│       ├── admin/
│       │   ├── layout.tsx
│       │   ├── dashboard/
│       │   ├── verifications/
│       │   ├── workers/
│       │   └── settings/
│       └── chat/
│           ├── layout.tsx
│           ├── page.tsx        # Conversations inbox
│           └── [id]/page.tsx   # Individual chat thread
│
├── components/
│   ├── layout/                 # Navbar, Footer (landing only)
│   ├── dashboard/              # DashboardShell (sidebar + mobile drawer)
│   ├── landing/                # Hero, Categories, HowItWorks, etc.
│   ├── auth/                   # SignInForm, SignUpForm
│   ├── client/                 # ClientDashboard, JobsPanel, PostJobForm, QuotesInbox
│   ├── worker/                 # VerificationCard, JobFeed, QuotesPanel, etc.
│   ├── admin/                  # AdminReviewActions
│   ├── shared/                 # ChatWindow, PhotoCapture, LocationPicker
│   └── ui/                     # ScrollReveal
│
├── lib/
│   ├── auth/                   # types, schemas, session, service, actions, mock-store
│   ├── client/                 # types, schemas, service, actions, mock-store
│   ├── worker/                 # types, schemas, service, actions, verification-store, nin-service
│   ├── admin/                  # types, service, actions, admin-log-store
│   ├── chat/                   # types, service, actions, mock-store
│   └── shared/
│       ├── navigation.tsx      # Nav entries per role (WORKER_NAV, CLIENT_NAV, ADMIN_NAV)
│       ├── notifications.ts    # Unread badge counts
│       ├── quote-store.ts      # Cross-domain quote store (read by both client + worker)
│       └── types.ts
│
├── middleware.ts               # Edge route protection (runs before every request)
├── .mock-store.json            # Persisted users
├── .mock-quotes.json           # Persisted quotes
├── .mock-jobs.json             # Persisted jobs
├── .mock-conversations.json    # Persisted chat conversations
├── .mock-messages.json         # Persisted chat messages
├── .mock-verifications.json    # Persisted worker verification states
└── .mock-admin-log.json        # Persisted admin audit log
```

---

## 3. How a Request Travels Through the App

Every browser request passes through these layers in order:

```
Browser request
      │
      ▼
middleware.ts          ← Edge function. Checks cookie. Redirects if unauth or wrong role.
      │
      ▼
app/(protected)/layout.tsx  ← Server Component. Double-checks session. Redirects if missing.
      │
      ▼
app/(protected)/[role]/layout.tsx  ← Role-specific guard. Loads DashboardShell + notification counts.
      │
      ▼
app/(protected)/[role]/[page]/page.tsx  ← Server Component. Calls service. Passes data to components.
      │
      ▼
components/            ← Pure display. Client Components only where browser interaction is needed.
```

The middleware runs at the **edge** (before the server renders anything), making it the first and fastest gate. The layout guards are a second line of defence in case something slips through.

---

## 4. Authentication & Session

### Sign-in flow

```
User submits form
      │
      ▼
SignInForm (Client Component)
  useActionState(signInAction)
      │
      ▼
lib/auth/actions.ts → signInAction()   [Server Action]
  1. Validate with signInSchema (Zod)
  2. Call signIn() from lib/auth/service.ts
  3. service.ts calls findByEmail() from mock-store
  4. If match: setSession() — writes JSON to HTTP-only cookie "hh_session"
  5. redirect(ROLE_REDIRECTS[user.role])
         client  → /client/dashboard
         worker  → /worker/dashboard
         admin   → /admin/dashboard
```

### Session cookie

The cookie is named `hh_session`. Its value is a JSON-serialised `SessionData` object:

```ts
interface SessionData {
  userId: string;
  name: string;
  email: string;
  role: "client" | "worker" | "admin";
  trade?: string;   // workers only
}
```

It is `httpOnly` (no JS access), `secure` in production, `sameSite: lax`, and expires in 7 days.

### Reading the session

Any Server Component or Server Action calls:

```ts
import { getSession } from "@/lib/auth/session";
const session = await getSession(); // returns SessionData | null
```

This reads the cookie from `next/headers` and parses the JSON. It never hits a database.

### Sign-out

`signOutAction()` in `lib/auth/actions.ts` calls `clearSession()` (deletes the cookie) then redirects to `/`.

---

## 5. Route Protection — Two Layers

### Layer 1: `middleware.ts` (Edge)

Runs on **every request** before any rendering. Three rules:

| Situation | Action |
|---|---|
| Unauthenticated user hits `/client`, `/worker`, `/admin`, `/dashboard` | Redirect → `/auth/signin?from=<original-path>` |
| Authenticated user hits wrong role prefix (e.g., client hits `/worker/…`) | Redirect → `/dashboard` |
| Authenticated user hits `/auth/signin` or `/auth/signup` | Redirect → `/dashboard` |

Admins bypass role gates — they can access any prefix.

### Layer 2: Role Layouts (Server)

Each role section has its own `layout.tsx` that re-reads the session and redirects if the role is wrong:

```ts
// app/(protected)/worker/layout.tsx
const session = await getSession();
if (!session || session.role !== "worker") redirect("/dashboard");
```

This catches edge cases the middleware might miss (e.g., a session that expired mid-request) and is where the `DashboardShell` is mounted with the correct nav.

### `/dashboard` — the redirect hub

`app/(protected)/dashboard/page.tsx` reads the session role and immediately redirects to the right dashboard. It exists so any generic "go to your dashboard" link always works regardless of role.

---

## 6. The Four-Layer Architecture

Every domain (auth, client, worker, admin, chat) follows the same four-layer pattern:

```
types.ts        ← TypeScript interfaces. The contract. Update first.
schemas.ts      ← Zod validation schemas. Derived from types.
mock-store.ts   ← File-backed in-memory store. Pure data CRUD. SERVER ONLY.
service.ts      ← Business logic. Reads from stores. Assembles full objects.
actions.ts      ← "use server" Server Actions. Validate → call service → redirect.
page.tsx        ← Server Component. Calls service. Passes props to components.
components/     ← Display. Calls actions on interaction.
```

### Types (`types.ts`)

Define all interfaces and type aliases. No logic, no imports from other layers. Everything else imports from here.

Example — `ClientJob` has fields like `status: JobStatus`, `budgetMinNgn: number`, `hiredWorkerName?: string`. If the backend changes the shape, you update the type first and TypeScript will flag every broken caller.

### Schemas (`schemas.ts`)

Zod schemas that validate form/action input. They only validate shape — they don't know about the database or UI. Server Actions run these before touching any store.

### Mock Stores (`mock-store.ts`, `verification-store.ts`, `quote-store.ts`)

File-backed stores. Each exposes simple CRUD functions:
- `findBy*()` — reads
- `insert*()` — writes
- `update*()` — mutations
- `reject*()` — conditional bulk updates

They never contain business logic — just raw data access.

### Services (`service.ts`)

Business logic layer. A service:
- Takes a simple input (usually a `userId`)
- Calls one or more stores
- Assembles a rich response object (e.g., `WorkerProfile`)
- Never touches the HTTP layer

Services are what pages call directly. When the backend is wired, each service function body gets replaced with an API call — the signature never changes.

### Server Actions (`actions.ts`)

Marked `"use server"`. These are the only things the browser can trigger. Each action:
1. Calls `getSession()` and validates the caller's role
2. Validates input through the Zod schema
3. Calls the relevant store functions
4. Returns an `ActionState` (`{ error?: string }`) or calls `redirect()`

They never return sensitive data — only success/error state.

---

## 7. Mock Data Persistence

The mock stores use a two-tier persistence strategy so data survives both HMR (hot module reload) and full server restarts:

```
Cold start
    │
    ▼
Read .mock-*.json from disk
    │ (if file missing or empty)
    ▼
Fall back to SEED_* constants in the file
    │
    ▼
Store in globalThis.__hhXxx
    │
On every write:
    ├── Update globalThis.__hhXxx (immediate, in-memory)
    └── Write back to .mock-*.json (async, disk)
```

**Why `globalThis`?** Next.js re-evaluates server modules on every request in development, which resets any module-level variables. `globalThis` survives module re-evaluation. The JSON file is the fallback for full restarts.

**The mock JSON files at the project root** (`.mock-store.json`, `.mock-quotes.json`, etc.) are the on-disk snapshots. They are gitignored-equivalent — they accumulate test state during development and can be deleted to reset to seed data.

---

## 8. Domain Walkthrough

### Auth domain (`lib/auth/`)

| File | Purpose |
|---|---|
| `types.ts` | `User`, `SessionData`, `UserRole`, `ROLE_REDIRECTS` |
| `schemas.ts` | `signInSchema`, `signUpSchema` (Zod) |
| `session.ts` | `getSession()`, `setSession()`, `clearSession()` — cookie layer |
| `service.ts` | `signIn()`, `signUp()`, `getUserById()` — calls mock-store |
| `mock-store.ts` | Array of `StoredUser` objects. Seed users: `client@test.com`, `worker@test.com`, `admin@test.com` (all password: `password`) |
| `actions.ts` | `signInAction`, `signUpAction`, `signOutAction` |

### Client domain (`lib/client/`)

| File | Purpose |
|---|---|
| `types.ts` | `ClientJob`, `ReceivedQuote`, `ClientStats`, `ClientProfile` |
| `schemas.ts` | `postJobSchema` — validates the post-job form |
| `service.ts` | `getClientProfile()` — merges mock profile + live jobs + live quotes |
| `mock-store.ts` | Job storage: `findJobsByClientId`, `insertJob`, `updateJobStatus`, `findAllOpenJobs` |
| `actions.ts` | `postJobAction`, `acceptQuoteAction`, `declineQuoteAction`, `completeJobAction` |

The client profile is assembled dynamically: it takes a seed profile, overlays live jobs from `client/mock-store`, and overlays live quotes from `shared/quote-store`. The `isWorkerVerified()` check at read-time queries `verification-store` so the badge is always fresh.

### Worker domain (`lib/worker/`)

| File | Purpose |
|---|---|
| `types.ts` | `WorkerVerification`, `VerificationRecord`, `WorkerProfile`, `NearbyJob`, `ActiveQuote`, `deriveOverallStatus()` |
| `schemas.ts` | `submitNINSchema`, `startBackgroundCheckSchema` |
| `service.ts` | `getWorkerProfile()` — merges mock profile + live quotes + live verification + live job feed |
| `verification-store.ts` | Stores `WorkerVerification` per `userId`. Updated by both worker actions and admin actions. |
| `nin-service.ts` | Mock NIMC API. `lookupNIN(nin)` returns identity data for any 11-digit number. |
| `verification-actions.ts` | `submitNINAction`, `startBackgroundCheckAction`, `uploadDocumentsAction` |
| `actions.ts` | `submitQuoteAction` |

`deriveOverallStatus()` in `types.ts` computes the overall verification state from the two sub-records (`nin` and `backgroundCheck`). It's a pure function used by both the worker dashboard and the admin service.

### Admin domain (`lib/admin/`)

| File | Purpose |
|---|---|
| `types.ts` | `VerificationQueueItem`, `AdminStats`, `AdminCheckAction`, `QueueFilter` |
| `service.ts` | `getVerificationQueue()`, `getAdminStats()`, `getWorkerVerificationDetail()`, `getWorkerAuditLog()` |
| `actions.ts` | `approveCheckAction`, `rejectCheckAction`, `requestManualReviewAction` |
| `admin-log-store.ts` | Append-only log of admin actions. Persisted to `.mock-admin-log.json`. |

The admin service reads directly from `auth/mock-store` (to list all workers) and `worker/verification-store` (to get their current verification state). It does not have its own user store.

### Chat domain (`lib/chat/`)

| File | Purpose |
|---|---|
| `types.ts` | `Conversation`, `Message`, `ConversationPreview` |
| `service.ts` | `getConversation()`, `getMessages()`, `getConversationPreviews()` |
| `actions.ts` | `sendMessageAction`, `markConversationReadAction` |
| `mock-store.ts` | `Conversation[]` and `Message[]`. Seed: `conv_seed_001` between client and worker. |

A conversation is created automatically when a client accepts a quote (`acceptQuoteAction` in `client/actions.ts`). The `conversationId` is written to the quote record so both sides can find the chat from their quotes panel.

### Shared domain (`lib/shared/`)

| File | Purpose |
|---|---|
| `quote-store.ts` | The single source of truth for all quotes. Both client and worker services read from here. |
| `navigation.tsx` | `WORKER_NAV`, `CLIENT_NAV`, `ADMIN_NAV` — nav item arrays consumed by `DashboardShell`. |
| `notifications.ts` | `getClientNotificationCounts()`, `getWorkerNotificationCounts()` — badge counts for the sidebar. |
| `types.ts` | Shared utility types. |

`quote-store.ts` is cross-domain because a `StoredQuote` satisfies both `ReceivedQuote` (client view) and `ActiveQuote` (worker view). Each service maps only the fields it needs at read time.

---

## 9. The UI Shell

### Landing pages (`app/page.tsx`)

Uses `Navbar` and `Footer` from `components/layout/`. These are only on the public pages. The dashboards have their own navigation (the sidebar).

### `DashboardShell` (`components/dashboard/DashboardShell.tsx`)

The shared authenticated layout. A **Client Component** because it needs:
- `usePathname()` to highlight the active nav link
- `useState` for the mobile drawer open/close
- `useTransition` to show "Signing out…" state

It receives:
- `session: SessionData` — to show the user's name and derive nav items
- `notificationCounts: Record<string, number>` — badge numbers keyed by href
- `children` — the page content

It renders:
- A **fixed sidebar** on desktop (lg+) with logo, nav links, user card, sign-out button
- A **slide-in drawer** on mobile triggered by a hamburger button
- The page content to the right of the sidebar

The nav items come from `lib/shared/navigation.tsx` via `ROLE_NAV[session.role]`. So the same `DashboardShell` component serves client, worker, and admin — it just gets different nav arrays.

### How layouts mount the shell

```
app/(protected)/worker/layout.tsx   (Server Component)
  1. getSession()
  2. Role check
  3. getWorkerNotificationCounts(userId)
  4. return <DashboardShell session={...} notificationCounts={...}>{children}</DashboardShell>

→ DashboardShell renders the sidebar + wraps {children}

→ {children} = app/(protected)/worker/dashboard/page.tsx (Server Component)
     getWorkerProfile(userId)
     return JSX with VerificationCard, StatsRow, JobFeed, QuotesPanel
```

---

## 10. Full Data Flow — Posting a Job

```
1. Client clicks "Post a Job" → navigates to /client/post-job

2. PostJobForm renders (Client Component)
   - useActionState(postJobAction, null)
   - Renders <form action={formAction}>

3. Client fills form and submits

4. postJobAction() fires (Server Action in lib/client/actions.ts)
   a. getSession() → confirm role is "client"
   b. postJobSchema.safeParse(formData) → validate all fields
   c. insertJob() in lib/client/mock-store → push to globalThis.__hhJobs + write .mock-jobs.json
   d. return { success: true, jobId }
   → PostJobForm shows success state / redirect to /client/dashboard

5. On /client/dashboard:
   getClientProfile(userId)
     → findJobsByClientId(userId)        ← lib/client/mock-store (includes new job)
     → findQuotesByJobId(jobId)          ← lib/shared/quote-store
     → isWorkerVerified(workerId)        ← lib/worker/verification-store
   → Returns full ClientProfile
   → ClientDashboardPage renders JobsPanel with the new job in it
```

---

## 11. Full Data Flow — Accepting a Quote

```
1. Client sees a quote in QuotesInbox (ReceivedQuote)

2. Client clicks "Accept"

3. acceptQuoteAction(quoteId) fires (Server Action)
   a. getSession() → confirm role is "client"
   b. findQuoteById(quoteId) → lib/shared/quote-store
   c. updateQuoteStatus(quoteId, "accepted")
   d. updateJobStatus(jobId, "in_progress", { hiredWorkerName, hiredWorkerId })
   e. rejectOtherQuotes(jobId, quoteId) → all other pending quotes on same job → "rejected"
   f. insertConversation({...}) → lib/chat/mock-store — chat is born here
   g. updateQuoteConversationId(quoteId, conversationId) → links quote → conversation

4. Page re-renders:
   - Quote shows "Accepted" badge + "Open chat" link
   - Job status shows "In Progress"
   - Worker's QuotesPanel also shows "accepted" (reads same quote-store)
   - Chat inbox for both parties now has the conversation
```

---

## 12. Wiring Diagram

```
Browser
  │
  ├── GET request
  │     middleware.ts (edge) ──── cookie check ──→ redirect or next()
  │           │
  │           ▼
  │     app/(protected)/layout.tsx ── session check ──→ redirect or render
  │           │
  │           ▼
  │     app/(protected)/[role]/layout.tsx ── role check ──→ DashboardShell
  │           │
  │           ▼
  │     page.tsx ──→ service.ts ──→ mock-store / verification-store / quote-store
  │                       │                          │
  │                       │                   globalThis.__hh*
  │                       │                          │
  │                       └──────────────── .mock-*.json (disk)
  │
  └── Form submit / button click
        Client Component calls Server Action ("use server")
              │
              ▼
        action.ts: getSession() + schema.safeParse() + store mutation
              │
              ▼
        mock-store: mutate globalThis + persist to disk
              │
              ▼
        redirect() or return ActionState → component re-renders
```

---

## 13. How to Swap Mock for Real Backend

The codebase is designed so that wiring a real API only requires touching the service layer. The UI, actions, types, and schemas stay unchanged.

### Per domain:

**Auth:**
```ts
// lib/auth/service.ts
export async function signIn(input: SignInInput): Promise<AuthOutcome> {
  // Replace: findByEmail(input.email)
  // With:    POST /api/auth/signin → returns { user } or { error }
}
```
Then delete `lib/auth/mock-store.ts` and its three imports in `service.ts`.

**Client jobs:**
```ts
// lib/client/service.ts — getClientProfile()
// Replace: findJobsByClientId(userId)
// With:    GET /api/clients/:userId/profile
```
Then delete `lib/client/mock-store.ts`.

**Quotes:**
```ts
// lib/shared/quote-store.ts — findQuotesByJobId(), insertQuote(), etc.
// Replace each function with the equivalent API call
```

**Worker verification:**
```ts
// lib/worker/verification-store.ts — getVerification(), updateNINRecord(), etc.
// Replace with: GET/PATCH /api/workers/:userId/verification
```

**Chat:**
```ts
// lib/chat/service.ts and lib/chat/actions.ts
// Replace with WebSocket or polling against a real messages API
```

**Session:**
```ts
// lib/auth/session.ts — setSession()
// Replace JSON cookie with a JWT or server-side session token
// getSession() would then decode the JWT or look up the session ID
```

The `lib/api/` directory (now removed) had interface stubs describing exactly what each real API endpoint would need to implement. Those interfaces are the spec — implement them in your backend and the swap is straightforward.
