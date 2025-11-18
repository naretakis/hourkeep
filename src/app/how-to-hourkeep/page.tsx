"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { db } from "@/lib/db";
import { getProfile } from "@/lib/storage/profile";
import { IntroductionScreen } from "@/components/assessment/IntroductionScreen";
import { ProgressIndicator } from "@/components/assessment/ProgressIndicator";
import {
  NoticeQuestion,
  NoticeFollowUp,
  NoticeFollowUpWithNotice,
} from "@/components/assessment/NoticeQuestion";
import { NoticeDetailsQuestion } from "@/components/onboarding/NoticeDetailsQuestion";
import { GettingStartedContextual } from "@/components/onboarding/GettingStartedContextual";
import { ExemptionQuestion as ExemptionQuestionComponent } from "@/components/exemptions/ExemptionQuestion";
import { SingleChoiceQuestion } from "@/components/assessment/SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "@/components/assessment/MultipleChoiceQuestion";
import { NumberInputQuestion } from "@/components/assessment/NumberInputQuestion";
import {
  HoursConverter,
  IncomeConverter,
} from "@/components/assessment/EstimationTools";
import {
  AssessmentResponses,
  PayFrequency,
  Recommendation,
} from "@/types/assessment";
import { ExemptionResponses } from "@/types/exemptions";
import { allQuestions as exemptionQuestions } from "@/lib/exemptions/questions";
import { calculateExemption } from "@/lib/exemptions/calculator";
import { calculateRecommendation } from "@/lib/assessment/recommendationEngine";
import {
  saveAssessmentProgress,
  getAssessmentProgress,
  saveAssessmentResult,
  completeAssessmentProgress,
  getLatestAssessmentResult,
} from "@/lib/storage/assessment";
import {
  setComplianceMode,
  setSeasonalWorkerStatus,
} from "@/lib/storage/income";
import { updateProfile } from "@/lib/storage/profile";
import { format } from "date-fns";
import { OnboardingContext } from "@/types";

type AssessmentStep =
  | "intro"
  | "notice"
  | "noticeDetails"
  | "notice-followup"
  | "noticeFollowUpWithNotice"
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
  | "gettingStarted"
  | "results";

