import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { discoverySteps, type DiscoveryField } from "../../lib/discovery";
import { QuestionPanel } from "./question-panel";

const questionPanelSource = () => {
  const filePath = join(import.meta.dirname, "question-panel.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const questionStepLayoutSource = () => {
  const filePath = join(import.meta.dirname, "question-step-layout.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const promptEnhancerAppSource = () => {
  const filePath = join(import.meta.dirname, "../prompt-enhancer-app.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const audienceStepSource = () => {
  const filePath = join(import.meta.dirname, "audience-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const problemStepSource = () => {
  const filePath = join(import.meta.dirname, "problem-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const featuresStepSource = () => {
  const filePath = join(import.meta.dirname, "features-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const designPreferencesStepSource = () => {
  const filePath = join(import.meta.dirname, "design-preferences-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const constraintsStepSource = () => {
  const filePath = join(import.meta.dirname, "constraints-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const integrationsStepSource = () => {
  const filePath = join(import.meta.dirname, "integrations-step.tsx");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const discoverySource = () => {
  const filePath = join(import.meta.dirname, "../../lib/discovery.ts");
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
};

const loadConstraintsStepModule = async () => {
  try {
    return (await import("./constraints-step")) as {
      ConstraintsStep?: unknown;
      constraintChips?: string[];
      toggleConstraintChip?: (answer: string, chip: string) => string;
    };
  } catch {
    return null;
  }
};

const loadIntegrationsStepModule = async () => {
  try {
    return (await import("./integrations-step")) as {
      integrationChips?: string[];
      toggleIntegrationChip?: (answer: string, chip: string) => string;
    };
  } catch {
    return null;
  }
};

const questionPanelElementFor = (field: DiscoveryField) => {
  const stepIndex = discoverySteps.findIndex((step) => step.id === field);
  const step = discoverySteps[stepIndex];

  return QuestionPanel({
    answer: "Example answer",
    errorVisible: false,
    isMissing: false,
    onBack: () => {},
    onChange: () => {},
    onNext: () => {},
    showBack: true,
    step,
    stepIndex,
  }) as { props: { isCompact?: boolean } };
};

describe("QuestionPanel Step 1 structure", () => {
  it("lets the first discovery step return to the intro screen", () => {
    const source = promptEnhancerAppSource();

    expect(source).toContain("const returnToIntro = () => {");
    expect(source).toContain('setFlowState("intro")');
    expect(source).toContain(
      'if (flowState === "questions" && stepIndex === 0)',
    );
    expect(source).toContain(
      'showBack={Boolean(questionReturnTarget) || flowState === "questions"}',
    );
  });

  it("gives the app idea step a dense enterprise form layout", () => {
    const source = questionPanelSource();
    const layoutSource = questionStepLayoutSource();

    expect(source).toContain("Discovery / Product definition");
    expect(layoutSource).toContain("Why this matters");
    expect(source).toContain("Appointment booking");
    expect(source).toContain("Customer portal");
    expect(layoutSource).toContain("maxLength={answerMaxLength}");
    expect(source).toContain("min-h-[210px]");
    expect(layoutSource).toContain(
      "text-sm font-medium text-[var(--text-muted)]",
    );
    expect(source).not.toContain("min-h-56");
    expect(source).not.toContain(
      "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]",
    );
  });

  it("makes app idea examples clickable templates", async () => {
    const source = questionPanelSource();
    const layoutSource = questionStepLayoutSource();
    const questionPanelModule = (await import("./question-panel")) as {
      appIdeaExamples?: Array<{ label: string; template: string }>;
      getAppIdeaExampleAnswer?: (
        answer: string,
        template: string,
      ) => string;
    };

    expect(questionPanelModule.appIdeaExamples).toHaveLength(2);
    expect(
      questionPanelModule.appIdeaExamples?.map((example) => example.label),
    ).toEqual([
      "Appointment booking",
      "Customer portal",
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
    expect(layoutSource).toContain('type="button"');
    expect(source).toContain("getAppIdeaExampleAnswer(answer, example.template)");
  });

  it("gives target users a guided audience step with interactive chips", async () => {
    const source = questionPanelSource();
    const stepSource = audienceStepSource();
    const questionPanelModule = (await import("./question-panel")) as {
      audienceTypeChips?: string[];
      toggleAudienceType?: (answer: string, audienceType: string) => string;
    };

    expect(source).toContain("Discovery / Audience");
    expect(source).toContain("<AudienceStep answer={answer} onChange={onChange} />");
    expect(stepSource).toContain("Common audience types");
    expect(stepSource).toContain("Clear user groups help the AI builder");
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
    expect(stepSource).toContain("toggleAudienceType(answer, audienceType)");
  });

  it("gives core problem a guided problem step with prompt chips", async () => {
    const source = questionPanelSource();
    const stepSource = problemStepSource();
    const problemStepModule = (await import("./problem-step")) as {
      problemPromptChips?: Array<{ label: string; text: string }>;
      toggleProblemPrompt?: (answer: string, promptText: string) => string;
    };

    expect(source).toContain("Discovery / Problem");
    expect(source).toContain(
      "<ProblemStep answer={answer} onChange={onChange} step={step} />",
    );
    expect(stepSource).toContain("Problem prompts");
    expect(stepSource).toContain("A clear problem statement helps the AI builder");
    expect(
      problemStepModule.problemPromptChips?.map((prompt) => prompt.label),
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

    const firstPrompt = problemStepModule.problemPromptChips?.[0]?.text;

    expect(firstPrompt).toBeTruthy();
    expect(problemStepModule.toggleProblemPrompt?.("", firstPrompt || "")).toBe(
      firstPrompt,
    );
    expect(
      problemStepModule.toggleProblemPrompt?.(
        "Requests are handled in email.",
        firstPrompt || "",
      ),
    ).toBe(`Requests are handled in email. ${firstPrompt}`);
    expect(
      problemStepModule.toggleProblemPrompt?.(
        `Requests are handled in email. ${firstPrompt}`,
        firstPrompt || "",
      ),
    ).toBe("Requests are handled in email.");
    expect(stepSource).toContain(
      "onClick={() => onChange(toggleProblemPrompt(answer, prompt.text))}",
    );
  });

  it("gives MVP features a focused feature selection step", async () => {
    const source = questionPanelSource();
    const stepSource = featuresStepSource();
    const questionPanelModule = (await import("./question-panel")) as {
      featureChips?: string[];
      toggleFeatureChip?: (answer: string, feature: string) => string;
    };

    expect(source).toContain("Discovery / MVP scope");
    expect(source).toContain("<FeaturesStep answer={answer} onChange={onChange} />");
    expect(stepSource).toContain("Common MVP features");
    expect(stepSource).toContain("Start with 4 to 6 must-have features.");
    expect(stepSource).toContain(
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
    expect(stepSource).toContain(
      "onClick={() => onChange(toggleFeatureChip(answer, feature))}",
    );
  });

  it("gives user journey a guided screens and flow planning step", () => {
    const source = questionPanelSource();

    expect(source).toContain("Discovery / User journey");
    expect(source).toContain('case "screens"');
    expect(source).toContain(
      "Plain language is enough. A simple ordered flow works well.",
    );
    expect(source).toContain(
      "<ScreensStep answer={answer} onChange={onChange} />",
    );
    expect(source).toContain("min-h-[180px]");
  });

  it("gives design preferences a guided UX tone step with interactive chips", async () => {
    const source = questionPanelSource();
    const stepSource = designPreferencesStepSource();
    const questionPanelModule = (await import("./question-panel")) as {
      toneOptions?: string[];
      hasToneOption?: (answer: string, tone: string) => boolean;
      toggleToneOption?: (answer: string, tone: string) => string;
    };

    expect(source).toContain("Discovery / Design direction");
    expect(source).toContain("Plain language is enough. Describe the feeling, audience, and what to avoid.");
    expect(stepSource).toContain("Tone options");
    expect(stepSource).toContain("Useful details to include");
    expect(stepSource).toContain("Who should the design feel built for");
    expect(stepSource).toContain("Whether it should feel simple, premium, playful, or operational");
    expect(stepSource).toContain("Any styles to avoid, such as too corporate, too playful, too dark, or too busy");
    expect(stepSource).toContain(
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
    expect(stepSource).toContain(
      "onClick={() => onChange(toggleToneOption(answer, tone))}",
    );
  });

  it("aligns design preferences with the neighboring integrations step", () => {
    const integrationsPanel = questionPanelElementFor("integrations");
    const designPreferencesPanel = questionPanelElementFor("uxTone");

    expect(designPreferencesPanel.props.isCompact).toBe(
      integrationsPanel.props.isCompact,
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
      "Rule or limit → why it matters → how strict it is",
    );
    expect(stepSource).toContain(
      "No account creation for prototype → keeps the demo simple → explain where login would fit later",
    );
    expect(stepSource).toContain(
      "Constraints help the AI builder avoid overbuilding, respect business rules, and produce a realistic first version.",
    );
    expect(constraintsStepModule?.ConstraintsStep).toBeTypeOf("function");
    expect(source).toContain(
      "<ConstraintsStep answer={answer} onChange={onChange} />",
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
    expect(source).toContain('case "data"');
    expect(source).toContain("<DataStep answer={answer} onChange={onChange} />");
    expect(source).toContain("min-h-[180px]");
    expect(source).toContain(
      "Plain language is enough. List the objects and details the app should track.",
    );
  });

  it("gives integrations a guided external services discovery step", async () => {
    const source = questionPanelSource();
    const stepSource = integrationsStepSource();
    const integrationsStepModule = await loadIntegrationsStepModule();

    expect(source).toContain("Discovery / Integrations");
    expect(source).toContain(
      "<IntegrationsStep answer={answer} onChange={onChange} />",
    );
    expect(stepSource).toContain("export function IntegrationsStep");
    expect(stepSource).toContain("Common integrations");
    expect(stepSource).toContain("Add any outside system the prototype should mention.");
    expect(stepSource).toContain("Simple integration format");
    expect(source).toContain(
      "Plain language is enough. List the tools or services the app should connect with.",
    );
    expect(stepSource).toContain(
      "Tool or service → what it does → when it is used",
    );
    expect(stepSource).toContain(
      "Stripe → collects payments → when a customer books a class",
    );
    expect(stepSource).toContain(
      "Integration details help the AI builder plan API boundaries, payment flows, notifications, and realistic prototype scope.",
    );
    expect(integrationsStepModule?.integrationChips).toEqual([
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
    expect(integrationsStepModule?.toggleIntegrationChip?.("", "Payments")).toBe(
      "Payments",
    );
    expect(
      integrationsStepModule?.toggleIntegrationChip?.("Payments", "Email"),
    ).toBe("Payments, Email");
    expect(
      integrationsStepModule?.toggleIntegrationChip?.("Payments, Email", "Email"),
    ).toBe("Payments");
    expect(
      integrationsStepModule?.toggleIntegrationChip?.(
        "Payments, Email",
        "None for prototype",
      ),
    ).toBe("None for prototype");
    expect(
      integrationsStepModule?.toggleIntegrationChip?.(
        "None for prototype",
        "None for prototype",
      ),
    ).toBe("");
    expect(
      integrationsStepModule?.toggleIntegrationChip?.(
        "None for prototype",
        "Webhooks",
      ),
    ).toBe("Webhooks");
    expect(
      integrationsStepModule?.toggleIntegrationChip?.(
        "Stripe for payments and email reminders.",
        "Webhooks",
      ),
    ).toBe("Stripe for payments and email reminders, Webhooks");
  });
});
