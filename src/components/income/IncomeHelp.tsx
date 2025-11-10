"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { HelpSection } from "@/components/help/HelpSection";
import { EdgeCaseExamples } from "@/components/help/EdgeCaseExamples";
import { incomeDefinitions } from "@/content/helpText";

export interface IncomeHelpProps {
  /**
   * Whether to show seasonal worker information
   */
  showSeasonalWorkerInfo?: boolean;
}

/**
 * IncomeHelp Component
 *
 * Displays comprehensive help text for income tracking and the $580/month threshold.
 * Explains what types of income count, seasonal worker provisions, and edge cases.
 *
 * Features:
 * - Clear explanation of $580 threshold with calculation
 * - "What counts" vs "What doesn't count" sections
 * - Optional seasonal worker information
 * - Edge case examples
 * - Mobile-friendly layout
 */
export function IncomeHelp({ showSeasonalWorkerInfo = true }: IncomeHelpProps) {
  const threshold = incomeDefinitions.threshold;
  const seasonalWorker = incomeDefinitions.seasonalWorker;
  const incomeVsHours = incomeDefinitions.incomeVsHours;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Main Threshold Explanation */}
      <Card
        variant="outlined"
        sx={{
          borderLeft: 4,
          borderLeftColor: "primary.main",
          backgroundColor: "primary.50",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {threshold.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {threshold.definition}
          </Typography>

          {/* Calculation Box */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              backgroundColor: "background.paper",
              border: "2px solid",
              borderColor: "primary.main",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {threshold.calculation}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            {threshold.note}
          </Alert>
        </CardContent>
      </Card>

      {/* Income OR Hours Choice */}
      <HelpSection
        title={incomeVsHours.title}
        content={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {incomeVsHours.definition}
            </Typography>

            {incomeVsHours.options?.map((option, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {option.option}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {option.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "success.main",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                  {option.benefit}
                </Typography>
              </Box>
            ))}

            <Alert severity="success" sx={{ mt: 1 }}>
              {incomeVsHours.note}
            </Alert>
          </Box>
        }
        icon={<InfoOutlinedIcon fontSize="small" />}
        defaultExpanded={false}
      />

      {/* What Counts */}
      <HelpSection
        title={threshold.whatCounts?.title || "What Types of Income Count?"}
        content={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {threshold.whatCounts?.description}
            </Typography>
            <List dense sx={{ py: 0 }}>
              {threshold.whatCounts?.examples.map((example, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 20, color: "success.main", mr: 1 }}
                  />
                  <ListItemText
                    primary={example}
                    primaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        }
        icon={<CheckCircleOutlineIcon fontSize="small" />}
        variant="default"
        defaultExpanded={false}
      />

      {/* What Doesn't Count */}
      <HelpSection
        title={
          threshold.whatDoesNotCount?.title ||
          "What Types of Income Do NOT Count?"
        }
        content={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {threshold.whatDoesNotCount?.description}
            </Typography>
            <List dense sx={{ py: 0 }}>
              {threshold.whatDoesNotCount?.examples.map((example, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <CancelOutlinedIcon
                    sx={{ fontSize: 20, color: "error.main", mr: 1 }}
                  />
                  <ListItemText
                    primary={example}
                    primaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        }
        icon={<CancelOutlinedIcon fontSize="small" />}
        variant="default"
        defaultExpanded={false}
      />

      {/* Seasonal Worker Info */}
      {showSeasonalWorkerInfo && (
        <HelpSection
          title={seasonalWorker.title}
          content={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {seasonalWorker.definition}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, mt: 2 }}
              >
                Who Qualifies?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {seasonalWorker.whoQualifies}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, mt: 2 }}
              >
                How to Calculate:
              </Typography>
              <List dense sx={{ py: 0, mb: 2 }}>
                {seasonalWorker.howToCalculate?.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                    <ListItemText
                      primary={`${index + 1}. ${step}`}
                      primaryTypographyProps={{
                        variant: "body2",
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Example Calculation */}
              {seasonalWorker.example && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: "info.lighter",
                    border: "1px solid",
                    borderColor: "info.light",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Example:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {seasonalWorker.example.scenario}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {seasonalWorker.example.calculation}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "success.main", fontWeight: 600 }}
                  >
                    ✓ {seasonalWorker.example.result}
                  </Typography>
                </Box>
              )}
            </Box>
          }
          icon={<InfoOutlinedIcon fontSize="small" />}
          variant="info"
          defaultExpanded={false}
        />
      )}

      {/* Edge Cases for Income */}
      {threshold.edgeCases && (
        <EdgeCaseExamples
          activityType="income"
          examples={threshold.edgeCases}
        />
      )}

      {/* Edge Cases for Seasonal Workers */}
      {showSeasonalWorkerInfo && seasonalWorker.edgeCases && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Seasonal Worker Scenarios:
          </Typography>
          <EdgeCaseExamples
            activityType="income"
            examples={seasonalWorker.edgeCases}
          />
        </Box>
      )}
    </Box>
  );
}

/**
 * CompactIncomeHelp Component
 *
 * A more compact version showing just the threshold and basic info,
 * useful for inline help or tooltips.
 */
export function CompactIncomeHelp() {
  const threshold = incomeDefinitions.threshold;

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {threshold.definition}
      </Typography>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1,
          backgroundColor: "primary.50",
          border: "1px solid",
          borderColor: "primary.light",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          {threshold.calculation}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {threshold.note}
      </Typography>
    </Box>
  );
}
