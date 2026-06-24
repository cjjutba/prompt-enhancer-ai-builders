import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const problemStepSource = () => {
  const filePath = join(import.meta.dirname, "problem-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const questionPanelSource = () => {
  const filePath = join(import.meta.dirname, "question-panel.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const livePromptBriefSource = () => {
  const filePath = join(import.meta.dirname, "live-prompt-brief.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

describe("ProblemStep discovery experience", () => {
  it("keeps Step 3 in a dedicated problem discovery component", async () => {
    const source = problemStepSource();
    const questionPanel = questionPanelSource();

    expect(source).toContain("export function ProblemStep");
    expect(source).toContain("export function ProblemPromptChips");
    expect(source).toContain("export function StepGuidance");
    expect(questionPanel).toContain(
      '<ProblemStep answer={answer} onChange={onChange} step={step} />',
    );
  });

  it("uses the requested Step 3 copy, textarea constraints, and restrained row guidance", () => {
    const source = problemStepSource();

    expect(source).toContain("Plain language is enough. One or two short paragraphs works well.");
    expect(source).toContain("maxLength={1000}");
    expect(source).toContain("min-h-[200px]");
    expect(source).toContain("max-h-[240px]");
    expect(source).toContain("divide-y divide-[var(--border)]");
    expect(source).toContain("Problem prompts");
    expect(source).toContain("Why this matters");
    expect(source).toContain(
      "A clear problem statement helps the AI builder choose the right workflows, screens, and success states instead of creating a generic feature list.",
    );
    expect(source).not.toContain("bg-gradient");
    expect(source).not.toContain("rounded-full");
  });

  it("defines interactive prompt chips that append editable problem wording", async () => {
    const problemStepModule = (await import("./problem-step")) as {
      problemPromptChips?: Array<{ label: string; text: string }>;
      toggleProblemPrompt?: (answer: string, promptText: string) => string;
    };

    expect(
      problemStepModule.problemPromptChips?.map((prompt) => prompt.label),
    ).toEqual([
      "Too much manual work",
      "Missed updates",
      "Hard to track requests",
      "Duplicate data entry",
      "Slow approvals",
      "No clear owner",
      "Payment confusion",
      "Poor customer visibility",
    ]);

    const paymentPrompt = problemStepModule.problemPromptChips?.find(
      (prompt) => prompt.label === "Payment confusion",
    )?.text;

    expect(paymentPrompt).toBeTruthy();
    expect(problemStepModule.toggleProblemPrompt?.("", paymentPrompt || "")).toBe(
      paymentPrompt,
    );
    expect(
      problemStepModule.toggleProblemPrompt?.(
        "Bookings happen through texts and spreadsheets.",
        paymentPrompt || "",
      ),
    ).toBe(`Bookings happen through texts and spreadsheets. ${paymentPrompt}`);
    expect(
      problemStepModule.toggleProblemPrompt?.(
        `Bookings happen through texts and spreadsheets. ${paymentPrompt}`,
        paymentPrompt || "",
      ),
    ).toBe("Bookings happen through texts and spreadsheets.");
  });

  it("shows the problem answer as a Problem row in the live prompt brief", () => {
    const source = livePromptBriefSource();

    expect(source).toContain('{ key: "problem", label: "Problem"');
    expect(source).not.toContain('{ key: "problem", label: "Goal"');
  });
});
