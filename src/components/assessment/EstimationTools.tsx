"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Collapse,
  MenuItem,
  Paper,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

interface HoursConverterProps {
  onUseValue: (monthlyHours: number) => void;
}

export function HoursConverter({ onUseValue }: HoursConverterProps) {
  const [expanded, setExpanded] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState("");

  const monthlyEquivalent = weeklyHours
    ? Math.round(parseFloat(weeklyHours) * 4.33)
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => setExpanded(!expanded)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        }
        sx={{
          textTransform: "none",
          color: "primary.main",
          fontSize: "0.875rem",
        }}
      >
        I only know my weekly hours
      </Button>

      <Collapse in={expanded}>
        <Paper
          sx={{
            p: 2,
            mt: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Weekly to Monthly Converter
          </Typography>

          <TextField
            label="Weekly Hours"
            type="number"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.5,
              },
            }}
            sx={{ mb: 2 }}
          />

          {monthlyEquivalent > 0 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.50",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Monthly equivalent:
              </Typography>
              <Typography variant="h6" color="primary.main">
                {monthlyEquivalent} hours/month
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calculated: {weeklyHours} × 4.33 weeks/month
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              onUseValue(monthlyEquivalent);
              setExpanded(false);
            }}
            disabled={!weeklyHours || monthlyEquivalent === 0}
            fullWidth
          >
            Use This Amount
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
}

interface IncomeConverterProps {
  onUseValue: (monthlyIncome: number) => void;
}

export function IncomeConverter({ onUseValue }: IncomeConverterProps) {
  const [expanded, setExpanded] = useState(false);
  const [paycheckAmount, setPaycheckAmount] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">(
    "biweekly",
  );

  const multipliers = {
    weekly: 4.33,
    biweekly: 2.17,
    monthly: 1,
  };

  const monthlyEquivalent = paycheckAmount
    ? Math.round(parseFloat(paycheckAmount) * multipliers[frequency])
    : 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => setExpanded(!expanded)}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        }
        sx={{
          textTransform: "none",
          color: "primary.main",
          fontSize: "0.875rem",
        }}
      >
        I only know my paycheck amount
      </Button>

      <Collapse in={expanded}>
        <Paper
          sx={{
            p: 2,
            mt: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Paycheck to Monthly Converter
          </Typography>

          <TextField
            label="Paycheck Amount"
            type="number"
            value={paycheckAmount}
            onChange={(e) => setPaycheckAmount(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              },
              htmlInput: {
                min: 0,
                step: 0.01,
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="How often paid"
            select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as "weekly" | "biweekly" | "monthly")
            }
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="biweekly">Bi-weekly (every 2 weeks)</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </TextField>

          {monthlyEquivalent > 0 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.50",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Monthly income:
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${monthlyEquivalent}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Calculated: ${paycheckAmount} × {multipliers[frequency]}{" "}
                {frequency === "monthly"
                  ? ""
                  : frequency === "biweekly"
                    ? "pay periods/month"
                    : "weeks/month"}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              onUseValue(monthlyEquivalent);
              setExpanded(false);
            }}
            disabled={!paycheckAmount || monthlyEquivalent === 0}
            fullWidth
          >
            Use This Amount
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
}
