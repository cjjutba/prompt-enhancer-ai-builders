"use client";

import { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/prompt-enhancer/app-shell";
import type { ShellFlowState } from "@/components/prompt-enhancer/discovery-rail";
import { IntroScreen } from "@/components/prompt-enhancer/intro-screen";
import { QuestionPanel } from "@/components/prompt-enhancer/question-panel";
import { Button, WorkspacePanel } from "@/components/prompt-enhancer/ui";
import {
  useDiscoveryDraft,
  type DiscoveryDraftSnapshot,
} from "@/components/prompt-enhancer/use-discovery-draft";
import {
  discoverySteps,
  emptyDiscoveryAnswers,
  getMissingDiscoveryFields,
  type DiscoveryAnswers,
  type DiscoveryField,
} from "@/lib/discovery";

type FlowState = ShellFlowState;
type CopyState = "idle" | "copied" | "failed";

const stepCount = discoverySteps.length;

export function PromptEnhancerApp() {
  const [flowState, setFlowState] = useState<FlowState>("intro");
  const [answers, setAnswers] = useState<DiscoveryAnswers>(
    emptyDiscoveryAnswers,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [showExampleOutput, setShowExampleOutput] = useState(false);

  const restoreDraft = useCallback((draft: DiscoveryDraftSnapshot) => {
    setFlowState(draft.flowState);
    setStepIndex(draft.stepIndex);
    setAnswers(draft.answers);
    setTouched(draft.touched);
    setError("");
    setGeneratedPrompt("");
    setCopyState("idle");
    setShowExampleOutput(false);
  }, []);

  const { clearDraft } = useDiscoveryDraft({
    answers,
    flowState,
    onRestore: restoreDraft,
    stepIndex,
    touched,
  });

  const currentStep = discoverySteps[stepIndex];
  const currentValue = answers[currentStep.id];
  const currentStepMissing = currentValue.trim().length === 0;
  const missingFields = useMemo(
    () => getMissingDiscoveryFields(answers),
    [answers],
  );
  const completedCount = stepCount - missingFields.length;
  const progressPercent =
    flowState === "intro"
      ? 0
      : flowState === "review" || flowState === "result"
        ? 100
        : Math.round((completedCount / stepCount) * 100);

  const updateAnswer = (field: DiscoveryField, value: string) => {
    setAnswers((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const markTouched = (field: DiscoveryField) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const startFlow = () => {
    setFlowState("questions");
    setStepIndex(0);
    setError("");
    setShowExampleOutput(false);
  };

  const goNext = () => {
    markTouched(currentStep.id);

    if (currentStepMissing) {
      return;
    }

    if (stepIndex === stepCount - 1) {
      setFlowState("review");
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const goBack = () => {
    setError("");

    if (flowState === "review") {
      setFlowState("questions");
      setStepIndex(stepCount - 1);
      return;
    }

    setStepIndex((index) => Math.max(0, index - 1));
  };

  const editField = (field: DiscoveryField) => {
    const index = discoverySteps.findIndex((step) => step.id === field);
    setStepIndex(Math.max(0, index));
    setFlowState("questions");
    setError("");
    setShowExampleOutput(false);
  };

  const restart = () => {
    clearDraft();
    setAnswers(emptyDiscoveryAnswers());
    setStepIndex(0);
    setTouched({});
    setError("");
    setGeneratedPrompt("");
    setCopyState("idle");
    setShowExampleOutput(false);
    setFlowState("intro");
  };

  const generatePrompt = async () => {
    const missing = getMissingDiscoveryFields(answers);

    if (missing.length > 0) {
      setError("Complete every discovery step before generating.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setCopyState("idle");

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });
      const data = (await response.json()) as {
        prompt?: string;
        error?: string;
      };

      if (!response.ok || !data.prompt) {
        setError(data.error || "Prompt generation failed. Try again.");
        return;
      }

      setGeneratedPrompt(data.prompt);
      setFlowState("result");
    } catch {
      setError("Prompt generation failed. Check your connection and retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <AppShell
      answers={answers}
      completedCount={completedCount}
      currentStepIndex={stepIndex}
      flowState={flowState}
      onStepSelect={editField}
      progressPercent={progressPercent}
    >
      {flowState === "intro" && (
        <IntroScreen
          onShowExample={() => setShowExampleOutput((visible) => !visible)}
          onStart={startFlow}
          showExample={showExampleOutput}
        />
      )}

      {flowState === "questions" && (
        <QuestionPanel
          answer={currentValue}
          errorVisible={Boolean(touched[currentStep.id])}
          isMissing={currentStepMissing}
          onBack={goBack}
          onChange={(value) => updateAnswer(currentStep.id, value)}
          onNext={goNext}
          showBack={stepIndex > 0}
          step={currentStep}
          stepIndex={stepIndex}
        />
      )}

      {flowState === "review" && (
        <ReviewPanel
          answers={answers}
          error={error}
          isGenerating={isGenerating}
          missingFields={missingFields}
          onBack={goBack}
          onEdit={editField}
          onGenerate={generatePrompt}
        />
      )}

      {flowState === "result" && (
        <ResultPanel
          copyState={copyState}
          error={error}
          isGenerating={isGenerating}
          onCopy={copyPrompt}
          onRestart={restart}
          onRetry={generatePrompt}
          prompt={generatedPrompt}
        />
      )}
    </AppShell>
  );
}

function ReviewPanel({
  answers,
  error,
  isGenerating,
  missingFields,
  onBack,
  onEdit,
  onGenerate,
}: {
  answers: DiscoveryAnswers;
  error: string;
  isGenerating: boolean;
  missingFields: DiscoveryField[];
  onBack: () => void;
  onEdit: (field: DiscoveryField) => void;
  onGenerate: () => void;
}) {
  const isReady = missingFields.length === 0;

  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-[calc(100vh-40px)] lg:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        Review
      </p>
      <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl">
        Check the brief before generation.
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
        These answers become the context for the final builder prompt.
      </p>

      <div className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {discoverySteps.map((step) => (
          <div key={step.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                {step.label}
              </h2>
              <button
                type="button"
                onClick={() => onEdit(step.id)}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]"
              >
                Edit
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line break-words text-base leading-7 text-[var(--text-secondary)]">
              {answers[step.id] || "Missing"}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p
          aria-live="polite"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      {isGenerating && (
        <p
          aria-live="polite"
          className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
        >
          Assembling your builder prompt from the discovery notes.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={onBack} variant="secondary">
          Back to questions
        </Button>
        <Button
          disabled={!isReady || isGenerating}
          onClick={onGenerate}
          variant="primary"
        >
          {isGenerating ? "Generating..." : "Generate prompt"}
        </Button>
      </div>
    </WorkspacePanel>
  );
}

function ResultPanel({
  copyState,
  error,
  isGenerating,
  onCopy,
  onRestart,
  onRetry,
  prompt,
}: {
  copyState: CopyState;
  error: string;
  isGenerating: boolean;
  onCopy: () => void;
  onRestart: () => void;
  onRetry: () => void;
  prompt: string;
}) {
  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-[calc(100vh-40px)] lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Builder-ready prompt
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl">
            Paste this into your AI app builder.
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="sm:min-w-24"
            onClick={onCopy}
            variant={copyState === "copied" ? "secondary" : "primary"}
          >
            {copyState === "copied" ? "Copied" : "Copy"}
          </Button>
          <Button onClick={onRestart} variant="secondary">
            Restart
          </Button>
        </div>
      </div>

      {copyState === "copied" && (
        <p
          aria-live="polite"
          className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          Copied to clipboard.
        </p>
      )}

      {copyState === "failed" && (
        <p
          aria-live="polite"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          Copy failed. Select the prompt text and copy it manually.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <Button
            className="mt-3"
            disabled={isGenerating}
            onClick={onRetry}
            variant="primary"
          >
            {isGenerating ? "Retrying..." : "Retry generation"}
          </Button>
        </div>
      )}

      <textarea
        readOnly
        id="generatedPrompt"
        name="generatedPrompt"
        value={prompt}
        className="mt-6 min-h-[520px] w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 font-mono text-sm leading-6 text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-ring)]"
        aria-label="Generated prompt"
      />
    </WorkspacePanel>
  );
}
