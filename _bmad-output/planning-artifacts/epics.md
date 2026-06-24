# Epics And Stories: Prompt Enhancer MVP

## Epic 1: Guided Discovery Flow
Deliver a complete user journey from start through review without AI generation.

### Story 1.1: Replace starter with workflow shell
Acceptance criteria:
- The first screen introduces the tool and starts the guided flow.
- The UI is usable on desktop and mobile.
- No source is added outside the MVP app surface.

### Story 1.2: Implement discovery steps
Acceptance criteria:
- The flow captures idea, audience, journeys, features, screens, data, rules, and style.
- Users can move back and forward without losing answers.
- Required missing inputs are handled with clear inline feedback.

### Story 1.3: Add review step
Acceptance criteria:
- Users see a concise summary of their answers.
- Users can return to edit prior steps.
- Generation is only available after required inputs are complete.

## Epic 2: Prompt Generation
Generate a builder-ready prompt through a server-only OpenRouter integration.

### Story 2.1: Define generation contract
Acceptance criteria:
- A typed discovery-answer shape exists.
- The prompt template maps answers into product, UX, data, constraints, and build instructions.
- The output format is stable enough to test manually.

### Story 2.2: Add OpenRouter server boundary
Acceptance criteria:
- The browser never receives `OPENROUTER_API_KEY`.
- The configured model defaults to `google/gemini-3-flash-preview`.
- Missing key and provider errors produce useful UI messages.

### Story 2.3: Display generated prompt
Acceptance criteria:
- The final prompt is readable and copyable.
- Copy success is visible.
- Users can restart the flow from the output screen.

## Epic 3: Polish And Submission Readiness
Make the demo credible for review and easy to explain in Loom.

### Story 3.1: Apply UX polish
Acceptance criteria:
- Spacing, typography, progress, focus, and loading states feel intentional.
- Mobile layout remains usable.
- Accessibility basics are covered.

### Story 3.2: Add reviewer-facing documentation
Acceptance criteria:
- README explains setup, env vars, and local run commands.
- Planning artifacts remain committed and easy to find.
- Future-improvement notes are ready for the walkthrough.

### Story 3.3: Verify demo path
Acceptance criteria:
- A sample user can complete the flow, generate a prompt, copy it, and restart.
- Error and loading states are manually checked.
- The Loom outline matches the implemented flow.

## Assumptions
- Epics are ordered for implementation, but small stories can be developed in parallel after the discovery answer shape is stable.
- README edits are implementation-phase documentation and are not part of this planning-only pass.
