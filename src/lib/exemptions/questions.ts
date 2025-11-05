import { ExemptionCategory } from "@/types/exemptions";

export type QuestionType = "date" | "boolean" | "multipleChoice";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface ExemptionQuestion {
  id: string;
  category: ExemptionCategory;
  text: string;
  type: QuestionType;
  helpText?: string;
  options?: QuestionOption[];
  required: boolean;
}

// Age-based questions
export const ageQuestions: ExemptionQuestion[] = [
  {
    id: "age-dob",
    category: "age",
    text: "What is your date of birth?",
    type: "date",
    helpText:
      "We'll check if you're exempt based on your age. People 18 or younger and 65 or older are exempt.",
    required: true,
  },
];

// Family/caregiving questions
export const familyCaregivingQuestions: ExemptionQuestion[] = [
  {
    id: "family-pregnant",
    category: "family-caregiving",
    text: "Are you currently pregnant or recently gave birth?",
    type: "boolean",
    helpText:
      "If you're pregnant or gave birth within the last 60 days, you're exempt. Tap the info icon below for more details.",
    required: true,
  },
  {
    id: "family-child",
    category: "family-caregiving",
    text: "Do you live with a child age 13 or younger?",
    type: "boolean",
    helpText:
      "This includes your own children, stepchildren, or children you care for. Tap the info icons below for more details.",
    required: true,
  },
  {
    id: "family-disabled-dependent",
    category: "family-caregiving",
    text: "Do you care for someone with a disability?",
    type: "boolean",
    helpText:
      "This includes caring for a child or adult with a disability. Tap the info icons below for more details.",
    required: true,
  },
];

// Health/disability questions
export const healthDisabilityQuestions: ExemptionQuestion[] = [
  {
    id: "health-medicare",
    category: "health-disability",
    text: "Do you have Medicare?",
    type: "boolean",
    helpText:
      "Medicare is health insurance for people 65 or older, or people with certain disabilities. Tap the info icon below for more details.",
    required: true,
  },
  {
    id: "health-non-magi",
    category: "health-disability",
    text: "Do you get Medicaid because of a disability or long-term care needs (non-MAGI Medicaid)?",
    type: "boolean",
    helpText:
      "This is different from regular Medicaid. If you're not sure, select No. Tap the info icon below for more details.",
    required: true,
  },
  {
    id: "health-disabled-veteran",
    category: "health-disability",
    text: "Are you a veteran with a 100% disability rating from the VA?",
    type: "boolean",
    helpText:
      "This means the VA determined you have a total service-connected disability. Tap the info icon below for more details.",
    required: true,
  },
  {
    id: "health-medically-frail",
    category: "health-disability",
    text: "Do you have a serious health condition or disability (defined as medically frail or special needs)?",
    type: "boolean",
    helpText:
      "This includes being blind, disabled, having addiction issues, mental health conditions, or chronic illnesses. Tap the info icons below for detailed examples.",
    required: true,
  },
];

// Program participation questions
export const programParticipationQuestions: ExemptionQuestion[] = [
  {
    id: "program-snap-tanf",
    category: "program-participation",
    text: "Are you on food stamps (SNAP) or cash assistance (TANF) and meeting their work requirements?",
    type: "boolean",
    helpText:
      "You must be meeting (not exempt from) their work requirements. Tap the info icons below for more details about these programs.",
    required: true,
  },
  {
    id: "program-rehab",
    category: "program-participation",
    text: "Are you in a drug or alcohol treatment program?",
    type: "boolean",
    helpText:
      "This includes inpatient or outpatient treatment programs. Tap the info icon below for more details.",
    required: true,
  },
];

// Other exemptions questions
export const otherExemptionsQuestions: ExemptionQuestion[] = [
  {
    id: "other-incarcerated",
    category: "other",
    text: "Are you currently in jail or prison, or were you released in the last 3 months?",
    type: "boolean",
    helpText:
      "If you're currently incarcerated or were recently released, you're exempt during this time. Tap the info icon below for more details.",
    required: true,
  },
  {
    id: "other-tribal",
    category: "other",
    text: "Are you a member of a Native American tribe or eligible for Indian Health Service?",
    type: "boolean",
    helpText:
      "This includes being Indian, Urban Indian, California Indian, or IHS-eligible. Tap the info icons below for more details.",
    required: true,
  },
];

// All questions in order
export const allQuestions: ExemptionQuestion[] = [
  ...ageQuestions,
  ...familyCaregivingQuestions,
  ...healthDisabilityQuestions,
  ...programParticipationQuestions,
  ...otherExemptionsQuestions,
];

// Get questions by category
export function getQuestionsByCategory(
  category: ExemptionCategory,
): ExemptionQuestion[] {
  switch (category) {
    case "age":
      return ageQuestions;
    case "family-caregiving":
      return familyCaregivingQuestions;
    case "health-disability":
      return healthDisabilityQuestions;
    case "program-participation":
      return programParticipationQuestions;
    case "other":
      return otherExemptionsQuestions;
  }
}

// Get question by ID
export function getQuestionById(id: string): ExemptionQuestion | undefined {
  return allQuestions.find((q) => q.id === id);
}

// Get category order for screening flow
export const categoryOrder: ExemptionCategory[] = [
  "age",
  "family-caregiving",
  "health-disability",
  "program-participation",
  "other",
];
