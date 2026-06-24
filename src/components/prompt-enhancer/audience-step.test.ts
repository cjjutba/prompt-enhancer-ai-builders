import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceFor = (fileName: string) => {
  const filePath = join(import.meta.dirname, fileName);
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

describe("AudienceStep", () => {
  it("is a dedicated guided Step 2 module with enterprise row structure", async () => {
    const source = sourceFor("audience-step.tsx");
    const audienceStepModule = (await import("./audience-step")) as {
      audienceTypeChips?: string[];
      toggleAudienceType?: (answer: string, audienceType: string) => string;
    };

    expect(source).toContain("export function AudienceStep");
    expect(source).toContain("Common audience types");
    expect(source).toContain("Why this matters");
    expect(source).toContain(
      "Clear user groups help the AI builder design the right screens, permissions, and workflows for each person using the app.",
    );
    expect(source).toContain("const isSelected = hasAudienceType");
    expect(sourceFor("question-step-layout.tsx")).toContain(
      "aria-pressed={item.isSelected}",
    );
    expect(source).toContain("divide-y divide-[var(--border)]");
    expect(source).toContain("py-4 sm:py-5");
    expect(audienceStepModule.audienceTypeChips).toEqual([
      "Customers",
      "Admins",
      "Staff",
      "Managers",
      "Students",
      "Parents",
      "Tutors",
      "Business owners",
    ]);
    expect(audienceStepModule.toggleAudienceType?.("", "Customers")).toBe(
      "Customers",
    );
    expect(
      audienceStepModule.toggleAudienceType?.("Teachers", "Students"),
    ).toBe("Teachers, Students");
    expect(
      audienceStepModule.toggleAudienceType?.(
        "Teachers, Students",
        "Students",
      ),
    ).toBe("Teachers");
    expect(
      audienceStepModule.toggleAudienceType?.(
        "Teachers who manage classes and students who reserve sessions.",
        "Admins",
      ),
    ).toBe(
      "Teachers who manage classes and students who reserve sessions, Admins",
    );
  });

  it("uses shared question layout primitives instead of duplicating the shell", () => {
    const source = sourceFor("question-step-layout.tsx");

    expect(source).toContain("export function QuestionStepLayout");
    expect(source).toContain("export function AnswerTextarea");
    expect(source).toContain("max-w-[740px]");
    expect(source).toContain("maxLength={answerMaxLength}");
    expect(source).toContain("min-h-[196px]");
    expect(source).toContain("border-t border-[var(--border)]");
  });
});
