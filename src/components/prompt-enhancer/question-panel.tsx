import {
  ArrowRightIcon,
  Button,
  cx,
  DocumentIcon,
  TargetIcon,
  WorkspacePanel,
} from "./ui";
import { discoverySteps, type DiscoveryStep } from "../../lib/discovery";

const stepCount = discoverySteps.length;
const answerMaxLength = 1000;

export const appIdeaExamples = [
  {
    label: "Appointment booking",
    template:
      "A booking app for independent yoga teachers who run small studio classes. It helps students find available sessions, reserve a spot, and gives teachers a simple way to manage capacity, payments, and cancellations.",
  },
  {
    label: "Customer portal",
    template:
      "A customer portal for a boutique home services company. It helps clients view project status, approve estimates, schedule visits, upload notes, and message the team without relying on scattered emails.",
  },
  {
    label: "Inventory tracker",
    template:
      "An inventory tracker for a small retail team. It helps staff monitor stock levels, record supplier orders, receive new items, and get low-stock alerts before important products run out.",
  },
  {
    label: "Event management",
    template:
      "An event management app for community organizers. It helps them publish events, manage RSVPs, coordinate volunteers, send attendee updates, and understand which events need follow-up.",
  },
  {
    label: "Internal dashboard",
    template:
      "An internal dashboard for an operations team. It helps managers review daily tasks, surface bottlenecks, assign owners, and track progress across multiple locations in one focused workspace.",
  },
];

export const audienceTypeChips = [
  "Customers",
  "Admins",
  "Staff",
  "Managers",
  "Students",
  "Parents",
  "Tutors",
  "Business owners",
];

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

export const featureChips = [
  "Sign up / login",
  "Dashboard",
  "Booking or scheduling",
  "Payments",
  "Messaging",
  "Notifications",
  "Admin panel",
  "Search / filters",
  "File upload",
  "Analytics",
];

export const toneOptions = [
  "Calm",
  "Trustworthy",
  "Fast",
  "Premium",
  "Friendly",
  "Minimal",
  "Mobile-first",
  "Professional",
  "Playful",
  "Accessible",
  "Data-heavy",
  "Simple",
];

const designPreferenceDetails = [
  "Who should the design feel built for",
  "Whether it should feel simple, premium, playful, or operational",
  "Any styles to avoid, such as too corporate, too playful, too dark, or too busy",
];

const designPreferenceWhy =
  "Design direction helps the AI builder choose layout, tone, density, and visual style that match the users instead of generating a generic interface.";

export function getAppIdeaExampleAnswer(answer: string, template: string) {
  return answer.trim() === template.trim() ? "" : template;
}

