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
    answers.data = "Teachers, classes, bookings, payment status";

    const parsed = draftModule?.parseDiscoveryDraft({
      version: 1,
      flowState: "questions",
      stepIndex: 5,
      answers,
      touched: { appIdea: true, data: true },
    });

    expect(draftModule?.DISCOVERY_DRAFT_STORAGE_KEY).toBe(
      "prompt-enhancer:draft:v1",
    );
    expect(parsed).toMatchObject({
      flowState: "questions",
      stepIndex: 5,
      answers: {
        appIdea: "A booking app for yoga teachers",
        data: "Teachers, classes, bookings, payment status",
      },
      touched: { appIdea: true, data: true },
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
});
