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
    <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)] lg:bg-[var(--surface)]">
      <div className="grid min-h-screen w-full gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[320px_minmax(0,1fr)_360px] lg:gap-0 lg:p-0">
        <DiscoveryRail
          answers={answers}
          completedCount={completedCount}
          currentStepIndex={currentStepIndex}
          flowState={flowState}
          onStepSelect={onStepSelect}
          progressPercent={progressPercent}
        />
        <div className="min-w-0 lg:min-h-screen lg:bg-[var(--surface)]">
          {children}
        </div>
        <LivePromptBrief answers={answers} />
      </div>
    </main>
  );
}
