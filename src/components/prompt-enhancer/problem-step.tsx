import type { DiscoveryStep } from "@/lib/discovery";
import { ListIcon, TargetIcon, cx } from "./ui";

const answerMaxLength = 1000;
const problemTextareaHelper =
  "Plain language is enough. One or two short paragraphs works well.";
const problemWhyItMatters =
  "A clear problem statement helps the AI builder choose the right workflows, screens, and success states instead of creating a generic feature list.";

export const problemPromptChips = [
  {
    label: "Too much manual work",
    text: "The current workflow relies on too much manual work, so important tasks take longer than they should.",
  },
  {
    label: "Missed updates",
    text: "People miss updates because status changes are scattered across messages, spreadsheets, or separate tools.",
  },
  {
    label: "Hard to track requests",
    text: "Requests are hard to track, so the team cannot quickly see what is new, blocked, or already resolved.",
  },
  {
    label: "Duplicate data entry",
    text: "The same information gets entered in multiple places, which creates mistakes and slows the team down.",
  },
  {
    label: "Slow approvals",
    text: "Approvals move slowly because reviewers do not have a clear place to see context, make decisions, and follow up.",
  },
  {
    label: "No clear owner",
    text: "Work gets delayed because it is not clear who owns each request, task, or next step.",
  },
  {
    label: "Payment confusion",
    text: "Payments are confusing because people cannot easily see what is due, paid, overdue, or disputed.",
  },
  {
    label: "Poor customer visibility",
    text: "Customers have poor visibility into progress, so they ask for updates and the team spends time responding manually.",
  },
];

type ProblemStepProps = {
  answer: string;
  onChange: (value: string) => void;
  step: DiscoveryStep;
};

export function ProblemStep({ answer, onChange, step }: ProblemStepProps) {
  return (
    <div className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <section className="py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
              Current workflow problem
            </h2>
            <p
              id={`${step.id}-helper`}
              className="mt-1 text-sm leading-6 text-[var(--text-secondary)]"
            >
              {problemTextareaHelper}
            </p>
          </div>
          <p
            id={`${step.id}-count`}
            className="shrink-0 text-sm font-medium tabular-nums text-[var(--text-secondary)]"
          >
            {Math.min(answer.length, answerMaxLength)}/{answerMaxLength}
          </p>
        </div>

        <textarea
          id={step.id}
          maxLength={1000}
          value={answer}
          onChange={(event) => onChange(event.target.value)}
          placeholder={step.placeholder}
          className="mt-4 max-h-[240px] min-h-[200px] w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-base leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-ring)]"
          aria-describedby={`${step.id}-helper ${step.id}-count`}
        />
      </section>

      <ProblemPromptChips answer={answer} onChange={onChange} />

      <StepGuidance>{problemWhyItMatters}</StepGuidance>
    </div>
  );
}

export function ProblemPromptChips({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="py-5">
      <div className="flex items-start gap-3">
        <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Problem prompts
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Choose the workflow issues that match what happens today.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {problemPromptChips.map((prompt) => {
          const isSelected = hasProblemPrompt(answer, prompt.text);

          return (
            <button
              key={prompt.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleProblemPrompt(answer, prompt.text))}
              className={cx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {prompt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function StepGuidance({ children }: { children: string }) {
  return (
    <section className="flex gap-4 py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {children}
        </p>
      </div>
    </section>
  );
}

export function toggleProblemPrompt(answer: string, promptText: string) {
  const normalizedAnswer = normalizeWhitespace(answer);
  const normalizedPrompt = normalizeWhitespace(promptText);

  if (!normalizedPrompt) {
    return normalizedAnswer;
  }

  if (hasProblemPrompt(normalizedAnswer, normalizedPrompt)) {
    return normalizeWhitespace(normalizedAnswer.replace(normalizedPrompt, ""));
  }

  return normalizedAnswer
    ? `${normalizedAnswer} ${normalizedPrompt}`
    : normalizedPrompt;
}

function hasProblemPrompt(answer: string, promptText: string) {
  return normalizeWhitespace(answer).includes(normalizeWhitespace(promptText));
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
