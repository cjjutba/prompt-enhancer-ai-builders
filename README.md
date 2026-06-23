# Prompt Enhancer for AI App Builders

Take-home assignment scaffold for a fictional prompt enhancer tool. The app will guide non-technical users through a structured discovery flow and generate a complete prompt they can paste into AI app builders such as Lovable, Base44, and Emergent.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- OpenRouter for product AI generation
- BMAD Method for planning and implementation workflow

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` from `.env.example`.

```bash
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-3-flash-preview
```

The OpenRouter key is for the product runtime only. It is not committed to the repo.

## Workflow

This repo is set up with BMAD for agent-assisted planning and implementation artifacts.

- `_bmad/` contains the installed BMAD configuration.
- `.agents/skills/` contains the Codex BMAD skills.
- `_bmad-output/planning-artifacts/` is for product briefs, UX flow, architecture notes, and implementation plans.
- `_bmad-output/implementation-artifacts/` is for build notes, decisions, QA notes, and submission notes.

Branch convention:

- `main` is the production-ready branch.
- `dev` is the development branch.
- Feature work should branch from `dev`.
