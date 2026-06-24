import type { ReactNode } from "react";
import type { DiscoveryStep } from "@/lib/discovery";
import { ArrowRightIcon, Button, cx, TargetIcon, WorkspacePanel } from "./ui";

export const answerMaxLength = 1000;

export type QuestionStepLayoutProps = {
  answer: string;
  answerControl?: ReactNode;
  breadcrumbLabel: string;
  children?: ReactNode;
  errorVisible: boolean;
  footer?: ReactNode;
  isCompact?: boolean;
  isMissing: boolean;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
  primaryActionLabel?: string;
  renderTextarea?: boolean;
  secondaryActionLabel?: string;
  showBack: boolean;
  showPrimaryActionIcon?: boolean;
  step: DiscoveryStep;
  stepCount: number;
  stepIndex: number;
  textareaHelper: string;
  textareaMinHeightClassName?: string;
};

export function QuestionStepLayout({
  answer,
  answerControl,
  breadcrumbLabel,
  children,
  errorVisible,
  footer,
  isCompact = false,
  isMissing,
  onBack,
  onChange,
  onNext,
  primaryActionLabel,
  renderTextarea = true,
  secondaryActionLabel = "Back",
  showBack,
  showPrimaryActionIcon = true,
  step,
  stepCount,
  stepIndex,
  textareaHelper,
  textareaMinHeightClassName = "min-h-[196px]",
}: QuestionStepLayoutProps) {
  const primaryLabel =
    primaryActionLabel ??
    (stepIndex === stepCount - 1 ? "Review answers" : "Continue");
  const answerInput =
    answerControl ??
    (renderTextarea ? (
      <AnswerTextarea
        answer={answer}
        helperText={textareaHelper}
        id={step.id}
        minHeightClassName={textareaMinHeightClassName}
        onChange={onChange}
        placeholder={step.placeholder}
      />
    ) : null);

  return (
    <WorkspacePanel
      className={cx(
        "min-h-[560px] p-5 sm:p-7 lg:min-h-screen",
        isCompact ? "lg:px-12 lg:py-7" : "lg:p-12",
      )}
    >
      <div
        className={cx(
          "mx-auto flex min-h-full max-w-[740px] flex-col",
          isCompact
            ? "lg:min-h-[calc(100vh-56px)]"
            : "lg:min-h-[calc(100vh-96px)] lg:pt-5",
        )}
      >
        <QuestionStepHeader
          breadcrumbLabel={breadcrumbLabel}
          step={step}
          stepCount={stepCount}
          stepIndex={stepIndex}
        />

        <label
          htmlFor={step.id}
          className="mt-7 block max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]"
        >
          {step.question}
        </label>
        <p className="mt-4 max-w-[680px] text-base leading-7 text-[var(--text-secondary)]">
          {step.helper}
        </p>

        {answerInput}

        {children}

        {errorVisible && isMissing && (
          <p
            aria-live="polite"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            Add a short answer before moving on. Write none for now if this
            does not apply.
          </p>
        )}

        <div
          className={cx(
            "flex flex-col-reverse gap-3 border-t border-[var(--border)] sm:flex-row sm:items-center sm:justify-between",
            isCompact ? "mt-5 pt-4" : "mt-6 pt-5",
          )}
        >
          <Button
            className={cx("w-full sm:w-auto", !showBack && "opacity-45")}
            disabled={!showBack}
            onClick={onBack}
            variant="secondary"
          >
            {secondaryActionLabel}
          </Button>
          <Button
            className="w-full px-6 sm:w-auto"
            onClick={onNext}
            variant="primary"
          >
            {primaryLabel}
            {showPrimaryActionIcon && stepIndex < stepCount - 1 && (
              <ArrowRightIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {footer}
      </div>
    </WorkspacePanel>
  );
}

function QuestionStepHeader({
  breadcrumbLabel,
  step,
  stepCount,
  stepIndex,
}: {
  breadcrumbLabel: string;
  step: DiscoveryStep;
  stepCount: number;
  stepIndex: number;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {breadcrumbLabel}
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Step {stepIndex + 1} of {stepCount}
        </p>
      </div>
      <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]">
        {step.label}
      </span>
    </div>
  );
}

export function AnswerTextarea({
  answer,
  helperText,
  id,
  minHeightClassName,
  onChange,
  placeholder,
}: {
  answer: string;
  helperText: string;
  id: string;
  minHeightClassName: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mt-6">
      <textarea
        id={id}
        maxLength={answerMaxLength}
        value={answer}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cx(
          "w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-base leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-ring)]",
          minHeightClassName,
        )}
        aria-describedby={`${id}-helper ${id}-count`}
      />
      <div className="mt-2 flex flex-col gap-2 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-helper`}>{helperText}</p>
        <p
          id={`${id}-count`}
          className="font-medium tabular-nums text-[var(--text-secondary)]"
        >
          {Math.min(answer.length, answerMaxLength)}/{answerMaxLength}
        </p>
      </div>
    </div>
  );
}

export function ExampleChips({
  className,
  items,
}: {
  className?: string;
  items: Array<{
    isSelected: boolean;
    label: string;
    onSelect: () => void;
  }>;
}) {
  return (
    <div className={cx("flex flex-wrap gap-2.5", className)}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-pressed={item.isSelected}
          onClick={item.onSelect}
          className={cx(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
            item.isSelected
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function StepGuidance({
  children,
  className,
  title = "Why this matters",
}: {
  children: string;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cx(
        "flex gap-4",
        className || "mt-6 border-y border-[var(--border)] py-5",
      )}
    >
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {children}
        </p>
      </div>
    </section>
  );
}
