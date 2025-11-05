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
      "If you're pregnant or gave birth within the last 60 days, you're exempt. Select 'Yes' if either applies to you.",
    required: true,
  },
  {
    id: "family-child",
    category: "family-caregiving",
    text: "Do you live with a child age 13 or younger?",
    type: "boolean",
    helpText:
      "This includes your own children, stepchildren, or children you care for. The child must live in your household.",
    required: true,
  },
  {
    id: "family-disabled-dependent",
    category: "family-caregiving",
    text: "Are you a parent or guardian of someone with a disability?",
    type: "boolean",
    helpText:
      "This includes caring for a child or adult with a disability. You must be their parent or legal guardian.",
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
      "Medicare is federal health insurance, usually for people 65+ or with certain disabilities. This is different from Medicaid.",
    required: true,
  },
  {
    id: "health-non-magi",
    category: "health-disability",
    text: "Do you get Medicaid because of a disability or long-term care needs (non-MAGI Medicaid)?",
    type: "boolean",
    helpText:
      "This is a special type of Medicaid for people with disabilities or in nursing homes. If you're not sure, select 'No'.",
    required: true,
  },
  {
    id: "health-disabled-veteran",
    category: "health-disability",
    text: "Are you a veteran with a 100% disability rating from the VA?",
    type: "boolean",
    helpText:
      "This means the VA determined you have a total (100%) service-connected disability. If you're not sure of your rating, select 'No'.",
    required: true,
  },
  {
    id: "health-medically-frail",
    category: "health-disability",
    text: "Do you have a serious health condition or disability (defined as medically frail or special needs)?",
    type: "boolean",
    helpText:
      "This includes being blind, disabled, having substance use disorder, mental health conditions, or chronic illnesses. Check the definitions below for detailed examples.",
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
      "Important: You must be actively meeting their work requirements (not exempt from them). If you're exempt from SNAP/TANF work requirements, select 'No'.",
    required: true,
  },
  {
    id: "program-rehab",
    category: "program-participation",
    text: "Are you currently in a drug or alcohol treatment program?",
    type: "boolean",
    helpText:
      "This includes inpatient programs (where you stay at a facility) or outpatient programs (where you go for treatment but live at home).",
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
      "Select 'Yes' if you're currently incarcerated or if you were released within the last 3 months. After 3 months, you'll need to re-screen.",
    required: true,
  },
  {
    id: "other-tribal",
    category: "other",
    text: "Are you a member of a Native American tribe or eligible for Indian Health Service?",
    type: "boolean",
    helpText:
      "This includes being enrolled in a federally recognized tribe, being an Urban Indian, California Indian, or eligible for IHS services.",
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
