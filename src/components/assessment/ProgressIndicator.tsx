"use client";

import { Box, LinearProgress, Typography } from "@mui/material";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  const progressPercentage = Math.min(
    Math.round((currentStep / totalSteps) * 100),
    95,
  ); // Cap at 95% until completion

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {progressPercentage}% complete
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "grey.200",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            backgroundColor: "primary.main",
          },
        }}
      />
    </Box>
  );
}
