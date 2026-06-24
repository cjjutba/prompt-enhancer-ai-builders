import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const questionPanelSource = () => {
  const filePath = join(import.meta.dirname, "question-panel.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const constraintsStepSource = () => {
  const filePath = join(import.meta.dirname, "constraints-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const discoverySource = () => {
  const filePath = join(import.meta.dirname, "../../lib/discovery.ts");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadConstraintsStepModule = async () => {
  try {
    return (await import("./constraints-step")) as {
      constraintChips?: string[];
      toggleConstraintChip?: (answer: string, chip: string) => string;
    };
  } catch {
    return null;
  }
};

describe("QuestionPanel Step 1 structure", () => {
  it("gives the app idea step a dense enterprise form layout", () => {
    const source = questionPanelSource();

    expect(source).toContain("Discovery / Product definition");
    expect(source).toContain("Why this matters");
    expect(source).toContain("Appointment booking");
    expect(source).toContain("Customer portal");
    expect(source).toContain("maxLength={1000}");
    expect(source).toContain("min-h-[210px]");
    expect(source).toContain(
      "text-sm font-medium text-[var(--text-muted)]",
    );
    expect(source).not.toContain("min-h-56");
    expect(source).not.toContain(
      "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]",
    );
  });

  it("makes app idea examples clickable templates", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      appIdeaExamples?: Array<{ label: string; template: string }>;
      getAppIdeaExampleAnswer?: (
        answer: string,
        template: string,
      ) => string;
    };

    expect(questionPanelModule.appIdeaExamples).toHaveLength(5);
    expect(
      questionPanelModule.appIdeaExamples?.map((example) => example.label),
    ).toEqual([
      "Appointment booking",
      "Customer portal",
      "Inventory tracker",
      "Event management",
      "Internal dashboard",
    ]);
    expect(
      questionPanelModule.appIdeaExamples?.every(
        (example) => example.template.length > 80,
      ),
    ).toBe(true);
    const firstTemplate = questionPanelModule.appIdeaExamples?.[0]?.template;

    expect(firstTemplate).toBeTruthy();
    expect(
      questionPanelModule.getAppIdeaExampleAnswer?.("", firstTemplate || ""),
    ).toBe(firstTemplate);
    expect(
      questionPanelModule.getAppIdeaExampleAnswer?.(
        firstTemplate || "",
        firstTemplate || "",
      ),
    ).toBe("");
    expect(source).toContain('type="button"');
    expect(source).toContain(
      "onClick={() => onChange(getAppIdeaExampleAnswer(answer, example.template))}",
    );
  });

  it("gives target users a guided audience step with interactive chips", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      audienceTypeChips?: string[];
      toggleAudienceType?: (answer: string, audienceType: string) => string;
    };

    expect(source).toContain("Discovery / Audience");
    expect(source).toContain("Common audience types");
    expect(source).toContain("Clear user groups help the AI builder");
    expect(questionPanelModule.audienceTypeChips).toEqual([
      "Customers",
      "Admins",
      "Staff",
      "Managers",
      "Students",
      "Parents",
      "Tutors",
      "Business owners",
    ]);
    expect(questionPanelModule.toggleAudienceType?.("", "Customers")).toBe(
      "Customers",
    );
    expect(
      questionPanelModule.toggleAudienceType?.("Teachers", "Students"),
    ).toBe("Teachers, Students");
    expect(
      questionPanelModule.toggleAudienceType?.("Teachers, Students", "Students"),
    ).toBe("Teachers");
    expect(source).toContain(
      "onClick={() => onChange(toggleAudienceType(answer, audienceType))}",
    );
  });

  it("gives core problem a guided problem step with prompt chips", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      problemPromptChips?: Array<{ label: string; text: string }>;
      toggleProblemPrompt?: (answer: string, promptText: string) => string;
    };

    expect(source).toContain("Discovery / Problem");
    expect(source).toContain("Problem prompts");
    expect(source).toContain("A clear problem statement helps the AI builder");
    expect(
      questionPanelModule.problemPromptChips?.map((prompt) => prompt.label),
    ).toEqual([
      "Too much manual work",
      "Missed updates",
      "Hard to track requests",
      "Duplicate data entry",
      "Slow approvals",
      "No clear owner",
      "Payment confusion",
      "Poor customer visibility",
    ]);

    const firstPrompt = questionPanelModule.problemPromptChips?.[0]?.text;

    expect(firstPrompt).toBeTruthy();
    expect(questionPanelModule.toggleProblemPrompt?.("", firstPrompt || "")).toBe(
      firstPrompt,
    );
    expect(
      questionPanelModule.toggleProblemPrompt?.(
        "Requests are handled in email.",
        firstPrompt || "",
      ),
    ).toBe(`Requests are handled in email. ${firstPrompt}`);
    expect(
      questionPanelModule.toggleProblemPrompt?.(
        `Requests are handled in email. ${firstPrompt}`,
        firstPrompt || "",
      ),
    ).toBe("Requests are handled in email.");
    expect(source).toContain(
      "onClick={() => onChange(toggleProblemPrompt(answer, prompt.text))}",
    );
  });

  it("gives MVP features a focused feature selection step", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      featureChips?: string[];
      toggleFeatureChip?: (answer: string, feature: string) => string;
    };

    expect(source).toContain("Discovery / MVP scope");
    expect(source).toContain("Common MVP features");
    expect(source).toContain("Start with 4 to 6 must-have features.");
    expect(source).toContain(
      "A focused first release helps the AI builder create a usable MVP",
    );
    expect(source).toContain(
      "Plain language is enough. Focus on the first release, not every future idea.",
    );
    expect(questionPanelModule.featureChips).toEqual([
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
    expect(questionPanelModule.toggleFeatureChip?.("", "Dashboard")).toBe(
      "Dashboard",
    );
    expect(
      questionPanelModule.toggleFeatureChip?.("Class calendar", "Payments"),
    ).toBe("Class calendar, Payments");
    expect(
      questionPanelModule.toggleFeatureChip?.(
        "Class calendar, Payments",
        "Payments",
      ),
    ).toBe("Class calendar");
    expect(source).toContain(
      "onClick={() => onChange(toggleFeatureChip(answer, feature))}",
    );
  });

  it("gives design preferences a guided UX tone step with interactive chips", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      toneOptions?: string[];
      hasToneOption?: (answer: string, tone: string) => boolean;
      toggleToneOption?: (answer: string, tone: string) => string;
    };

    expect(source).toContain("Discovery / Design direction");
    expect(source).toContain("Plain language is enough. Describe the feeling, audience, and what to avoid.");
    expect(source).toContain("Tone options");
    expect(source).toContain("Useful details to include");
    expect(source).toContain("Who should the design feel built for");
    expect(source).toContain("Whether it should feel simple, premium, playful, or operational");
    expect(source).toContain("Any styles to avoid, such as too corporate, too playful, too dark, or too busy");
    expect(source).toContain(
      "Design direction helps the AI builder choose layout, tone, density, and visual style that match the users instead of generating a generic interface.",
    );
    expect(questionPanelModule.toneOptions).toEqual([
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
    expect(questionPanelModule.toggleToneOption?.("", "Calm")).toBe("Calm");
    expect(
      questionPanelModule.toggleToneOption?.("Simple for busy teachers", "Calm"),
    ).toBe("Simple for busy teachers, Calm");
    expect(
      questionPanelModule.toggleToneOption?.(
        "Simple for busy teachers, Calm",
        "Calm",
      ),
    ).toBe("Simple for busy teachers");
    expect(
      questionPanelModule.toggleToneOption?.(
        "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate.",
        "Premium",
      ),
    ).toBe(
      "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate, Premium",
    );
    expect(
      questionPanelModule.hasToneOption?.(
        "Calm, mobile-first, not corporate.",
        "Calm",
      ),
    ).toBe(true);
    expect(source).toContain(
      "onClick={() => onChange(toggleToneOption(answer, tone))}",
    );
  });

  it("gives launch goals a guided constraints step with toggle chips", async () => {
    const source = questionPanelSource();
    const stepSource = constraintsStepSource();
    const stepsSource = discoverySource();
    const constraintsStepModule = await loadConstraintsStepModule();

    expect(source).toContain("Discovery / Launch goals");
    expect(stepsSource).toContain(
      "Include business rules, permissions, launch limits, or write none for now.",
    );
    expect(stepSource).toContain("Common constraints");
    expect(stepSource).toContain("Useful constraint format");
    expect(stepSource).toContain(
      "No account creation for prototype -> keeps the demo simple -> explain where login would fit later",
    );
    expect(stepSource).toContain(
      "Constraints help the AI builder avoid overbuilding, respect business rules, and produce a realistic first version.",
    );
    expect(source).toContain(
      "<ConstraintChips answer={answer} onChange={onChange} />",
    );
    expect(source).toContain(
      "Plain language is enough. Include any must-follow rules, limits, or success goals.",
    );
    expect(constraintsStepModule?.constraintChips).toEqual([
      "No auth for prototype",
      "Mobile-first",
      "Admin approval required",
      "Role-based access",
      "Payment required",
      "Email confirmation",
      "Limited MVP scope",
      "Public landing page",
      "Private dashboard",
      "Accessibility",
      "No database for demo",
      "None for now",
    ]);
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "",
        "No auth for prototype",
      ),
    ).toBe("No auth for prototype");
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "Mobile-first",
        "Admin approval required",
      ),
    ).toBe("Mobile-first, Admin approval required");
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "Mobile-first, Admin approval required",
        "Mobile-first",
      ),
    ).toBe("Admin approval required");
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "Mobile-first, Admin approval required",
        "None for now",
      ),
    ).toBe("None for now");
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "None for now",
        "Mobile-first",
      ),
    ).toBe("Mobile-first");
    expect(
      constraintsStepModule?.toggleConstraintChip?.(
        "None for now",
        "None for now",
      ),
    ).toBe("");
  });

  it("gives content and data a guided data discovery step", () => {
    const source = questionPanelSource();

    expect(source).toContain("Discovery / Content & data");
    expect(source).toContain("isDataStep");
    expect(source).toContain("<DataStep answer={answer} onChange={onChange} />");
    expect(source).toContain("min-h-[180px]");
    expect(source).toContain(
      "Plain language is enough. List the objects and details the app should track.",
    );
  });

  it("gives integrations a guided external services discovery step", async () => {
    const source = questionPanelSource();
    const questionPanelModule = (await import("./question-panel")) as {
      integrationChips?: string[];
      toggleIntegrationChip?: (answer: string, chip: string) => string;
    };

    expect(source).toContain("Discovery / Integrations");
    expect(source).toContain("Common integrations");
    expect(source).toContain("Simple integration format");
    expect(source).toContain(
      "Plain language is enough. List the tools or services the app should connect with.",
    );
    expect(source).toContain(
      "Tool or service -&gt; what it does -&gt; when it is used",
    );
    expect(source).toContain(
      "Stripe -&gt; collects payments -&gt; when a customer books a class",
    );
    expect(source).toContain(
      "Integration details help the AI builder plan API boundaries, payment flows, notifications, and realistic prototype scope.",
    );
    expect(questionPanelModule.integrationChips).toEqual([
      "Payments",
      "Email",
      "Calendar",
      "AI model",
      "File storage",
      "Maps",
      "SMS",
      "Analytics",
      "CRM",
      "Webhooks",
      "Zapier",
      "None for prototype",
    ]);
    expect(questionPanelModule.toggleIntegrationChip?.("", "Payments")).toBe(
      "Payments",
    );
    expect(
      questionPanelModule.toggleIntegrationChip?.("Payments", "Email"),
    ).toBe("Payments, Email");
    expect(
      questionPanelModule.toggleIntegrationChip?.("Payments, Email", "Email"),
    ).toBe("Payments");
    expect(
      questionPanelModule.toggleIntegrationChip?.(
        "Payments, Email",
        "None for prototype",
      ),
    ).toBe("None for prototype");
    expect(
      questionPanelModule.toggleIntegrationChip?.(
        "None for prototype",
        "Webhooks",
      ),
    ).toBe("Webhooks");
  });
});
