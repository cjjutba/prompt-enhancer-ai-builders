import { Button, CheckIcon, ListIcon, ReassuranceRow, WorkspacePanel } from "./ui";

type IntroScreenProps = {
  onShowExample: () => void;
  onStart: () => void;
  showExample: boolean;
};

const promptIncludes = [
  "Product",
  "Audience",
  "Goal",
  "Core workflow",
  "MVP features",
];

const valueRows = [
  {
    title: "Plain-language inputs",
    body: "Describe the app in your own words. The tool shapes the details into a structured builder prompt.",
  },
  {
    title: "Guided product thinking",
    body: "Each step asks for the decisions an AI app builder needs before it can produce a coherent first version.",
  },
  {
    title: "Copy-ready prompt",
    body: "The final output is organized for Lovable, Base44, Emergent, and similar tools.",
  },
];

export function IntroScreen({
  onShowExample,
  onStart,
  showExample,
}: IntroScreenProps) {
  return (
    <WorkspacePanel className="min-h-[560px] p-5 sm:p-7 lg:min-h-[calc(100vh-40px)] lg:p-10">
      <div className="flex min-h-full flex-col justify-between gap-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Guided discovery
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Turn a loose app idea into a builder-ready prompt.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
            Answer a few practical questions. We&apos;ll turn your answers into
            a clear prompt you can paste into Lovable, Base44, Emergent, or any
            AI app builder.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              onClick={onStart}
              variant="primary"
            >
              Start discovery
            </Button>
            <Button
              aria-expanded={showExample}
              className="w-full sm:w-auto"
              onClick={onShowExample}
              variant="secondary"
            >
              {showExample ? "Hide example output" : "See example output"}
            </Button>
          </div>

          {showExample && (
            <div className="mt-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <div className="flex items-start gap-3">
                <ListIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
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

        <div className="border-t border-[var(--border)] pt-7">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Your prompt will include:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {promptIncludes.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 divide-y divide-[var(--border)]">
            {valueRows.map((row) => (
              <ValueRow key={row.title} body={row.body} title={row.title} />
            ))}
          </div>

          <div className="mt-7 grid gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:grid-cols-2">
            <ReassuranceRow icon="spark">
              No technical jargon required.
            </ReassuranceRow>
            <ReassuranceRow>
              We&apos;ll guide you step by step.
            </ReassuranceRow>
          </div>
        </div>
      </div>
    </WorkspacePanel>
  );
}

function ValueRow({ body, title }: { body: string; title: string }) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--success)]" />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}
