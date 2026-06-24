import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const introSource = () =>
  readFileSync(join(import.meta.dirname, "intro-screen.tsx"), "utf8");

describe("IntroScreen visual structure", () => {
  it("keeps the intro workspace dense and row-based", () => {
    const source = introSource();

    expect(source).toContain("max-w-[740px]");
    expect(source).toContain("lg:pt-6");
    expect(source).toContain("Your prompt will include:");
    expect(source).not.toContain("rounded-full bg-[var(--surface-subtle)]");
  });
});
