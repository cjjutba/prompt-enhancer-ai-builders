import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dataStepSource = () => {
  const filePath = join(import.meta.dirname, "data-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

describe("DataStep helpers", () => {
  it("renders the requested data guidance sections", () => {
    const source = dataStepSource();

    expect(source).toContain("Common data types");
    expect(source).toContain("Simple data format");
    expect(source).toContain(
      "Thing to manage → important details → who can view or edit it",
    );
    expect(source).toContain(
      "Booking → date, time, customer, status, payment status → customer and admin",
    );
    expect(source).toContain("Why this matters");
    expect(source).toContain(
      "Clear data requirements help the AI builder create better forms, dashboards, permissions, and empty states.",
    );
  });

  it("defines the supported common data type chips", async () => {
    const dataStepModule = (await import("./data-step")) as {
      dataTypeChips?: string[];
    };

    expect(dataStepModule.dataTypeChips).toEqual([
      "Users",
      "Profiles",
      "Bookings",
      "Payments",
      "Messages",
      "Files",
      "Products",
      "Orders",
      "Requests",
      "Notifications",
      "Settings",
      "Activity logs",
    ]);
  });

  it("toggles comma-separated data type chips in the data answer", async () => {
    const dataStepModule = (await import("./data-step")) as {
      toggleDataTypeChip?: (answer: string, dataType: string) => string;
    };

    expect(dataStepModule.toggleDataTypeChip?.("", "Users")).toBe("Users");
    expect(
      dataStepModule.toggleDataTypeChip?.("Users", "Bookings"),
    ).toBe("Users, Bookings");
    expect(
      dataStepModule.toggleDataTypeChip?.("Users, Bookings", "Bookings"),
    ).toBe("Users");
  });

  it("uses a quiet split-row layout for the data format and rationale", () => {
    const source = dataStepSource();

    expect(source).toContain("export function DataWhyItMatters");
    expect(source).toContain("grid gap-5 border-t");
    expect(source).toContain("sm:grid-cols");
    expect(source).toContain(
      "border-t border-[var(--border)] pt-5 sm:border-l",
    );
    expect(source).not.toContain("<RouteIcon");
  });
});
