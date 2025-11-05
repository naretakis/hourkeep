"use client";

import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TermDefinition } from "@/lib/exemptions/definitions";

interface DefinitionTooltipProps {
  definition: TermDefinition;
  /**
   * Size of the info icon
   * @default "small"
   */
  size?: "small" | "medium" | "large";
  /**
   * Color of the info icon
   * @default "primary"
   */
  color?: "primary" | "secondary" | "default" | "inherit";
}

/**
 * DefinitionTooltip Component
 *
 * Displays a plain language definition in a tooltip when the user taps/hovers
 * over an info icon. Designed for mobile-first with large touch targets.
 *
 * Features:
 * - 44px+ touch target for accessibility
 * - Works with screen readers (ARIA labels)
 * - Keyboard navigable
 * - Shows term, definition, and examples
 */
export function DefinitionTooltip({
  definition,
  size = "small",
  color = "primary",
}: DefinitionTooltipProps) {
  const [open, setOpen] = useState(false);

  const handleTooltipToggle = () => {
    setOpen(!open);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <Tooltip
      title={
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            {definition.term}
          </Typography>
          <Typography variant="body2" sx={{ mb: definition.examples ? 1 : 0 }}>
            {definition.definition}
          </Typography>
          {definition.examples && definition.examples.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", display: "block", mt: 1, mb: 0.5 }}
              >
                Examples:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {definition.examples.map((example, index) => (
                  <ListItem key={index} sx={{ py: 0, px: 0 }}>
                    <ListItemText
                      primary={`• ${example}`}
                      primaryTypographyProps={{
                        variant: "caption",
                        sx: { fontSize: "0.75rem" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      }
      open={open}
      onClose={handleTooltipClose}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
      placement="top"
    >
      <IconButton
        onClick={handleTooltipToggle}
        size={size}
        color={color}
        aria-label={`Definition of ${definition.term}`}
        sx={{
          // Ensure 44px minimum touch target for accessibility
          minWidth: 44,
          minHeight: 44,
          padding: size === "small" ? 1.5 : 2,
        }}
      >
        <InfoOutlinedIcon fontSize={size} />
      </IconButton>
    </Tooltip>
  );
}

/**
 * InlineDefinition Component
 *
 * Displays a definition inline with the text, useful for very short definitions
 * that don't need a tooltip.
 */
interface InlineDefinitionProps {
  term: string;
  definition: string;
}

export function InlineDefinition({ term, definition }: InlineDefinitionProps) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline",
        borderBottom: "1px dotted",
        borderColor: "text.secondary",
        cursor: "help",
      }}
      title={definition}
    >
      {term}
    </Box>
  );
}
