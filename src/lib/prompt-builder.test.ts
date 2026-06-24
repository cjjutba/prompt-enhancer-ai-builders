import { describe, expect, it } from "vitest";
import { buildOpenRouterMessages } from "./prompt-builder";

const answers = {
  appIdea:
    "A booking app for neighborhood yoga teachers who run small studio classes.",
  targetUsers: "Independent instructors and students looking for local classes.",
  problem:
    "Teachers coordinate bookings through messages and spreadsheets, which causes missed payments and overbooked sessions.",
  features:
    "Class calendar, student booking, payment status, teacher dashboard, cancellation rules.",
  screens:
    "Landing page, class list, class details, checkout, teacher dashboard.",
  data:
    "Teachers, students, classes, bookings, payment status, cancellation window.",
  integrations: "Stripe for payments and email reminders.",
  uxTone: "Calm, trustworthy, mobile-first, not corporate.",
  constraints:
    "No authentication for the prototype, but explain where auth would fit later.",
};

describe("buildOpenRouterMessages", () => {
  it("turns discovery answers into builder-ready system and user messages", () => {
    const messages = buildOpenRouterMessages(answers);

    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ role: "system" });
    expect(messages[0].content).toContain("AI app builders");
    expect(messages[1]).toMatchObject({ role: "user" });
    expect(messages[1].content).toContain("booking app");
    expect(messages[1].content).toContain(
      "## UX tone\nCalm, trustworthy, mobile-first, not corporate.",
    );
    expect(messages[1].content).toContain("Data and content");
    expect(messages[1].content).toContain(
      "Teachers, students, classes, bookings, payment status, cancellation window.",
    );
    expect(messages[1].content).toContain("Stripe");
    expect(messages[1].content).toContain("Out-of-scope");
    expect(messages[1].content).toContain("ask clarifying questions only when blocked");
  });

  it("keeps generated prompts aligned to the assignment builder targets", () => {
    const messages = buildOpenRouterMessages(answers);
    const promptContract = messages.map((message) => message.content).join("\n");

    expect(promptContract).toContain("Lovable, Base44, and Emergent");
    expect(promptContract).toContain("Do not mention Bolt");
    expect(promptContract).toContain("Do not mention Replit Agent");
  });
});
