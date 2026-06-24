import { cx } from "./ui";

export const dataTypeChips = [
  "Users",
  "Profiles",
  "Bookings",
  "Payments",
  "Messages",
  "Files",
  "Products",
  "Orders",
  "Requests",
  "Notifications",
  "Settings",
  "Activity logs",
];

const dataFormatGuide =
  "Thing to manage → important details → who can view or edit it";
const dataFormatExample =
  "Booking → date, time, customer, status, payment status → customer and admin";
const dataWhyItMatters =
  "Clear data requirements help the AI builder create better forms, dashboards, permissions, and empty states.";

type DataStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function DataStep({ answer, onChange }: DataStepProps) {
  return (
    <div className="mt-5 border-y border-[var(--border)]">
      <DataTypeChips answer={answer} onChange={onChange} />
      <div className="grid gap-5 border-t border-[var(--border)] py-5 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-7">
        <DataFormatHint />
        <DataWhyItMatters />
      </div>
    </div>
  );
}

export function DataTypeChips({ answer, onChange }: DataStepProps) {
  return (
    <section className="py-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Common data types
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Add anything the app needs to store, show, or manage.
          </p>
        </div>
        <p className="shrink-0 text-sm font-medium leading-6 text-[var(--text-muted)]">
          Select to add
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {dataTypeChips.map((dataType) => {
          const isSelected = hasDataTypeChip(answer, dataType);

          return (
            <button
              key={dataType}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(toggleDataTypeChip(answer, dataType))}
              className={cx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-ring)]",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
              )}
            >
              {dataType}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DataFormatHint() {
  return (
    <section className="min-w-0">
      <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
        Simple data format
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {dataFormatGuide}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-primary)]">
        {dataFormatExample}
      </p>
    </section>
  );
}

export function toggleDataTypeChip(answer: string, dataType: string) {
  const normalizedAnswer = answer.trim();
  const normalizedType = dataType.trim();

  if (!normalizedType) {
    return normalizedAnswer;
  }

  if (hasDataTypeChip(normalizedAnswer, normalizedType)) {
    return getDataAnswerItems(normalizedAnswer)
      .filter((item) => item.toLowerCase() !== normalizedType.toLowerCase())
      .join(", ");
  }

  return normalizedAnswer
    ? `${normalizedAnswer}, ${normalizedType}`
    : normalizedType;
}

export function DataWhyItMatters() {
  return (
    <section className="min-w-0 border-t border-[var(--border)] pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
      <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
        Why this matters
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {dataWhyItMatters}
      </p>
    </section>
  );
}

function hasDataTypeChip(answer: string, dataType: string) {
  const normalizedType = dataType.trim().toLowerCase();

  if (!normalizedType) {
    return false;
  }

  return getDataAnswerItems(answer)
    .map((item) => item.toLowerCase())
    .includes(normalizedType);
}

function getDataAnswerItems(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
