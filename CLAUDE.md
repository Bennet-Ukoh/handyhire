@AGENTS.md

# handyHire — Claude Code Instructions

## Project intent

HandyHire is a modern marketplace that connects clients with trusted skilled workers and helps workers discover jobs, quote, and build reputation.

## Working principles

- Follow the App Router and keep route files thin.
- Prefer Server Components by default.
- Use Client Components only for interactivity that truly needs browser state.
- Keep network calls in service files only.
- Keep validation in schema files only.
- Keep shared types in type files only.
- Build reusable feature components instead of large page-only implementations.
- Prefer clean separation of UI, data, and state.

## Architecture rules

- Pages and layouts should be minimal and compositional.
- Do not place fetch calls directly inside components.
- Do not mix mock API logic with live API logic in the same code path without clear separation.
- Treat TypeScript types as the contract.
- Update types first when the backend shape changes.
- Keep auth, dashboard, profile, and admin features separated by domain.
- Use strict TypeScript and avoid `any`.
- Prefer semantic HTML and accessibility-first markup.

## UI rules

- Design should feel modern, premium, and distinct.
- Do not default to generic SaaS dashboard styling.
- Prioritize clarity, hierarchy, and trust.
- Use consistent spacing, typography, and color tokens.
- Include loading, empty, and error states for every important flow.
- Make interfaces responsive and mobile-first.
- Keep focus states visible and keyboard navigation reliable.

## State and data rules

- Use local component state for UI-only interactions.
- Use feature-level state only when data must be shared across screens.
- Keep persisted state limited and intentional.
- Do not store sensitive production tokens in browser storage.
- Keep mock state clearly separated from production-ready session logic.

## Forms and validation

- Validate user input before any network request.
- Use Zod schemas for form validation and API input validation.
- Use React Hook Form for forms where appropriate.
- Provide clear, actionable error messages.

## Security rules

- Never log passwords, tokens, OTPs, NINs, or other sensitive values.
- Avoid exposing secrets in URLs.
- Keep production auth ready for server-side protection.
- Use route guards as UX support, not as the only security layer.

## Claude Code behavior

- Start by proposing the strongest UI and UX direction.
- Be creative, but do not break architecture rules.
- When unsure, prefer scalable and maintainable solutions.
- Build one screen or flow at a time.
- Reuse patterns once they are proven.
- Ask for clarification only when a decision materially affects architecture or UX.

## Quality bar

- TypeScript passes without errors.
- Components are reusable and predictable.
- Code is readable and maintainable.
- The UI feels intentional and polished.
- The app should be easy to extend when backend endpoints arrive.

## Suggested implementation order

1. Foundation files and shared types.
2. Design tokens and reusable UI primitives.
3. Auth and role flow.
4. Landing page.
5. Client dashboard.
6. Worker dashboard.
7. Admin dashboard.
8. Profile screens.
9. Backend integration adapters.
