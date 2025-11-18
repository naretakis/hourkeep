"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { OnboardingContext } from "@/types";
import { format, differenceInDays } from "date-fns";

interface GoalProgressProps {
  onboardingContext?: OnboardingContext;
  monthlyCompliance: Map<string, boolean>; // Map of month (YYYY-MM) to compliance status
  onAddMonth: () => void;
}

export function GoalProgress({
  onboardingContext,
  monthlyCompliance,
  onAddMonth,
}: GoalProgressProps) {
  // If no onboarding context, show continuous tracking mode
  if (!onboardingContext || !onboardingContext.monthsRequired) {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Continuous Tracking Mode
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You&apos;re tracking hours continuously. Keep logging your activities
          to stay ready for renewals!
        </Typography>
      </Paper>
    );
  }

  const { monthsRequired, deadline } = onboardingContext;

  // Calculate days remaining if deadline exists
  const daysRemaining = deadline
    ? differenceInDays(new Date(deadline), new Date())
    : null;

  // Calculate progress
  const completedMonths = Array.from(monthlyCompliance.values()).filter(
    (isCompliant) => isCompliant,
  ).length;
  const progressPercentage = (completedMonths / monthsRequired) * 100;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Your Goal</Typography>
        {deadline && daysRemaining !== null && (
          <Chip
            icon={<CalendarIcon />}
            label={
              daysRemaining > 0
                ? `${daysRemaining} days left`
                : "Deadline passed"
            }
            sx={{
              bgcolor: daysRemaining > 7 ? "primary.main" : "warning.main",
              color: "white",
              fontWeight: 600,
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
            size="small"
          />
        )}
      </Box>

      {/* Deadline Alert */}
      {deadline && daysRemaining !== null && daysRemaining <= 7 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Deadline: {format(new Date(deadline), "MMMM d, yyyy")}
          </Typography>
          <Typography variant="body2">
            {daysRemaining > 0
              ? `You have ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} to complete your documentation.`
              : "Your deadline has passed. Please submit your documentation as soon as possible."}
          </Typography>
        </Alert>
      )}

      {/* Progress Overview */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Months Completed
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {completedMonths} / {monthsRequired} months
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                completedMonths >= monthsRequired
                  ? "success.main"
                  : "primary.main",
            },
          }}
        />
      </Box>

      {/* Month Status List */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Month Status
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {Array.from(monthlyCompliance.entries()).map(
            ([month, isCompliant]) => (
              <Box
                key={month}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: isCompliant ? "success.50" : "background.paper",
                }}
              >
                <Typography variant="body2">
                  {format(new Date(month + "-01"), "MMMM yyyy")}
                </Typography>
                {isCompliant ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ fontSize: 20, color: "success.main" }}
                    />
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight={600}
                    >
                      Complete
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                )}
              </Box>
            ),
          )}
        </Box>
      </Box>

      {/* Add Another Month Button */}
      {completedMonths >= monthsRequired && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddMonth}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Another Month
        </Button>
      )}

      {/* Completion Message */}
      {completedMonths >= monthsRequired && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            🎉 Goal Complete!
          </Typography>
          <Typography variant="body2">
            You&apos;ve completed all required months. You can now export your
            report and submit it to your state.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}
