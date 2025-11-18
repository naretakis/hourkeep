// How to HourKeep Assessment Types

import { ExemptionResponses } from "./exemptions";

/**
 * Compliance method options
 */
export type ComplianceMethod =
  | "exemption"
  | "income-tracking"
  | "seasonal-income-tracking"
  | "hour-tracking";

/**
 * Pay frequency options for work situation
 */
export type PayFrequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "varies"
  | "not-sure";

/**
 * Complete assessment responses including exemption and work situation
 */
export interface AssessmentResponses {
  // Notice question
  receivedAgencyNotice?: boolean;
  skipToWorkQuestions?: boolean; // User choice after notice

  // Notice context (NEW)
  noticeContext?: {
    monthsRequired?: number;
    deadline?: Date;
  };

  // Exemption responses (reusing existing type)
  exemption: ExemptionResponses;

  // Work situation
  hasJob?: boolean;
  paymentFrequency?: PayFrequency;
  monthlyIncome?: number;
  monthlyWorkHours?: number;
  isSeasonalWork?: boolean;

  // Other activities
  otherActivities?: {
    volunteer?: boolean;
    school?: boolean;
    workProgram?: boolean;
  };
  volunteerHoursPerMonth?: number;
  schoolHoursPerMonth?: number;
  workProgramHoursPerMonth?: number;
}

/**
 * Recommendation result from assessment
 */
export interface Recommendation {
  primaryMethod: ComplianceMethod;
  reasoning: string;
  alternativeMethods: ComplianceMethod[];
  complianceStatus: "compliant" | "needs-increase" | "unknown";
  estimatedEffort: "low" | "medium" | "high";
}

/**
 * In-progress assessment state
 */
export interface AssessmentProgress {
  id?: number;
  userId: string;
  startedAt: Date;
  lastUpdatedAt: Date;
  currentStep: number;
  responses: Partial<AssessmentResponses>;
  isComplete: boolean;
}

/**
 * Completed assessment result
 */
export interface AssessmentResult {
  id?: number;
  userId: string;
  completedAt: Date;
  responses: AssessmentResponses;
  recommendation: Recommendation;
  version: number; // Logic version for future updates
}

/**
 * Historical assessment entry (simplified)
 */
export interface AssessmentHistoryEntry {
  id?: number;
  userId: string;
  completedAt: Date;
  exemptionStatus: boolean;
  recommendedMethod: ComplianceMethod;
}
