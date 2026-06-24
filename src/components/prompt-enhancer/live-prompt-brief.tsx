import type { ReactNode } from "react";
import type { DiscoveryAnswers } from "@/lib/discovery";
import {
  CubeIcon,
  DocumentIcon,
  ListIcon,
  RouteIcon,
  ShieldIcon,
  SparkIcon,
  TargetIcon,
  TipBlock,
  UsersIcon,
  cx,
} from "./ui";

type LivePromptBriefProps = {
  answers: DiscoveryAnswers;
};

const briefRows: Array<{
  key: keyof DiscoveryAnswers;
  label: string;
  icon:
    | "product"
    | "audience"
    | "problem"
    | "features"
    | "screens"
    | "data"
    | "integrations"
    | "tone"
    | "constraints";
}> = [
  { key: "appIdea", label: "Product", icon: "product" },
  { key: "targetUsers", label: "Audience", icon: "audience" },
  { key: "problem", label: "Problem", icon: "problem" },
  { key: "features", label: "MVP features", icon: "features" },
  { key: "screens", label: "Screens", icon: "screens" },
  { key: "data", label: "Data", icon: "data" },
  { key: "integrations", label: "Integrations", icon: "integrations" },
  { key: "uxTone", label: "UX tone", icon: "tone" },
  { key: "constraints", label: "Constraints", icon: "constraints" },
];

export function LivePromptBrief({ answers }: LivePromptBriefProps) {
  return (
    <aside className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:rounded-none lg:border-y-0 lg:border-l lg:border-r-0 lg:p-7 lg:shadow-none">
      <div>
        <p className="text-lg font-semibold leading-7 text-[var(--text-primary)]">
          Live prompt brief
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          Your brief will build here as you answer.
        </p>
      </div>

      <div className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {briefRows.map((row) => (
          <BriefRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            value={answers[row.key]}
          />
        ))}
      </div>

      <div className="border-b border-[var(--border)] py-5">
        <TipBlock title="Tips for a stronger brief">
          <ul className="space-y-2">
            <li>Start with the outcome, not the tech.</li>
            <li>Keep your first version focused.</li>
            <li>Mention what success looks like.</li>
          </ul>
        </TipBlock>
      </div>

      <div className="flex items-start gap-3 py-5">
        <TargetIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
            Builder targets: Lovable <span aria-hidden="true">&bull;</span>{" "}
            Base44 <span aria-hidden="true">&bull;</span> Emergent
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Your final prompt will be easy to copy and paste.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function BriefRow({
  icon,
  label,
  value,
}: {
  icon:
    | "product"
    | "audience"
    | "problem"
    | "features"
    | "screens"
    | "data"
    | "integrations"
    | "tone"
    | "constraints";
  label: string;
  value: string;
}) {
  const Icon = briefIconMap[icon];
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex min-w-0 items-start gap-3 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {label}
        </p>
        {hasValue ? (
          <p
            className="mt-1 overflow-hidden break-words text-sm leading-6 text-[var(--text-secondary)]"
            style={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              display: "-webkit-box",
            }}
            title={value}
          >
            {value}
          </p>
        ) : (
          <div className="mt-3 space-y-2.5" aria-hidden="true">
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-7/12" />
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <span
      className={cx(
        "block h-1.5 rounded-full bg-[var(--border)]",
        width,
      )}
    />
  );
}

function ProductIcon({ className }: { className?: string }) {
  return <CubeIcon className={className} />;
}

function AudienceIcon({ className }: { className?: string }) {
  return <UsersIcon className={className} />;
}

function ProblemIcon({ className }: { className?: string }) {
  return <TargetIcon className={className} />;
}

function FeaturesIcon({ className }: { className?: string }) {
  return <ListIcon className={className} />;
}

function ScreensIcon({ className }: { className?: string }) {
  return <DocumentIcon className={className} />;
}

function DataIcon({ className }: { className?: string }) {
  return <ListIcon className={className} />;
}

function IntegrationsIcon({ className }: { className?: string }) {
  return <RouteIcon className={className} />;
}

function ToneIcon({ className }: { className?: string }) {
  return <SparkIcon className={className} />;
}

function ConstraintsIcon({ className }: { className?: string }) {
  return <ShieldIcon className={className} />;
}

const briefIconMap: Record<
  | "product"
  | "audience"
  | "problem"
  | "features"
  | "screens"
  | "data"
  | "integrations"
  | "tone"
  | "constraints",
  ({ className }: { className?: string }) => ReactNode
> = {
  product: ProductIcon,
  audience: AudienceIcon,
  problem: ProblemIcon,
  features: FeaturesIcon,
  screens: ScreensIcon,
  data: DataIcon,
  integrations: IntegrationsIcon,
  tone: ToneIcon,
  constraints: ConstraintsIcon,
};
