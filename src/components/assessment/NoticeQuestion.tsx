"use client";

import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

interface NoticeQuestionProps {
  onAnswer: (receivedNotice: boolean, skipToWork: boolean) => void;
}

export function NoticeQuestion({ onAnswer }: NoticeQuestionProps) {
  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          fontWeight: 500,
          mb: 2,
        }}
      >
        Have you received a notice from your Medicaid agency about work
        requirements?
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "info.50",
          border: "1px solid",
          borderColor: "info.200",
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <InfoIcon sx={{ color: "info.main", fontSize: 20, mt: 0.5 }} />
          <Box>
            <Typography variant="body2" color="info.main" paragraph>
              This notice might mention:
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="ul"
              sx={{ pl: 2, m: 0 }}
            >
              <li>Community engagement requirements</li>
              <li>Work requirements for Medicaid</li>
              <li>Reporting your work hours or income</li>
              <li>80 hours per month or $580 per month</li>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Answer buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => onAnswer(true, false)}
          sx={{
            py: 2,
            textAlign: "left",
            justifyContent: "flex-start",
            textTransform: "none",
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Yes, I received a notice
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your agency has determined you need to track work requirements
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => onAnswer(false, false)}
          sx={{
            py: 2,
            textAlign: "left",
            justifyContent: "flex-start",
            textTransform: "none",
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600}>
              No or I&apos;m not sure
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Let&apos;s check if you might be exempt
            </Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

interface NoticeFollowUpProps {
  onCheckExemption: () => void;
  onSkipToWork: () => void;
}

export function NoticeFollowUp({
  onCheckExemption,
  onSkipToWork,
}: NoticeFollowUpProps) {
  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Your Medicaid agency has determined that you need to track work
        requirements. However, you might still qualify for an exemption.
      </Alert>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          fontWeight: 500,
          mb: 3,
        }}
      >
        What would you like to do?
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onCheckExemption}
          sx={{
            py: 2,
            textAlign: "left",
            justifyContent: "flex-start",
            textTransform: "none",
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Check if I&apos;m exempt anyway
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Recommended—takes 2 minutes
            </Typography>
          </Box>
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onSkipToWork}
          sx={{
            py: 2,
            textAlign: "left",
            justifyContent: "flex-start",
            textTransform: "none",
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Skip to finding my compliance method
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Go straight to work situation questions
            </Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
