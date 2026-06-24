# Implementation Notes: Prompt Enhancer MVP

## What Was Built
- Replaced the starter page with a responsive guided discovery wizard.
- Added client-side state for app idea, target users, problem, features, screens, data, integrations, UX tone, constraints, review, result, retry, copy, and restart.
- Added `/api/enhance` as a server-only route handler for prompt generation.
- Added shared discovery types and prompt-message assembly.
- Added a Vitest contract test for OpenRouter message construction.

## OpenRouter Boundary
- The browser posts structured discovery answers to `/api/enhance`.
- The route handler reads the private OpenRouter credential and configured model on the server only.
- The default model is `google/gemini-3-flash-preview`.
- Client responses return only generated prompt text or safe error messages.

## UX Decisions
- The first screen starts the workflow directly instead of acting like a marketing landing page.
- The wizard uses one primary question per step to keep the flow approachable for non-technical users.
- The review step makes the user confirm context before generation.
- The output screen focuses on copy, retry, and restart.

## Verification Targets
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- Manual flow: start, answer all steps, review, generate, copy, restart, and retry after a generation error.

## Notes For The Loom
- Highlight the planning artifacts first, then show how the code follows them.
- Call out that generation is server-only and no persistence/auth/database was added.
- Avoid showing environment values or any secret material on screen.
