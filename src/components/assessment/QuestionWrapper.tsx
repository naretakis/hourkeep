"use client";

import { Box, Button, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
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
  continueLabel = "Continue",
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
      {/* Back button */}
      {onBack && (
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={onBack}
            aria-label="go back"
            sx={{
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      )}

      {/* Question content */}
      <Box sx={{ flex: 1, mb: 3 }}>{children}</Box>

      {/* Continue button */}
      {showContinue && onContinue && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="large"
            onClick={onContinue}
            disabled={continueDisabled}
            sx={{
              minWidth: 120,
              py: 1.5,
            }}
          >
            {continueLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}
