import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const designPreferencesStepSource = () => {
  const filePath = join(import.meta.dirname, "design-preferences-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const questionPanelSource = () => {
  const filePath = join(import.meta.dirname, "question-panel.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadDesignPreferencesStepModule = async () => {
  try {
    return (await import("./design-preferences-step")) as {
      toneOptions?: string[];
      hasToneOption?: (answer: string, tone: string) => boolean;
      toggleToneOption?: (answer: string, tone: string) => string;
    };
  } catch {
    return null;
  }
};

describe("DesignPreferencesStep", () => {
  it("keeps Step 8 in a dedicated restrained UX tone module", async () => {
    const source = designPreferencesStepSource();
    const questionPanel = questionPanelSource();
    const designStepModule = await loadDesignPreferencesStepModule();

    expect(questionPanel).toContain(
      "<DesignPreferencesStep answer={answer} onChange={onChange} />",
    );
    expect(source).toContain("export function DesignPreferencesStep");
    expect(source).toContain("export function ToneChips");
    expect(source).toContain("export function DesignDirectionHint");
    expect(source).toContain("Tone options");
    expect(source).toContain("Useful details to include");
    expect(source).toContain("Why this matters");
    expect(source).toContain("divide-y divide-[var(--border)]");
    expect(source).not.toContain("bg-gradient");
    expect(source).not.toContain("rounded-full");
    expect(designStepModule?.toneOptions).toEqual([
      "Calm",
      "Trustworthy",
      "Fast",
      "Premium",
      "Friendly",
      "Minimal",
      "Mobile-first",
      "Professional",
      "Playful",
      "Accessible",
      "Data-heavy",
      "Simple",
    ]);
  });

  it("toggles tone chips into the existing uxTone answer", async () => {
    const designStepModule = await loadDesignPreferencesStepModule();

    expect(designStepModule?.toggleToneOption?.("", "Calm")).toBe("Calm");
    expect(
      designStepModule?.toggleToneOption?.(
        "Simple for busy teachers",
        "Calm",
      ),
    ).toBe("Simple for busy teachers, Calm");
    expect(
      designStepModule?.toggleToneOption?.(
        "Simple for busy teachers, Calm",
        "Calm",
      ),
    ).toBe("Simple for busy teachers");
    expect(
      designStepModule?.toggleToneOption?.(
        "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate.",
        "Premium",
      ),
    ).toBe(
      "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate, Premium",
    );
    expect(
      designStepModule?.hasToneOption?.(
        "Calm, mobile-first, not corporate.",
        "Calm",
      ),
    ).toBe(true);
  });

  it("renders plain-language design guidance for non-designers", () => {
    const source = designPreferencesStepSource();

    expect(source).toContain("Who should the design feel built for");
    expect(source).toContain(
      "Whether it should feel simple, premium, playful, or operational",
    );
    expect(source).toContain(
      "Any styles to avoid, such as too corporate, too playful, too dark, or too busy",
    );
    expect(source).toContain(
      "Design direction helps the AI builder choose layout, tone, density, and visual style that match the users instead of generating a generic interface.",
    );
  });
});
