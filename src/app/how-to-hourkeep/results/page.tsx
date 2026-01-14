"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { db } from "@/lib/db";
import { getLatestAssessmentResult } from "@/lib/storage/assessment";
import { AssessmentResult } from "@/types/assessment";
import {
  getComplianceMethodLabel,
  getComplianceMethodDescription,
} from "@/lib/assessment/recommendationEngine";

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const profiles = await db.profiles.toArray();
        if (profiles.length === 0) {
          router.push("/onboarding");
          return;
        }

        const latestResult = await getLatestAssessmentResult(profiles[0].id);
        if (!latestResult) {
          router.push("/how-to-hourkeep");
          return;
        }

        setResult(latestResult);
        setLoading(false);
      } catch (error) {
        console.error("Error loading assessment result:", error);
        setLoading(false);
      }
    };

    loadResult();
  }, [router]);

  const handleStartMethod = async () => {
    if (!result) return;

    try {
      const profiles = await db.profiles.toArray();
      if (profiles.length > 0) {
        const { setComplianceMode, setSeasonalWorkerStatus } = await import(
          "@/lib/storage/income"
        );
        const currentMonth = new Date().toISOString().slice(0, 7);

        if (result.recommendation.primaryMethod === "income-tracking") {
          await setComplianceMode(profiles[0].id, currentMonth, "income");
          await setSeasonalWorkerStatus(profiles[0].id, currentMonth, false);
        } else if (
          result.recommendation.primaryMethod === "seasonal-income-tracking"
        ) {
          await setComplianceMode(profiles[0].id, currentMonth, "income");
          await setSeasonalWorkerStatus(profiles[0].id, currentMonth, true);
        } else if (result.recommendation.primaryMethod === "hour-tracking") {
          await setComplianceMode(profiles[0].id, currentMonth, "hours");
        }
      }
    } catch (error) {
      console.error("Error setting compliance mode:", error);
    }

    router.push("/tracking");
  };

  const getExemptMethodMessage = (method: string): string => {
    if (method === "income-tracking") {
      const income = result?.responses.monthlyIncome || 0;
      if (income >= 580) {
        return `You're earning $${income}/month, which meets the $580 threshold. Since you're exempt, you don't need to track this.`;
      }
      return "Since you're exempt, you don't need to track income. If your exemption status changes, this would be an option.";
    }
    if (method === "seasonal-income-tracking") {
      return "Since you're exempt, you don't need to track seasonal income. If your exemption status changes, this would be an option.";
    }
    if (method === "hour-tracking") {
      const totalHours =
        (result?.responses.monthlyWorkHours || 0) +
        (result?.responses.volunteerHoursPerMonth || 0) +
        (result?.responses.schoolHoursPerMonth || 0) +
        (result?.responses.workProgramHoursPerMonth || 0);
      if (totalHours >= 80) {
        return `You're at ${totalHours} hours/month, which meets the 80-hour requirement. Since you're exempt, you don't need to track this.`;
      }
      return "Since you're exempt, you don't need to track hours. If your exemption status changes, this would be an option.";
    }
    return "";
  };

  const getNonExemptMethodMessage = (
    method: string,
    isAlternative: boolean,
  ): string => {
    if (method === "income-tracking") {
      if (isAlternative) {
        return "This also works for you, but we recommended hour tracking because it might be simpler given your current situation.";
      }
      const income = result?.responses.monthlyIncome || 0;
      const needed = 580 - income;
      if (needed <= 0) {
        return `You're earning $${income}/month, which already meets the $580 threshold. You could use this method instead.`;
      } else if (income > 0 && needed <= 100) {
        return `You're at $${income}/month — just $${needed} away from the $580 threshold. A small income increase would let you use this easier method.`;
      } else if (income > 0) {
        return `You're at $${income}/month. If your income increases to $580 or more, you can switch to this easier method.`;
      }
      return "You're not currently earning $580/month. If your income increases to $580 or more, you can switch to this easier method—just submit one paystub each month instead of tracking hours.";
    }
    if (method === "seasonal-income-tracking") {
      if (isAlternative) {
        return "This also works for you, but we recommended a simpler option based on your situation.";
      }
      return "This method is for people with seasonal work that averages $580/month over 6 months. If your work becomes seasonal, you can switch to this method.";
    }
    if (method === "hour-tracking") {
      if (isAlternative) {
        if (result?.recommendation.primaryMethod === "income-tracking") {
          return "This also works for you, but income tracking is easier—just submit one paystub each month instead of tracking hours daily.";
        }
        if (
          result?.recommendation.primaryMethod === "seasonal-income-tracking"
        ) {
          return "This also works for you, but seasonal income tracking might be easier for your situation.";
        }
        return "This also works for you.";
      }
      const totalHours =
        (result?.responses.monthlyWorkHours || 0) +
        (result?.responses.volunteerHoursPerMonth || 0) +
        (result?.responses.schoolHoursPerMonth || 0) +
        (result?.responses.workProgramHoursPerMonth || 0);
      const needed = 80 - totalHours;
      if (needed <= 0) {
        return `You're at ${totalHours} hours/month, which already meets the 80-hour requirement. You could use this method instead.`;
      } else if (totalHours > 0 && needed <= 20) {
        return `You're at ${totalHours} hours/month — just ${needed} more hours to reach 80. Adding a bit more work, volunteering, or school time would get you there.`;
      } else if (totalHours > 0) {
        return `You're at ${totalHours} hours/month. If you add more work, volunteering, or school hours to reach 80/month, you can use this method.`;
      }
      return "You're not currently at 80 hours/month. If you add more work, volunteering, or school hours to reach 80/month, you can use this method.";
    }
    return "";
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

  if (!result) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            No assessment results found. Please complete the assessment first.
          </Alert>
          <Button
            variant="contained"
            onClick={() => router.push("/how-to-hourkeep")}
            sx={{ mt: 2 }}
          >
            Start Assessment
          </Button>
        </Box>
      </Container>
    );
  }

  const { recommendation } = result;
  const isExempt = recommendation.primaryMethod === "exemption";

  return (
    <Container maxWidth="md">
      <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: isExempt ? "success.50" : "primary.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 50,
                color: isExempt ? "success.main" : "primary.main",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: 600,
            mb: 1,
          }}
        >
          Your Recommended Path
        </Typography>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: isExempt ? "success.50" : "primary.50",
            border: "2px solid",
            borderColor: isExempt ? "success.main" : "primary.main",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: isExempt ? "success.main" : "primary.main",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {getComplianceMethodLabel(recommendation.primaryMethod)}
          </Typography>
          <Typography variant="body1" paragraph>
            {recommendation.reasoning}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getComplianceMethodDescription(recommendation.primaryMethod)}
          </Typography>
        </Paper>

        <Box id="alternatives" sx={{ mb: 3 }}>
          <Accordion
            sx={{
              border: "1px solid",
              borderColor: "divider",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "grey.50", "&:hover": { bgcolor: "grey.100" } }}
            >
              <Typography variant="h6">See all compliance methods</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Here are all the ways you can stay compliant. We recommended{" "}
                {getComplianceMethodLabel(recommendation.primaryMethod)} because
                it&apos;s the easiest for your situation, but you can choose any
                method that works for you.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {(
                  [
                    "exemption",
                    "income-tracking",
                    "seasonal-income-tracking",
                    "hour-tracking",
                  ] as const
                ).map((method) => {
                  const isRecommended = method === recommendation.primaryMethod;
                  const isAlternative =
                    recommendation.alternativeMethods.includes(method);
                  const isAvailable = isRecommended || isAlternative;

                  if (method === "exemption" && !isRecommended) {
                    return null;
                  }

                  return (
                    <Paper
                      key={method}
                      sx={{
                        p: 2,
                        border: "2px solid",
                        borderColor: isRecommended ? "primary.main" : "divider",
                        bgcolor: isRecommended ? "primary.50" : "transparent",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            color: isRecommended
                              ? "primary.main"
                              : "text.primary",
                          }}
                        >
                          {getComplianceMethodLabel(method)}
                        </Typography>
                        {isRecommended && (
                          <Chip
                            label="Easiest for you"
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                        {isAlternative && (
                          <Chip
                            label="Also works"
                            size="small"
                            sx={{
                              bgcolor: "success.50",
                              color: "success.main",
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {!isAvailable && method !== "exemption" && (
                          <Chip
                            label={
                              isExempt
                                ? "Not needed"
                                : "Not an option right now"
                            }
                            size="small"
                            sx={{
                              bgcolor: isExempt ? "success.50" : "grey.100",
                              color: isExempt
                                ? "success.main"
                                : "text.secondary",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {getComplianceMethodDescription(method)}
                      </Typography>
                      {!isRecommended && method !== "exemption" && (
                        <Alert
                          severity={
                            isExempt
                              ? "success"
                              : isAlternative
                                ? "info"
                                : "warning"
                          }
                          sx={{ mt: 1 }}
                        >
                          <Typography variant="body2">
                            {isExempt
                              ? getExemptMethodMessage(method)
                              : getNonExemptMethodMessage(
                                  method,
                                  isAlternative,
                                )}
                          </Typography>
                        </Alert>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          You can switch methods anytime without losing data. All tracking
          methods remain accessible, and your previous data is preserved.
        </Alert>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartMethod}
            endIcon={<ArrowForwardIcon />}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {isExempt
              ? "Go to Dashboard"
              : `Start ${getComplianceMethodLabel(recommendation.primaryMethod)}`}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={async () => {
              if (result?.id) {
                try {
                  await db.assessmentResults.delete(result.id);
                } catch (error) {
                  console.error("Error deleting result:", error);
                }
              }
              router.push("/how-to-hourkeep");
            }}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Back to Assessment
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => router.push("/how-to-hourkeep")}
            fullWidth
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Start Fresh
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
