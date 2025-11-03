"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { Activity } from "@/types";

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    activity: Omit<Activity, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onDelete?: () => void;
  selectedDate: Date | null;
  existingActivity?: Activity;
}

function ActivityFormContent({
  onClose,
  onSave,
  onDelete,
  selectedDate,
  existingActivity,
}: Omit<ActivityFormProps, "open">) {
  const [type, setType] = useState<"work" | "volunteer" | "education">(
    existingActivity?.type || "work",
  );
  const [hours, setHours] = useState<string>(
    existingActivity?.hours.toString() || "",
  );
  const [organization, setOrganization] = useState<string>(
    existingActivity?.organization || "",
  );
  const [errors, setErrors] = useState<{ hours?: string }>({});
  const [saving, setSaving] = useState(false);

  const validateHours = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setErrors({ hours: "Please enter a valid number" });
      return false;
    }
    if (num < 0 || num > 24) {
      setErrors({ hours: "Hours must be between 0 and 24" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!selectedDate) return;

    if (!validateHours(hours)) return;

    const activity: Omit<Activity, "id" | "createdAt" | "updatedAt"> = {
      date: format(selectedDate, "yyyy-MM-dd"),
      type,
      hours: parseFloat(hours),
      organization: organization.trim() || undefined,
    };

    setSaving(true);
    try {
      await onSave(activity);
      onClose();
    } catch (error) {
      console.error("Error saving activity:", error);
      setErrors({ hours: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
    if (value) {
      validateHours(value);
    } else {
      setErrors({});
    }
  };

  if (!selectedDate) return null;

  return (
    <>
      <DialogTitle>
        {existingActivity ? "Edit Activity" : "Log Activity"}
        <Typography variant="body2" color="text.secondary">
          {format(selectedDate, "MMMM d, yyyy")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={type}
              label="Activity Type"
              onChange={(e) =>
                setType(e.target.value as "work" | "volunteer" | "education")
              }
            >
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="volunteer">Volunteer</MenuItem>
              <MenuItem value="education">Education</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            error={!!errors.hours}
            helperText={errors.hours || "Enter hours between 0 and 24"}
            inputProps={{
              min: 0,
              max: 24,
              step: 0.5,
            }}
            fullWidth
            required
          />

          <TextField
            label="Organization (Optional)"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Where did you work/volunteer/study?"
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {existingActivity && onDelete && (
          <Button
            onClick={handleDelete}
            color="error"
            sx={{ mr: "auto" }}
            disabled={saving}
          >
            Delete
          </Button>
        )}
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!hours || saving}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </>
  );
}

export function ActivityForm({
  open,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  existingActivity,
}: ActivityFormProps) {
  // Use key to reset form state when dialog opens with different data
  const dialogKey = open
    ? `${selectedDate?.toISOString()}-${existingActivity?.id || "new"}`
    : "closed";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      key={dialogKey}
      PaperProps={{
        sx: {
          m: { xs: 2, sm: 3 },
          maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
        },
      }}
    >
      {open && (
        <ActivityFormContent
          onClose={onClose}
          onSave={onSave}
          onDelete={onDelete}
          selectedDate={selectedDate}
          existingActivity={existingActivity}
        />
      )}
    </Dialog>
  );
}
