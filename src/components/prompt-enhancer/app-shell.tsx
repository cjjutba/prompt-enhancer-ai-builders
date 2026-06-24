import type { ReactNode } from "react";
import type { DiscoveryAnswers, DiscoveryField } from "@/lib/discovery";
import { DiscoveryRail, type ShellFlowState } from "./discovery-rail";
import { LivePromptBrief } from "./live-prompt-brief";

type AppShellProps = {
  answers: DiscoveryAnswers;
  children: ReactNode;
  completedCount: number;
  currentStepIndex: number;
  flowState: ShellFlowState;
  onStepSelect: (field: DiscoveryField) => void;
  progressPercent: number;
};

export function AppShell({
  answers,
  children,
  completedCount,
  currentStepIndex,
  flowState,
  onStepSelect,
  progressPercent,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-3 py-3 text-[var(--text-primary)] sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)_336px] xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <DiscoveryRail
          answers={answers}
          completedCount={completedCount}
          currentStepIndex={currentStepIndex}
          flowState={flowState}
          onStepSelect={onStepSelect}
          progressPercent={progressPercent}
        />
        <div className="min-w-0">{children}</div>
        <LivePromptBrief answers={answers} />
      </div>
    </main>
  );
}
