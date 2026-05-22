# handyHire — Project Brief

## Product summary

HandyHire is a two-sided marketplace that helps clients find trusted skilled workers and helps workers discover nearby jobs, submit quotes, and grow their reputation. The product should feel trustworthy, modern, local-first, and easy to use.

## Primary users

### Clients

- Need a fast way to request help.
- Need to compare quotes and choose the right worker.
- Need confidence that the worker is verified and reliable.

### Skilled workers

- Need to discover jobs near them.
- Need to submit quotes quickly.
- Need to present credibility through verification, experience, and completed work.

### Admins

- Need to verify worker identities and credentials.
- Need to resolve disputes and monitor platform activity.
- Need a clear overview of platform health.

## Product goals

- Make requesting and hiring help feel simple.
- Build trust through verification, profile quality, and visual clarity.
- Make the interface feel premium and distinctive.
- Support frontend-first development while backend endpoints are still being built.

## Design direction

The UI should not feel like a generic SaaS dashboard or a standard admin template. It should feel crafted, modern, and slightly editorial. The design should use strong typography, smart spacing, clear hierarchy, and subtle motion where it improves comprehension.

## Experience principles

- Clarity first, then delight.
- Every screen should feel intentional.
- Important actions should be obvious.
- Empty states, loading states, and error states should be designed carefully.
- Trust signals should be visible where users make decisions.

## Screens to design

Start with:

- Landing page.
- Client onboarding and request flow.
- Worker onboarding and verification flow.
- Client dashboard.
- Worker dashboard.
- Admin dashboard.
- Public worker profile.
- Private user profile.

## Content and UX rules

- Show only what the user needs for the current step.
- Keep forms short and progressive.
- Use clear labels, helper text, and validation feedback.
- Use status chips, tags, and summaries only when they help scanning.
- Make trust visible through verification badges, response time, proximity, ratings, and job history.

## Technical direction

- Use Next.js App Router with TypeScript.
- Keep pages thin and use Server Components by default.
- Use Client Components only for interactive pieces like forms, drawers, filters, and modals.
- Keep API calls in service files.
- Keep validation in schema files.
- Keep shared types in type files.
- Use reusable feature-based components.

## Data and state approach

- Use mock services until backend endpoints are ready.
- Keep mock data separate from production data adapters.
- Define request and response types early.
- Treat types as the contract between frontend and backend.
- Use local state for UI interactions and shared state only where necessary.

## Security and reliability

- Avoid logging sensitive data.
- Validate input before sending requests.
- Keep auth flows ready for stronger server-side protection later.
- Avoid putting sensitive data in URLs.
- Build with accessibility and keyboard support in mind.

## What Claude Code should do

Claude Code should be allowed to create a unique design system and UI direction for handyHire. It should propose the best layout, visual language, component structure, and interaction patterns without being forced into a generic template. The goal is a polished, modern, trustworthy product that feels custom-built.

## What not to overdefine

Do not overprescribe the exact visual layout too early.
Do not lock the design into common dashboard patterns.
Do not hardcode unnecessary page behavior before the design system is established.
Allow room for Claude Code to invent a strong, original UI.

## Success criteria

- The UI feels distinctive and premium.
- The codebase is modular and maintainable.
- The design is accessible and responsive.
- The frontend is ready for backend integration.
- The architecture stays clean as the project grows.
