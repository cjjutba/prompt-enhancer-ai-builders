import {
  discoverySteps,
  type DiscoveryAnswers,
  type DiscoveryField,
} from "@/lib/discovery";
import {
  CheckIcon,
  cx,
  MenuIcon,
  PromptEnhancerMark,
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
  currentStepIndex,
  flowState,
  onStepSelect,
  progressPercent,
}: DiscoveryRailProps) {
  const isIntro = flowState === "intro";
  const displayStep = isIntro ? 0 : Math.min(currentStepIndex + 1, discoverySteps.length);
  const displayProgress = isIntro ? 0 : progressPercent;

  return (
    <aside className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:p-7 lg:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <PromptEnhancerMark className="h-8 w-8 shrink-0 text-[var(--accent)]" />
          <div className="min-w-0">
            <p className="text-base font-semibold leading-6 text-[var(--text-primary)]">
              Prompt Enhancer
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

      <div className="mt-7 border-t border-[var(--border)] pt-6 lg:mt-8 lg:border-t-0 lg:pt-0">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Discovery flow
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Step {displayStep} of {discoverySteps.length}
          </p>
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

      <div className="mt-6 border-t border-[var(--border)] pt-5 lg:mt-6">
        <ReassuranceRow icon="clock">
          Most people finish in 6 to 8 minutes
        </ReassuranceRow>
      </div>
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
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <>
      <div className="mt-4 hidden items-center gap-4 lg:flex">
        <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]">
          <div
            className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm text-[var(--text-secondary)]">
          {clampedProgress}%
        </span>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-[var(--border)] lg:hidden">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${clampedProgress}%` }}
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
    <ol className="mt-6 hidden space-y-1.5 lg:block">
      {discoverySteps.map((step, index) => {
        const isDone = flowState !== "intro" && answers[step.id].trim().length > 0;
        const isCurrent = flowState === "questions" && index === currentStepIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepSelect(step.id)}
              className={cx(
                "group flex w-full items-center gap-3.5 rounded-lg border border-transparent px-0 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isCurrent &&
                  "text-[var(--text-primary)]",
                isDone &&
                  !isCurrent &&
                  "text-[var(--text-primary)]",
                !isCurrent &&
                  !isDone &&
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
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
                    "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)]",
                )}
              >
                {isDone && !isCurrent ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-5">
                {railStepLabels[step.id]}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
