import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const componentSource = (fileName: string) => {
  const filePath = join(import.meta.dirname, fileName);
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadFinalFlowModule = async () => {
  try {
    return (await import("./final-flow")) as {
      getReviewAnswerPreview?: (answer: string, maxLength?: number) => string;
      getGenerationProgressSnapshot?: (elapsedMs: number) => {
        activeStageLabel: string;
        elapsedSeconds: number;
        includedDiscoveryCount: number;
        progressPercent: number;
        stages: Array<{
          label: string;
          state: "done" | "active" | "pending";
        }>;
      };
      generationProgressStages?: Array<{ label: string }>;
      reviewAnswerRows?: Array<{ key: string; label: string }>;
    };
  } catch {
    return null;
  }
};

describe("final prompt flow", () => {
  it("defines the review rows in the required discovery order", async () => {
    const finalFlowModule = await loadFinalFlowModule();

    expect(finalFlowModule?.reviewAnswerRows?.map((row) => row.label)).toEqual([
      "App idea",
      "Target users",
      "Problem",
      "Features",
      "Screens",
      "Data",
      "Integrations",
      "UX tone",
      "Constraints",
    ]);
  });

  it("keeps review previews compact without losing empty states", async () => {
    const finalFlowModule = await loadFinalFlowModule();

    expect(finalFlowModule?.getReviewAnswerPreview?.("")).toBe("Missing");
    expect(
      finalFlowModule?.getReviewAnswerPreview?.("Line one\nLine two", 80),
    ).toBe("Line one Line two");
    expect(
      finalFlowModule?.getReviewAnswerPreview?.(
        "A booking app for independent yoga teachers",
        24,
      ),
    ).toBe("A booking app for ind...");
  });

  it("extracts review, loading, and result components with the step-width rhythm", () => {
    const source = componentSource("final-flow.tsx");

    expect(source).toContain("export function ReviewPanel");
    expect(source).toContain("export function ReviewAnswerRow");
    expect(source).toContain("export function InlineReviewEditor");
    expect(source).toContain("export function GenerationLoadingPanel");
    expect(source).toContain("export function GenerationErrorPanel");
    expect(source).toContain("export function ResultPanel");
    expect(source).toContain("export function PromptOutputViewer");
    expect(source).toContain("max-w-[740px]");
    expect(source).toContain("Check the brief before generation.");
    expect(source).toContain(
      "These answers become the context for the final builder prompt.",
    );
  });

  it("uses inline review editing instead of navigating back to question steps", () => {
    const appSource = componentSource("../prompt-enhancer-app.tsx");
    const finalFlowSource = componentSource("final-flow.tsx");

    expect(appSource).toContain("editingReviewField");
    expect(appSource).toContain("startInlineReviewEdit");
    expect(appSource).toContain("saveInlineReviewEdit");
    expect(appSource).not.toContain("onEdit={editField}");
    expect(finalFlowSource).toContain("Save");
    expect(finalFlowSource).toContain("Cancel");
    expect(finalFlowSource).toContain("maxLength={1000}");
    expect(finalFlowSource).toContain("Save or cancel before editing another row.");
  });

  it("shows a builder generation state before rendering the result", () => {
    const appSource = componentSource("../prompt-enhancer-app.tsx");
    const finalFlowSource = componentSource("final-flow.tsx");

    expect(appSource).toContain("GenerationLoadingPanel");
    expect(appSource).toContain("GenerationErrorPanel");
    expect(appSource).toContain("generationFailed");
    expect(appSource).toContain("if (isGenerating) {");
    expect(finalFlowSource).toContain("Generating");
    expect(finalFlowSource).toContain("Assembling your builder-ready prompt.");
    expect(finalFlowSource).toContain("Reading discovery answers");
    expect(finalFlowSource).toContain("Organizing product scope");
    expect(finalFlowSource).toContain("Structuring screens and workflows");
    expect(finalFlowSource).toContain("Preparing copy-ready output");
    expect(finalFlowSource).toContain("Retry generation");
    expect(finalFlowSource).toContain("Back to review");
  });

  it("models prompt generation as live progress through discovery context and AI response phases", async () => {
    const finalFlowModule = await loadFinalFlowModule();
    const getSnapshot = finalFlowModule?.getGenerationProgressSnapshot;

    expect(getSnapshot).toBeTypeOf("function");
    expect(
      finalFlowModule?.generationProgressStages?.map((stage) => stage.label),
    ).toEqual([
      "Reading discovery answers",
      "Organizing product scope",
      "Structuring screens and workflows",
      "Adding data and integrations",
      "Preparing copy-ready output",
      "Awaiting model response",
    ]);

    const start = getSnapshot?.(0);
    expect(start).toMatchObject({
      activeStageLabel: "Reading discovery answers",
      elapsedSeconds: 0,
      includedDiscoveryCount: 1,
      progressPercent: 8,
    });
    expect(start?.stages.map((stage) => stage.state)).toEqual([
      "active",
      "pending",
      "pending",
      "pending",
      "pending",
      "pending",
    ]);

    const midRequest = getSnapshot?.(2600);
    expect(midRequest?.includedDiscoveryCount).toBe(9);
    expect(midRequest?.progressPercent).toBeGreaterThan(35);
    expect(midRequest?.stages.map((stage) => stage.state)).toEqual([
      "done",
      "done",
      "active",
      "pending",
      "pending",
      "pending",
    ]);

    const longRequest = getSnapshot?.(20000);
    expect(longRequest).toMatchObject({
      activeStageLabel: "Awaiting model response",
      includedDiscoveryCount: 9,
      progressPercent: 94,
    });
  });

  it("wires the loading panel to a real-time progressbar and rotating generation phases", () => {
    const appSource = componentSource("../prompt-enhancer-app.tsx");
    const finalFlowSource = componentSource("final-flow.tsx");

    expect(appSource).toContain("generationElapsedMs");
    expect(appSource).toContain("window.setInterval");
    expect(appSource).toContain("getGenerationProgressSnapshot");
    expect(appSource).toContain("progress={generationProgress}");
    expect(finalFlowSource).toContain('role="progressbar"');
    expect(finalFlowSource).toContain("aria-valuenow={progress.progressPercent}");
    expect(finalFlowSource).toContain("9-step discovery context");
    expect(finalFlowSource).toContain("progress.includedDiscoveryCount");
    expect(finalFlowSource).toContain("Included in prompt context");
    expect(finalFlowSource).toContain("motion-reduce:animate-none");
  });

  it("lets users return from completed question steps without walking the whole flow again", () => {
    const appSource = componentSource("../prompt-enhancer-app.tsx");
    const questionPanelSource = componentSource("question-panel.tsx");
    const questionStepLayoutSource = componentSource("question-step-layout.tsx");

    expect(appSource).toContain("questionReturnTarget");
    expect(appSource).toContain("returnToActiveCheckpoint");
    expect(appSource).toContain('setQuestionReturnTarget("review")');
    expect(appSource).toContain('setQuestionReturnTarget("result")');
    expect(questionPanelSource).toContain("returnTarget");
    expect(questionPanelSource).toContain("Save and return to review");
    expect(questionPanelSource).toContain("Save and view prompt");
    expect(questionStepLayoutSource).toContain("primaryActionLabel");
    expect(questionStepLayoutSource).toContain("secondaryActionLabel");
    expect(questionStepLayoutSource).toContain("showPrimaryActionIcon");
  });

  it("keeps the latest generated prompt reachable in session and marks it stale after edits", () => {
    const appSource = componentSource("../prompt-enhancer-app.tsx");
    const railSource = componentSource("discovery-rail.tsx");
    const finalFlowSource = componentSource("final-flow.tsx");

    expect(appSource).toContain("isGeneratedPromptStale");
    expect(appSource).toContain("setIsGeneratedPromptStale(true)");
    expect(appSource).toContain("onReviewSelect={viewReview}");
    expect(appSource).toContain("onResultSelect={viewGeneratedPrompt}");
    expect(appSource).toContain("generatedPromptStatus");
    expect(railSource).toContain("Review answers");
    expect(railSource).toContain("Generated prompt ready");
    expect(railSource).toContain("Previous prompt ready");
    expect(railSource).toContain("View prompt");
    expect(finalFlowSource).toContain("Generated before latest edits");
    expect(finalFlowSource).toContain("Regenerate from updated brief");
    expect(finalFlowSource).toContain("Review answers");
    expect(finalFlowSource).toContain("View current prompt");
  });

  it("renders the generated prompt in a polished output viewer", () => {
    const source = componentSource("final-flow.tsx");
    const promptOutputViewerSource =
      source.split("export function PromptOutputViewer")[1] || "";

    expect(source).toContain("Paste this into your AI app builder.");
    expect(source).toContain("Generated from {completedAnswerCount} discovery answers");
    expect(source).toContain("Review the prompt, then paste it into Lovable, Base44, Emergent");
    expect(promptOutputViewerSource).toContain("<pre");
    expect(promptOutputViewerSource).not.toContain("<textarea");
    expect(source).toContain("Copied");
    expect(source).not.toContain("Bolt");
    expect(source).not.toContain("Replit Agent");
  });

  it("keeps the right live brief aligned with all saved discovery answers", () => {
    const source = componentSource("live-prompt-brief.tsx");

    expect(source).toContain('key: "screens"');
    expect(source).toContain('key: "data"');
    expect(source).toContain('key: "integrations"');
    expect(source).toContain('key: "uxTone"');
    expect(source).toContain('key: "constraints"');
    expect(source).not.toContain('hasValue ? "text-[var(--accent)]"');
  });
});
