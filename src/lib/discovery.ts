export const discoveryFields = [
  "appIdea",
  "targetUsers",
  "problem",
  "features",
  "screens",
  "data",
  "integrations",
  "uxTone",
  "constraints",
] as const;

export type DiscoveryField = (typeof discoveryFields)[number];

export type DiscoveryAnswers = Record<DiscoveryField, string>;

export type DiscoveryStep = {
  id: DiscoveryField;
  label: string;
  question: string;
  helper: string;
  placeholder: string;
};

export const discoverySteps: DiscoveryStep[] = [
  {
    id: "appIdea",
    label: "App idea",
    question: "What are you building?",
    helper:
      "Describe the app in plain language. Include who it helps and the outcome you want.",
    placeholder:
      "A booking app for independent yoga teachers who run small studio classes.",
  },
  {
    id: "targetUsers",
    label: "Target users",
    question: "Who will use it?",
    helper:
      "Name the people on both sides of the product if there are multiple user groups.",
    placeholder:
      "Teachers who manage classes and students who want to find and reserve local sessions.",
  },
  {
    id: "problem",
    label: "Problem",
    question: "What problem should the app solve?",
    helper:
      "Focus on the messy current workflow, not the features yet.",
    placeholder:
      "Bookings happen through texts and spreadsheets, so teachers miss payments and overbook classes.",
  },
  {
    id: "features",
    label: "Features",
    question: "What must the first version include?",
    helper:
      "List the capabilities that would make the first version useful enough to test.",
    placeholder:
      "Class calendar, booking form, payment status, teacher dashboard, cancellation rules.",
  },
  {
    id: "screens",
    label: "Screens",
    question: "What screens or pages should exist?",
    helper:
      "Think in terms of what someone sees as they move through the app.",
    placeholder:
      "Landing page, class list, class detail, checkout, teacher dashboard.",
  },
  {
    id: "data",
    label: "Data",
    question: "What information does the app manage?",
    helper:
      "Include records, fields, content types, or anything the app needs to remember.",
    placeholder:
      "Teachers, students, classes, bookings, payment status, cancellation windows.",
  },
  {
    id: "integrations",
    label: "Integrations",
    question: "What should it connect to?",
    helper:
      "Mention payments, email, AI, calendars, or write none for the prototype.",
    placeholder: "Stripe for payments and email reminders.",
  },
  {
    id: "uxTone",
    label: "UX tone",
    question: "What should it feel like?",
    helper:
      "Describe the product personality and any design references to avoid.",
    placeholder:
      "Calm, trustworthy, mobile-first, simple for busy teachers, not corporate.",
  },
  {
    id: "constraints",
    label: "Constraints",
    question: "What rules or limits matter?",
    helper:
      "Include business rules, permissions, launch limits, or write none for now.",
    placeholder:
      "No auth in the prototype, but explain where accounts would fit later.",
  },
];

export const emptyDiscoveryAnswers = (): DiscoveryAnswers =>
  discoveryFields.reduce((answers, field) => {
    answers[field] = "";
    return answers;
  }, {} as DiscoveryAnswers);

export const normalizeDiscoveryAnswers = (
  value: unknown,
): DiscoveryAnswers | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const answers = emptyDiscoveryAnswers();

  for (const field of discoveryFields) {
    const fieldValue = candidate[field];

    if (typeof fieldValue !== "string") {
      return null;
    }

    answers[field] = fieldValue.trim();
  }

  return answers;
};

export const getMissingDiscoveryFields = (
  answers: DiscoveryAnswers,
): DiscoveryField[] => discoveryFields.filter((field) => !answers[field].trim());
