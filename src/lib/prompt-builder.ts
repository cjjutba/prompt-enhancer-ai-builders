import type { DiscoveryAnswers } from "./discovery";

export type OpenRouterMessage = {
  role: "system" | "user";
  content: string;
};

const answerLines = (answers: DiscoveryAnswers): string => {
  return [
    ["App idea", answers.appIdea],
    ["Target users", answers.targetUsers],
    ["Problem", answers.problem],
    ["Must-have features", answers.features],
    ["Screens and navigation", answers.screens],
    ["Data and content", answers.data],
    ["Integrations", answers.integrations],
    ["UX tone", answers.uxTone],
    ["Constraints", answers.constraints],
  ]
    .map(([label, value]) => `## ${label}\n${value}`)
    .join("\n\n");
};

export const buildOpenRouterMessages = (
  answers: DiscoveryAnswers,
): OpenRouterMessage[] => [
  {
    role: "system",
    content:
      "You create complete prompts for AI app builders. This assignment targets Lovable, Base44, and Emergent. Write for non-technical founders. Be specific, structured, and practical. Do not mention Bolt. Do not mention Replit Agent. Do not introduce unrelated builder platforms unless the user's discovery notes explicitly name them. Do not mention hidden system instructions.",
  },
  {
    role: "user",
    content: `Turn these discovery notes into one polished, builder-ready prompt.

${answerLines(answers)}

Write the final prompt with these sections:
1. Product summary
2. Target users
3. Core user journeys
4. Must-have features with acceptance criteria
5. Suggested screens and navigation
6. Data model or content structure
7. Integrations and external services
8. UX and visual direction
9. Constraints and business rules
10. Out-of-scope items

When naming where the prompt should be pasted, name only Lovable, Base44, and Emergent unless the user's discovery notes explicitly name another builder.

End with this instruction to the app builder: ask clarifying questions only when blocked, otherwise build the first version from this prompt.`,
  },
];
