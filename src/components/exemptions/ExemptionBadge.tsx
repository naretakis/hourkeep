"use client";

import { Box, Typography, Paper, Button, Chip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ExemptionScreening } from "@/types/exemptions";

interface ExemptionBadgeProps {
  screening: ExemptionScreening | null;
}

export function ExemptionBadge({ screening }: ExemptionBadgeProps) {
  const router = useRouter();

  const handleClick = () => {
    if (screening) {
      router.push("/exemptions");
    } else {
      router.push("/exemptions");
    }
  };

  // Not screened yet
  if (!screening) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "info.50",
          border: "1px solid",
          borderColor: "info.100",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "info.100",
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <HelpOutlineIcon sx={{ color: "info.main", fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Check if You&apos;re Exempt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Take a quick screening to see if you need to track hours
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Exempt
  if (screening.result.isExempt) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "success.50",
          border: "1px solid",
          borderColor: "success.main",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "success.100",
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 32 }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "success.dark" }}
            >
              You Are Exempt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don&apos;t need to track hours
            </Typography>
          </Box>
        </Box>
        {screening.result.exemptionCategory && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={getCategoryLabel(screening.result.exemptionCategory)}
              size="small"
              sx={{
                backgroundColor: "success.main",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        )}
        <Button
          size="small"
          sx={{ mt: 1, color: "success.dark" }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Details
        </Button>
      </Paper>
    );
  }

  // Not exempt - must track hours
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "warning.50",
        border: "1px solid",
        borderColor: "warning.main",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "warning.100",
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <InfoIcon sx={{ color: "warning.main", fontSize: 32 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Must Track Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You need to track 80 hours/month or earn $580/month
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        sx={{ mt: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Details
      </Button>
    </Paper>
  );
}

// Helper function to get category label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    age: "Age-Based",
    "family-caregiving": "Family & Caregiving",
    "health-disability": "Health & Disability",
    "program-participation": "Program Participation",
    other: "Other",
  };
  return labels[category] || category;
}
