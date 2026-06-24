import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = () =>
  readFileSync(join(import.meta.dirname, "route.ts"), "utf8");

describe("POST /api/enhance logging contract", () => {
  it("logs safe OpenRouter success details for Loom verification", () => {
    const source = routeSource();

    expect(source).toContain("AI generation started");
    expect(source).toContain("AI generation succeeded");
    expect(source).toContain("requestId");
    expect(source).toContain("durationMs");
    expect(source).toContain("outputCharacters");
    expect(source).toContain("openRouterStatus");
    expect(source).toContain("formatLogDetails");
    expect(source).toContain("console.info(`${message} ${formatLogDetails(details)}`)");
    expect(source).not.toContain("console.info(apiKey");
    expect(source).not.toContain("console.log(apiKey");
  });
});
