"use client";

import {
  Box,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { QuestionWrapper } from "@/components/assessment/QuestionWrapper";

interface NoticeDetailsQuestionProps {
  monthsRequired: number | undefined;
  deadline: string | undefined; // ISO date string
  onMonthsChange: (months: number) => void;
  onDeadlineChange: (deadline: string) => void;
  onBack?: () => void;
  onContinue: () => void;
}

export function NoticeDetailsQuestion({
  monthsRequired,
  deadline,
  onMonthsChange,
  onDeadlineChange,
  onBack,
  onContinue,
}: NoticeDetailsQuestionProps) {
  const [localDeadline, setLocalDeadline] = useState(deadline || "");
  const [localMonths, setLocalMonths] = useState<string>(
    monthsRequired !== undefined ? monthsRequired.toString() : "",
  );

  const handleMonthsChange = (value: string) => {
    setLocalMonths(value);
    const months = value === "unsure" ? 1 : parseInt(value, 10);
    onMonthsChange(months);
  };

  const handleDeadlineChange = (value: string) => {
    setLocalDeadline(value);
    onDeadlineChange(value);
  };

  const isAnswered = localMonths !== "";

  return (
    <QuestionWrapper
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isAnswered}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Question Text */}
        <Box>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            What does your notice say?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            How many months of work do you need to prove?
          </Typography>
        </Box>

        {/* Months Selection */}
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={localMonths}
            onChange={(e) => handleMonthsChange(e.target.value)}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="1 month"
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
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="2 months"
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
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="3 months"
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
            <FormControlLabel
              value="6"
              control={<Radio />}
              label="6 months"
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
            <FormControlLabel
              value="unsure"
              control={<Radio />}
              label="I'm not sure"
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
          </RadioGroup>
        </FormControl>

        {/* Deadline Field */}
        <Box>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1 }}
          >
            When do you need to respond? (Optional)
          </Typography>
          <TextField
            type="date"
            value={localDeadline}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
            sx={{ maxWidth: 300 }}
          />
        </Box>

        {/* Help Text */}
        <Alert severity="info">
          💡 Not sure? We recommend tracking 1 month to start. You can always
          add more later.
        </Alert>
      </Box>
    </QuestionWrapper>
  );
}
