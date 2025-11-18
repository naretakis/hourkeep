"use client";

import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import {
  Explore as ExploreIcon,
  CheckCircle as CheckCircleIcon,
  Recommend as RecommendIcon,
} from "@mui/icons-material";
import { AssessmentResult } from "@/types/assessment";
import { getComplianceMethodLabel } from "@/lib/assessment/recommendationEngine";

interface AssessmentBadgeProps {
  result: AssessmentResult | null;
  onTakeAssessment: () => void;
  onViewDetails: () => void;
  onRetakeAssessment: () => void;
}

export function AssessmentBadge({
  result,
  onTakeAssessment,
  onViewDetails,
  onRetakeAssessment,
}: AssessmentBadgeProps) {
  // Not started state
  if (!result) {
    return (
      <Paper
        sx={{
          p: 3,
          bgcolor: "primary.50",
          border: "2px solid",
          borderColor: "primary.main",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "primary.100",
            transform: "translateY(-2px)",
            boxShadow: 2,
          },
        }}
        onClick={onTakeAssessment}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ExploreIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              How to HourKeep
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Discover the easiest way to keep your hours, and keep your
              coverage
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onTakeAssessment();
              }}
            >
              Take 5 Minute Assessment →
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  const { recommendation } = result;
  const isExempt = recommendation.primaryMethod === "exemption";

  // Exempt state
  if (isExempt) {
    return (
      <Paper
        sx={{
          p: 3,
          bgcolor: "success.50",
          border: "2px solid",
          borderColor: "success.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "success.main", fontWeight: 600 }}
            >
              You&apos;re Exempt
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {recommendation.reasoning}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={onViewDetails}
                sx={{
                  borderColor: "success.main",
                  color: "success.main",
                  "&:hover": {
                    borderColor: "success.dark",
                    bgcolor: "success.50",
                  },
                }}
              >
                View Details
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={onRetakeAssessment}
                sx={{ color: "text.secondary" }}
              >
                Retake Assessment
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Recommended method state
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "primary.50",
        border: "2px solid",
        borderColor: "primary.main",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RecommendIcon sx={{ color: "white", fontSize: 28 }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              Recommended:
            </Typography>
            <Chip
              label={getComplianceMethodLabel(recommendation.primaryMethod)}
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Based on your assessment
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="small"
              onClick={onViewDetails}
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              View Details
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={onRetakeAssessment}
              sx={{ color: "text.secondary" }}
            >
              Retake Assessment
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
