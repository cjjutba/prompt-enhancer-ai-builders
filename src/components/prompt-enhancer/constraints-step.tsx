import { TargetIcon, cx } from "./ui";

const noneForNowLabel = "None for now";

export const constraintChips = [
  "No auth for prototype",
  "Mobile-first",
  "Admin approval required",
  "Role-based access",
  "Payment required",
  "Email confirmation",
  "Limited MVP scope",
  "Public landing page",
  "Private dashboard",
  "Accessibility",
  "No database for demo",
  noneForNowLabel,
];

export function toggleConstraintChip(answer: string, chip: string) {
  const normalizedChip = chip.trim();

  if (!normalizedChip) {
    return answer.trim();
  }

  if (isNoneForNow(normalizedChip)) {
    return isExactNoneForNow(answer) ? "" : noneForNowLabel;
  }

  const parts = splitConstraintParts(answer).filter(
    (part) => !isNoneForNow(part),
  );
  const hasChip = parts.some(
    (part) => part.toLowerCase() === normalizedChip.toLowerCase(),
  );
  const nextParts = hasChip
    ? parts.filter((part) => part.toLowerCase() !== normalizedChip.toLowerCase())
    : [...parts, normalizedChip];

  return nextParts.join(", ");
}

export function ConstraintChips({
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
          Common constraints
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Add launch rules, prototype boundaries, and access needs the builder
          should respect.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {constraintChips.map((chip) => {
          const isSelected = hasConstraintChip(answer, chip);

          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleConstraintChip(answer, chip))}
              className={cx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ConstraintFormatHint() {
  return (
    <div className="border-b border-[var(--border)] py-5">
      <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
        Useful constraint format
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {"Rule or limit -> why it matters -> how strict it is"}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        {
          "No account creation for prototype -> keeps the demo simple -> explain where login would fit later"
        }
      </p>
    </div>
  );
}

export function ConstraintWhyItMatters() {
  return (
    <div className="flex gap-4 border-b border-[var(--border)] py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {
            "Constraints help the AI builder avoid overbuilding, respect business rules, and produce a realistic first version."
          }
        </p>
      </div>
    </div>
  );
}

function hasConstraintChip(answer: string, chip: string) {
  if (isNoneForNow(chip)) {
    return isExactNoneForNow(answer);
  }

  return splitConstraintParts(answer).some(
    (part) => part.toLowerCase() === chip.trim().toLowerCase(),
  );
}

function splitConstraintParts(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isExactNoneForNow(answer: string) {
  return answer.trim().toLowerCase() === noneForNowLabel.toLowerCase();
}

function isNoneForNow(value: string) {
  return value.trim().toLowerCase() === noneForNowLabel.toLowerCase();
}
