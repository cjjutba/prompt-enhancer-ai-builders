# Assignment Brief: Prompt Enhancer for AI App Builders

## Client Context
The client wants a focused take-home assignment that demonstrates product thinking, UX judgment, clean architecture, AI product integration, and disciplined AI-assisted workflow. The product is fictional; the evaluation is about how the builder thinks, plans, implements, and presents the work.

## Product To Build
Create a basic Next.js web app for non-technical users who want to build apps with tools like Lovable, Base44, Emergent, or similar AI app builders. The app guides them through a structured discovery flow, then generates a complete prompt they can copy into their chosen builder.

## Required Constraints
- Platform: web app.
- Framework: Next.js.
- LLM integration: OpenRouter using `google/gemini-3-flash-preview`.
- Backend, database, and authentication are not required.
- OpenRouter key is for the product runtime only, not coding sessions.
- Nothing needs to be saved after the generated prompt is shown.

## What The Client Is Evaluating
- Product thinking: choice of discovery steps, questions, and flow logic.
- UX/design: polished guided flow that is easy for non-technical users.
- Code quality: clear structure in a modern framework.
- AI integration: API usage, context management, prompt engineering.
- AI workflow: committed planning artifacts and clear use of agent tooling.
- Presentation: a 5-10 minute Loom covering app, code, decisions, AI workflow, and future improvements.

## Planning Decision
Keep the MVP narrow: a guided discovery wizard, a prompt generation action, a copyable output, and a restart path. The planning artifacts should make implementation straightforward without over-documenting speculative features.

## Assumptions
- The intended submission is a GitHub repo plus Loom walkthrough.
- The demo can run locally with an `.env.local` OpenRouter API key.
- Future implementation should not add persistence, auth, or a database unless the scope changes.
