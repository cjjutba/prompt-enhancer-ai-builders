# UX Design: Prompt Enhancer MVP

## UX Principle
Make the user feel like they are answering a practical product worksheet, not filling out a technical spec. Each step should reduce ambiguity while keeping momentum.

## Information Architecture
- **Landing/start:** one-screen intro, expected time, start action.
- **Discovery wizard:** focused step-by-step form with progress.
- **Review:** summarized answers with edit affordances.
- **Generating:** clear loading state and reassurance that the app is assembling the final prompt.
- **Output:** generated prompt, copy action, restart action.

## Suggested Steps
1. **Idea:** What are you building, and why?
2. **Audience:** Who will use it, and what problem do they have?
3. **Journeys:** What should users be able to do from start to finish?
4. **Features:** What must be included in the first version?
5. **Screens:** What pages or views should exist?
6. **Data:** What information does the app need to store or display?
7. **Rules:** What constraints, permissions, or business logic matter?
8. **Style:** What should the app feel like?
9. **Review:** Confirm answers before generating.

## Screen Behavior
- Keep one primary question per step.
- Use helper text to explain intent without teaching software concepts.
- Prefer plain-language labels like "What should people be able to do?" over "functional requirements."
- Allow back/next navigation without losing current answers.
- Disable generation until required answers are present.

## States
- Empty: show example phrasing or short placeholders.
- Validation: inline, specific, and non-blocking until the user advances.
- Loading: show progress text during generation.
- Error: explain that generation failed and allow retry without losing answers.
- Success: prompt visible, copy confirmation, restart available.

## Accessibility Floor
- Keyboard-accessible controls.
- Visible focus states.
- Form labels tied to inputs.
- Sufficient color contrast.
- Generated prompt readable in a large text area or structured preview.

## Visual Direction
Use a clean productivity-tool feel: calm, focused, and credible. Avoid a marketing-heavy landing page. The first screen should immediately start the usable workflow.

## Assumptions
- A single-column wizard is enough for desktop and mobile.
- No visual mockups are required before implementation; this document is the UX contract.
