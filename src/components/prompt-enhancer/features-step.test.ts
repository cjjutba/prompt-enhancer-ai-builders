import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const featuresStepSource = () => {
  const filePath = join(import.meta.dirname, "features-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const questionPanelSource = () => {
  const filePath = join(import.meta.dirname, "question-panel.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadFeaturesStepModule = async () => {
  try {
    return (await import("./features-step")) as {
      featureChips?: string[];
      toggleFeatureChip?: (answer: string, feature: string) => string;
    };
  } catch {
    return null;
  }
};

describe("FeaturesStep", () => {
  it("keeps Step 4 as a focused MVP scoping row pattern", async () => {
    const source = featuresStepSource();
    const questionPanel = questionPanelSource();
    const featuresStepModule = await loadFeaturesStepModule();

    expect(questionPanel).toContain(
      "<FeaturesStep answer={answer} onChange={onChange} />",
    );
    expect(source).toContain("Common MVP features");
    expect(source).toContain("Start with 4 to 6 must-have features.");
    expect(source).toContain("Why this matters");
    expect(source).toContain(
      "A focused first release helps the AI builder create a usable MVP instead of spreading the app across too many unfinished features.",
    );
    expect(source).toContain("divide-y divide-[var(--border)]");
    expect(source).not.toContain("grid");
    expect(source).not.toContain("shadow-");
    expect(featuresStepModule?.featureChips).toEqual([
      "Sign up / login",
      "Dashboard",
      "Booking or scheduling",
      "Payments",
      "Messaging",
      "Notifications",
      "Admin panel",
      "Search / filters",
      "File upload",
      "Analytics",
    ]);
  });

  it("toggles selected feature chips into the existing features answer", async () => {
    const featuresStepModule = await loadFeaturesStepModule();

    expect(featuresStepModule?.toggleFeatureChip?.("", "Dashboard")).toBe(
      "Dashboard",
    );
    expect(
      featuresStepModule?.toggleFeatureChip?.("Class calendar", "Payments"),
    ).toBe("Class calendar, Payments");
    expect(
      featuresStepModule?.toggleFeatureChip?.(
        "Class calendar, Payments",
        "Payments",
      ),
    ).toBe("Class calendar");
    expect(
      featuresStepModule?.toggleFeatureChip?.(
        "Dashboard\nPayments",
        "Dashboard",
      ),
    ).toBe("Payments");
  });
});
