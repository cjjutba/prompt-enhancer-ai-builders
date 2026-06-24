import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readComponent = (fileName: string) =>
  readFileSync(join(import.meta.dirname, fileName), "utf8");

describe("DiscoveryRail", () => {
  it("keeps the sidebar brand compact and removes inactive help copy", () => {
    const railSource = readComponent("discovery-rail.tsx");
    const uiSource = readComponent("ui.tsx");

    expect(railSource).toContain("Prompt Enhancer");
    expect(railSource).toContain("Most people finish in 6 to 8 minutes");
    expect(uiSource).toContain("export function PromptEnhancerMark");
    expect(railSource).not.toContain("Builder-ready prompt workspace");
    expect(railSource).not.toContain("Need help?");
    expect(railSource).not.toContain("View guidance and examples");
  });
});
