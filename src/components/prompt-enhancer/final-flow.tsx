import type { DiscoveryAnswers, DiscoveryField } from "@/lib/discovery";
import {
  Button,
  CheckIcon,
  ClockIcon,
  WarningIcon,
  WorkspacePanel,
  cx,
} from "./ui";

type CopyState = "idle" | "copied" | "failed";

const answerMaxLength = 1000;

export const reviewAnswerRows: Array<{
  key: DiscoveryField;
  label: string;
}> = [
  { key: "appIdea", label: "App idea" },
  { key: "targetUsers", label: "Target users" },
  { key: "problem", label: "Problem" },
  { key: "features", label: "Features" },
  { key: "screens", label: "Screens" },
  { key: "data", label: "Data" },
  { key: "integrations", label: "Integrations" },
  { key: "uxTone", label: "UX tone" },
  { key: "constraints", label: "Constraints" },
];

const generationChecklist = [
  {
    label: "Reading discovery answers",
    detail:
      "Including each completed discovery answer before drafting begins.",
    durationMs: 900,
  },
  {
    label: "Organizing product scope",
    detail:
      "Turning the idea, users, problem, and must-have features into a clear product brief.",
    durationMs: 1300,
  },
  {
    label: "Structuring screens and workflows",
    detail:
      "Mapping the first-version screens, navigation, and core user journeys.",
    durationMs: 1600,
  },
  {
    label: "Adding data and integrations",
    detail:
      "Folding in records, content, services, launch rules, and constraints.",
    durationMs: 1300,
  },
  {
    label: "Preparing copy-ready output",
    detail:
      "Formatting the final sections so the prompt can be pasted directly into a builder.",
    durationMs: 1200,
  },
  {
    label: "Awaiting model response",
    detail:
      "Waiting for the AI response before switching to the generated prompt.",
    durationMs: 1500,
  },
] as const;

export const generationProgressStages = generationChecklist;

const generationDiscoveryMilestones = reviewAnswerRows.map((row, index) => ({
  ...row,
  stepNumber: index + 1,
}));

type GenerationStageState = "done" | "active" | "pending";

export type GenerationProgressSnapshot = {
  activeStageLabel: string;
  elapsedSeconds: number;
  includedDiscoveryCount: number;
  progressPercent: number;
  stages: Array<{
    detail: string;
    label: string;
    state: GenerationStageState;
  }>;
};

const totalGenerationDuration = generationProgressStages.reduce(
  (total, stage) => total + stage.durationMs,
  0,
);
const discoveryContextReadDuration = 1800;
const initialGenerationProgress = 8;
const maxGenerationProgress = 94;

export function getGenerationProgressSnapshot(
  elapsedMs: number,
): GenerationProgressSnapshot {
  const safeElapsedMs = Number.isFinite(elapsedMs)
    ? Math.max(0, elapsedMs)
    : 0;

  let activeStageIndex = generationProgressStages.length - 1;
  let elapsedBeforeStage = 0;

  for (let index = 0; index < generationProgressStages.length; index += 1) {
    const stageEndsAt =
      elapsedBeforeStage + generationProgressStages[index].durationMs;

    if (safeElapsedMs < stageEndsAt) {
      activeStageIndex = index;
      break;
    }

    elapsedBeforeStage = stageEndsAt;
  }

  const cappedElapsedMs = Math.min(safeElapsedMs, totalGenerationDuration);
  const progressPercent = Math.min(
    maxGenerationProgress,
    Math.round(
      initialGenerationProgress +
        (cappedElapsedMs / totalGenerationDuration) *
          (maxGenerationProgress - initialGenerationProgress),
    ),
  );
  const includedDiscoveryCount = Math.min(
    generationDiscoveryMilestones.length,
    Math.max(
      1,
      Math.ceil(
        (Math.min(safeElapsedMs, discoveryContextReadDuration) /
          discoveryContextReadDuration) *
          generationDiscoveryMilestones.length,
      ),
    ),
  );

  return {
    activeStageLabel: generationProgressStages[activeStageIndex].label,
    elapsedSeconds: Math.floor(safeElapsedMs / 1000),
    includedDiscoveryCount,
    progressPercent,
    stages: generationProgressStages.map((stage, index) => ({
      detail: stage.detail,
      label: stage.label,
      state:
        index < activeStageIndex
          ? "done"
          : index === activeStageIndex
            ? "active"
            : "pending",
    })),
  };
}

