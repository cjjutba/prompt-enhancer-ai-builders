# Loom Walkthrough Outline

## Target Length
5-10 minutes.

## 1. Assignment Framing (45-60s)
- Explain the client problem: non-technical users struggle to prompt AI app builders well.
- State the MVP: guided discovery flow that turns an app idea into a paste-ready prompt.
- Mention constraints: Next.js, OpenRouter, no auth/database/backend persistence.

## 2. Product And UX Walkthrough (2-3m)
- Start at the first screen and explain why it goes straight into the workflow.
- Walk through the discovery steps:
  - idea, audience, journeys, features, screens, data, rules, style.
- Explain how the review step reduces bad AI output by forcing confirmation before generation.
- Show loading, output, copy, and restart behavior.

## 3. AI Integration (1-2m)
- Explain that the app sends structured answers to a server-only generation boundary.
- Call out `google/gemini-3-flash-preview` through OpenRouter.
- Explain the prompt template goal: produce a complete builder prompt with product summary, journeys, features, screens, data, constraints, and UX direction.
- Mention API key safety: env var stays server-side.

## 4. Code Structure And Decisions (1-2m)
- Show where the main route and components live.
- Show the shared discovery answer shape and prompt-generation boundary.
- Explain why there is no database, auth, or saved history.
- Mention that fresh Conductor workspaces may need `pnpm install` before coding/running.

## 5. AI Workflow And BMAD Artifacts (60-90s)
- Show `_bmad-output/planning-artifacts/`.
- Briefly explain assignment brief, PRD, UX design, architecture spine, epics, and readiness report.
- State how the artifacts kept implementation scoped and reviewable.

## 6. Improvements With More Time (45-60s)
- AI-generated follow-up questions based on weak answers.
- Prompt quality scoring before generation.
- Export formats for different builders.
- Saved projects and iteration history, only if this became a real product.
- More robust tests around prompt assembly and provider errors.

## Closing
End by restating the core product decision: the app does not try to build the user’s app; it helps them describe the app clearly enough for an AI builder to produce a better first version.

## Assumptions
- The final implemented demo will match the planned flow closely.
- The walkthrough will be recorded after implementation and verification.
