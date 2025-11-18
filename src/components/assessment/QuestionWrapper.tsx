"use client";

import { Box, Button } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { ReactNode } from "react";

interface QuestionWrapperProps {
  children: ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  showContinue?: boolean;
}

export function QuestionWrapper({
  children,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = "Next",
  showContinue = true,
}: QuestionWrapperProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "60vh",
      }}
    >
      {/* Question content */}
      <Box sx={{ flex: 1, mb: 3 }}>{children}</Box>

      {/* Navigation buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {onBack && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ minHeight: 48 }}
          >
            Back
          </Button>
        )}
        {showContinue && onContinue && (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onContinue}
            disabled={continueDisabled}
            fullWidth={!onBack}
            sx={{ minHeight: 48 }}
          >
            {continueLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