export function getReviewAnswerPreview(answer: string, maxLength = 150) {
  const normalized = answer.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return "Missing";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
}

export function ReviewPanel({
  answers,
  editingField,
  editingValue,
  error,
  hasGeneratedPrompt = false,
  isPromptStale = false,
  missingFields,
  onBack,
  onCancelEdit,
  onChangeEdit,
  onEdit,
  onGenerate,
  onSaveEdit,
  onViewPrompt,
}: {
  answers: DiscoveryAnswers;
  editingField: DiscoveryField | null;
  editingValue: string;
  error: string;
  hasGeneratedPrompt?: boolean;
  isPromptStale?: boolean;
  missingFields: DiscoveryField[];
  onBack: () => void;
  onCancelEdit: () => void;
  onChangeEdit: (value: string) => void;
  onEdit: (field: DiscoveryField) => void;
  onGenerate: () => void;
  onSaveEdit: () => void;
  onViewPrompt?: () => void;
}) {
  const isReady = missingFields.length === 0 && !editingField;
  const generateLabel = hasGeneratedPrompt ? "Regenerate prompt" : "Generate prompt";

  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-screen lg:px-5 lg:py-12">
      <div className="mx-auto flex min-h-full max-w-[740px] flex-col lg:min-h-[calc(100vh-96px)] lg:pt-5">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Discovery / Review
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Review
        </p>
        <h1 className="mt-7 max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]">
          Check the brief before generation.
        </h1>
        <p className="mt-4 max-w-[680px] text-base leading-7 text-[var(--text-secondary)]">
          These answers become the context for the final builder prompt.
        </p>

        <div className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {reviewAnswerRows.map((row) => (
            <ReviewAnswerRow
              key={row.key}
              answer={answers[row.key]}
              editingField={editingField}
              editingValue={editingValue}
              field={row.key}
              label={row.label}
              onCancelEdit={onCancelEdit}
              onChangeEdit={onChangeEdit}
              onEdit={onEdit}
              onSaveEdit={onSaveEdit}
            />
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

        {hasGeneratedPrompt && (
          <div className="mt-5 flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {isPromptStale
                  ? "Previous prompt ready"
                  : "Generated prompt ready"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {isPromptStale
                  ? "View the previous prompt or regenerate from the updated brief."
                  : "You can view the current prompt without generating again."}
              </p>
            </div>
            <Button
              className="shrink-0"
              disabled={!onViewPrompt}
              onClick={onViewPrompt}
              variant="secondary"
            >
              View current prompt
            </Button>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={onBack} variant="secondary">
            Back to questions
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {hasGeneratedPrompt && (
              <Button onClick={onViewPrompt} variant="secondary">
                View current prompt
              </Button>
            )}
            <Button disabled={!isReady} onClick={onGenerate} variant="primary">
              {generateLabel}
            </Button>
          </div>
        </div>
      </div>
    </WorkspacePanel>
  );
}

export function ReviewAnswerRow({
  answer,
  editingField,
  editingValue,
  field,
  label,
  onCancelEdit,
  onChangeEdit,
  onEdit,
  onSaveEdit,
}: {
  answer: string;
  editingField: DiscoveryField | null;
  editingValue: string;
  field: DiscoveryField;
  label: string;
  onCancelEdit: () => void;
  onChangeEdit: (value: string) => void;
  onEdit: (field: DiscoveryField) => void;
  onSaveEdit: () => void;
}) {
  const isEditing = editingField === field;
  const hasOtherActiveEdit = Boolean(editingField && !isEditing);
  const preview = getReviewAnswerPreview(answer);
  const isMissing = preview === "Missing";

  return (
    <section
      className={cx(
        "py-4 transition",
        isEditing &&
          "-mx-3 rounded-lg bg-[var(--surface-subtle)] px-3 ring-1 ring-[var(--border)]",
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            {label}
          </h2>
          <p
            className={cx(
              "mt-1 break-words text-sm leading-6",
              isMissing
                ? "text-[var(--text-muted)]"
                : "text-[var(--text-secondary)]",
            )}
          >
            {preview}
          </p>
        </div>
        <button
          type="button"
          disabled={hasOtherActiveEdit}
          title={
            hasOtherActiveEdit
              ? "Save or cancel before editing another row."
              : undefined
          }
          onClick={() => onEdit(field)}
          className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)] disabled:cursor-not-allowed disabled:text-[var(--text-muted)] disabled:hover:bg-transparent"
        >
          Edit
        </button>
      </div>

      {isEditing && (
        <InlineReviewEditor
          field={field}
          label={label}
          onCancel={onCancelEdit}
          onChange={onChangeEdit}
          onSave={onSaveEdit}
          value={editingValue}
        />
      )}
    </section>
  );
}

export function InlineReviewEditor({
  field,
  label,
  onCancel,
  onChange,
  onSave,
  value,
}: {
  field: DiscoveryField;
  label: string;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  value: string;
}) {
  const editorId = `review-edit-${field}`;

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <label
        htmlFor={editorId}
        className="sr-only"
      >
        Edit {label}
      </label>
      <textarea
        id={editorId}
        maxLength={1000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[156px] w-full resize-y rounded-lg border border-[var(--border-strong)] bg-white p-4 text-base leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-ring)]"
        aria-describedby={`${editorId}-count`}
      />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id={`${editorId}-count`}
          className="text-sm font-medium tabular-nums text-[var(--text-secondary)]"
        >
          {Math.min(value.length, answerMaxLength)}/{answerMaxLength}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button className="min-h-9 px-3" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button className="min-h-9 px-3" onClick={onSave} variant="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GenerationLoadingPanel({
  progress = getGenerationProgressSnapshot(0),
}: {
  progress?: GenerationProgressSnapshot;
}) {
  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-screen lg:px-5 lg:py-12">
      <div className="mx-auto flex min-h-[560px] max-w-[740px] flex-col justify-center lg:min-h-[calc(100vh-96px)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Generating
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
              {progress.activeStageLabel}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="text-3xl font-semibold tabular-nums text-[var(--text-primary)]">
              {progress.progressPercent}%
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {progress.elapsedSeconds}s elapsed
            </p>
          </div>
        </div>

        <h1 className="mt-7 max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]">
          Assembling your builder-ready prompt.
        </h1>
        <p className="mt-4 max-w-[680px] text-base leading-7 text-[var(--text-secondary)]">
          We are turning all nine discovery steps into a structured prompt with
          product scope, user journeys, screens, data, integrations,
          constraints, and a complete AI response.
        </p>

        <div className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              AI prompt progress
            </p>
            <p className="text-sm font-medium tabular-nums text-[var(--text-secondary)]">
              {progress.progressPercent}/100
            </p>
          </div>
          <div
            aria-label="AI prompt generation progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress.progressPercent}
            aria-valuetext={`${progress.progressPercent}% complete. ${progress.activeStageLabel}.`}
            className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border)]"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>

        <section className="mt-7 border-y border-[var(--border)] py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                9-step discovery context
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                Included in prompt context
              </p>
            </div>
            <p className="text-sm font-semibold tabular-nums text-[var(--text-secondary)]">
              {progress.includedDiscoveryCount}/
              {generationDiscoveryMilestones.length} answers
            </p>
          </div>

          <ol className="mt-4 grid gap-2 sm:grid-cols-3">
            {generationDiscoveryMilestones.map((milestone, index) => {
              const isIncluded = index < progress.includedDiscoveryCount;
              const isCurrent =
                index === progress.includedDiscoveryCount - 1 &&
                progress.includedDiscoveryCount <
                  generationDiscoveryMilestones.length;

              return (
                <li
                  key={milestone.key}
                  className={cx(
                    "flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                    isIncluded
                      ? "border-green-200 bg-green-50 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
                    isCurrent && "ring-2 ring-[var(--accent-ring)]",
                  )}
                >
                  <span
                    className={cx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                      isIncluded
                        ? "border-[var(--success)] bg-[var(--success)] text-white"
                        : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]",
                    )}
                  >
                    {isIncluded ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      milestone.stepNumber
                    )}
                  </span>
                  <span className="min-w-0 truncate font-medium">
                    {milestone.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <div
          aria-live="polite"
          className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]"
        >
          {progress.stages.map((stage) => (
            <div
              key={stage.label}
              aria-current={stage.state === "active" ? "step" : undefined}
              className={cx(
                "flex items-start gap-3 py-4 text-sm leading-6 transition",
                stage.state === "active"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]",
              )}
            >
              {stage.state === "done" && (
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--success)]" />
              )}
              {stage.state === "active" && (
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <span className="absolute h-5 w-5 rounded-full bg-[var(--accent)] opacity-20 motion-safe:animate-ping motion-reduce:animate-none" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                </span>
              )}
              {stage.state === "pending" && (
                <ClockIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]"
                />
              )}
              <span className="min-w-0">
                <span className="block font-semibold">{stage.label}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-[var(--text-secondary)]">
                  {stage.detail}
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          Generating prompt: {progress.activeStageLabel},{" "}
          {progress.progressPercent}% complete.
        </p>
      </div>
    </WorkspacePanel>
  );
}

