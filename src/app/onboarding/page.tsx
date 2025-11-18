"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { UserProfile, OnboardingContext } from "@/types";
import {
  AssessmentResponses,
  PayFrequency,
  Recommendation,
} from "@/types/assessment";
import { ExemptionResponses } from "@/types/exemptions";
import { saveProfile } from "@/lib/storage/profile";
import { PrivacyNotice } from "@/components/onboarding/PrivacyNotice";
import { ProfileForm } from "@/components/onboarding/ProfileForm";
import {
  NoticeQuestion,
  NoticeFollowUp,
  NoticeFollowUpWithNotice,
} from "@/components/assessment/NoticeQuestion";
import { NoticeDetailsQuestion } from "@/components/onboarding/NoticeDetailsQuestion";
import { GettingStartedContextual } from "@/components/onboarding/GettingStartedContextual";
import { ProgressIndicator } from "@/components/assessment/ProgressIndicator";
import { ExemptionQuestion as ExemptionQuestionComponent } from "@/components/exemptions/ExemptionQuestion";
import { SingleChoiceQuestion } from "@/components/assessment/SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "@/components/assessment/MultipleChoiceQuestion";
import { NumberInputQuestion } from "@/components/assessment/NumberInputQuestion";
import {
  HoursConverter,
  IncomeConverter,
} from "@/components/assessment/EstimationTools";
import { allQuestions as exemptionQuestions } from "@/lib/exemptions/questions";
import { calculateExemption } from "@/lib/exemptions/calculator";
import { calculateRecommendation } from "@/lib/assessment/recommendationEngine";
import { saveAssessmentResult } from "@/lib/storage/assessment";
import {
  setComplianceMode,
  setSeasonalWorkerStatus,
} from "@/lib/storage/income";
import { format } from "date-fns";

type OnboardingStep =
  | "privacy"
  | "profile"
  | "notice"
  | "noticeFollowUp"
  | "noticeFollowUpWithNotice"
  | "noticeDetails"
  | "exemption"
  | "work-job"
  | "work-seasonal"
  | "work-frequency"
  | "work-income"
  | "work-income-seasonal"
  | "work-hours"
  | "activities"
  | "activities-volunteer"
  | "activities-school"
  | "activities-workprogram"
  | "gettingStarted";

