# Architecture Spine: Prompt Enhancer MVP

## Paradigm
Small Next.js App Router application with a client-side guided flow and a server-only AI generation boundary.

## Invariants
- AD-1: Discovery state lives in the browser during a session.
  - Binds: wizard and review UI.
  - Prevents: accidental database or auth scope.
  - Rule: no persistence for MVP.
- AD-2: OpenRouter calls happen only on the server.
  - Binds: prompt generation.
  - Prevents: leaking `OPENROUTER_API_KEY` to the client.
  - Rule: browser submits structured answers to a server boundary; server calls OpenRouter.
- AD-3: The generated prompt is the final product output.
  - Binds: output screen and restart behavior.
  - Prevents: unnecessary projects, history, dashboards, or account features.
  - Rule: after output, user can copy or restart.
- AD-4: Prompt assembly uses typed structured input.
  - Binds: wizard answers and generator contract.
  - Prevents: brittle ad hoc prompt concatenation.
  - Rule: future implementation should define a shared `DiscoveryAnswers` shape.

## Planned App Shape
- `src/app/page.tsx`: main app route.
- Future client components: wizard shell, step components, review screen, output screen.
- Future server boundary: App Router route handler or equivalent server-only action for prompt generation.
- Future shared modules: discovery schema, prompt template, OpenRouter client wrapper.

## OpenRouter Boundary
- Model: `google/gemini-3-flash-preview`.
- Env vars: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`.
- Request type: chat completion with system instructions plus structured discovery answers.
- Response: generated prompt text and an error state when unavailable.

## Operational Notes
- No database, auth, background jobs, or file uploads.
- Fresh Conductor workspaces may need `pnpm install` before coding so dependencies and local Next docs are available.
- Before implementation, read the local Next docs required by `AGENTS.md` after dependencies are installed.

## Assumptions
- A route handler is the preferred future server boundary because it is easy to explain and keeps API behavior explicit.
- Streaming is not required for the take-home MVP.
