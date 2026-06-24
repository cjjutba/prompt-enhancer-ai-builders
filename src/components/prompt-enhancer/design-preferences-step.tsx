import { ListIcon, TargetIcon, cx } from "./ui";

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

type DesignPreferencesStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function DesignPreferencesStep({
  answer,
  onChange,
}: DesignPreferencesStepProps) {
  return (
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <ToneChips answer={answer} onChange={onChange} />
      <DesignDirectionHint />
      <DesignPreferenceWhyItMatters />
    </div>
  );
}

export function ToneChips({
  answer,
  onChange,
}: DesignPreferencesStepProps) {
  return (
    <section className="py-4 sm:py-5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Tone options
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Choose a few plain-language words that describe the product
          personality.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {toneOptions.map((tone) => {
          const isSelected = hasToneOption(answer, tone);

          return (
            <button
              key={tone}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleToneOption(answer, tone))}
              className={cx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-white text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {tone}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DesignDirectionHint() {
  return (
    <section className="flex gap-3 py-4 sm:py-5">
      <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
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
    </section>
  );
}

function DesignPreferenceWhyItMatters() {
  return (
    <section className="flex gap-3 py-4 sm:py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {designPreferenceWhy}
        </p>
      </div>
    </section>
  );
}

export function toggleToneOption(answer: string, tone: string) {
  const normalizedAnswer = answer.trim();
  const normalizedTone = tone.trim();

  if (!normalizedTone) {
    return normalizedAnswer;
  }

  if (hasToneOption(normalizedAnswer, normalizedTone)) {
    return getToneAnswerItems(normalizedAnswer)
      .filter((part) => part.toLowerCase() !== normalizedTone.toLowerCase())
      .join(", ");
  }

  const appendableAnswer = normalizedAnswer.replace(/[.,;:!?]+$/, "");

  return appendableAnswer
    ? `${appendableAnswer}, ${normalizedTone}`
    : normalizedTone;
}

export function hasToneOption(answer: string, tone: string) {
  const normalizedTone = tone.trim().toLowerCase();

  if (!normalizedTone) {
    return false;
  }

  return getToneAnswerItems(answer)
    .map((part) => part.toLowerCase())
    .includes(normalizedTone);
}

function getToneAnswerItems(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
