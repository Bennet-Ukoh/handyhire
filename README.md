# HandyHire

> A modern marketplace connecting clients with verified skilled workers across Nigeria.
> Clients post jobs, verified workers quote, and both parties chat and transact — all in one platform.

---

## Repository structure

```
handyhire/
├── frontend/        Next.js 15 (App Router) — client, worker, and admin UIs
├── backend/         Node.js API server (in progress)
├── shared/          TypeScript types and API contracts shared across apps
├── .github/         CI/CD workflows and collaboration config
└── README.md        You are here
```

---

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Test credentials:

| Role    | Email               | Password  |
|---------|---------------------|-----------|
| Client  | client@test.com     | password  |
| Worker  | worker@test.com     | password  |
| Admin   | admin@test.com      | password  |

### Backend

```bash
cd backend
# Coming soon — see backend/README.md
```

---

## Tech stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | Next.js 15, React 19, Tailwind CSS v4, Zod   |
| Backend    | Node.js (planned: Express or Fastify)        |
| Database   | PostgreSQL via Prisma (planned)              |
| Auth       | HTTP-only cookie sessions → JWT (planned)    |
| Types      | TypeScript (strict), shared via `/shared`    |
| CI/CD      | GitHub Actions                               |

---

## Branching strategy

| Branch              | Purpose                                    |
|---------------------|--------------------------------------------|
| `main`              | Production-ready code — protected          |
| `develop`           | Integration branch — protected             |
| `feature/*`         | New features, branched from `develop`      |
| `fix/*`             | Bug fixes                                  |
| `chore/*`           | Deps, config, non-functional changes       |

PRs into `main` and `develop` require at least **1 approving review**.
Direct pushes to `main` and `develop` are blocked.

---

## Team permissions (GitHub)

| Role       | Access                             | Who                          |
|------------|------------------------------------|------------------------------|
| Admin      | Full repo control                  | Repo owner                   |
| Maintain   | Manage branches, releases          | Tech leads                   |
| Write      | Push feature branches, open PRs    | Developers                   |
| Triage     | Label/assign issues, close PRs     | Project managers             |
| Read       | View code and issues               | Stakeholders, QA             |

To invite a collaborator:
```bash
gh api repos/Bennet-Ukoh/handyhire/collaborators/USERNAME -X PUT -f permission=write
```

---

## Shared types

`/shared/types/api.ts` defines every request and response DTO used by both the
frontend service layer and the backend API routes. When adding a new endpoint:

1. Define the request/response types in `/shared/types/api.ts`
2. Implement the route in `/backend`
3. Replace the matching mock service call in `/frontend/lib/*/service.ts`

---

## Contributing

1. Branch from `develop`: `git checkout -b feature/your-feature develop`
2. Make changes, run `npm run build` in the affected app to check for TS errors
3. Open a PR targeting `develop`
4. Get 1 review, then merge with **Squash and merge**
5. `develop` to `main` PRs are opened for releases

---

## License

Private — all rights reserved.
