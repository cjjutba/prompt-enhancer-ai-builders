"use client";

import { useMemo, useState } from "react";
import {
  discoverySteps,
  emptyDiscoveryAnswers,
  getMissingDiscoveryFields,
  type DiscoveryAnswers,
  type DiscoveryField,
} from "@/lib/discovery";

type FlowState = "intro" | "questions" | "review" | "result";

const stepCount = discoverySteps.length;
const panelClass =
  "min-h-[640px] rounded-lg border border-[#17211d]/12 bg-white shadow-[0_24px_80px_rgba(23,33,29,0.12)]";
const secondaryButtonClass =
  "h-11 rounded-md border border-[#17211d]/14 px-5 text-sm font-semibold text-[#31423a] transition hover:bg-[#eef3ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8be0bd]/35 disabled:cursor-not-allowed disabled:opacity-40";

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
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const currentStep = discoverySteps[stepIndex];
  const currentValue = answers[currentStep.id];
  const currentStepMissing = currentValue.trim().length === 0;
  const missingFields = useMemo(
    () => getMissingDiscoveryFields(answers),
    [answers],
  );
  const completedCount = stepCount - missingFields.length;
  const progressPercent =
    flowState === "review" || flowState === "result"
      ? 100
      : Math.round(((stepIndex + 1) / stepCount) * 100);

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
  };

  const restart = () => {
    setAnswers(emptyDiscoveryAnswers());
    setStepIndex(0);
    setTouched({});
    setError("");
    setGeneratedPrompt("");
    setCopyState("idle");
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
    <main className="min-h-screen bg-[#e8efe9] p-3 text-[#17211d] sm:p-5 lg:p-7">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] overflow-hidden rounded-lg border border-[#17211d]/12 bg-white shadow-[0_30px_120px_rgba(23,33,29,0.16)] sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="border-b border-[#17211d]/10 bg-[#17211d] px-6 py-8 text-white lg:border-b-0 lg:border-r lg:px-7 xl:px-8">
          <div className="flex h-full flex-col justify-between gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8be0bd]">
                Prompt Enhancer
              </p>
              <h1 className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-normal">
                Turn a loose app idea into a builder-ready prompt.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-white/72">
                A guided worksheet for people building with Lovable, Base44,
                Emergent, or similar AI app builders.
              </p>
            </div>

            <div className="rounded-lg border border-white/12 bg-white/6 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Discovery progress</span>
                <span className="font-semibold text-[#f6bf45]">
                  {completedCount}/{stepCount}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/12">
                <div
                  className="h-2 rounded-full bg-[#f45d48] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {discoverySteps.map((step, index) => {
                  const isDone = answers[step.id].trim().length > 0;
                  const isCurrent =
                    flowState === "questions" && index === stepIndex;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => editField(step.id)}
                      className={`h-10 rounded-md border text-xs font-semibold transition ${
                        isCurrent
                          ? "border-[#f6bf45] bg-[#f6bf45] text-[#17211d]"
                          : isDone
                            ? "border-[#8be0bd]/70 bg-[#8be0bd]/12 text-[#d8fff0]"
                            : "border-white/12 bg-white/5 text-white/55"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6bf45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17211d]`}
                      aria-label={`Edit ${step.label}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="min-h-full bg-[#f6f8f4] px-4 py-5 sm:px-7 sm:py-7 lg:px-10 xl:px-14">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-stretch">
            {flowState === "intro" && <IntroPanel onStart={startFlow} />}

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
          </div>
        </section>
      </div>
    </main>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className={`${panelClass} grid w-full overflow-hidden lg:grid-cols-[minmax(0,1fr)_300px]`}>
      <div className="flex flex-col justify-between gap-10 p-6 sm:p-9 lg:p-11">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#287a67]">
            8 minute worksheet
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-[#17211d] sm:text-5xl lg:text-6xl">
            Answer the product questions your AI builder needs.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#51615a]">
            Move through practical prompts, review the plan, then generate a
            complete prompt you can paste into your app builder.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#f45d48] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#d94d3d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f45d48]/25"
          >
            Start discovery
          </button>

          <div className="mt-8 grid gap-4 border-t border-[#17211d]/10 pt-6 sm:grid-cols-3">
            {[
              ["1", "Plain-language inputs"],
              ["2", "No account or storage"],
              ["3", "Copy-ready output"],
            ].map(([number, item]) => (
              <div key={item} className="min-w-0">
                <p className="font-mono text-sm font-semibold text-[#f45d48]">
                  {number}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#31423a]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#17211d]/10 bg-[#edf3ee] p-6 lg:border-l lg:border-t-0 lg:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#287a67]">
          Discovery route
        </p>
        <div className="mt-5 grid gap-3">
          {discoverySteps.slice(0, 6).map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-3 border-b border-[#17211d]/10 pb-3 last:border-b-0"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-[#287a67]">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#17211d]">
                  {step.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#65746e]">
                  {step.question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionPanel({
  answer,
  errorVisible,
  isMissing,
  onBack,
  onChange,
  onNext,
  showBack,
  step,
  stepIndex,
}: {
  answer: string;
  errorVisible: boolean;
  isMissing: boolean;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
  showBack: boolean;
  step: (typeof discoverySteps)[number];
  stepIndex: number;
}) {
  return (
    <div className={`${panelClass} flex w-full flex-col justify-between p-5 sm:p-8 lg:p-10`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#287a67]">
          Step {stepIndex + 1} of {stepCount}
        </p>
        <span className="rounded-full border border-[#17211d]/10 px-3 py-1 text-sm font-medium text-[#51615a]">
          {step.label}
        </span>
      </div>

      <label
        htmlFor={step.id}
        className="mt-6 block text-3xl font-semibold tracking-normal text-[#17211d] sm:text-4xl"
      >
        {step.question}
      </label>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#51615a]">
        {step.helper}
      </p>

      <textarea
        id={step.id}
        value={answer}
        onBlur={() => undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={step.placeholder}
        className="mt-7 min-h-48 w-full resize-y rounded-md border border-[#17211d]/16 bg-[#fbfcfa] p-4 text-base leading-7 text-[#17211d] outline-none transition placeholder:text-[#8d9994] focus:border-[#287a67] focus:ring-4 focus:ring-[#8be0bd]/30"
      />

      {errorVisible && isMissing && (
        <p className="mt-3 text-sm font-medium text-[#b43c30]">
          Add a short answer before moving on. Write none for now if this does
          not apply.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!showBack}
          className={secondaryButtonClass}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="h-11 rounded-md bg-[#17211d] px-5 text-sm font-semibold text-white transition hover:bg-[#24352e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17211d]/20"
        >
          {stepIndex === stepCount - 1 ? "Review answers" : "Next question"}
        </button>
      </div>
    </div>
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
    <div className={`${panelClass} w-full p-5 sm:p-8 lg:p-10`}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#287a67]">
        Review
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[#17211d] sm:text-4xl">
        Check the brief before generation.
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#51615a]">
        These answers become the context for the final builder prompt.
      </p>

      <div className="mt-7 grid gap-3">
        {discoverySteps.map((step) => (
          <div
            key={step.id}
            className="rounded-md border border-[#17211d]/10 bg-[#fbfcfa] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#287a67]">
                {step.label}
              </h3>
              <button
                type="button"
                onClick={() => onEdit(step.id)}
                className="text-sm font-semibold text-[#b43c30] underline-offset-4 hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-base leading-7 text-[#31423a]">
              {answers[step.id] || "Missing"}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p
          aria-live="polite"
          className="mt-5 rounded-md border border-[#f45d48]/30 bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#9c342a]"
        >
          {error}
        </p>
      )}

      {isGenerating && (
        <p
          aria-live="polite"
          className="mt-5 rounded-md border border-[#f6bf45]/40 bg-[#fff8e7] px-4 py-3 text-sm font-medium text-[#6e4a05]"
        >
          Assembling your builder prompt from the discovery notes.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className={secondaryButtonClass}
        >
          Back to questions
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!isReady || isGenerating}
          className="h-11 rounded-md bg-[#f45d48] px-5 text-sm font-semibold text-white transition hover:bg-[#d94d3d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f45d48]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate prompt"}
        </button>
      </div>
    </div>
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
  copyState: "idle" | "copied" | "failed";
  error: string;
  isGenerating: boolean;
  onCopy: () => void;
  onRestart: () => void;
  onRetry: () => void;
  prompt: string;
}) {
  return (
    <div className={`${panelClass} w-full p-5 sm:p-8 lg:p-10`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#287a67]">
            Builder-ready prompt
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[#17211d] sm:text-4xl">
            Paste this into your AI app builder.
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="h-11 rounded-md bg-[#17211d] px-4 text-sm font-semibold text-white transition hover:bg-[#24352e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17211d]/20"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={onRestart}
            className={secondaryButtonClass}
          >
            Restart
          </button>
        </div>
      </div>

      {copyState === "copied" && (
        <p
          aria-live="polite"
          className="mt-4 rounded-md border border-[#8be0bd]/40 bg-[#e8fff4] px-4 py-3 text-sm font-medium text-[#1f6d58]"
        >
          Copied to clipboard.
        </p>
      )}

      {copyState === "failed" && (
        <p
          aria-live="polite"
          className="mt-4 rounded-md border border-[#f45d48]/30 bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#9c342a]"
        >
          Copy failed. Select the prompt text and copy it manually.
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-[#f45d48]/30 bg-[#fff1ef] px-4 py-3">
          <p className="text-sm font-medium text-[#9c342a]">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={isGenerating}
            className="mt-3 h-10 rounded-md bg-[#f45d48] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f45d48]/25 disabled:opacity-50"
          >
            {isGenerating ? "Retrying..." : "Retry generation"}
          </button>
        </div>
      )}

      <textarea
        readOnly
        value={prompt}
        className="mt-6 min-h-[520px] w-full rounded-md border border-[#17211d]/12 bg-[#fbfcfa] p-4 font-mono text-sm leading-6 text-[#17211d] outline-none focus:ring-4 focus:ring-[#8be0bd]/30"
        aria-label="Generated prompt"
      />
    </div>
  );
}
