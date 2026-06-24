# Prompt Enhancer for AI App Builders

Prompt Enhancer is a take-home assignment project that turns a rough app idea
into a structured, builder-ready prompt for AI app builders such as Lovable,
Base44, and Emergent.

The product is designed for non-technical users who know what they want to
build, but do not yet know how to describe the product clearly enough for an AI
builder. Instead of asking for one perfect prompt upfront, the app guides the
user through a practical discovery flow, reviews the collected context, and
generates a polished prompt through OpenRouter.

## What This Demo Shows

- A guided 9-step product discovery flow.
- A live prompt brief that updates as answers are entered.
- Session-based draft persistence while the user moves between steps.
- A review screen with inline answer editing before generation.
- A polished loading state while the AI prompt is assembled.
- A builder-ready final prompt with copy, regenerate, review, and restart
  actions.
- A server-only OpenRouter integration so the API key is never exposed to the
  browser.
- BMAD planning and implementation artifacts committed with the codebase.

## Product Flow

The user answers these discovery steps:

1. App idea
2. Target users
3. Core problem
4. Key features
5. User journey and screens
6. Content and data
7. Integrations
8. Design preferences
9. Launch goals and constraints

After the final step, the user reviews every answer, edits anything inline if
needed, then generates a complete prompt that can be pasted into an AI app
builder.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vitest
- OpenRouter for product AI generation
- BMAD Method for planning and implementation workflow

## Project Structure

```text
src/app/
  api/enhance/route.ts        Server-only OpenRouter route handler
  page.tsx                    App entry point

src/components/prompt-enhancer/
  app-shell.tsx               Three-zone workspace shell
  discovery-rail.tsx          Left progress and navigation rail
  live-prompt-brief.tsx       Right-side live answer summary
  question-panel.tsx          Step router for the discovery flow
  *-step.tsx                  Step-specific interaction components
  final-flow.tsx              Review, loading, error, and result states
  use-discovery-draft.ts      Session draft persistence

src/lib/
  discovery.ts                Shared answer shape and validation
  prompt-builder.ts           OpenRouter message construction

_bmad-output/
  planning-artifacts/         Brief, PRD, UX, architecture, epics, readiness
  implementation-artifacts/   Build notes and implementation decisions
```

## Local Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js will offer another local port.

## Environment

Create `.env.local` from `.env.example`:

```bash
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-3-flash-preview
```

The OpenRouter key is used only by `src/app/api/enhance/route.ts`. The client
posts discovery answers to `/api/enhance`; the server reads the private key,
calls OpenRouter, and returns only the generated prompt or a safe error message.

## Verification

Run the core checks:

```bash
pnpm test
pnpm lint
pnpm build
```

Current verification status:

- `pnpm test`: 13 test files passed, 50 tests passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- Manual browser check: desktop and 390px mobile rendered without horizontal
  overflow.
- Live AI smoke test: `/api/enhance` returned a successful generated prompt
  using the configured OpenRouter model.

## AI Integration Notes

The product AI integration is intentionally small and inspectable:

- The browser never receives `OPENROUTER_API_KEY`.
- The route handler validates that all discovery fields are complete before
  calling the model.
- The prompt builder sends structured discovery context to the model.
- The generated output is formatted for Lovable, Base44, and Emergent.
- No database, authentication, or long-term saved history is required for this
  assignment demo.

## AI-Assisted Development Workflow

This project was built with an AI-assisted workflow:

- BMAD artifacts were created first to clarify the product brief, PRD, UX
  direction, architecture spine, epics, and readiness checklist.
- Implementation was done in focused passes through Codex and Conductor-style
  workspace isolation.
- The app was iterated screen by screen, with reusable components extracted for
  the shell, discovery rail, live brief, question layout, step modules, review,
  generation, and result states.
- Verification used automated tests, linting, production build, manual browser
  review, and a live OpenRouter smoke test.

The relevant planning and implementation notes are committed under
`_bmad-output/`.

## Loom Walkthrough Guide

Suggested walkthrough length: 5 to 10 minutes.

1. Introduce the assignment and problem.
   - Non-technical users often get vague app results because they write vague
     prompts.
   - Prompt Enhancer turns a rough idea into structured builder context.
2. Walk through the product.
   - Start discovery.
   - Fill the 9 steps.
   - Show the live prompt brief updating.
   - Review answers and edit one answer inline.
   - Generate the builder-ready prompt.
   - Copy and restart.
3. Explain the code structure.
   - Show `src/components/prompt-enhancer/`.
   - Show `src/lib/discovery.ts` and `src/lib/prompt-builder.ts`.
   - Show `src/app/api/enhance/route.ts`.
4. Explain the AI integration.
   - OpenRouter call happens server-side.
   - The model receives structured discovery context.
   - The output is a complete prompt for AI app builders.
5. Explain the workflow.
   - Show `_bmad-output/planning-artifacts/`.
   - Mention Codex, BMAD, and Conductor-style isolated iteration.
6. Close with improvements.
   - Saved projects and history.
   - Prompt quality scoring.
   - Builder-specific export formats.
   - AI follow-up questions for weak answers.

## Demo Scenario

A strong sample idea for the walkthrough:

```text
A lightweight care coordination app for small home health agencies. It helps
care coordinators assign visits, track caregiver check-ins, and keep families
updated without relying on group chats and spreadsheets.
```

This scenario is specific enough to demonstrate product thinking, user roles,
workflows, data, integrations, and constraints without requiring a backend.

## Known Scope Decisions

- Draft answers are stored in `sessionStorage` so users can move between steps
  without losing work during a session.
- The generated prompt itself is not persisted after restart.
- Authentication, database persistence, saved projects, and billing are out of
  scope for this focused assignment.
- If this became a real product, the next step would be saved workspaces,
  builder-specific prompt templates, and AI-assisted follow-up questions.
