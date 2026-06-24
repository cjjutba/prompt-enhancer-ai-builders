import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const screensStepSource = () => {
  const filePath = join(import.meta.dirname, "screens-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const questionStepLayoutSource = () => {
  const filePath = join(import.meta.dirname, "question-step-layout.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadScreensStepModule = async () => {
  try {
    return (await import("./screens-step")) as {
      screenChips?: string[];
      hasScreenChip?: (answer: string, screen: string) => boolean;
      toggleScreenChip?: (answer: string, screen: string) => string;
    };
  } catch {
    return null;
  }
};

describe("ScreensStep helpers", () => {
  it("defines compact common screen chips for Step 5", async () => {
    const screensStepModule = await loadScreensStepModule();

    expect(screensStepModule?.screenChips).toEqual([
      "Landing page",
      "Dashboard",
      "List view",
      "Detail page",
      "Create form",
      "Checkout",
      "Settings",
      "Admin panel",
      "Profile",
      "Notifications",
    ]);
  });

  it("toggles screen chips in the existing screens answer", async () => {
    const screensStepModule = await loadScreensStepModule();

    expect(screensStepModule?.toggleScreenChip?.("", "Landing page")).toBe(
      "Landing page",
    );
    expect(
      screensStepModule?.toggleScreenChip?.("Landing page", "Checkout"),
    ).toBe("Landing page, Checkout");
    expect(
      screensStepModule?.toggleScreenChip?.(
        "Landing page, Checkout",
        "Checkout",
      ),
    ).toBe("Landing page");
    expect(
      screensStepModule?.hasScreenChip?.(
        "Landing page, class detail, checkout",
        "Checkout",
      ),
    ).toBe(true);
  });

  it("renders restrained journey guidance sections", () => {
    const source = screensStepSource();
    const layoutSource = questionStepLayoutSource();

    expect(source).toContain("Common screens");
    expect(source).toContain("Simple flow format");
    expect(source).toContain(
      "Start → choose item → view details → submit request → receive confirmation",
    );
    expect(source).toContain("StepGuidance");
    expect(layoutSource).toContain("Why this matters");
    expect(source).toContain(
      "Screen flow helps the AI builder understand navigation, page hierarchy, and what each user needs to do next.",
    );
    expect(source).toContain("divide-y divide-[var(--border)]");
  });
});
