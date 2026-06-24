import { ExampleChips, StepGuidance } from "./question-step-layout";
import { ListIcon, RouteIcon } from "./ui";

const noneForPrototypeLabel = "None for prototype";
const integrationFormatGuide =
  "Tool or service → what it does → when it is used";
const integrationFormatExample =
  "Stripe → collects payments → when a customer books a class";
const integrationsWhyText =
  "Integration details help the AI builder plan API boundaries, payment flows, notifications, and realistic prototype scope.";

export const integrationChips = [
  "Payments",
  "Email",
  "Calendar",
  "AI model",
  "File storage",
  "Maps",
  "SMS",
  "Analytics",
  "CRM",
  "Webhooks",
  "Zapier",
  noneForPrototypeLabel,
];

type IntegrationsStepProps = {
  answer: string;
  onChange: (value: string) => void;
};

export function IntegrationsStep({ answer, onChange }: IntegrationsStepProps) {
  return (
    <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
      <IntegrationChips answer={answer} onChange={onChange} />
      <IntegrationFormatHint />
      <IntegrationWhyItMatters />
    </div>
  );
}

export function IntegrationChips({ answer, onChange }: IntegrationsStepProps) {
  return (
    <section className="py-5">
      <div className="flex items-start gap-3">
        <ListIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Common integrations
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Add any outside system the prototype should mention.
          </p>
        </div>
      </div>
      <ExampleChips
        className="mt-4"
        items={integrationChips.map((chip) => {
          const isSelected = hasIntegrationChip(answer, chip);

          return {
            isSelected,
            label: chip,
            onSelect: () => onChange(toggleIntegrationChip(answer, chip)),
          };
        })}
      />
    </section>
  );
}

export function IntegrationFormatHint() {
  return (
    <section className="flex gap-3 py-5">
      <RouteIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
          Simple integration format
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {integrationFormatGuide}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {integrationFormatExample}
        </p>
      </div>
    </section>
  );
}

export function toggleIntegrationChip(answer: string, chip: string) {
  const normalizedChip = chip.trim();

  if (!normalizedChip) {
    return answer.trim();
  }

  if (isNoneForPrototype(normalizedChip)) {
    return isExactNoneForPrototype(answer) ? "" : noneForPrototypeLabel;
  }

  const parts = splitIntegrationParts(answer).filter(
    (part) => !isNoneForPrototype(part),
  );
  const hasChip = parts.some(
    (part) => part.toLowerCase() === normalizedChip.toLowerCase(),
  );

  if (hasChip) {
    return parts
      .filter((part) => part.toLowerCase() !== normalizedChip.toLowerCase())
      .join(", ");
  }

  const appendableAnswer = parts.join(", ").replace(/[.,;:!?]+$/, "");

  return appendableAnswer
    ? `${appendableAnswer}, ${normalizedChip}`
    : normalizedChip;
}

function IntegrationWhyItMatters() {
  return (
    <StepGuidance className="py-5">{integrationsWhyText}</StepGuidance>
  );
}

function hasIntegrationChip(answer: string, chip: string) {
  if (isNoneForPrototype(chip)) {
    return isExactNoneForPrototype(answer);
  }

  return splitIntegrationParts(answer).some(
    (part) => part.toLowerCase() === chip.trim().toLowerCase(),
  );
}

function splitIntegrationParts(answer: string) {
  return answer
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isExactNoneForPrototype(answer: string) {
  return answer.trim().toLowerCase() === noneForPrototypeLabel.toLowerCase();
}

function isNoneForPrototype(value: string) {
  return value.trim().toLowerCase() === noneForPrototypeLabel.toLowerCase();
}
