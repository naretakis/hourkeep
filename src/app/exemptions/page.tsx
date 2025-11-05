"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Start as StartIcon,
} from "@mui/icons-material";
import { QuestionFlow } from "@/components/exemptions/QuestionFlow";
import { ExemptionResults } from "@/components/exemptions/ExemptionResults";
import {
  saveScreening,
  getLatestScreening,
  archiveScreening,
} from "@/lib/storage/exemptions";
import { ExemptionResponses, ExemptionResult } from "@/types/exemptions";
import { db } from "@/lib/db";

type ScreenState = "welcome" | "screening" | "results";

export default function ExemptionScreeningPage() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>("welcome");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExistingScreening, setHasExistingScreening] = useState(false);
  const [currentResult, setCurrentResult] = useState<ExemptionResult | null>(
    null,
  );
  const [screeningDate, setScreeningDate] = useState<Date>(new Date());

  // Load user profile and check for existing screening
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user profile
        const profiles = await db.profiles.toArray();
        if (profiles.length > 0) {
          const profile = profiles[0];
          setUserId(profile.id);

          // Check for existing screening
          const existing = await getLatestScreening(profile.id);
          setHasExistingScreening(!!existing);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStartScreening = () => {
    setScreenState("screening");
  };

  const handleCancel = () => {
    router.push("/settings");
  };

  const handleComplete = async (
    responses: ExemptionResponses,
    result: ExemptionResult,
  ) => {
    if (!userId) return;

    try {
      // Archive existing screening if it exists
      if (hasExistingScreening) {
        const existing = await getLatestScreening(userId);
        if (existing?.id) {
          await archiveScreening(existing.id);
        }
      }

      // Save new screening
      const now = new Date();
      await saveScreening(userId, responses, result);

      // Update state to show results
      setCurrentResult(result);
      setScreeningDate(now);
      setScreenState("results");
    } catch (error) {
      console.error("Error saving screening:", error);
    }
  };

  const handleDone = () => {
    router.push("/settings");
  };

  const handleRescreen = () => {
    setScreenState("screening");
    setCurrentResult(null);
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Back to Settings
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Exemption Screening
        </Typography>
      </Box>

      {/* Welcome Screen */}
      {screenState === "welcome" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Check if you&apos;re exempt from work requirements
            </Typography>
            <Typography variant="body1" paragraph>
              This quick screening will help you determine if you qualify for an
              exemption from Medicaid work requirements.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The screening takes about 5 minutes and covers 5 categories:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Age-based exemptions
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Family and caregiving exemptions
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Health and disability exemptions
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Program participation exemptions
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Other exemptions
              </Typography>
            </Box>
          </Paper>

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Optional & Informational:</strong> This screening is
              completely optional. The results are for your own reference and
              are not an official determination.
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Important:</strong> This is not an official exemption
              determination. You should verify your status with your state
              Medicaid agency.
            </Typography>
          </Alert>

          {hasExistingScreening && (
            <Alert severity="info">
              <Typography variant="body2">
                You have completed a previous screening. Starting a new
                screening will replace your current results (your old results
                will be saved in history).
              </Typography>
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              fullWidth
              sx={{ minHeight: 48 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={handleStartScreening}
              fullWidth
              sx={{ minHeight: 48 }}
            >
              Start Screening
            </Button>
          </Box>
        </Box>
      )}

      {/* Screening Flow */}
      {screenState === "screening" && (
        <QuestionFlow onComplete={handleComplete} />
      )}

      {/* Results */}
      {screenState === "results" && currentResult && (
        <ExemptionResults
          result={currentResult}
          screeningDate={screeningDate}
          onDone={handleDone}
          onRescreen={handleRescreen}
        />
      )}
    </Container>
  );
}
