import { cx, ListIcon, TargetIcon } from "./ui";

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

const featuresWhyItMatters =
  "A focused first release helps the AI builder create a usable MVP instead of spreading the app across too many unfinished features.";

type FeaturesStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function FeaturesStep({ answer, onChange }: FeaturesStepProps) {
  return (
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <FeatureChips answer={answer} onChange={onChange} />
      <StepGuidance />
    </div>
  );
}

export function FeatureChips({ answer, onChange }: FeaturesStepProps) {
  return (
    <section className="py-5">
      <div className="flex items-start gap-3">
        <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Common MVP features
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Choose only the capabilities the first version needs to be useful.
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[var(--text-muted)]">
            Start with 4 to 6 must-have features.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
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
                  ? "border-[var(--accent)] bg-white text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {feature}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function StepGuidance() {
  return (
    <section className="flex gap-3 py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {featuresWhyItMatters}
        </p>
      </div>
    </section>
  );
}

export function toggleFeatureChip(answer: string, feature: string) {
  const normalizedAnswer = answer.trim();
  const normalizedFeature = feature.trim();

  if (!normalizedFeature) {
    return normalizedAnswer;
  }

  if (hasFeatureChip(normalizedAnswer, normalizedFeature)) {
    return getFeatureAnswerItems(normalizedAnswer)
      .filter((item) => item.toLowerCase() !== normalizedFeature.toLowerCase())
      .join(", ");
  }

  return normalizedAnswer
    ? `${normalizedAnswer}, ${normalizedFeature}`
    : normalizedFeature;
}

function hasFeatureChip(answer: string, feature: string) {
  const normalizedFeature = feature.trim().toLowerCase();

  if (!normalizedFeature) {
    return false;
  }

  return getFeatureAnswerItems(answer)
    .map((part) => part.toLowerCase())
    .includes(normalizedFeature);
}

function getFeatureAnswerItems(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
