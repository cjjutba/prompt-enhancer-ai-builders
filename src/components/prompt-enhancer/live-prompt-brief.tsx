import type { ReactNode } from "react";
import type { DiscoveryAnswers } from "@/lib/discovery";
import { CubeIcon, ListIcon, TargetIcon, TipBlock, UsersIcon, cx } from "./ui";

type LivePromptBriefProps = {
  answers: DiscoveryAnswers;
};

const briefRows: Array<{
  key: keyof DiscoveryAnswers;
  label: string;
  icon: "product" | "audience" | "goal" | "features";
}> = [
  { key: "appIdea", label: "Product", icon: "product" },
  { key: "targetUsers", label: "Audience", icon: "audience" },
  { key: "problem", label: "Goal", icon: "goal" },
  { key: "features", label: "MVP features", icon: "features" },
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
  icon: "product" | "audience" | "goal" | "features";
  label: string;
  value: string;
}) {
  const Icon = briefIconMap[icon];
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex min-w-0 items-start gap-4 py-5">
      <Icon
        className={cx(
          "mt-0.5 h-5 w-5 shrink-0",
          hasValue ? "text-[var(--accent)]" : "text-[var(--text-muted)]",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {label}
        </p>
        {hasValue ? (
          <p className="mt-1 max-h-20 overflow-hidden break-words text-sm leading-6 text-[var(--text-secondary)]">
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

function GoalIcon({ className }: { className?: string }) {
  return <TargetIcon className={className} />;
}

function FeaturesIcon({ className }: { className?: string }) {
  return <ListIcon className={className} />;
}

const briefIconMap: Record<
  "product" | "audience" | "goal" | "features",
  ({ className }: { className?: string }) => ReactNode
> = {
  product: ProductIcon,
  audience: AudienceIcon,
  goal: GoalIcon,
  features: FeaturesIcon,
};
