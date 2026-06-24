import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  Button,
  CubeIcon,
  DocumentIcon,
  PencilIcon,
  RouteIcon,
  ShieldIcon,
  SparkIcon,
  TargetIcon,
  UsersIcon,
  WorkspacePanel,
} from "./ui";

type IntroScreenProps = {
  onShowExample: () => void;
  onStart: () => void;
  showExample: boolean;
};

const promptIncludes = [
  { icon: CubeIcon, label: "Product" },
  { icon: UsersIcon, label: "Audience" },
  { icon: TargetIcon, label: "Goal" },
  { icon: RouteIcon, label: "Core workflow" },
  { icon: SparkIcon, label: "MVP features" },
];

const valueRows = [
  {
    icon: PencilIcon,
    title: "Plain-language inputs",
    body: "Answer in your own words. We'll handle the structure.",
  },
  {
    icon: TargetIcon,
    title: "Guided product thinking",
    body: "Smart prompts help you cover what matters.",
  },
  {
    icon: DocumentIcon,
    title: "Copy-ready prompt",
    body: "Clean, structured, and ready to paste.",
  },
];

type IconComponent = ({ className }: { className?: string }) => ReactNode;

export function IntroScreen({
  onShowExample,
  onStart,
  showExample,
}: IntroScreenProps) {
  return (
    <WorkspacePanel className="min-h-[560px] p-5 sm:p-7 lg:min-h-screen lg:p-12">
      <div className="mx-auto flex min-h-full max-w-[740px] flex-col gap-7 lg:min-h-[calc(100vh-96px)] lg:pt-6">
        <div>
          <p className="text-base font-semibold text-[var(--accent)]">
            Guided discovery
          </p>
          <h1 className="mt-4 max-w-[720px] text-4xl font-semibold leading-[1.08] text-[var(--text-primary)] sm:text-[44px]">
            Turn a loose app idea into a builder-ready prompt.
          </h1>
          <p className="mt-4 max-w-[700px] text-base leading-7 text-[var(--text-secondary)] sm:text-[17px] sm:leading-8">
            Answer a few practical questions. We&apos;ll turn your answers into
            a clear prompt you can paste into Lovable, Base44, Emergent, or any
            AI app builder.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              className="w-full px-6 sm:w-auto"
              onClick={onStart}
              variant="primary"
            >
              Start discovery
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
            <Button
              aria-expanded={showExample}
              className="w-full px-6 sm:w-auto"
              onClick={onShowExample}
              variant="secondary"
            >
              <DocumentIcon className="h-4 w-4 text-[var(--text-muted)]" />
              See example output
            </Button>
          </div>

          {showExample && (
            <div className="mt-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <div className="flex items-start gap-3">
                <DocumentIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Example final prompt structure
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Build a focused MVP for the defined audience. Include core
                    workflows, screens, data model, integrations, UX tone,
                    constraints, and clear out-of-scope notes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Your prompt will include:
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-y-3 text-sm font-medium leading-5 text-[var(--text-primary)]">
              {promptIncludes.map((item) => (
                <PromptIncludeItem key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {valueRows.map((row) => (
              <ValueRow key={row.title} {...row} />
            ))}
          </div>

          <div className="mt-5 flex gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <ShieldIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                No technical jargon required.
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                We&apos;ll guide you step by step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WorkspacePanel>
  );
}

function PromptIncludeItem({
  icon: Icon,
  label,
}: {
  icon: IconComponent;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 border-r border-[var(--border)] pr-4 last:border-r-0 last:pr-0 sm:pr-5">
      <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      {label}
    </span>
  );
}

function ValueRow({
  body,
  icon: Icon,
  title,
}: {
  body: string;
  icon: IconComponent;
  title: string;
}) {
  return (
    <div className="flex gap-4 py-4 first:pt-4 last:pb-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--text-secondary)]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-semibold leading-6 text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}