export default function HowToHourKeepPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<AssessmentStep>("intro");
  const [stepHistory, setStepHistory] = useState<AssessmentStep[]>([]);
  const [responses, setResponses] = useState<Partial<AssessmentResponses>>({
    exemption: {},
  });
  const [exemptionQuestionIndex, setExemptionQuestionIndex] = useState(0);
  const [sixMonthTotal, setSixMonthTotal] = useState<number | undefined>(
    undefined,
  );
  const [jobStatus, setJobStatus] = useState<
    "yes" | "no" | "sometimes" | undefined
  >(undefined);
  const [seasonalStatus, setSeasonalStatus] = useState<
    "yes" | "no" | "not-sure" | undefined
  >(undefined);
  const [hasNotice, setHasNotice] = useState(false);
  const [monthsRequired, setMonthsRequired] = useState<number | undefined>(
    undefined,
  );
  const [deadline, setDeadline] = useState<string | undefined>(undefined);
  const [recommendation, setRecommendation] = useState<
    Recommendation | undefined
  >(undefined);

  // Load user and any existing progress
  useEffect(() => {
    const loadData = async () => {
      try {
        const profiles = await db.profiles.toArray();
        if (profiles.length === 0) {
          router.push("/onboarding");
          return;
        }

        const profileId = profiles[0].id;
        setUserId(profileId);

        // Get decrypted profile to access date of birth
        const profile = await getProfile(profileId);

        // Initialize responses with date of birth from profile if available
        const initialResponses: Partial<AssessmentResponses> = {
          exemption: {},
        };

        if (profile?.dateOfBirth) {
          try {
            // Convert the ISO string to a Date object
            const dob = new Date(profile.dateOfBirth);
            if (!isNaN(dob.getTime())) {
              initialResponses.exemption = {
                dateOfBirth: dob,
              };
            }
          } catch (error) {
            console.error("Error parsing date of birth:", error);
          }
        }

        // Check for existing in-progress assessment
        const progress = await getAssessmentProgress(profileId);

        // Check for previous completed assessment to pre-populate
        const latestResult = await getLatestAssessmentResult(profileId);

        if (progress) {
          // Resume from saved progress, but preserve pre-filled DOB if not already set
          setResponses({
            ...initialResponses,
            ...progress.responses,
            exemption: {
              ...initialResponses.exemption,
              ...progress.responses.exemption,
            },
          });
        } else if (latestResult) {
          // Pre-populate from latest completed assessment
          setResponses({
            ...initialResponses,
            ...latestResult.responses,
            exemption: {
              ...initialResponses.exemption,
              ...latestResult.responses.exemption,
            },
          });

          // Also pre-populate derived state for UI
          if (latestResult.responses.hasJob !== undefined) {
            const hasJob = latestResult.responses.hasJob;
            setJobStatus(hasJob ? "yes" : "no");
          }

          if (latestResult.responses.isSeasonalWork !== undefined) {
            setSeasonalStatus(
              latestResult.responses.isSeasonalWork ? "yes" : "no",
            );
          }

          // Pre-populate six month total if it was a seasonal worker
          if (
            latestResult.responses.isSeasonalWork &&
            latestResult.responses.monthlyIncome
          ) {
            setSixMonthTotal(latestResult.responses.monthlyIncome * 6);
          }

          // Pre-populate notice context if available
          if (latestResult.responses.noticeContext) {
            setHasNotice(true);
            setMonthsRequired(
              latestResult.responses.noticeContext.monthsRequired,
            );
            if (latestResult.responses.noticeContext.deadline) {
              setDeadline(
                latestResult.responses.noticeContext.deadline
                  .toISOString()
                  .split("T")[0],
              );
            }
          }
        } else {
          // Start fresh with pre-filled DOB
          setResponses(initialResponses);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading assessment data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const getStepNumber = useCallback((): number => {
    // Simplified progress calculation based on major sections
    // This provides a smoother, more predictable progress experience

    let progress = 0;

    // Section 1: Initial questions (15-25%)
    if (currentStep === "notice") progress = 15;
    else if (currentStep === "noticeDetails") progress = 20;
    else if (currentStep === "noticeFollowUpWithNotice") progress = 25;
    else if (currentStep === "notice-followup") progress = 25;
    // Section 2: Exemption questions (25-60%)
    else if (currentStep === "exemption") {
      // 12 exemption questions spanning 35% of progress
      const exemptionProgress = (exemptionQuestionIndex / 12) * 35;
      progress = 25 + exemptionProgress;
    }

    // Section 3: Work/Path questions (60-95%)
    else if (
      currentStep.startsWith("work") ||
      currentStep.startsWith("activities")
    ) {
      // Estimate based on step history after exemptions
      const workSteps = stepHistory.filter(
        (s) => s.startsWith("work") || s.startsWith("activities"),
      ).length;
      progress = 60 + Math.min(workSteps * 5, 35);
    }

    // Getting Started (95%)
    else if (currentStep === "gettingStarted") progress = 95;

    return progress;
  }, [currentStep, exemptionQuestionIndex, stepHistory]);

  // Auto-save progress
  useEffect(() => {
    if (
      !userId ||
      currentStep === "intro" ||
      currentStep === "results" ||
      currentStep === "gettingStarted"
    )
      return;

    const saveProgress = async () => {
      try {
        const stepNumber = getStepNumber();
        await saveAssessmentProgress(userId, stepNumber, responses);
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    };

    saveProgress();
  }, [
    userId,
    currentStep,
    responses,
    stepHistory,
    exemptionQuestionIndex,
    getStepNumber,
  ]);

  const getTotalSteps = (): number => {
    // Return 100 since we're now using percentage-based progress
    return 100;
  };

  const handleBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setStepHistory(stepHistory.slice(0, -1));
      setCurrentStep(previousStep);
    }
  };

  const advanceStep = (nextStep: AssessmentStep) => {
    setStepHistory([...stepHistory, currentStep]);
    setCurrentStep(nextStep);
  };

  const handleIntroGetStarted = () => {
    advanceStep("notice");
  };

  const handleIntroSkip = () => {
    router.push("/tracking");
  };

  const handleNoticeAnswer = (receivedNotice: boolean) => {
    setHasNotice(receivedNotice);
    setResponses({
      ...responses,
      receivedAgencyNotice: receivedNotice,
    });

    if (receivedNotice) {
      advanceStep("noticeDetails");
    } else {
      advanceStep("notice-followup");
    }
  };

  const handleNoticeDetailsComplete = () => {
    advanceStep("noticeFollowUpWithNotice");
  };

  const handleMonthsChange = (months: number) => {
    setMonthsRequired(months);
  };

  const handleDeadlineChange = (deadlineValue: string) => {
    setDeadline(deadlineValue);
  };

  const handleNoticeFollowUp = (checkExemption: boolean) => {
    if (checkExemption) {
      advanceStep("exemption");
    } else {
      advanceStep("work-job");
    }
  };

  const handleExemptionAnswer = (
    questionId: string,
    answer: boolean | Date,
  ) => {
    const updatedExemption = {
      ...responses.exemption,
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

    setResponses({
      ...responses,
      exemption: updatedExemption,
    });
  };

  const handleExemptionBack = () => {
    if (exemptionQuestionIndex > 0) {
      // Go back to previous exemption question
      setExemptionQuestionIndex(exemptionQuestionIndex - 1);
    } else {
      // Go back to previous step (before exemptions)
      handleBack();
    }
  };

  const handleExemptionContinue = () => {
    if (!responses.exemption) return;

    // Only check exemption status based on questions answered so far
    // Create a partial exemption object with only the questions up to current index
    const answeredQuestions: Partial<ExemptionResponses> = {};

    for (let i = 0; i <= exemptionQuestionIndex; i++) {
      const questionId = exemptionQuestions[i].id;

      // Map question IDs to exemption response properties
      switch (questionId) {
        case "age-dob":
          if (responses.exemption.dateOfBirth) {
            answeredQuestions.dateOfBirth = responses.exemption.dateOfBirth;
          }
          break;
        case "family-pregnant":
          if (responses.exemption.isPregnantOrPostpartum !== undefined) {
            answeredQuestions.isPregnantOrPostpartum =
              responses.exemption.isPregnantOrPostpartum;
          }
          break;
        case "family-child":
          if (responses.exemption.hasDependentChild13OrYounger !== undefined) {
            answeredQuestions.hasDependentChild13OrYounger =
              responses.exemption.hasDependentChild13OrYounger;
          }
          break;
        case "family-disabled-dependent":
          if (responses.exemption.isParentGuardianOfDisabled !== undefined) {
            answeredQuestions.isParentGuardianOfDisabled =
              responses.exemption.isParentGuardianOfDisabled;
          }
          break;
        case "health-medicare":
          if (responses.exemption.isOnMedicare !== undefined) {
            answeredQuestions.isOnMedicare = responses.exemption.isOnMedicare;
          }
          break;
        case "health-non-magi":
          if (responses.exemption.isEligibleForNonMAGI !== undefined) {
            answeredQuestions.isEligibleForNonMAGI =
              responses.exemption.isEligibleForNonMAGI;
          }
          break;
        case "health-disabled-veteran":
          if (responses.exemption.isDisabledVeteran !== undefined) {
            answeredQuestions.isDisabledVeteran =
              responses.exemption.isDisabledVeteran;
          }
          break;
        case "health-medically-frail":
          if (responses.exemption.isMedicallyFrail !== undefined) {
            answeredQuestions.isMedicallyFrail =
              responses.exemption.isMedicallyFrail;
          }
          break;
        case "program-snap-tanf":
          if (
            responses.exemption.isOnSNAPOrTANFMeetingRequirements !== undefined
          ) {
            answeredQuestions.isOnSNAPOrTANFMeetingRequirements =
              responses.exemption.isOnSNAPOrTANFMeetingRequirements;
          }
          break;
        case "program-rehab":
          if (responses.exemption.isInRehabProgram !== undefined) {
            answeredQuestions.isInRehabProgram =
              responses.exemption.isInRehabProgram;
          }
          break;
        case "other-incarcerated":
          if (
            responses.exemption.isIncarceratedOrRecentlyReleased !== undefined
          ) {
            answeredQuestions.isIncarceratedOrRecentlyReleased =
              responses.exemption.isIncarceratedOrRecentlyReleased;
          }
          break;
        case "other-tribal":
          if (responses.exemption.hasTribalStatus !== undefined) {
            answeredQuestions.hasTribalStatus =
              responses.exemption.hasTribalStatus;
          }
          break;
      }
    }

    // Check if exempt based only on questions answered so far
    const exemptionResult = calculateExemption(
      answeredQuestions as ExemptionResponses,
    );
    if (exemptionResult.isExempt) {
      // Skip to results
      completeAssessment(responses.exemption);
      return;
    }

    // Move to next exemption question or work questions
    if (exemptionQuestionIndex < exemptionQuestions.length - 1) {
      setExemptionQuestionIndex(exemptionQuestionIndex + 1);
    } else {
      advanceStep("work-job");
    }
  };

  const completeAssessment = async (exemptionResponses: ExemptionResponses) => {
    const finalResponses: AssessmentResponses = {
      ...responses,
      exemption: exemptionResponses,
      noticeContext:
        hasNotice && (monthsRequired || deadline)
          ? {
              monthsRequired,
              deadline: deadline ? new Date(deadline) : undefined,
            }
          : undefined,
    } as AssessmentResponses;

    const calculatedRecommendation = calculateRecommendation(finalResponses);
    setRecommendation(calculatedRecommendation);

    try {
      await saveAssessmentResult(
        userId,
        finalResponses,
        calculatedRecommendation,
      );

      // Clean up progress
      const progress = await getAssessmentProgress(userId);
      if (progress?.id) {
        await completeAssessmentProgress(progress.id);
      }

      // Navigate to getting started screen
      advanceStep("gettingStarted");
    } catch (error) {
      console.error("Error saving assessment result:", error);
    }
  };

  const handleStartTracking = async () => {
    if (!recommendation || !userId) {
      router.push("/tracking");
      return;
    }

    try {
      // Configure dashboard based on recommendation
      const currentMonth = format(new Date(), "yyyy-MM");
      const { primaryMethod } = recommendation;

      if (primaryMethod === "income-tracking") {
        await setComplianceMode(userId, currentMonth, "income");
        await setSeasonalWorkerStatus(userId, currentMonth, false);
      } else if (primaryMethod === "seasonal-income-tracking") {
        await setComplianceMode(userId, currentMonth, "income");
        await setSeasonalWorkerStatus(userId, currentMonth, true);
      } else if (primaryMethod === "hour-tracking") {
        await setComplianceMode(userId, currentMonth, "hours");
      }

      // Update profile's onboarding context with new notice details
      const profile = await getProfile(userId);
      if (profile) {
        // Only update onboarding context if user provided notice details
        // Otherwise, preserve existing context
        const updatedOnboardingContext: OnboardingContext = hasNotice
          ? {
              hasNotice,
              monthsRequired,
              deadline: deadline ? new Date(deadline) : undefined,
              completedAt: new Date(),
            }
          : {
              // User said no to notice, preserve existing context or set defaults
              hasNotice: false,
              monthsRequired: profile.onboardingContext?.monthsRequired,
              deadline: profile.onboardingContext?.deadline,
              completedAt: new Date(),
            };

        await updateProfile(userId, {
          onboardingContext: updatedOnboardingContext,
        });
      }

      // Dispatch event to notify dashboard of assessment completion
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("assessment-completed"));
      }

      router.push("/tracking");
    } catch (error) {
      console.error("Error configuring dashboard:", error);
      router.push("/tracking");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
        {/* Progress indicator (except on intro and results) */}
        {currentStep !== "intro" && currentStep !== "results" && (
          <ProgressIndicator
            currentStep={getStepNumber()}
            totalSteps={getTotalSteps()}
          />
        )}

        {/* Introduction */}
        {currentStep === "intro" && (
          <IntroductionScreen
            onGetStarted={handleIntroGetStarted}
            onSkip={handleIntroSkip}
          />
        )}

        {/* Notice Question */}
        {currentStep === "notice" && (
          <Box sx={{ py: 2 }}>
            <NoticeQuestion
              onAnswer={handleNoticeAnswer}
              onBack={stepHistory.length > 0 ? handleBack : undefined}
            />
          </Box>
        )}

        {/* Notice Details */}
        {currentStep === "noticeDetails" && (
          <Box sx={{ py: 2 }}>
            <NoticeDetailsQuestion
              monthsRequired={monthsRequired}
              deadline={deadline}
              onMonthsChange={handleMonthsChange}
              onDeadlineChange={handleDeadlineChange}
              onBack={handleBack}
              onContinue={handleNoticeDetailsComplete}
            />
          </Box>
        )}

        {/* Notice Follow-up With Notice */}
        {currentStep === "noticeFollowUpWithNotice" && (
          <Box sx={{ py: 2 }}>
            <NoticeFollowUpWithNotice
              onCheckExemption={() => handleNoticeFollowUp(true)}
              onSkipToWork={() => handleNoticeFollowUp(false)}
              onBack={handleBack}
            />
          </Box>
        )}

        {/* Notice Follow-up */}
        {currentStep === "notice-followup" && (
          <Box sx={{ py: 2 }}>
            <NoticeFollowUp
              onCheckExemption={() => handleNoticeFollowUp(true)}
              onSkipToWork={() => handleNoticeFollowUp(false)}
              onBack={handleBack}
            />
          </Box>
        )}

        {/* Exemption Questions */}
        {currentStep === "exemption" && (
          <Box sx={{ py: 2 }}>
            <ExemptionQuestionComponent
              question={exemptionQuestions[exemptionQuestionIndex]}
              value={(() => {
                const questionId =
                  exemptionQuestions[exemptionQuestionIndex].id;
                const exemption = responses.exemption;

                // Map question IDs to exemption response properties
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
                    return exemption?.isOnSNAPOrTANFMeetingRequirements ?? null;
                  case "program-rehab":
                    return exemption?.isInRehabProgram ?? null;
                  case "other-incarcerated":
                    return exemption?.isIncarceratedOrRecentlyReleased ?? null;
                  case "other-tribal":
                    return exemption?.hasTribalStatus ?? null;
                  default:
                    return null;
                }
              })()}
              onChange={(answer) =>
                handleExemptionAnswer(
                  exemptionQuestions[exemptionQuestionIndex].id,
                  answer as boolean | Date,
                )
              }
              onNext={handleExemptionContinue}
              onBack={
                exemptionQuestionIndex > 0 || stepHistory.length > 0
                  ? handleExemptionBack
                  : undefined
              }
              isFirst={exemptionQuestionIndex === 0 && stepHistory.length === 0}
            />
          </Box>
        )}

        {/* Work Questions - Job Status */}
        {currentStep === "work-job" && (
          <Box sx={{ py: 2 }}>
            <SingleChoiceQuestion
              question="Do you currently have a job?"
              helperText="This includes full-time, part-time, gig work, or self-employment"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "sometimes", label: "Sometimes" },
              ]}
              value={jobStatus}
              onChange={(value) => {
                const status = value as "yes" | "no" | "sometimes";
                setJobStatus(status);
                setResponses({
                  ...responses,
                  hasJob: status === "yes" || status === "sometimes",
                });
              }}
              onNext={() => advanceStep("work-seasonal")}
              onBack={stepHistory.length > 0 ? handleBack : undefined}
              isFirst={stepHistory.length === 0}
            />
          </Box>
        )}

        {/* Work Questions - Seasonal Income (6-month average) */}
        {currentStep === "work-income-seasonal" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="About how much have you earned in the last 6 months?"
                helperText="Add up all your income from the past 6 months. We'll calculate your monthly average."
                value={sixMonthTotal}
                onChange={(value) => {
                  setSixMonthTotal(value);
                  // Store as monthly average (divide by 6)
                  setResponses({
                    ...responses,
                    monthlyIncome: value ? Math.round(value / 6) : undefined,
                  });
                }}
                label="Total 6-Month Income"
                prefix="$"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.monthlyIncome === 0}
                onNotSureChange={(checked) => {
                  setSixMonthTotal(undefined);
                  setResponses({
                    ...responses,
                    monthlyIncome: checked ? 0 : undefined,
                  });
                }}
                onNext={() => {
                  // After seasonal income, ask about hours if they have a job
                  if (responses.hasJob) {
                    advanceStep("work-hours");
                  } else {
                    advanceStep("activities");
                  }
                }}
                onBack={handleBack}
              />
              {responses.monthlyIncome !== undefined &&
                responses.monthlyIncome > 0 && (
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
                      {responses.monthlyIncome}/month
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calculated: ${sixMonthTotal} ÷ 6 months
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        )}

        {/* Work Questions - Payment Frequency */}
        {currentStep === "work-frequency" && (
          <Box sx={{ py: 2 }}>
            <SingleChoiceQuestion
              question="How often do you get paid?"
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "biweekly", label: "Bi-weekly (every 2 weeks)" },
                { value: "monthly", label: "Monthly" },
                { value: "varies", label: "It varies" },
                { value: "not-sure", label: "Not sure" },
              ]}
              value={responses.paymentFrequency}
              onChange={(value) => {
                setResponses({
                  ...responses,
                  paymentFrequency: value as PayFrequency,
                });
              }}
              onNext={() => advanceStep("work-income")}
              onBack={handleBack}
            />
          </Box>
        )}

        {/* Work Questions - Monthly Income (for non-seasonal workers) */}
        {currentStep === "work-income" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="About how much do you earn per month?"
                helperText="Enter your average monthly income from work"
                value={responses.monthlyIncome}
                onChange={(value) => {
                  setResponses({
                    ...responses,
                    monthlyIncome: value,
                  });
                }}
                label="Monthly Income"
                prefix="$"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.monthlyIncome === 0}
                onNotSureChange={(checked) => {
                  setResponses({
                    ...responses,
                    monthlyIncome: checked ? 0 : undefined,
                  });
                }}
                onNext={() => advanceStep("work-hours")}
                onBack={handleBack}
              />
              <IncomeConverter
                onUseValue={(value) => {
                  setResponses({
                    ...responses,
                    monthlyIncome: value,
                  });
                }}
              />
            </Box>
          </Box>
        )}

        {/* Work Questions - Monthly Hours */}
        {currentStep === "work-hours" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="About how many hours per month do you work?"
                helperText="Enter your average monthly work hours"
                value={responses.monthlyWorkHours}
                onChange={(value) => {
                  setResponses({
                    ...responses,
                    monthlyWorkHours: value,
                  });
                }}
                label="Monthly Hours"
                suffix="hours"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.monthlyWorkHours === 0}
                onNotSureChange={(checked) => {
                  setResponses({
                    ...responses,
                    monthlyWorkHours: checked ? 0 : undefined,
                  });
                }}
                onNext={() => advanceStep("activities")}
                onBack={handleBack}
              />
              <HoursConverter
                onUseValue={(value) => {
                  setResponses({
                    ...responses,
                    monthlyWorkHours: value,
                  });
                }}
              />
            </Box>
          </Box>
        )}

        {/* Work Questions - Seasonal (now asked earlier) */}
        {currentStep === "work-seasonal" && (
          <Box sx={{ py: 2 }}>
            <SingleChoiceQuestion
              question="Is your work seasonal?"
              helperText="Seasonal work means your income or hours vary significantly by season"
              options={[
                { value: "yes", label: "Yes, my work is seasonal" },
                { value: "no", label: "No, it's year-round" },
                { value: "not-sure", label: "Not sure" },
              ]}
              value={seasonalStatus}
              onChange={(value) => {
                const status = value as "yes" | "no" | "not-sure";
                setSeasonalStatus(status);
                setResponses({
                  ...responses,
                  isSeasonalWork: status === "yes",
                });
              }}
              onNext={() => {
                // If no job and not seasonal, skip to activities
                if (!responses.hasJob && !responses.isSeasonalWork) {
                  advanceStep("activities");
                }
                // If seasonal work, ask about 6-month income
                else if (responses.isSeasonalWork) {
                  advanceStep("work-income-seasonal");
                }
                // If has job but not seasonal, ask about payment frequency
                else if (responses.hasJob) {
                  advanceStep("work-frequency");
                }
                // Otherwise skip to activities
                else {
                  advanceStep("activities");
                }
              }}
              onBack={handleBack}
            />
          </Box>
        )}

        {/* Activities Question */}
        {currentStep === "activities" && (
          <Box sx={{ py: 2 }}>
            <MultipleChoiceQuestion
              question="Do you do any of these activities?"
              helperText="Select all that apply"
              options={[
                { value: "volunteer", label: "Volunteer work" },
                { value: "school", label: "Attending school" },
                { value: "workProgram", label: "Work program" },
              ]}
              values={responses.otherActivities || {}}
              onChange={(value, checked) => {
                setResponses({
                  ...responses,
                  otherActivities: {
                    ...responses.otherActivities,
                    [value]: checked,
                  },
                });
              }}
              onNext={() => {
                const hasActivities = Object.values(
                  responses.otherActivities || {},
                ).some((v) => v === true);
                if (hasActivities) {
                  if (responses.otherActivities?.volunteer) {
                    advanceStep("activities-volunteer");
                  } else if (responses.otherActivities?.school) {
                    advanceStep("activities-school");
                  } else if (responses.otherActivities?.workProgram) {
                    advanceStep("activities-workprogram");
                  }
                } else {
                  completeAssessment(responses.exemption as ExemptionResponses);
                }
              }}
              onBack={handleBack}
            />
          </Box>
        )}

        {/* Activity Hours - Volunteer */}
        {currentStep === "activities-volunteer" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="How many hours per month do you volunteer?"
                value={responses.volunteerHoursPerMonth}
                onChange={(value) => {
                  setResponses({
                    ...responses,
                    volunteerHoursPerMonth: value,
                  });
                }}
                label="Monthly Volunteer Hours"
                suffix="hours"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.volunteerHoursPerMonth === 0}
                onNotSureChange={(checked) => {
                  setResponses({
                    ...responses,
                    volunteerHoursPerMonth: checked ? 0 : undefined,
                  });
                }}
                onNext={() => {
                  if (responses.otherActivities?.school) {
                    advanceStep("activities-school");
                  } else if (responses.otherActivities?.workProgram) {
                    advanceStep("activities-workprogram");
                  } else {
                    completeAssessment(
                      responses.exemption as ExemptionResponses,
                    );
                  }
                }}
                onBack={handleBack}
              />
              <HoursConverter
                onUseValue={(value) => {
                  setResponses({
                    ...responses,
                    volunteerHoursPerMonth: value,
                  });
                }}
              />
            </Box>
          </Box>
        )}

        {/* Activity Hours - School */}
        {currentStep === "activities-school" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="How many hours per month do you attend school?"
                value={responses.schoolHoursPerMonth}
                onChange={(value) => {
                  setResponses({
                    ...responses,
                    schoolHoursPerMonth: value,
                  });
                }}
                label="Monthly School Hours"
                suffix="hours"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.schoolHoursPerMonth === 0}
                onNotSureChange={(checked) => {
                  setResponses({
                    ...responses,
                    schoolHoursPerMonth: checked ? 0 : undefined,
                  });
                }}
                onNext={() => {
                  if (responses.otherActivities?.workProgram) {
                    advanceStep("activities-workprogram");
                  } else {
                    completeAssessment(
                      responses.exemption as ExemptionResponses,
                    );
                  }
                }}
                onBack={handleBack}
              />
              <HoursConverter
                onUseValue={(value) => {
                  setResponses({
                    ...responses,
                    schoolHoursPerMonth: value,
                  });
                }}
              />
            </Box>
          </Box>
        )}

        {/* Activity Hours - Work Program */}
        {currentStep === "activities-workprogram" && (
          <Box sx={{ py: 2 }}>
            <Box>
              <NumberInputQuestion
                question="How many hours per month do you participate in work programs?"
                value={responses.workProgramHoursPerMonth}
                onChange={(value) => {
                  setResponses({
                    ...responses,
                    workProgramHoursPerMonth: value,
                  });
                }}
                label="Monthly Work Program Hours"
                suffix="hours"
                min={0}
                step={1}
                allowNotSure={true}
                notSureChecked={responses.workProgramHoursPerMonth === 0}
                onNotSureChange={(checked) => {
                  setResponses({
                    ...responses,
                    workProgramHoursPerMonth: checked ? 0 : undefined,
                  });
                }}
                onNext={() => {
                  completeAssessment(responses.exemption as ExemptionResponses);
                }}
                onBack={handleBack}
              />
              <HoursConverter
                onUseValue={(value) => {
                  setResponses({
                    ...responses,
                    workProgramHoursPerMonth: value,
                  });
                }}
              />
            </Box>
          </Box>
        )}

        {/* Getting Started */}
        {currentStep === "gettingStarted" && (
          <GettingStartedContextual
            hasNotice={hasNotice}
            monthsRequired={monthsRequired}
            deadline={deadline ? new Date(deadline) : undefined}
            recommendation={recommendation}
            onStartTracking={handleStartTracking}
          />
        )}
      </Box>
    </Container>
  );
}
