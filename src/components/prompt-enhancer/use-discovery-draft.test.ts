import { afterEach, describe, expect, it, vi } from "vitest";
import { emptyDiscoveryAnswers } from "../../lib/discovery";

const loadDraftModule = async () => {
  try {
    return await import("./use-discovery-draft");
  } catch {
    return null;
  }
};

describe("discovery draft autosave contract", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("does not persist intro state or generated result content", async () => {
    const draftModule = await loadDraftModule();
    const answers = emptyDiscoveryAnswers();
    answers.appIdea = "A booking app for yoga teachers";

    expect(
      draftModule?.createDiscoveryDraftSnapshot({
        answers,
        flowState: "intro",
        stepIndex: 0,
        touched: {},
      }),
    ).toBeNull();

    expect(
      draftModule?.createDiscoveryDraftSnapshot({
        answers,
        flowState: "result",
        stepIndex: 8,
        touched: { appIdea: true },
      }),
    ).toMatchObject({
      flowState: "review",
      stepIndex: 8,
      answers: {
        appIdea: "A booking app for yoga teachers",
      },
    });
  });

  it("clears the session draft from sessionStorage", async () => {
    const draftModule = await loadDraftModule();
    const storage = createMemoryStorage();

    vi.stubGlobal("window", { sessionStorage: storage });

    storage.setItem("prompt-enhancer:draft:v1", JSON.stringify({ version: 1 }));
    draftModule?.clearDiscoveryDraft();

    expect(storage.getItem("prompt-enhancer:draft:v1")).toBeNull();
  });
});

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}
