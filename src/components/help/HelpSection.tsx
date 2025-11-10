"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface HelpSectionProps {
  /**
   * Title shown in the accordion header
   */
  title: string;
  /**
   * Content to display when expanded (can be string or React node)
   */
  content: string | React.ReactNode;
  /**
   * Whether the section should be expanded by default
   */
  defaultExpanded?: boolean;
  /**
   * Optional icon to show before the title
   */
  icon?: React.ReactNode;
  /**
   * Visual variant for different contexts
   */
  variant?: "default" | "info" | "warning";
  /**
   * Optional storage key to persist expanded state
   */
  storageKey?: string;
}

/**
 * HelpSection Component
 *
 * A reusable expandable section for help content. Based on the DefinitionsAccordion
 * pattern from the exemption screener but more flexible for general help content.
 *
 * Features:
 * - Smooth expand/collapse animation (300ms)
 * - Optional state persistence in sessionStorage
 * - Customizable icon and variant
 * - Mobile-friendly with large touch targets
 * - Consistent styling with exemption screener
 */
export function HelpSection({
  title,
  content,
  defaultExpanded = false,
  icon,
  variant = "default",
  storageKey,
}: HelpSectionProps) {
  // Load initial state from storage if key provided
  const getInitialExpanded = () => {
    if (storageKey && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        return stored === "true";
      }
    }
    return defaultExpanded;
  };

  const [expanded, setExpanded] = useState(getInitialExpanded);

  // Save state to storage when it changes
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, expanded.toString());
    }
  }, [expanded, storageKey]);

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Get colors based on variant
  const getVariantColors = () => {
    switch (variant) {
      case "info":
        return {
          borderColor: "info.light",
          iconColor: "info.main",
          backgroundColor: "info.lighter",
        };
      case "warning":
        return {
          borderColor: "warning.light",
          iconColor: "warning.main",
          backgroundColor: "warning.lighter",
        };
      default:
        return {
          borderColor: "divider",
          iconColor: "primary",
          backgroundColor: "grey.50",
        };
    }
  };

  const colors = getVariantColors();

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        mt: 2,
        boxShadow: "none",
        border: "1px solid",
        borderColor: colors.borderColor,
        "&:before": {
          display: "none",
        },
        borderRadius: 1,
        transition: "all 300ms ease-in-out",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-content`}
        id={`${title}-header`}
        sx={{
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56,
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            transition: "transform 300ms ease-in-out",
          },
        }}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: colors.iconColor,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 1,
          pb: 2,
          backgroundColor: colors.backgroundColor,
          transition: "background-color 300ms ease-in-out",
        }}
      >
        {typeof content === "string" ? (
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        ) : (
          content
        )}
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * CompactHelpSection Component
 *
 * A more compact version without background color changes,
 * useful for nested or inline help sections.
 */
export interface CompactHelpSectionProps {
  title: string;
  content: string | React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

export function CompactHelpSection({
  title,
  content,
  defaultExpanded = false,
  icon,
}: CompactHelpSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        boxShadow: "none",
        border: "none",
        "&:before": {
          display: "none",
        },
        backgroundColor: "transparent",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 48,
          px: 0,
          "&.Mui-expanded": {
            minHeight: 48,
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
            my: 1,
          },
        }}
      >
        {icon && (
          <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>
        )}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0, pb: 1 }}>
        {typeof content === "string" ? (
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        ) : (
          content
        )}
      </AccordionDetails>
    </Accordion>
  );
}
