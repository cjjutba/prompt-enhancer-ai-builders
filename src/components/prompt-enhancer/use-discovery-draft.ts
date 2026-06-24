"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ShellFlowState } from "./discovery-rail";
import {
  discoveryFields,
  discoverySteps,
  emptyDiscoveryAnswers,
  getMissingDiscoveryFields,
  type DiscoveryAnswers,
  type DiscoveryField,
} from "../../lib/discovery";

export const DISCOVERY_DRAFT_STORAGE_KEY = "prompt-enhancer:draft:v1";
export const DISCOVERY_DRAFT_VERSION = 1;

type DraftFlowState = Exclude<ShellFlowState, "result">;

export type DiscoveryDraftSnapshot = {
  version: typeof DISCOVERY_DRAFT_VERSION;
  flowState: DraftFlowState;
  stepIndex: number;
  answers: DiscoveryAnswers;
  touched: Record<string, boolean>;
};

type UseDiscoveryDraftArgs = {
  answers: DiscoveryAnswers;
  flowState: ShellFlowState;
  onRestore: (draft: DiscoveryDraftSnapshot) => void;
  stepIndex: number;
  touched: Record<string, boolean>;
};

const draftFlowStates = new Set<DraftFlowState>([
  "intro",
  "questions",
  "review",
]);

export function useDiscoveryDraft({
  answers,
  flowState,
  onRestore,
  stepIndex,
  touched,
}: UseDiscoveryDraftArgs) {
  const hasLoadedDraftRef = useRef(false);
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    if (hasLoadedDraftRef.current) {
      return;
    }

    const draft = readDiscoveryDraft();

    if (draft) {
      skipNextSaveRef.current = true;
      onRestore(draft);
    }

    hasLoadedDraftRef.current = true;
  }, [onRestore]);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const draft = createDiscoveryDraftSnapshot({
      answers,
      flowState,
      stepIndex,
      touched,
    });

    if (!draft) {
      clearDiscoveryDraft();
      return;
    }

    saveDiscoveryDraft(draft);
  }, [answers, flowState, stepIndex, touched]);

  const clearDraft = useCallback(() => {
    clearDiscoveryDraft();
  }, []);

  return { clearDraft };
}

export function createDiscoveryDraftSnapshot({
  answers,
  flowState,
  stepIndex,
  touched,
}: Omit<UseDiscoveryDraftArgs, "onRestore">): DiscoveryDraftSnapshot | null {
  if (flowState === "intro") {
    return null;
  }

  return {
    version: DISCOVERY_DRAFT_VERSION,
    flowState: flowState === "result" ? "review" : flowState,
    stepIndex,
    answers,
    touched,
  };
}

export function parseDiscoveryDraft(value: unknown): DiscoveryDraftSnapshot | null {
  if (!isRecord(value) || value.version !== DISCOVERY_DRAFT_VERSION) {
    return null;
  }

  if (
    typeof value.flowState !== "string" ||
    !draftFlowStates.has(value.flowState as DraftFlowState)
  ) {
    return null;
  }

  if (
    typeof value.stepIndex !== "number" ||
    !Number.isInteger(value.stepIndex) ||
    value.stepIndex < 0 ||
    value.stepIndex >= discoverySteps.length
  ) {
    return null;
  }

  const answers = parseDraftAnswers(value.answers);

  if (!answers) {
    return null;
  }

  const missingFields = getMissingDiscoveryFields(answers);
  const flowState =
    value.flowState === "review" && missingFields.length > 0
      ? "questions"
      : (value.flowState as DraftFlowState);

  return {
    version: DISCOVERY_DRAFT_VERSION,
    flowState,
    stepIndex: value.stepIndex,
    answers,
    touched: parseDraftTouched(value.touched),
  };
}

export function readDiscoveryDraft(): DiscoveryDraftSnapshot | null {
  const storage = getDraftStorage();

  if (!storage) {
    return null;
  }

  try {
    const stored = storage.getItem(DISCOVERY_DRAFT_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return parseDiscoveryDraft(JSON.parse(stored));
  } catch {
    return null;
  }
}

export function saveDiscoveryDraft(draft: DiscoveryDraftSnapshot) {
  const storage = getDraftStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(DISCOVERY_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Session storage can fail in private browsing or constrained contexts.
  }
}

export function clearDiscoveryDraft() {
  const storage = getDraftStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(DISCOVERY_DRAFT_STORAGE_KEY);
  } catch {
    // Ignore unavailable browser storage.
  }
}

function parseDraftAnswers(value: unknown): DiscoveryAnswers | null {
  if (!isRecord(value)) {
    return null;
  }

  const answers = emptyDiscoveryAnswers();

  for (const field of discoveryFields) {
    const fieldValue = value[field];

    if (typeof fieldValue !== "string") {
      return null;
    }

    answers[field] = fieldValue;
  }

  return answers;
}

function parseDraftTouched(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) {
    return {};
  }

  return discoveryFields.reduce(
    (draftTouched, field: DiscoveryField) => {
      if (value[field] === true) {
        draftTouched[field] = true;
      }

      return draftTouched;
    },
    {} as Record<string, boolean>,
  );
}

function getDraftStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
