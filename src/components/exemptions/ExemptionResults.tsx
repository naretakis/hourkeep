"use client";

import { useState } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { ExemptionResult } from "@/types/exemptions";
import { format } from "date-fns";
import { RescreenDialog } from "./RescreenDialog";

interface ExemptionResultsProps {
  result: ExemptionResult;
  screeningDate: Date;
  onDone: () => void;
  onRescreen: () => void;
}

export function ExemptionResults({
  result,
  screeningDate,
  onDone,
  onRescreen,
}: ExemptionResultsProps) {
  const [rescreenDialogOpen, setRescreenDialogOpen] = useState(false);

  const handleRescreenClick = () => {
    setRescreenDialogOpen(true);
  };

  const handleRescreenConfirm = () => {
    setRescreenDialogOpen(false);
    onRescreen();
  };

  const handleRescreenCancel = () => {
    setRescreenDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Status Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: result.isExempt ? "success.50" : "info.50",
          border: "2px solid",
          borderColor: result.isExempt ? "success.main" : "info.main",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {result.isExempt ? (
            <CheckCircleIcon sx={{ fontSize: 64, color: "success.main" }} />
          ) : (
            <InfoIcon sx={{ fontSize: 64, color: "info.main" }} />
          )}
        </Box>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {result.isExempt ? "You Are Exempt" : "You Must Track Hours"}
        </Typography>
        {result.isExempt && result.exemptionCategory && (
          <Typography variant="body2" color="text.secondary">
            Category: {getCategoryLabel(result.exemptionCategory)}
          </Typography>
        )}
      </Paper>

      {/* Explanation */}
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          What this means
        </Typography>
        <Typography variant="body1" paragraph>
          {result.explanation}
        </Typography>
        {result.exemptionReason && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Reason:</strong> {result.exemptionReason}
          </Alert>
        )}
      </Paper>

      {/* Next Steps */}
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          What you need to do
        </Typography>
        <Typography variant="body1">{result.nextSteps}</Typography>

        {!result.isExempt && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>How to meet the requirements:</strong>
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Do 80 hours per month of work, volunteering, or school
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                OR earn $580 per month from working
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This app helps you track your hours and stay organized. You can
              log activities daily and see your monthly progress.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Screening Info */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Screened: {format(screeningDate, "MMMM d, yyyy")}
        </Typography>
      </Box>

      {/* Disclaimer */}
      <Alert severity="warning">
        <Typography variant="body2">
          <strong>Important:</strong> This screening is for your own reference
          only. It is not an official determination. Please verify your
          exemption status with your state Medicaid agency.
        </Typography>
      </Alert>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleRescreenClick}
          fullWidth
          sx={{ minHeight: 48 }}
        >
          Re-screen
        </Button>
        <Button
          variant="contained"
          onClick={onDone}
          fullWidth
          sx={{ minHeight: 48 }}
        >
          Done
        </Button>
      </Box>

      {/* Rescreen Confirmation Dialog */}
      <RescreenDialog
        open={rescreenDialogOpen}
        onClose={handleRescreenCancel}
        onConfirm={handleRescreenConfirm}
      />
    </Box>
  );
}

// Helper function to get category label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    age: "Age-Based",
    "family-caregiving": "Family & Caregiving",
    "health-disability": "Health & Disability",
    "program-participation": "Program Participation",
    other: "Other Exemptions",
  };
  return labels[category] || category;
}
