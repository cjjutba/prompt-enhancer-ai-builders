"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/prompt-enhancer/app-shell";
import type { ShellFlowState } from "@/components/prompt-enhancer/discovery-rail";
import {
  GenerationErrorPanel,
  GenerationLoadingPanel,
  getGenerationProgressSnapshot,
  ResultPanel,
  ReviewPanel,
} from "@/components/prompt-enhancer/final-flow";
import { IntroScreen } from "@/components/prompt-enhancer/intro-screen";
import { QuestionPanel } from "@/components/prompt-enhancer/question-panel";
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
type QuestionReturnTarget = "review" | "result" | null;

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
  const [generationFailed, setGenerationFailed] = useState(false);
  const [generationElapsedMs, setGenerationElapsedMs] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGeneratedPromptStale, setIsGeneratedPromptStale] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [questionReturnTarget, setQuestionReturnTarget] =
    useState<QuestionReturnTarget>(null);
  const [editingReviewField, setEditingReviewField] =
    useState<DiscoveryField | null>(null);
  const [editingReviewValue, setEditingReviewValue] = useState("");
  const [showExampleOutput, setShowExampleOutput] = useState(false);

  const restoreDraft = useCallback((draft: DiscoveryDraftSnapshot) => {
    setFlowState(draft.flowState);
    setStepIndex(draft.stepIndex);
    setAnswers(draft.answers);
    setTouched(draft.touched);
    setError("");
    setGenerationFailed(false);
    setGeneratedPrompt("");
    setIsGeneratedPromptStale(false);
    setCopyState("idle");
    setQuestionReturnTarget(null);
    setEditingReviewField(null);
    setEditingReviewValue("");
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
  const hasCompletedDiscovery = missingFields.length === 0;
  const hasGeneratedPrompt = generatedPrompt.trim().length > 0;
  const generatedPromptStatus = !hasGeneratedPrompt
    ? "none"
    : isGeneratedPromptStale
      ? "stale"
      : "ready";
  const progressPercent =
    flowState === "intro"
      ? 0
      : flowState === "review" || flowState === "result"
        ? 100
        : Math.round((completedCount / stepCount) * 100);
  const generationProgress = useMemo(
    () => getGenerationProgressSnapshot(generationElapsedMs),
    [generationElapsedMs],
  );

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      setGenerationElapsedMs(Date.now() - startedAt);
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isGenerating]);

  const updateAnswer = (field: DiscoveryField, value: string) => {
    const answerChanged = answers[field] !== value;

    setAnswers((current) => ({
      ...current,
      [field]: value,
    }));

    if (answerChanged && hasGeneratedPrompt) {
      setIsGeneratedPromptStale(true);
    }

    setError("");
    setGenerationFailed(false);
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
    setGenerationFailed(false);
    setQuestionReturnTarget(null);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setShowExampleOutput(false);
  };

  const returnToIntro = () => {
    setFlowState("intro");
    setError("");
    setGenerationFailed(false);
    setQuestionReturnTarget(null);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setShowExampleOutput(false);
  };

  const goNext = () => {
    markTouched(currentStep.id);

    if (currentStepMissing) {
      return;
    }

    if (questionReturnTarget) {
      returnToActiveCheckpoint(questionReturnTarget);
      return;
    }

    if (stepIndex === stepCount - 1) {
      setEditingReviewField(null);
      setEditingReviewValue("");
      setQuestionReturnTarget(null);
      setFlowState("review");
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const goBack = () => {
    if (questionReturnTarget) {
      returnToActiveCheckpoint(questionReturnTarget);
      return;
    }

    setError("");
    setGenerationFailed(false);
    setEditingReviewField(null);
    setEditingReviewValue("");

    if (flowState === "questions" && stepIndex === 0) {
      returnToIntro();
      return;
    }

    if (flowState === "review") {
      setFlowState("questions");
      setStepIndex(stepCount - 1);
      return;
    }

    setStepIndex((index) => Math.max(0, index - 1));
  };

  const openQuestionStep = (field: DiscoveryField) => {
    const index = discoverySteps.findIndex((step) => step.id === field);
    setStepIndex(Math.max(0, index));

    if (flowState === "review") {
      setQuestionReturnTarget("review");
    } else if (flowState === "result" && hasGeneratedPrompt) {
      setQuestionReturnTarget("result");
    } else {
      setQuestionReturnTarget(null);
    }

    setFlowState("questions");
    setError("");
    setGenerationFailed(false);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setShowExampleOutput(false);
  };

  const returnToActiveCheckpoint = (
    target: Exclude<QuestionReturnTarget, null>,
  ) => {
    setError("");
    setGenerationFailed(false);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setQuestionReturnTarget(null);
    setFlowState(target === "result" && hasGeneratedPrompt ? "result" : "review");
  };

  const startInlineReviewEdit = (field: DiscoveryField) => {
    if (editingReviewField && editingReviewField !== field) {
      return;
    }

    setEditingReviewField(field);
    setEditingReviewValue(answers[field]);
    setError("");
    setGenerationFailed(false);
  };

  const cancelInlineReviewEdit = () => {
    setEditingReviewField(null);
    setEditingReviewValue("");
    setError("");
  };

  const saveInlineReviewEdit = () => {
    if (!editingReviewField) {
      return;
    }

    updateAnswer(editingReviewField, editingReviewValue);
    markTouched(editingReviewField);
    setEditingReviewField(null);
    setEditingReviewValue("");
  };

  const backToReview = () => {
    setGenerationFailed(false);
    setError("");
  };

  const viewReview = () => {
    if (!hasCompletedDiscovery) {
      return;
    }

    setError("");
    setGenerationFailed(false);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setQuestionReturnTarget(null);
    setFlowState("review");
  };

  const viewGeneratedPrompt = () => {
    if (!hasGeneratedPrompt) {
      return;
    }

    setError("");
    setGenerationFailed(false);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setQuestionReturnTarget(null);
    setFlowState("result");
  };

  const restart = () => {
    clearDraft();
    setAnswers(emptyDiscoveryAnswers());
    setStepIndex(0);
    setTouched({});
    setError("");
    setGenerationFailed(false);
    setGeneratedPrompt("");
    setIsGeneratedPromptStale(false);
    setCopyState("idle");
    setQuestionReturnTarget(null);
    setEditingReviewField(null);
    setEditingReviewValue("");
    setShowExampleOutput(false);
    setFlowState("intro");
  };

  const generatePrompt = async () => {
    if (isGenerating) {
      return;
    }

    if (editingReviewField) {
      setError("Save or cancel your inline edit before generating.");
      return;
    }

    const missing = getMissingDiscoveryFields(answers);

    if (missing.length > 0) {
      setError("Complete every discovery step before generating.");
      setGenerationFailed(false);
      return;
    }

    setIsGenerating(true);
    setGenerationElapsedMs(0);
    setError("");
    setGenerationFailed(false);
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
        setGenerationFailed(true);
        return;
      }

      setGeneratedPrompt(data.prompt);
      setIsGeneratedPromptStale(false);
      setEditingReviewField(null);
      setEditingReviewValue("");
      setGenerationFailed(false);
      setQuestionReturnTarget(null);
      setFlowState("result");
    } catch {
      setError("Prompt generation failed. Check your connection and retry.");
      setGenerationFailed(true);
    } finally {
      setIsGenerating(false);
      setGenerationElapsedMs(0);
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
      canReviewAnswers={hasCompletedDiscovery}
      generatedPromptStatus={generatedPromptStatus}
      onResultSelect={viewGeneratedPrompt}
      onReviewSelect={viewReview}
      onStepSelect={openQuestionStep}
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
          returnTarget={questionReturnTarget}
          showBack={Boolean(questionReturnTarget) || flowState === "questions"}
          step={currentStep}
          stepIndex={stepIndex}
        />
      )}

      {flowState === "review" && isGenerating && (
        <GenerationLoadingPanel progress={generationProgress} />
      )}

      {flowState === "review" && !isGenerating && generationFailed && error && (
        <GenerationErrorPanel
          error={error}
          isGenerating={isGenerating}
          onBackToReview={backToReview}
          onRetry={generatePrompt}
        />
      )}

      {flowState === "review" && !isGenerating && (!generationFailed || !error) && (
        <ReviewPanel
          answers={answers}
          editingField={editingReviewField}
          editingValue={editingReviewValue}
          error={error}
          hasGeneratedPrompt={hasGeneratedPrompt}
          isPromptStale={isGeneratedPromptStale}
          missingFields={missingFields}
          onBack={goBack}
          onCancelEdit={cancelInlineReviewEdit}
          onChangeEdit={setEditingReviewValue}
          onEdit={startInlineReviewEdit}
          onGenerate={generatePrompt}
          onSaveEdit={saveInlineReviewEdit}
          onViewPrompt={viewGeneratedPrompt}
        />
      )}

      {flowState === "result" && (
        <ResultPanel
          completedAnswerCount={completedCount}
          copyState={copyState}
          isPromptStale={isGeneratedPromptStale}
          onCopy={copyPrompt}
          onRegenerate={generatePrompt}
          onReview={viewReview}
          onRestart={restart}
          prompt={generatedPrompt}
        />
      )}
    </AppShell>
  );
}
