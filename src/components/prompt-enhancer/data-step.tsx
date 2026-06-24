import { cx, ListIcon, RouteIcon, TargetIcon } from "./ui";

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
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <DataTypeChips answer={answer} onChange={onChange} />
      <DataFormatHint />
      <DataWhyItMatters />
    </div>
  );
}

export function DataTypeChips({ answer, onChange }: DataStepProps) {
  return (
    <section className="py-5">
      <div className="flex items-start gap-3">
        <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Common data types
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Add anything the app needs to store, show, or manage.
          </p>
        </div>
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
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
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
    <section className="flex gap-3 py-5">
      <RouteIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Simple data format
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {dataFormatGuide}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {dataFormatExample}
        </p>
      </div>
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

function DataWhyItMatters() {
  return (
    <section className="flex gap-3 py-5">
      <TargetIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Why this matters
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {dataWhyItMatters}
        </p>
      </div>
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
