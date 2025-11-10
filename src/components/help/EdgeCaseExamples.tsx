"use client";

import React from "react";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HelpSection } from "./HelpSection";
import { EdgeCaseExample } from "@/content/helpText";

export interface EdgeCaseExamplesProps {
  /**
   * Type of activity (for context)
   */
  activityType: "work" | "volunteer" | "education" | "workProgram" | "income";
  /**
   * Array of edge case examples to display
   */
  examples: EdgeCaseExample[];
}

/**
 * EdgeCaseExamples Component
 *
 * Displays edge case scenarios in a collapsible section with clear visual indicators
 * for whether each scenario counts toward work requirements.
 *
 * Features:
 * - Collapsed by default to avoid clutter
 * - Clear visual indicators (✓ counts, ✗ doesn't count, ⚠ varies)
 * - Card-based layout for easy scanning
 * - Mobile-friendly stacked layout
 */
export function EdgeCaseExamples({
  activityType,
  examples,
}: EdgeCaseExamplesProps) {
  if (!examples || examples.length === 0) {
    return null;
  }

  // Get icon and color based on counts value
  const getStatusDisplay = (counts: boolean | "varies") => {
    if (counts === true) {
      return {
        icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
        color: "success.main",
        label: "Counts",
        chipColor: "success" as const,
      };
    } else if (counts === false) {
      return {
        icon: <CancelIcon sx={{ fontSize: 20 }} />,
        color: "error.main",
        label: "Doesn't Count",
        chipColor: "error" as const,
      };
    } else {
      return {
        icon: <WarningAmberIcon sx={{ fontSize: 20 }} />,
        color: "warning.main",
        label: "It Depends",
        chipColor: "warning" as const,
      };
    }
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Here are some common scenarios to help you understand what counts:
      </Typography>

      {examples.map((example, index) => {
        const status = getStatusDisplay(example.counts);

        return (
          <Card
            key={index}
            variant="outlined"
            sx={{
              borderLeft: 4,
              borderLeftColor: status.color,
              backgroundColor: "background.paper",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              {/* Scenario */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    color: status.color,
                    display: "flex",
                    alignItems: "center",
                    mt: 0.25,
                  }}
                >
                  {status.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: "0.9rem",
                    }}
                  >
                    {example.scenario}
                  </Typography>
                  <Chip
                    label={status.label}
                    size="small"
                    color={status.chipColor}
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Explanation */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 4,
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {example.explanation}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );

  return (
    <HelpSection
      title="Examples & Edge Cases"
      content={content}
      defaultExpanded={false}
      icon={<WarningAmberIcon fontSize="small" />}
      variant="info"
      storageKey={`edge-cases-${activityType}`}
    />
  );
}

/**
 * InlineEdgeCaseExample Component
 *
 * A simpler inline version for displaying a single edge case
 * without the collapsible wrapper.
 */
export interface InlineEdgeCaseExampleProps {
  example: EdgeCaseExample;
}

export function InlineEdgeCaseExample({ example }: InlineEdgeCaseExampleProps) {
  const getStatusDisplay = (counts: boolean | "varies") => {
    if (counts === true) {
      return {
        icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
        color: "success.main",
        label: "Counts",
      };
    } else if (counts === false) {
      return {
        icon: <CancelIcon sx={{ fontSize: 18 }} />,
        color: "error.main",
        label: "Doesn't Count",
      };
    } else {
      return {
        icon: <WarningAmberIcon sx={{ fontSize: 18 }} />,
        color: "warning.main",
        label: "It Depends",
      };
    }
  };

  const status = getStatusDisplay(example.counts);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        p: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
      }}
    >
      <Box sx={{ color: status.color, mt: 0.25 }}>{status.icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {example.scenario}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {example.explanation}
        </Typography>
      </Box>
    </Box>
  );
}