export function toggleAudienceType(answer: string, audienceType: string) {
  const normalizedAnswer = answer.trim();
  const normalizedType = audienceType.trim();

  if (!normalizedType) {
    return normalizedAnswer;
  }

  if (hasAudienceType(normalizedAnswer, normalizedType)) {
    return normalizedAnswer
      .split(/[,;\n]/)
      .map((part) => part.trim())
      .filter((part) => part.toLowerCase() !== normalizedType.toLowerCase())
      .join(", ");
  }

  return normalizedAnswer
    ? `${normalizedAnswer}, ${normalizedType}`
    : normalizedType;
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

export function toggleFeatureChip(answer: string, feature: string) {
  const normalizedAnswer = answer.trim();
  const normalizedFeature = feature.trim();

  if (!normalizedFeature) {
    return normalizedAnswer;
  }

  if (hasFeatureChip(normalizedAnswer, normalizedFeature)) {
    return normalizedAnswer
      .split(/[,;\n]/)
      .map((part) => part.trim())
      .filter((part) => part.toLowerCase() !== normalizedFeature.toLowerCase())
      .join(", ");
  }

  return normalizedAnswer
    ? `${normalizedAnswer}, ${normalizedFeature}`
    : normalizedFeature;
}

export function toggleToneOption(answer: string, tone: string) {
  const normalizedAnswer = answer.trim();
  const normalizedTone = tone.trim();

  if (!normalizedTone) {
    return normalizedAnswer;
  }

  if (hasToneOption(normalizedAnswer, normalizedTone)) {
    return normalizedAnswer
      .split(/[,;\n]/)
      .map((part) => part.trim())
      .filter((part) => part.toLowerCase() !== normalizedTone.toLowerCase())
      .join(", ");
  }

  const appendableAnswer = normalizedAnswer.replace(/[.,;:!?]+$/, "");

  return appendableAnswer
    ? `${appendableAnswer}, ${normalizedTone}`
    : normalizedTone;
}

type QuestionPanelProps = {
  answer: string;
  errorVisible: boolean;
  isMissing: boolean;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
  showBack: boolean;
  step: DiscoveryStep;
  stepIndex: number;
};

export function QuestionPanel({
  answer,
  errorVisible,
  isMissing,
  onBack,
  onChange,
  onNext,
  showBack,
  step,
  stepIndex,
}: QuestionPanelProps) {
  const isAppIdeaStep = step.id === "appIdea";
  const isAudienceStep = step.id === "targetUsers";
  const isProblemStep = step.id === "problem";
  const isFeaturesStep = step.id === "features";
  const isDesignPreferencesStep = step.id === "uxTone";
  const breadcrumbLabel = isAppIdeaStep
    ? "Discovery / Product definition"
    : isAudienceStep
      ? "Discovery / Audience"
      : isProblemStep
        ? "Discovery / Problem"
        : isFeaturesStep
          ? "Discovery / MVP scope"
          : isDesignPreferencesStep
            ? "Discovery / Design direction"
            : "Discovery / Builder brief";
  const textareaHelper = isFeaturesStep
    ? "Plain language is enough. Focus on the first release, not every future idea."
    : isDesignPreferencesStep
      ? "Plain language is enough. Describe the feeling, audience, and what to avoid."
    : "Plain language is enough. One or two short paragraphs works well.";
  const primaryLabel =
    stepIndex === stepCount - 1 ? "Review answers" : "Continue";

  return (
    <WorkspacePanel
      className={cx(
        "min-h-[560px] p-5 sm:p-7 lg:min-h-screen",
        isDesignPreferencesStep ? "lg:px-12 lg:py-7" : "lg:p-12",
      )}
    >
      <div
        className={cx(
          "mx-auto flex min-h-full max-w-[740px] flex-col",
          isDesignPreferencesStep
            ? "lg:min-h-[calc(100vh-56px)]"
            : "lg:min-h-[calc(100vh-96px)] lg:pt-5",
        )}
      >
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

        <label
          htmlFor={step.id}
          className="mt-7 block max-w-[680px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)]"
        >
          {step.question}
        </label>
        <p className="mt-4 max-w-[680px] text-base leading-7 text-[var(--text-secondary)]">
          {step.helper}
        </p>

        <div className="mt-6">
          <textarea
            id={step.id}
            maxLength={1000}
            value={answer}
            onChange={(event) => onChange(event.target.value)}
            placeholder={step.placeholder}
            className={cx(
              "w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-base leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent-ring)]",
              isDesignPreferencesStep ? "min-h-[160px]" : "min-h-[210px]",
            )}
            aria-describedby={`${step.id}-helper ${step.id}-count`}
          />
          <div className="mt-2 flex flex-col gap-2 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p id={`${step.id}-helper`}>{textareaHelper}</p>
            <p
              id={`${step.id}-count`}
              className="font-medium tabular-nums text-[var(--text-secondary)]"
            >
              {Math.min(answer.length, answerMaxLength)}/{answerMaxLength}
            </p>
          </div>
        </div>

        {isAppIdeaStep && (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Examples
              </span>
              {appIdeaExamples.map((example) => {
                const isSelected = answer === example.template;

                return (
                  <button
                    key={example.label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onChange(getAppIdeaExampleAnswer(answer, example.template))}
                    className={cx(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {example.label}
                  </button>
                );
              })}
            </div>

            <StepGuidance>
              A clear product idea gives the AI builder enough context to plan
              screens, flows, and data.
            </StepGuidance>
          </>
        )}

        {isAudienceStep && (
          <>
            <div className="mt-5 border-y border-[var(--border)] py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
                    Common audience types
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    Add the people who need a different screen, permission, or
                    workflow.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {audienceTypeChips.map((audienceType) => {
                  const isSelected = hasAudienceType(answer, audienceType);

                  return (
                    <button
                      key={audienceType}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onChange(toggleAudienceType(answer, audienceType))}
                      className={cx(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                        isSelected
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {audienceType}
                    </button>
                  );
                })}
              </div>
            </div>

            <StepGuidance>
              Clear user groups help the AI builder design the right screens,
              permissions, and workflows for each person using the app.
            </StepGuidance>
          </>
        )}

        {isProblemStep && (
          <>
            <ProblemPromptChips answer={answer} onChange={onChange} />

            <StepGuidance>
              A clear problem statement helps the AI builder choose the right
              workflows, screens, and success states instead of creating a
              generic feature list.
            </StepGuidance>
          </>
        )}

        {isFeaturesStep && (
          <>
            <FeatureChips answer={answer} onChange={onChange} />

            <StepGuidance>
              A focused first release helps the AI builder create a usable MVP
              instead of spreading the app across too many unfinished features.
            </StepGuidance>
          </>
        )}

        {isDesignPreferencesStep && (
          <DesignPreferencesStep answer={answer} onChange={onChange} />
        )}

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
            isDesignPreferencesStep ? "mt-5 pt-4" : "mt-6 pt-5",
          )}
        >
          <Button
            className={cx("w-full sm:w-auto", !showBack && "opacity-45")}
            disabled={!showBack}
            onClick={onBack}
            variant="secondary"
          >
            Back
          </Button>
          <Button className="w-full px-6 sm:w-auto" onClick={onNext} variant="primary">
            {primaryLabel}
            {stepIndex < stepCount - 1 && <ArrowRightIcon className="h-5 w-5" />}
          </Button>
        </div>

        {isAppIdeaStep && (
          <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]">
            <DocumentIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
            <p>
              This first answer will appear in the live brief as the product
              foundation.
            </p>
          </div>
        )}
      </div>
    </WorkspacePanel>
  );
}

function DesignPreferencesStep({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <ToneChips answer={answer} onChange={onChange} />

      <DesignDirectionHint />
    </>
  );
}

function ToneChips({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 border-y border-[var(--border)] py-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Tone options
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Choose a few words that describe the product personality.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {toneOptions.map((tone) => {
          const isSelected = hasToneOption(answer, tone);

          return (
            <button
              key={tone}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleToneOption(answer, tone))}
              className={cx(
                "rounded-lg border px-3 py-1 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {tone}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DesignDirectionHint() {
  return (
    <div className="border-b border-[var(--border)] py-4">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-7">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Useful details to include
          </h2>
          <div className="mt-3 divide-y divide-[var(--border)] text-sm leading-6 text-[var(--text-secondary)]">
            {designPreferenceDetails.map((detail) => (
              <p key={detail} className="py-2 first:pt-0 last:pb-0">
                {detail}
              </p>
            ))}
          </div>
        </div>
        <div className="min-w-0 border-t border-[var(--border)] pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
          <div className="flex gap-3">
            <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
                Why this matters
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {designPreferenceWhy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureChips({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 border-y border-[var(--border)] py-5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Common MVP features
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Start with 4 to 6 must-have features.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {featureChips.map((feature) => {
          const isSelected = hasFeatureChip(answer, feature);

          return (
            <button
              key={feature}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleFeatureChip(answer, feature))}
              className={cx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {feature}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProblemPromptChips({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 border-y border-[var(--border)] py-5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Problem prompts
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Add the messy workflow issues that describe what happens today.
        </p>
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
    </div>
  );
}

function StepGuidance({ children }: { children: string }) {
  return (
    <div className="mt-6 flex gap-4 border-y border-[var(--border)] py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {children}
        </p>
      </div>
    </div>
  );
}

function hasProblemPrompt(answer: string, promptText: string) {
  return normalizeWhitespace(answer).includes(normalizeWhitespace(promptText));
}

function hasFeatureChip(answer: string, feature: string) {
  const normalizedFeature = feature.trim().toLowerCase();

  if (!normalizedFeature) {
    return false;
  }

  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase())
    .includes(normalizedFeature);
}

export function hasToneOption(answer: string, tone: string) {
  const normalizedTone = tone.trim().toLowerCase();

  if (!normalizedTone) {
    return false;
  }

  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase())
    .includes(normalizedTone);
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasAudienceType(answer: string, audienceType: string) {
  const normalizedType = audienceType.trim().toLowerCase();

  if (!normalizedType) {
    return false;
  }

  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase())
    .includes(normalizedType);
}
