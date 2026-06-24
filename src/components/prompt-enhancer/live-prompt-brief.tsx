import type { ReactNode } from "react";
import type { DiscoveryAnswers } from "@/lib/discovery";
import { cx, ListIcon, SparkIcon, TipBlock } from "./ui";

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
    <aside className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:min-h-[calc(100vh-40px)] lg:p-5">
      <div>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Live prompt brief
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
          Your brief will build here as you answer.
        </p>
      </div>

      <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {briefRows.map((row) => (
          <BriefRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            value={answers[row.key]}
          />
        ))}
      </div>

      <div className="mt-5">
        <TipBlock title="Tips for a stronger brief">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>Start with the outcome, not the tech.</li>
            <li>Keep your first version focused.</li>
            <li>Mention what success looks like.</li>
          </ul>
        </TipBlock>
      </div>

      <div className="mt-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Builder targets
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
          Lovable <span aria-hidden="true">&bull;</span> Base44{" "}
          <span aria-hidden="true">&bull;</span> Emergent
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Your final prompt will be easy to copy and paste.
        </p>
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
    <div className="flex min-w-0 items-start gap-3 py-4">
      <Icon
        className={cx(
          "mt-0.5 h-4 w-4 shrink-0",
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
          <div className="mt-2 space-y-2" aria-hidden="true">
            <SkeletonLine width="w-11/12" />
            <SkeletonLine width="w-8/12" />
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
        "block h-2 rounded-full bg-[var(--surface-subtle)]",
        width,
      )}
    />
  );
}

function ProductIcon({ className }: { className?: string }) {
  return <ListIcon className={className} />;
}

function AudienceIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function GoalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function FeaturesIcon({ className }: { className?: string }) {
  return <SparkIcon className={className} />;
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
