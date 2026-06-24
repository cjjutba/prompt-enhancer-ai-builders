import {
  discoverySteps,
  type DiscoveryAnswers,
  type DiscoveryField,
} from "@/lib/discovery";
import {
  CheckIcon,
  cx,
  MenuIcon,
  ReassuranceRow,
} from "./ui";

export type ShellFlowState = "intro" | "questions" | "review" | "result";

const railStepLabels: Record<DiscoveryField, string> = {
  appIdea: "Your idea",
  targetUsers: "Target users",
  problem: "Core problem",
  features: "Key features",
  screens: "User journey",
  data: "Content & data",
  integrations: "Integrations",
  uxTone: "Design preferences",
  constraints: "Launch goals",
};

type DiscoveryRailProps = {
  answers: DiscoveryAnswers;
  completedCount: number;
  currentStepIndex: number;
  flowState: ShellFlowState;
  onStepSelect: (field: DiscoveryField) => void;
  progressPercent: number;
};

export function DiscoveryRail({
  answers,
  completedCount,
  currentStepIndex,
  flowState,
  onStepSelect,
  progressPercent,
}: DiscoveryRailProps) {
  const isIntro = flowState === "intro";
  const displayStep = isIntro ? 0 : Math.min(currentStepIndex + 1, discoverySteps.length);
  const displayCompletedCount = isIntro ? 0 : completedCount;
  const displayProgress = isIntro ? 0 : progressPercent;

  return (
    <aside className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:min-h-[calc(100vh-40px)] lg:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-strong)] text-sm font-bold text-[var(--text-primary)]">
            PE
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Prompt Enhancer
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Builder-ready prompt workspace
            </p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] lg:hidden"
        >
          <MenuIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Discovery flow
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Step {displayStep} of {discoverySteps.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Progress</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {displayProgress}%
            </p>
          </div>
        </div>

        <ProgressIndicator
          answers={answers}
          currentStepIndex={currentStepIndex}
          flowState={flowState}
          onStepSelect={onStepSelect}
          progressPercent={displayProgress}
        />

        <StepList
          answers={answers}
          currentStepIndex={currentStepIndex}
          flowState={flowState}
          onStepSelect={onStepSelect}
        />
      </div>

      <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-5 lg:mt-6">
        <ReassuranceRow>
          Most people finish in 6 to 8 minutes.
        </ReassuranceRow>
        <ReassuranceRow icon="help">
          View guidance and examples.
        </ReassuranceRow>
      </div>

      <p className="mt-5 text-xs leading-5 text-[var(--text-muted)]">
        {displayCompletedCount}/{discoverySteps.length} answers captured
      </p>
    </aside>
  );
}

export function ProgressIndicator({
  answers,
  currentStepIndex,
  flowState,
  onStepSelect,
  progressPercent,
}: {
  answers: DiscoveryAnswers;
  currentStepIndex: number;
  flowState: ShellFlowState;
  onStepSelect: (field: DiscoveryField) => void;
  progressPercent: number;
}) {
  return (
    <>
      <div className="mt-4 hidden h-2 rounded-full bg-[var(--surface-subtle)] lg:block">
        <div
          className="h-2 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-1 lg:hidden">
        {discoverySteps.map((step, index) => {
          const isCurrent = flowState === "questions" && index === currentStepIndex;
          const isDone = flowState !== "intro" && answers[step.id].trim().length > 0;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(step.id)}
              className={cx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isCurrent &&
                  "border-[var(--accent)] bg-[var(--accent)] text-white",
                isDone &&
                  !isCurrent &&
                  "border-[var(--success)] bg-[var(--success)] text-white",
                !isCurrent &&
                  !isDone &&
                  "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]",
              )}
              aria-label={`Go to ${railStepLabels[step.id]}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function StepList({
  answers,
  currentStepIndex,
  flowState,
  onStepSelect,
}: {
  answers: DiscoveryAnswers;
  currentStepIndex: number;
  flowState: ShellFlowState;
  onStepSelect: (field: DiscoveryField) => void;
}) {
  return (
    <ol className="mt-5 hidden space-y-1.5 lg:block">
      {discoverySteps.map((step, index) => {
        const isDone = flowState !== "intro" && answers[step.id].trim().length > 0;
        const isCurrent = flowState === "questions" && index === currentStepIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepSelect(step.id)}
              className={cx(
                "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isCurrent &&
                  "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-primary)]",
                isDone &&
                  !isCurrent &&
                  "border-transparent bg-white text-[var(--text-primary)] hover:border-[var(--border)]",
                !isCurrent &&
                  !isDone &&
                  "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-subtle)]",
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={cx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  isCurrent &&
                    "border-[var(--accent)] bg-[var(--accent)] text-white",
                  isDone &&
                    !isCurrent &&
                    "border-[var(--success)] bg-[var(--success)] text-white",
                  !isCurrent &&
                    !isDone &&
                    "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]",
                )}
              >
                {isDone && !isCurrent ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {railStepLabels[step.id]}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
