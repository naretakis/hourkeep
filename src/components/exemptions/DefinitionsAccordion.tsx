"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TermDefinition } from "@/lib/exemptions/definitions";

interface DefinitionsAccordionProps {
  definitions: TermDefinition[];
  /**
   * Summary text shown when collapsed
   * @default "What do these terms mean?"
   */
  summaryText?: string;
}

/**
 * DefinitionsAccordion Component
 *
 * Displays multiple definitions in a clean, expandable accordion.
 * Better UX than multiple tooltips when there are many terms to define.
 *
 * Features:
 * - Single expandable section for all definitions
 * - Clean, organized layout
 * - Mobile-friendly with large touch targets
 * - Shows term count in summary
 */
export function DefinitionsAccordion({
  definitions,
  summaryText = "What do these terms mean?",
}: DefinitionsAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  if (definitions.length === 0) {
    return null;
  }

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        mt: 2,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        "&:before": {
          display: "none",
        },
        borderRadius: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="definitions-content"
        id="definitions-header"
        sx={{
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56,
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        <InfoOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {summaryText}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: "auto", mr: 1 }}
        >
          {definitions.length} {definitions.length === 1 ? "term" : "terms"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List sx={{ py: 0 }}>
          {definitions.map((definition, index) => (
            <React.Fragment key={definition.term}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <ListItem sx={{ px: 0, py: 1, alignItems: "flex-start" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {definition.term}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {definition.definition}
                  </Typography>
                  {definition.examples && definition.examples.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                      >
                        Examples:
                      </Typography>
                      <List dense sx={{ py: 0, pl: 2 }}>
                        {definition.examples.map((example, exampleIndex) => (
                          <ListItem key={exampleIndex} sx={{ py: 0, px: 0 }}>
                            <ListItemText
                              primary={`• ${example}`}
                              slotProps={{
                                primary: {
                                  variant: "caption",
                                  color: "text.secondary",
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * CompactDefinitionsAccordion Component
 *
 * A more compact version that shows just term names and short definitions,
 * useful when there are many definitions.
 */
interface CompactDefinitionsAccordionProps {
  definitions: TermDefinition[];
  summaryText?: string;
}

export function CompactDefinitionsAccordion({
  definitions,
  summaryText = "What do these terms mean?",
}: CompactDefinitionsAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  if (definitions.length === 0) {
    return null;
  }

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        mt: 2,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        "&:before": {
          display: "none",
        },
        borderRadius: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="definitions-content"
        id="definitions-header"
        sx={{
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56,
          },
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        <InfoOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {summaryText}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: "auto", mr: 1 }}
        >
          {definitions.length} {definitions.length === 1 ? "term" : "terms"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {definitions.map((definition) => (
            <Box key={definition.term}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, display: "inline" }}
              >
                {definition.term}:{" "}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline" }}
              >
                {definition.definition}
              </Typography>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
