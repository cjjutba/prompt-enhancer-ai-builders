import { ExampleChips, StepGuidance } from "./question-step-layout";
import { UsersIcon } from "./ui";

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

const audienceWhyItMatters =
  "Clear user groups help the AI builder design the right screens, permissions, and workflows for each person using the app.";

type AudienceStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function AudienceStep({ answer, onChange }: AudienceStepProps) {
  return (
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <section className="py-4 sm:py-5">
        <div className="flex items-start gap-3">
          <UsersIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
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
        <ExampleChips
          className="mt-4"
          items={audienceTypeChips.map((audienceType) => {
            const isSelected = hasAudienceType(answer, audienceType);

            return {
              isSelected,
              label: audienceType,
              onSelect: () =>
                onChange(toggleAudienceType(answer, audienceType)),
            };
          })}
        />
      </section>

      <StepGuidance className="py-4 sm:py-5" title="Why this matters">
        {audienceWhyItMatters}
      </StepGuidance>
    </div>
  );
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

  const appendableAnswer = normalizedAnswer.replace(/[.,;:!?]+$/, "");

  return appendableAnswer
    ? `${appendableAnswer}, ${normalizedType}`
    : normalizedType;
}

export function hasAudienceType(answer: string, audienceType: string) {
  const normalizedType = audienceType.trim().toLowerCase();

  if (!normalizedType) {
    return false;
  }

  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim().toLowerCase())
    .includes(normalizedType);
}
