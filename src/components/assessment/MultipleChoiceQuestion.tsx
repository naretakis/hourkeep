"use client";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

interface MultipleChoiceQuestionProps {
  question: string;
  helperText?: string;
  options: { value: string; label: string }[];
  values: Record<string, boolean>;
  onChange: (value: string, checked: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  allowSkip?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  helperText,
  options,
  values,
  onChange,
  onNext,
  onBack,
  isFirst = false,
  allowSkip = true,
}: MultipleChoiceQuestionProps) {
  // For multiple choice, we allow proceeding even with no selections (unless allowSkip is false)
  const hasSelection = Object.values(values).some((v) => v === true);
  const canProceed = allowSkip || hasSelection;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minHeight: "400px",
      }}
    >
      {/* Question Text */}
      <Box>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {question}
        </Typography>
        {helperText && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {helperText}
          </Alert>
        )}
      </Box>

      {/* Answer Input */}
      <Box sx={{ flex: 1 }}>
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={values[option.value] || false}
                  onChange={(e) => onChange(option.value, e.target.checked)}
                />
              }
              label={option.label}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                mb: 1,
                mx: 0,
                px: 2,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {!isFirst && onBack && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ minHeight: 48 }}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onNext}
          disabled={!canProceed}
          fullWidth={isFirst}
          sx={{ minHeight: 48 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