interface OnboardingState {
  hasNotice: boolean;
  monthsRequired?: number;
  deadline?: string;
  skipExemption?: boolean;
  assessmentResponses: Partial<AssessmentResponses>;
  recommendation?: Recommendation;
  exemptionQuestionIndex: number;
  jobStatus?: "yes" | "no" | "sometimes";
  seasonalStatus?: "yes" | "no" | "not-sure";
  sixMonthTotal?: number;
  profileData?: {
    profileId: string;
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">;
    createdAt: Date;
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("privacy");
  const [stepHistory, setStepHistory] = useState<OnboardingStep[]>([]);
  const [privacyAcknowledgedAt, setPrivacyAcknowledgedAt] =
    useState<Date | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    hasNotice: false,
    assessmentResponses: { exemption: {} },
    exemptionQuestionIndex: 0,
  });

  // Navigation helpers
  const advanceStep = (nextStep: OnboardingStep) => {
    setStepHistory([...stepHistory, step]);
    setStep(nextStep);
  };

  const handleBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setStepHistory(stepHistory.slice(0, -1));
      setStep(previousStep);
    }
  };

  // Handle privacy acknowledgment
  const handlePrivacyAcknowledge = () => {
    const now = new Date();
    setPrivacyAcknowledgedAt(now);
    advanceStep("profile");
  };

  // Handle skip from profile (save and go straight to dashboard)
  const handleSkipToTracking = async (
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const now = new Date();
      const profileId = crypto.randomUUID();

      const fullProfile: UserProfile = {
        id: profileId,
        ...profile,
        createdAt: now,
        updatedAt: now,
      };

      await saveProfile(fullProfile);

      setRedirecting(true);
      router.push("/tracking");
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  // Handle notice question
  const handleNoticeAnswer = (receivedNotice: boolean) => {
    setOnboardingState((prev) => ({
      ...prev,
      hasNotice: receivedNotice,
      assessmentResponses: {
        ...prev.assessmentResponses,
        receivedAgencyNotice: receivedNotice,
      },
    }));

    if (receivedNotice) {
      // User has a notice, ask for details then offer exemption check
      advanceStep("noticeDetails");
    } else {
      // No notice, offer exemption check
      advanceStep("noticeFollowUp");
    }
  };

  // Handle notice follow-up (check exemption or skip)
  const handleNoticeFollowUp = (checkExemption: boolean) => {
    setOnboardingState((prev) => ({ ...prev, skipExemption: !checkExemption }));

    if (checkExemption) {
      advanceStep("exemption");
    } else {
      advanceStep("work-job");
    }
  };

  // Handle notice details
  const handleNoticeDetailsComplete = () => {
    // After notice details, offer exemption check (with notice version)
    advanceStep("noticeFollowUpWithNotice");
  };

  const handleMonthsChange = (months: number) => {
    setOnboardingState((prev) => ({ ...prev, monthsRequired: months }));
  };

  const handleDeadlineChange = (deadline: string) => {
    setOnboardingState((prev) => ({ ...prev, deadline }));
  };

  // Handle exemption questions
  const handleExemptionAnswer = (
    questionId: string,
    answer: boolean | Date,
  ) => {
    const updatedExemption = {
      ...onboardingState.assessmentResponses.exemption,
    };

    // Map answer to exemption responses
    switch (questionId) {
      case "age-dob":
        updatedExemption.dateOfBirth = answer as Date;
        break;
      case "family-pregnant":
        updatedExemption.isPregnantOrPostpartum = answer as boolean;
        break;
      case "family-child":
        updatedExemption.hasDependentChild13OrYounger = answer as boolean;
        break;
      case "family-disabled-dependent":
        updatedExemption.isParentGuardianOfDisabled = answer as boolean;
        break;
      case "health-medicare":
        updatedExemption.isOnMedicare = answer as boolean;
        break;
      case "health-non-magi":
        updatedExemption.isEligibleForNonMAGI = answer as boolean;
        break;
      case "health-disabled-veteran":
        updatedExemption.isDisabledVeteran = answer as boolean;
        break;
      case "health-medically-frail":
        updatedExemption.isMedicallyFrail = answer as boolean;
        break;
      case "program-snap-tanf":
        updatedExemption.isOnSNAPOrTANFMeetingRequirements = answer as boolean;
        break;
      case "program-rehab":
        updatedExemption.isInRehabProgram = answer as boolean;
        break;
      case "other-incarcerated":
        updatedExemption.isIncarceratedOrRecentlyReleased = answer as boolean;
        break;
      case "other-tribal":
        updatedExemption.hasTribalStatus = answer as boolean;
        break;
    }

    setOnboardingState((prev) => ({
      ...prev,
      assessmentResponses: {
        ...prev.assessmentResponses,
        exemption: updatedExemption,
      },
    }));
  };

  const handleExemptionContinue = async () => {
    const { exemptionQuestionIndex, assessmentResponses } = onboardingState;

    // Check if exempt based on questions answered so far
    const exemptionResult = calculateExemption(
      assessmentResponses.exemption as ExemptionResponses,
    );

    if (exemptionResult.isExempt) {
      // User is exempt, generate recommendation and save
      const recommendation = calculateRecommendation(
        assessmentResponses as AssessmentResponses,
      );
      setOnboardingState((prev) => ({ ...prev, recommendation }));
      await saveProfileAndAssessment(recommendation);
      return;
    }

    // Move to next exemption question or work questions
    if (exemptionQuestionIndex < exemptionQuestions.length - 1) {
      setOnboardingState((prev) => ({
        ...prev,
        exemptionQuestionIndex: exemptionQuestionIndex + 1,
      }));
    } else {
      advanceStep("work-job");
    }
  };

  const handleExemptionBack = () => {
    if (onboardingState.exemptionQuestionIndex > 0) {
      setOnboardingState((prev) => ({
        ...prev,
        exemptionQuestionIndex: prev.exemptionQuestionIndex - 1,
      }));
    } else {
      handleBack();
    }
  };

  // Complete assessment and generate recommendation
  const completeAssessment = async () => {
    const finalResponses =
      onboardingState.assessmentResponses as AssessmentResponses;
    const recommendation = calculateRecommendation(finalResponses);
    setOnboardingState((prev) => ({ ...prev, recommendation }));

    // Save profile and assessment, then go to getting started
    await saveProfileAndAssessment(recommendation);
  };

  // Handle profile save (start assessment)
  const handleProfileSave = async (
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const now = new Date();
      const profileId = crypto.randomUUID();

      // Store profile data temporarily (we'll save it after assessment)
      const profileData = { profileId, profile, createdAt: now };

      setOnboardingState((prev) => ({
        ...prev,
        profileData,
      }));

      // Pre-fill date of birth in exemption responses if provided
      if (profile.dateOfBirth) {
        const dob = new Date(profile.dateOfBirth);
        setOnboardingState((prev) => ({
          ...prev,
          assessmentResponses: {
            ...prev.assessmentResponses,
            exemption: {
              ...prev.assessmentResponses.exemption,
              dateOfBirth: dob,
            },
          },
        }));
      }

      // Move to notice question to start assessment
      advanceStep("notice");
    } catch (error) {
      console.error("Error processing profile:", error);
      throw error;
    }
  };

  // Save profile and assessment at the end
  const saveProfileAndAssessment = async (recommendation?: Recommendation) => {
    try {
      if (!onboardingState.profileData) {
        throw new Error("Profile data not found");
      }

      const { profileId, profile, createdAt } = onboardingState.profileData;
      const now = new Date();

      // Build onboarding context
      const onboardingContext: OnboardingContext = {
        hasNotice: onboardingState.hasNotice,
        monthsRequired: onboardingState.monthsRequired,
        deadline: onboardingState.deadline
          ? new Date(onboardingState.deadline)
          : undefined,
        completedAt: now,
      };

      const fullProfile: UserProfile = {
        id: profileId,
        ...profile,
        onboardingContext,
        createdAt,
        updatedAt: now,
      };

      await saveProfile(fullProfile);

      // Save assessment result if we have one (use passed recommendation or state)
      const finalRecommendation =
        recommendation || onboardingState.recommendation;
      if (finalRecommendation) {
        const finalResponses =
          onboardingState.assessmentResponses as AssessmentResponses;
        await saveAssessmentResult(
          profileId,
          finalResponses,
          finalRecommendation,
        );

        console.log("Assessment saved successfully:", {
          profileId,
          recommendation: finalRecommendation,
        });

        // Dispatch event to notify dashboard of assessment completion
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("assessment-completed"));
        }

        // Configure dashboard based on recommendation
        const currentMonth = format(new Date(), "yyyy-MM");
        const { primaryMethod } = finalRecommendation;

        if (primaryMethod === "income-tracking") {
          await setComplianceMode(profileId, currentMonth, "income");
          await setSeasonalWorkerStatus(profileId, currentMonth, false);
        } else if (primaryMethod === "seasonal-income-tracking") {
          await setComplianceMode(profileId, currentMonth, "income");
          await setSeasonalWorkerStatus(profileId, currentMonth, true);
        } else if (primaryMethod === "hour-tracking") {
          await setComplianceMode(profileId, currentMonth, "hours");
        }
      } else {
        console.warn("No recommendation found to save");
      }

      // Move to getting started screen
      advanceStep("gettingStarted");
    } catch (error) {
      console.error("Error saving profile and assessment:", error);
      throw error;
    }
  };

  // Handle getting started completion
  const handleStartTracking = () => {
    setRedirecting(true);
    router.push("/tracking");
  };

  // Calculate progress percentage based on current step
  const getProgressPercentage = (): number => {
    // Privacy and profile are setup (0-15%)
    if (step === "privacy") return 0;
    if (step === "profile") return 10;

    // Notice questions (15-25%)
    if (step === "notice") return 15;
    if (step === "noticeDetails") return 20;
    if (step === "noticeFollowUp" || step === "noticeFollowUpWithNotice")
      return 25;

    // Exemption questions (25-60%)
    if (step === "exemption") {
      const exemptionProgress =
        (onboardingState.exemptionQuestionIndex / 12) * 35;
      return 25 + exemptionProgress;
    }

    // Work and activities questions (60-95%)
    const workSteps = [
      "work-job",
      "work-seasonal",
      "work-frequency",
      "work-income",
      "work-income-seasonal",
      "work-hours",
      "activities",
      "activities-volunteer",
      "activities-school",
      "activities-workprogram",
    ];
    const workIndex = workSteps.indexOf(step);
    if (workIndex >= 0) {
      const workProgress = (workIndex / workSteps.length) * 35;
      return 60 + workProgress;
    }

    // Getting started (95%)
    if (step === "gettingStarted") return 95;

    return 0;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          {/* Progress indicator (show after profile step) */}
          {!redirecting && step !== "privacy" && step !== "profile" && (
            <Box sx={{ mb: 3 }}>
              <ProgressIndicator
                currentStep={getProgressPercentage()}
                totalSteps={100}
              />
            </Box>
          )}

          {redirecting ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress size={48} />
              <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                Setting up your profile...
              </Box>
            </Box>
          ) : (
            <>
              {step === "privacy" && (
                <PrivacyNotice onAcknowledge={handlePrivacyAcknowledge} />
              )}

              {step === "profile" && privacyAcknowledgedAt && (
                <ProfileForm
                  onSave={handleProfileSave}
                  privacyAcknowledgedAt={privacyAcknowledgedAt}
                  showDeadlineField={false}
                  showIntroduction={true}
                  onSkip={handleSkipToTracking}
                />
              )}

              {step === "notice" && (
                <NoticeQuestion
                  onAnswer={handleNoticeAnswer}
                  onBack={handleBack}
                />
              )}

              {step === "noticeDetails" && (
                <NoticeDetailsQuestion
                  monthsRequired={onboardingState.monthsRequired}
                  deadline={onboardingState.deadline}
                  onMonthsChange={handleMonthsChange}
                  onDeadlineChange={handleDeadlineChange}
                  onBack={handleBack}
                  onContinue={handleNoticeDetailsComplete}
                />
              )}

              {step === "noticeFollowUp" && (
                <NoticeFollowUp
                  onCheckExemption={() => handleNoticeFollowUp(true)}
                  onSkipToWork={() => handleNoticeFollowUp(false)}
                  onBack={handleBack}
                />
              )}

              {step === "noticeFollowUpWithNotice" && (
                <NoticeFollowUpWithNotice
                  onCheckExemption={() => handleNoticeFollowUp(true)}
                  onSkipToWork={() => handleNoticeFollowUp(false)}
                  onBack={handleBack}
                />
              )}

              {step === "exemption" && (
                <ExemptionQuestionComponent
                  question={
                    exemptionQuestions[onboardingState.exemptionQuestionIndex]
                  }
                  value={(() => {
                    const questionId =
                      exemptionQuestions[onboardingState.exemptionQuestionIndex]
                        .id;
                    const exemption =
                      onboardingState.assessmentResponses.exemption;

                    switch (questionId) {
                      case "age-dob":
                        return exemption?.dateOfBirth ?? null;
                      case "family-pregnant":
                        return exemption?.isPregnantOrPostpartum ?? null;
                      case "family-child":
                        return exemption?.hasDependentChild13OrYounger ?? null;
                      case "family-disabled-dependent":
                        return exemption?.isParentGuardianOfDisabled ?? null;
                      case "health-medicare":
                        return exemption?.isOnMedicare ?? null;
                      case "health-non-magi":
                        return exemption?.isEligibleForNonMAGI ?? null;
                      case "health-disabled-veteran":
                        return exemption?.isDisabledVeteran ?? null;
                      case "health-medically-frail":
                        return exemption?.isMedicallyFrail ?? null;
                      case "program-snap-tanf":
                        return (
                          exemption?.isOnSNAPOrTANFMeetingRequirements ?? null
                        );
                      case "program-rehab":
                        return exemption?.isInRehabProgram ?? null;
                      case "other-incarcerated":
                        return (
                          exemption?.isIncarceratedOrRecentlyReleased ?? null
                        );
                      case "other-tribal":
                        return exemption?.hasTribalStatus ?? null;
                      default:
                        return null;
                    }
                  })()}
                  onChange={(answer) =>
                    handleExemptionAnswer(
                      exemptionQuestions[onboardingState.exemptionQuestionIndex]
                        .id,
                      answer as boolean | Date,
                    )
                  }
                  onNext={handleExemptionContinue}
                  onBack={
                    onboardingState.exemptionQuestionIndex > 0 ||
                    stepHistory.length > 0
                      ? handleExemptionBack
                      : undefined
                  }
                  isFirst={
                    onboardingState.exemptionQuestionIndex === 0 &&
                    stepHistory.length === 0
                  }
                />
              )}

              {step === "work-job" && (
                <SingleChoiceQuestion
                  question="Do you currently have a job?"
                  helperText="This includes full-time, part-time, gig work, or self-employment"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "sometimes", label: "Sometimes" },
                  ]}
                  value={onboardingState.jobStatus}
                  onChange={(value) => {
                    const status = value as "yes" | "no" | "sometimes";
                    setOnboardingState((prev) => ({
                      ...prev,
                      jobStatus: status,
                      assessmentResponses: {
                        ...prev.assessmentResponses,
                        hasJob: status === "yes" || status === "sometimes",
                      },
                    }));
                  }}
                  onNext={() => advanceStep("work-seasonal")}
                  onBack={handleBack}
                  isFirst={stepHistory.length === 0}
                />
              )}

              {step === "work-seasonal" && (
                <SingleChoiceQuestion
                  question="Is your work seasonal?"
                  helperText="Seasonal work means your income or hours vary significantly by season"
                  options={[
                    { value: "yes", label: "Yes, my work is seasonal" },
                    { value: "no", label: "No, it's year-round" },
                    { value: "not-sure", label: "Not sure" },
                  ]}
                  value={onboardingState.seasonalStatus}
                  onChange={(value) => {
                    const status = value as "yes" | "no" | "not-sure";
                    setOnboardingState((prev) => ({
                      ...prev,
                      seasonalStatus: status,
                      assessmentResponses: {
                        ...prev.assessmentResponses,
                        isSeasonalWork: status === "yes",
                      },
                    }));
                  }}
                  onNext={() => {
                    if (
                      !onboardingState.assessmentResponses.hasJob &&
                      !onboardingState.assessmentResponses.isSeasonalWork
                    ) {
                      advanceStep("activities");
                    } else if (
                      onboardingState.assessmentResponses.isSeasonalWork
                    ) {
                      advanceStep("work-income-seasonal");
                    } else if (onboardingState.assessmentResponses.hasJob) {
                      advanceStep("work-frequency");
                    } else {
                      advanceStep("activities");
                    }
                  }}
                  onBack={handleBack}
                />
              )}

              {step === "work-frequency" && (
                <SingleChoiceQuestion
                  question="How often do you get paid?"
                  options={[
                    { value: "weekly", label: "Weekly" },
                    { value: "biweekly", label: "Bi-weekly (every 2 weeks)" },
                    { value: "monthly", label: "Monthly" },
                    { value: "varies", label: "It varies" },
                    { value: "not-sure", label: "Not sure" },
                  ]}
                  value={onboardingState.assessmentResponses.paymentFrequency}
                  onChange={(value) => {
                    setOnboardingState((prev) => ({
                      ...prev,
                      assessmentResponses: {
                        ...prev.assessmentResponses,
                        paymentFrequency: value as PayFrequency,
                      },
                    }));
                  }}
                  onNext={() => advanceStep("work-income")}
                  onBack={handleBack}
                />
              )}

              {step === "work-income" && (
                <Box>
                  <NumberInputQuestion
                    question="About how much do you earn per month?"
                    helperText="Enter your average monthly income from work"
                    value={onboardingState.assessmentResponses.monthlyIncome}
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyIncome: value,
                        },
                      }));
                    }}
                    label="Monthly Income"
                    prefix="$"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses.monthlyIncome === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyIncome: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => advanceStep("work-hours")}
                    onBack={handleBack}
                  />
                  <IncomeConverter
                    onUseValue={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyIncome: value,
                        },
                      }));
                    }}
                  />
                </Box>
              )}

              {step === "work-income-seasonal" && (
                <Box>
                  <NumberInputQuestion
                    question="About how much have you earned in the last 6 months?"
                    helperText="Add up all your income from the past 6 months. We'll calculate your monthly average."
                    value={onboardingState.sixMonthTotal}
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        sixMonthTotal: value,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyIncome: value
                            ? Math.round(value / 6)
                            : undefined,
                        },
                      }));
                    }}
                    label="Total 6-Month Income"
                    prefix="$"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses.monthlyIncome === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        sixMonthTotal: undefined,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyIncome: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => {
                      if (onboardingState.assessmentResponses.hasJob) {
                        advanceStep("work-hours");
                      } else {
                        advanceStep("activities");
                      }
                    }}
                    onBack={handleBack}
                  />
                  {onboardingState.assessmentResponses.monthlyIncome !==
                    undefined &&
                    onboardingState.assessmentResponses.monthlyIncome > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "info.50",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "info.200",
                        }}
                      >
                        <Typography variant="body2" color="info.main">
                          <strong>Monthly average:</strong> $
                          {onboardingState.assessmentResponses.monthlyIncome}
                          /month
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Calculated: ${onboardingState.sixMonthTotal} ÷ 6
                          months
                        </Typography>
                      </Box>
                    )}
                </Box>
              )}

              {step === "work-hours" && (
                <Box>
                  <NumberInputQuestion
                    question="About how many hours per month do you work?"
                    helperText="Enter your average monthly work hours"
                    value={onboardingState.assessmentResponses.monthlyWorkHours}
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyWorkHours: value,
                        },
                      }));
                    }}
                    label="Monthly Hours"
                    suffix="hours"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses.monthlyWorkHours === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyWorkHours: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => advanceStep("activities")}
                    onBack={handleBack}
                  />
                  <HoursConverter
                    onUseValue={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          monthlyWorkHours: value,
                        },
                      }));
                    }}
                  />
                </Box>
              )}

              {step === "activities" && (
                <MultipleChoiceQuestion
                  question="Do you do any of these activities?"
                  helperText="Select all that apply"
                  options={[
                    { value: "volunteer", label: "Volunteer work" },
                    { value: "school", label: "Attending school" },
                    { value: "workProgram", label: "Work program" },
                  ]}
                  values={
                    onboardingState.assessmentResponses.otherActivities || {}
                  }
                  onChange={(value, checked) => {
                    setOnboardingState((prev) => ({
                      ...prev,
                      assessmentResponses: {
                        ...prev.assessmentResponses,
                        otherActivities: {
                          ...prev.assessmentResponses.otherActivities,
                          [value]: checked,
                        },
                      },
                    }));
                  }}
                  onNext={() => {
                    const hasActivities = Object.values(
                      onboardingState.assessmentResponses.otherActivities || {},
                    ).some((v) => v === true);
                    if (hasActivities) {
                      if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.volunteer
                      ) {
                        advanceStep("activities-volunteer");
                      } else if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.school
                      ) {
                        advanceStep("activities-school");
                      } else if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.workProgram
                      ) {
                        advanceStep("activities-workprogram");
                      }
                    } else {
                      completeAssessment();
                    }
                  }}
                  onBack={handleBack}
                />
              )}

              {step === "activities-volunteer" && (
                <Box>
                  <NumberInputQuestion
                    question="How many hours per month do you volunteer?"
                    value={
                      onboardingState.assessmentResponses.volunteerHoursPerMonth
                    }
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          volunteerHoursPerMonth: value,
                        },
                      }));
                    }}
                    label="Monthly Volunteer Hours"
                    suffix="hours"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses
                        .volunteerHoursPerMonth === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          volunteerHoursPerMonth: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => {
                      if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.school
                      ) {
                        advanceStep("activities-school");
                      } else if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.workProgram
                      ) {
                        advanceStep("activities-workprogram");
                      } else {
                        completeAssessment();
                      }
                    }}
                    onBack={handleBack}
                  />
                  <HoursConverter
                    onUseValue={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          volunteerHoursPerMonth: value,
                        },
                      }));
                    }}
                  />
                </Box>
              )}

              {step === "activities-school" && (
                <Box>
                  <NumberInputQuestion
                    question="How many hours per month do you attend school?"
                    value={
                      onboardingState.assessmentResponses.schoolHoursPerMonth
                    }
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          schoolHoursPerMonth: value,
                        },
                      }));
                    }}
                    label="Monthly School Hours"
                    suffix="hours"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses
                        .schoolHoursPerMonth === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          schoolHoursPerMonth: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => {
                      if (
                        onboardingState.assessmentResponses.otherActivities
                          ?.workProgram
                      ) {
                        advanceStep("activities-workprogram");
                      } else {
                        completeAssessment();
                      }
                    }}
                    onBack={handleBack}
                  />
                  <HoursConverter
                    onUseValue={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          schoolHoursPerMonth: value,
                        },
                      }));
                    }}
                  />
                </Box>
              )}

              {step === "activities-workprogram" && (
                <Box>
                  <NumberInputQuestion
                    question="How many hours per month do you participate in work programs?"
                    value={
                      onboardingState.assessmentResponses
                        .workProgramHoursPerMonth
                    }
                    onChange={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          workProgramHoursPerMonth: value,
                        },
                      }));
                    }}
                    label="Monthly Work Program Hours"
                    suffix="hours"
                    min={0}
                    step={1}
                    allowNotSure={true}
                    notSureChecked={
                      onboardingState.assessmentResponses
                        .workProgramHoursPerMonth === 0
                    }
                    onNotSureChange={(checked) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          workProgramHoursPerMonth: checked ? 0 : undefined,
                        },
                      }));
                    }}
                    onNext={() => completeAssessment()}
                    onBack={handleBack}
                  />
                  <HoursConverter
                    onUseValue={(value) => {
                      setOnboardingState((prev) => ({
                        ...prev,
                        assessmentResponses: {
                          ...prev.assessmentResponses,
                          workProgramHoursPerMonth: value,
                        },
                      }));
                    }}
                  />
                </Box>
              )}

              {step === "gettingStarted" && (
                <GettingStartedContextual
                  hasNotice={onboardingState.hasNotice}
                  monthsRequired={onboardingState.monthsRequired}
                  deadline={
                    onboardingState.deadline
                      ? new Date(onboardingState.deadline)
                      : undefined
                  }
                  recommendation={onboardingState.recommendation}
                  onStartTracking={handleStartTracking}
                />
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
