"use client";

import React from "react";
import { Box } from "@mui/material";
import { HelpTooltip } from "@/components/help/HelpTooltip";
import { EdgeCaseExamples } from "@/components/help/EdgeCaseExamples";
import { activityDefinitions } from "@/content/helpText";

export interface ActivityFormHelpProps {
  /**
   * Type of activity to show help for
   */
  activityType: "work" | "volunteer" | "education" | "workProgram";
  /**
   * Whether to display inline (next to form field) or as standalone
   */
  inline?: boolean;
}

/**
 * ActivityFormHelp Component
 *
 * Displays contextual help for activity types in the activity tracking form.
 * Combines a tooltip with activity definition and an expandable edge cases section.
 *
 * Features:
 * - HelpTooltip with definition, examples, and counter-examples
 * - EdgeCaseExamples section for detailed scenarios
 * - Inline or standalone display modes
 * - Mobile-friendly with proper touch targets
 */
export function ActivityFormHelp({
  activityType,
  inline = true,
}: ActivityFormHelpProps) {
  const definition = activityDefinitions[activityType];

  if (!definition) {
    console.warn(`No definition found for activity type: ${activityType}`);
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: inline ? 0 : 2,
      }}
    >
      {/* Help Tooltip */}
      <Box
        sx={{
          display: inline ? "inline-flex" : "flex",
          alignItems: "center",
        }}
      >
        <HelpTooltip
          title={definition.title}
          content={definition.definition}
          examples={definition.examples}
          counterExamples={definition.counterExamples}
          ariaLabel={`Help for ${definition.title}`}
          size="small"
          color="primary"
        />
      </Box>

      {/* Edge Cases - Only show in non-inline mode or as separate section */}
      {!inline && (
        <EdgeCaseExamples
          activityType={activityType}
          examples={definition.edgeCases}
        />
      )}
    </Box>
  );
}

/**
 * ActivityFormHelpWithEdgeCases Component
 *
 * A variant that always shows edge cases, useful for dedicated help pages
 * or expanded views.
 */
export interface ActivityFormHelpWithEdgeCasesProps {
  activityType: "work" | "volunteer" | "education" | "workProgram";
}

export function ActivityFormHelpWithEdgeCases({
  activityType,
}: ActivityFormHelpWithEdgeCasesProps) {
  const definition = activityDefinitions[activityType];

  if (!definition) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ActivityFormHelp activityType={activityType} inline={false} />
    </Box>
  );
}
