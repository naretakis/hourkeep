import { ExemptionResponses, ExemptionResult } from "@/types/exemptions";

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Calculate exemption status based on user responses
 * Follows HR1 Section 71119 exemption criteria
 */
export function calculateExemption(
  responses: ExemptionResponses,
): ExemptionResult {
  // 1. Check age-based exemptions
  if (responses.dateOfBirth) {
    const age = calculateAge(responses.dateOfBirth);

    if (age <= 18) {
      return {
        isExempt: true,
        exemptionCategory: "age",
        exemptionReason: "18 years old or younger",
        explanation:
          "You're exempt from work requirements because you're 18 or younger.",
        nextSteps:
          "You don't need to track hours. You can still use this app if you want to track your activities.",
      };
    }

    if (age >= 65) {
      return {
        isExempt: true,
        exemptionCategory: "age",
        exemptionReason: "65 years old or older",
        explanation:
          "You're exempt from work requirements because you're 65 or older.",
        nextSteps:
          "You don't need to track hours. You can still use this app if you want to track your activities.",
      };
    }
  }

  // 2. Check family/caregiving exemptions
  if (responses.isPregnantOrPostpartum) {
    return {
      isExempt: true,
      exemptionCategory: "family-caregiving",
      exemptionReason: "Pregnant or recently gave birth",
      explanation:
        "You're exempt from work requirements because you're pregnant or recently gave birth.",
      nextSteps:
        "You don't need to track hours right now. You may need to check again after 60 days from giving birth.",
    };
  }

  if (responses.hasDependentChild13OrYounger) {
    return {
      isExempt: true,
      exemptionCategory: "family-caregiving",
      exemptionReason: "Has dependent child 13 or younger",
      explanation:
        "You're exempt from work requirements because you live with a child age 13 or younger.",
      nextSteps:
        "You don't need to track hours. If your child turns 14 or your living situation changes, check again.",
    };
  }

  if (responses.isParentGuardianOfDisabled) {
    return {
      isExempt: true,
      exemptionCategory: "family-caregiving",
      exemptionReason: "Parent or guardian of someone with a disability",
      explanation:
        "You are exempt from work requirements because you are a parent or guardian of someone with a disability.",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  // 3. Check health/disability exemptions
  if (responses.isOnMedicare) {
    return {
      isExempt: true,
      exemptionCategory: "health-disability",
      exemptionReason: "Has Medicare",
      explanation:
        "You're exempt from work requirements because you have Medicare.",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  if (responses.isEligibleForNonMAGI) {
    return {
      isExempt: true,
      exemptionCategory: "health-disability",
      exemptionReason:
        "Gets Medicaid for disability or long-term care (non-MAGI Medicaid)",
      explanation:
        "You're exempt from work requirements because you get Medicaid for a disability or long-term care needs (non-MAGI Medicaid).",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  if (responses.isDisabledVeteran) {
    return {
      isExempt: true,
      exemptionCategory: "health-disability",
      exemptionReason: "Disabled veteran",
      explanation:
        "You're exempt from work requirements because you're a veteran with a 100% disability rating from the VA.",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  if (responses.isMedicallyFrail) {
    return {
      isExempt: true,
      exemptionCategory: "health-disability",
      exemptionReason: "Has a serious health condition or disability",
      explanation:
        "You're exempt from work requirements because you have a serious health condition or disability (defined as medically frail or special needs).",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  // 4. Check program participation exemptions
  if (responses.isOnSNAPOrTANFMeetingRequirements) {
    return {
      isExempt: true,
      exemptionCategory: "program-participation",
      exemptionReason:
        "Meeting work requirements for food stamps (SNAP) or cash assistance (TANF)",
      explanation:
        "You're exempt from Medicaid work requirements because you're already meeting work requirements for food stamps (SNAP) or cash assistance (TANF).",
      nextSteps:
        "You don't need to track hours for Medicaid. Keep meeting your food stamps or cash assistance requirements.",
    };
  }

  if (responses.isInRehabProgram) {
    return {
      isExempt: true,
      exemptionCategory: "program-participation",
      exemptionReason: "In drug or alcohol treatment program",
      explanation:
        "You're exempt from work requirements because you're in a drug or alcohol treatment program.",
      nextSteps:
        "You don't need to track hours during treatment. Focus on your recovery.",
    };
  }

  // 5. Check other exemptions
  if (responses.isIncarceratedOrRecentlyReleased) {
    return {
      isExempt: true,
      exemptionCategory: "other",
      exemptionReason: "In jail/prison or recently released",
      explanation:
        "You're exempt from work requirements because you're currently in jail or prison, or were released in the last 3 months.",
      nextSteps:
        "You don't need to track hours during this time. You may need to check again 3 months after your release date.",
    };
  }

  if (responses.hasTribalStatus) {
    return {
      isExempt: true,
      exemptionCategory: "other",
      exemptionReason: "Native American tribal member or IHS-eligible",
      explanation:
        "You're exempt from work requirements because you're a member of a Native American tribe or eligible for Indian Health Service.",
      nextSteps:
        "You don't need to track hours. You can still use this app if you want to track your activities.",
    };
  }

  // 6. No exemptions found - must track hours
  return {
    isExempt: false,
    explanation:
      "Based on your answers, you need to meet work requirements to keep your Medicaid.",
    nextSteps:
      "You need to do 80 hours per month of work, volunteering, or school. Use this app to track your hours each month.",
  };
}
