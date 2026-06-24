import { describe, expect, it } from "vitest";
import { emptyDiscoveryAnswers } from "../../lib/discovery";

const loadDraftModule = async () => {
  try {
    return await import("./use-discovery-draft");
  } catch {
    return null;
  }
};

describe("discovery draft autosave contract", () => {
  it("uses a versioned session draft schema that restores wizard progress", async () => {
    const draftModule = await loadDraftModule();
    const answers = emptyDiscoveryAnswers();
    answers.appIdea = "A booking app for yoga teachers";

    const parsed = draftModule?.parseDiscoveryDraft({
      version: 1,
      flowState: "questions",
      stepIndex: 4,
      answers,
      touched: { appIdea: true },
    });

    expect(draftModule?.DISCOVERY_DRAFT_STORAGE_KEY).toBe(
      "prompt-enhancer:draft:v1",
    );
    expect(parsed).toMatchObject({
      flowState: "questions",
      stepIndex: 4,
      answers: { appIdea: "A booking app for yoga teachers" },
      touched: { appIdea: true },
    });
  });

  it("ignores incompatible draft payloads instead of restoring stale data", async () => {
    const draftModule = await loadDraftModule();

    expect(
      draftModule?.parseDiscoveryDraft({
        version: 999,
        flowState: "questions",
        stepIndex: 1,
        answers: emptyDiscoveryAnswers(),
      }),
    ).toBeNull();
  });

  it("restores Step 8 design preferences answers from the session draft", async () => {
    const draftModule = await loadDraftModule();
    const answers = emptyDiscoveryAnswers();
    answers.uxTone =
      "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate.";

    const parsed = draftModule?.parseDiscoveryDraft({
      version: 1,
      flowState: "questions",
      stepIndex: 7,
      answers,
      touched: { uxTone: true },
    });

    expect(parsed).toMatchObject({
      flowState: "questions",
      stepIndex: 7,
      answers: {
        uxTone:
          "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate.",
      },
      touched: { uxTone: true },
    });
  });
});
