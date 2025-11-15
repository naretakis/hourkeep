"use client";

import { Box, Typography, Paper, Chip } from "@mui/material";
import { format } from "date-fns";
import { AssessmentHistoryEntry } from "@/types/assessment";
import { getComplianceMethodLabel } from "@/lib/assessment/recommendationEngine";

interface AssessmentHistoryProps {
  history: AssessmentHistoryEntry[];
}

export function AssessmentHistory({ history }: AssessmentHistoryProps) {
  if (history.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No previous assessments
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {history.map((entry) => (
        <Paper
          key={entry.id}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {format(new Date(entry.completedAt), "MMMM d, yyyy")}
            </Typography>
            <Chip
              label={
                entry.exemptionStatus
                  ? "Exempt"
                  : getComplianceMethodLabel(entry.recommendedMethod)
              }
              size="small"
              color={entry.exemptionStatus ? "success" : "primary"}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {entry.exemptionStatus
              ? "You were exempt from work requirements"
              : `Recommended: ${getComplianceMethodLabel(entry.recommendedMethod)}`}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
