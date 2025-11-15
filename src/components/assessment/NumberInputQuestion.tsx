"use client";

import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

interface NumberInputQuestionProps {
  question: string;
  helperText?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  allowNotSure?: boolean;
  notSureChecked?: boolean;
  onNotSureChange?: (checked: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
}

export function NumberInputQuestion({
  question,
  helperText,
  value,
  onChange,
  label,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  allowNotSure = false,
  notSureChecked = false,
  onNotSureChange,
  onNext,
  onBack,
  isFirst = false,
}: NumberInputQuestionProps) {
  const isAnswered = value !== undefined || notSureChecked;

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
        <TextField
          type="number"
          label={label}
          value={notSureChecked ? "" : value || ""}
          onChange={(e) => {
            const val = e.target.value ? parseFloat(e.target.value) : undefined;
            onChange(val);
          }}
          disabled={notSureChecked}
          fullWidth
          slotProps={{
            input: {
              startAdornment: prefix ? (
                <Typography sx={{ mr: 0.5, color: "text.secondary" }}>
                  {prefix}
                </Typography>
              ) : undefined,
              endAdornment: suffix ? (
                <Typography sx={{ ml: 0.5, color: "text.secondary" }}>
                  {suffix}
                </Typography>
              ) : undefined,
            },
            htmlInput: {
              min,
              max,
              step,
            },
          }}
          sx={{
            mb: allowNotSure ? 2 : 0,
            "& .MuiInputBase-root": {
              minHeight: 56,
            },
          }}
        />

        {allowNotSure && onNotSureChange && (
          <FormControlLabel
            control={
              <Checkbox
                checked={notSureChecked}
                onChange={(e) => onNotSureChange(e.target.checked)}
              />
            }
            label="I'm not sure"
          />
        )}
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
