# PRD: Prompt Enhancer for AI App Builders

## Assignment Summary
Build a fictional prompt enhancer tool for non-technical users creating apps with AI builders such as Lovable, Base44, and Emergent. The app should guide users through structured discovery and generate a comprehensive, paste-ready prompt using OpenRouter with `google/gemini-3-flash-preview`. The take-home is evaluated on product thinking, UX, architecture, AI integration, AI-assisted workflow, and a 5-10 minute walkthrough.

## Goal
Help users turn a vague app idea into a clear AI-builder prompt that includes purpose, users, features, screens, data, rules, design direction, constraints, and implementation guidance.

## Users
- Primary: non-technical founders, operators, creators, and small business users experimenting with AI app builders.
- Secondary: technical reviewers evaluating whether the flow, AI integration, and code architecture are thoughtful.

## MVP Flow
1. Start with a short promise and a single primary action.
2. Guide the user through discovery steps:
   - App idea and intended outcome.
   - Target users and problem.
   - Core user journeys.
   - Must-have features.
   - Screens and navigation.
   - Data or content the app manages.
   - Integrations and constraints.
   - Visual tone and UX priorities.
3. Review a concise summary before generation.
4. Generate a complete AI-builder prompt with OpenRouter.
5. Show the prompt with copy and restart actions.

## Functional Requirements
- FR1: The app must collect structured user input across multiple guided steps.
- FR2: The app must support a review step before prompt generation.
- FR3: The app must call a server-only OpenRouter integration to generate the final prompt.
- FR4: The app must display the generated prompt in a readable, copyable format.
- FR5: The app must let the user restart the flow without saved history.
- FR6: The app must handle loading, missing input, and generation errors clearly.

## Non-Functional Requirements
- NFR1: The guided flow must feel approachable for non-technical users.
- NFR2: The OpenRouter API key must never be exposed to the browser.
- NFR3: The app must not require auth, database, or persistent storage.
- NFR4: The output should be useful when pasted into Lovable, Base44, Emergent, or similar builders.
- NFR5: The implementation should be simple enough to explain in a 5-10 minute Loom.

## Output Prompt Requirements
The generated prompt should include:
- Product summary.
- Target users and user journeys.
- Core features and acceptance criteria.
- Suggested screens/navigation.
- Data model or content structure.
- Integrations and constraints.
- UX/design direction.
- Out-of-scope items.
- Clear instruction to the AI builder to ask clarifying questions only when blocked.

## Success Criteria
- A reviewer can understand the product strategy from the flow.
- A non-technical user can finish without needing to know software terminology.
- The generated prompt is substantially better than the user’s initial idea.
- The architecture keeps secrets server-side and avoids unnecessary backend scope.
- The Loom walkthrough has clear talking points for product, UX, AI, and code decisions.

## Assumptions
- The MVP uses predefined discovery questions rather than AI-generated follow-up questions.
- Prompt generation happens once at the end, not continuously during the flow.
- The user-provided OpenRouter key will be configured locally or in deployment environment variables.
