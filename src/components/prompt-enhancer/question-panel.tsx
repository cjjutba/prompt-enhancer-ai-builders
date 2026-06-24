import {
  AudienceStep,
  audienceTypeChips,
  toggleAudienceType,
} from "./audience-step";
import { ConstraintsStep } from "./constraints-step";
import { DataStep } from "./data-step";
import {
  DesignPreferencesStep,
  hasToneOption,
  toneOptions,
  toggleToneOption,
} from "./design-preferences-step";
import { FeaturesStep, featureChips, toggleFeatureChip } from "./features-step";
import {
  IntegrationsStep,
  integrationChips,
  toggleIntegrationChip,
} from "./integrations-step";
import {
  ProblemStep,
  problemPromptChips,
  toggleProblemPrompt,
} from "./problem-step";
import {
  ExampleChips,
  QuestionStepLayout,
  StepGuidance,
} from "./question-step-layout";
import { ScreensStep, hasScreenChip, screenChips, toggleScreenChip } from "./screens-step";
import { DocumentIcon } from "./ui";
import { discoverySteps, type DiscoveryField, type DiscoveryStep } from "../../lib/discovery";

const stepCount = discoverySteps.length;

const breadcrumbLabels: Record<DiscoveryField, string> = {
  appIdea: "Discovery / Product definition",
  targetUsers: "Discovery / Audience",
  problem: "Discovery / Problem",
  features: "Discovery / MVP scope",
  screens: "Discovery / User journey",
  data: "Discovery / Content & data",
  integrations: "Discovery / Integrations",
  uxTone: "Discovery / Design direction",
  constraints: "Discovery / Launch goals",
};

const textareaHelpers: Record<DiscoveryField, string> = {
  appIdea: "Plain language is enough. One or two short paragraphs works well.",
  targetUsers:
    "Plain language is enough. One or two short paragraphs works well.",
  problem: "Plain language is enough. One or two short paragraphs works well.",
  features:
    "Plain language is enough. Focus on the first release, not every future idea.",
  screens: "Plain language is enough. A simple ordered flow works well.",
  data: "Plain language is enough. List the objects and details the app should track.",
  integrations:
    "Plain language is enough. List the tools or services the app should connect with.",
  uxTone:
    "Plain language is enough. Describe the feeling, audience, and what to avoid.",
  constraints:
    "Plain language is enough. Include any must-follow rules, limits, or success goals.",
};

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
];

export {
  audienceTypeChips,
  featureChips,
  hasScreenChip,
  hasToneOption,
  integrationChips,
  problemPromptChips,
  screenChips,
  toggleAudienceType,
  toggleFeatureChip,
  toggleIntegrationChip,
  toggleProblemPrompt,
  toggleScreenChip,
  toggleToneOption,
  toneOptions,
};

export function getAppIdeaExampleAnswer(answer: string, template: string) {
  return answer.trim() === template.trim() ? "" : template;
}

type QuestionPanelProps = {
  answer: string;
  errorVisible: boolean;
  isMissing: boolean;
  onBack: () => void;
  onChange: (value: string) => void;
  onNext: () => void;
  returnTarget?: "review" | "result" | null;
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
  returnTarget = null,
  showBack,
  step,
  stepIndex,
}: QuestionPanelProps) {
  const isProblemStep = step.id === "problem";
  const primaryActionLabel =
    returnTarget === "result"
      ? "Save and view prompt"
      : returnTarget === "review"
        ? "Save and return to review"
        : undefined;
  const secondaryActionLabel =
    returnTarget === "result"
      ? "Back to prompt"
      : returnTarget === "review"
        ? "Back to review"
        : undefined;

  return (
    <QuestionStepLayout
      answer={answer}
      breadcrumbLabel={breadcrumbLabels[step.id]}
      errorVisible={errorVisible}
      footer={step.id === "appIdea" ? <AppIdeaFooter /> : undefined}
      isMissing={isMissing}
      onBack={onBack}
      onChange={onChange}
      onNext={onNext}
      primaryActionLabel={primaryActionLabel}
      renderTextarea={!isProblemStep}
      secondaryActionLabel={secondaryActionLabel}
      showBack={showBack}
      showPrimaryActionIcon={!returnTarget}
      step={step}
      stepCount={stepCount}
      stepIndex={stepIndex}
      textareaHelper={textareaHelpers[step.id]}
      textareaMinHeightClassName={getTextareaMinHeightClassName(step.id)}
    >
      <StepBody answer={answer} onChange={onChange} step={step} />
    </QuestionStepLayout>
  );
}

function StepBody({
  answer,
  onChange,
  step,
}: {
  answer: string;
  onChange: (value: string) => void;
  step: DiscoveryStep;
}) {
  switch (step.id) {
    case "appIdea":
      return <AppIdeaGuidance answer={answer} onChange={onChange} />;
    case "targetUsers":
      return <AudienceStep answer={answer} onChange={onChange} />;
    case "problem":
      return <ProblemStep answer={answer} onChange={onChange} step={step} />;
    case "features":
      return <FeaturesStep answer={answer} onChange={onChange} />;
    case "screens":
      return <ScreensStep answer={answer} onChange={onChange} />;
    case "data":
      return <DataStep answer={answer} onChange={onChange} />;
    case "integrations":
      return <IntegrationsStep answer={answer} onChange={onChange} />;
    case "uxTone":
      return <DesignPreferencesStep answer={answer} onChange={onChange} />;
    case "constraints":
      return <ConstraintsStep answer={answer} onChange={onChange} />;
  }
}

function AppIdeaGuidance({
  answer,
  onChange,
}: {
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="shrink-0 text-sm font-medium leading-8 text-[var(--text-secondary)]">
          Examples
        </span>
        <ExampleChips
          items={appIdeaExamples.map((example) => ({
            isSelected: answer === example.template,
            label: example.label,
            onSelect: () =>
              onChange(getAppIdeaExampleAnswer(answer, example.template)),
          }))}
        />
      </div>

      <StepGuidance>
        A clear product idea gives the AI builder enough context to plan
        screens, flows, and data.
      </StepGuidance>
    </>
  );
}

function AppIdeaFooter() {
  return (
    <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]">
      <DocumentIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      <p>
        This first answer will appear in the live brief as the product
        foundation.
      </p>
    </div>
  );
}

function getTextareaMinHeightClassName(field: DiscoveryField) {
  if (field === "uxTone") {
    return "min-h-[160px] max-h-[220px]";
  }

  if (
    field === "features" ||
    field === "screens" ||
    field === "data" ||
    field === "integrations"
  ) {
    return "min-h-[180px]";
  }

  return "min-h-[210px]";
}