export function GenerationErrorPanel({
  error,
  isGenerating,
  onBackToReview,
  onRetry,
}: {
  error: string;
  isGenerating: boolean;
  onBackToReview: () => void;
  onRetry: () => void;
}) {
  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-screen lg:px-5 lg:py-12">
      <div className="mx-auto flex min-h-[560px] max-w-[740px] flex-col justify-center lg:min-h-[calc(100vh-96px)]">
        <div className="flex items-start gap-3">
          <WarningIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--warning)]" />
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--warning)]">
              Generation paused
            </p>
            <h1 className="mt-5 max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]">
              Generation could not complete.
            </h1>
            <p className="mt-4 max-w-[680px] text-base leading-7 text-[var(--text-secondary)]">
              {error}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={onBackToReview} variant="secondary">
            Back to review
          </Button>
          <Button disabled={isGenerating} onClick={onRetry} variant="primary">
            {isGenerating ? "Retrying..." : "Retry generation"}
          </Button>
        </div>
      </div>
    </WorkspacePanel>
  );
}

export function ResultPanel({
  completedAnswerCount,
  copyState,
  isPromptStale = false,
  onCopy,
  onRegenerate,
  onReview,
  onRestart,
  prompt,
}: {
  completedAnswerCount: number;
  copyState: CopyState;
  isPromptStale?: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onReview: () => void;
  onRestart: () => void;
  prompt: string;
}) {
  return (
    <WorkspacePanel className="p-5 sm:p-7 lg:min-h-screen lg:px-5 lg:py-12">
      <div className="mx-auto max-w-[740px] lg:pt-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Builder-ready prompt
            </p>
            <h1 className="mt-5 max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]">
              Paste this into your AI app builder.
            </h1>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={onReview} variant="secondary">
              Review answers
            </Button>
            <Button
              className="sm:min-w-24"
              disabled={!prompt}
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

        {isPromptStale && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900">
                  Generated before latest edits
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  This prompt is still available, but it may not include your
                  most recent answer changes.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button onClick={onReview} variant="secondary">
                  Review answers
                </Button>
                <Button onClick={onRegenerate} variant="primary">
                  Regenerate from updated brief
                </Button>
              </div>
            </div>
          </div>
        )}

        {copyState === "copied" && (
          <p
            aria-live="polite"
            className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
          >
            Copied to clipboard.
          </p>
        )}

        {copyState === "failed" && (
          <p
            aria-live="polite"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            Copy failed. Select the prompt text and copy it manually.
          </p>
        )}

        <section className="mt-7 border-y border-[var(--border)] py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
                Builder-ready prompt
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Generated from {completedAnswerCount} discovery answers
              </p>
            </div>
          </div>

          <PromptOutputViewer prompt={prompt} />
        </section>

        <p className="mt-5 text-sm leading-6 text-[var(--text-secondary)]">
          Review the prompt, then paste it into Lovable, Base44, Emergent, or
          your preferred AI app builder.
        </p>
      </div>
    </WorkspacePanel>
  );
}

export function PromptOutputViewer({ prompt }: { prompt: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)]">
      <pre
        aria-label="Generated prompt"
        tabIndex={0}
        className="max-h-[min(60vh,640px)] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-inset focus:ring-[var(--accent-ring)]"
      >
        {prompt}
      </pre>
    </div>
  );
}
