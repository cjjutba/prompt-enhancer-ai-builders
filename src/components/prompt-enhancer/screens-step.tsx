import { ExampleChips, StepGuidance } from "./question-step-layout";
import { ListIcon, RouteIcon } from "./ui";

export const screenChips = [
  "Landing page",
  "Dashboard",
  "List view",
  "Detail page",
  "Create form",
  "Checkout",
  "Settings",
  "Admin panel",
  "Profile",
  "Notifications",
];

const flowFormatExample =
  "Start → choose item → view details → submit request → receive confirmation";
const screensWhyItMatters =
  "Screen flow helps the AI builder understand navigation, page hierarchy, and what each user needs to do next.";

type ScreensStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function ScreensStep({ answer, onChange }: ScreensStepProps) {
  return (
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <ScreenChips answer={answer} onChange={onChange} />
      <ScreenFormatHint />
      <StepGuidance className="py-5" title="Why this matters">
        {screensWhyItMatters}
      </StepGuidance>
    </div>
  );
}

export function ScreenChips({ answer, onChange }: ScreensStepProps) {
  return (
    <section className="py-5">
      <div className="flex items-start gap-3">
        <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Common screens
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Add the pages or views people need to complete the main workflow.
          </p>
        </div>
      </div>
      <ExampleChips
        className="mt-4"
        items={screenChips.map((screen) => {
          const isSelected = hasScreenChip(answer, screen);

          return {
            isSelected,
            label: screen,
            onSelect: () => onChange(toggleScreenChip(answer, screen)),
          };
        })}
      />
    </section>
  );
}

export function ScreenFormatHint() {
  return (
    <section className="flex gap-3 py-5">
      <RouteIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Simple flow format
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {flowFormatExample}
        </p>
      </div>
    </section>
  );
}

export function toggleScreenChip(answer: string, screen: string) {
  const normalizedAnswer = answer.trim();
  const normalizedScreen = screen.trim();

  if (!normalizedScreen) {
    return normalizedAnswer;
  }

  if (hasScreenChip(normalizedAnswer, normalizedScreen)) {
    return getScreenAnswerItems(normalizedAnswer)
      .filter((item) => item.toLowerCase() !== normalizedScreen.toLowerCase())
      .join(", ");
  }

  return normalizedAnswer
    ? `${normalizedAnswer}, ${normalizedScreen}`
    : normalizedScreen;
}

export function hasScreenChip(answer: string, screen: string) {
  const normalizedScreen = screen.trim().toLowerCase();

  if (!normalizedScreen) {
    return false;
  }

  return getScreenAnswerItems(answer)
    .map((item) => item.toLowerCase())
    .includes(normalizedScreen);
}

function getScreenAnswerItems(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
