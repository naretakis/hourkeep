"use client";

import {
  Box,
  Typography,
  Button,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

interface SingleChoiceQuestionProps {
  question: string;
  helperText?: string;
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
}

export function SingleChoiceQuestion({
  question,
  helperText,
  options,
  value,
  onChange,
  onNext,
  onBack,
  isFirst = false,
}: SingleChoiceQuestionProps) {
  const isAnswered = value !== undefined && value !== "";

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
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
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
          </RadioGroup>
        </FormControl>
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
          disabled={!isAnswered}
          fullWidth={isFirst}
          sx={{ minHeight: 48 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
