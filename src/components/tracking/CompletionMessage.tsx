"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  FileDownload as FileDownloadIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

interface CompletionMessageProps {
  monthsCompleted: number;
  monthsRequired: number;
  onExport: () => void;
  onContinueTracking: () => void;
  onSetReminder?: () => void;
}

export function CompletionMessage({
  monthsCompleted,
  monthsRequired,
  onExport,
  onContinueTracking,
  onSetReminder,
}: CompletionMessageProps) {
  // Only show if goal is complete
  if (monthsCompleted < monthsRequired) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        bgcolor: "success.50",
        border: "2px solid",
        borderColor: "success.main",
      }}
    >
      {/* Success Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 48, color: "success.main" }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="success.dark">
            🎉 Goal Complete!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You&apos;ve completed all {monthsRequired} required month
            {monthsRequired !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Next Steps */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          What&apos;s Next?
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <FileDownloadIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Export your report"
              secondary="Generate a PDF with all your tracked hours and documents"
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <CalendarIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Submit to your state"
              secondary="Send your report to your Medicaid office by mail, fax, or online portal"
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <TrendingUpIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Keep tracking (optional)"
              secondary="Continue logging hours to stay ready for future renewals"
            />
          </ListItem>
        </List>
      </Box>

      {/* Renewal Reminder */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          💡 Remember: Renewals happen every 6 months
        </Typography>
        <Typography variant="body2">
          You&apos;ll need to verify your work hours again at your next renewal.
          Keeping HourKeep updated makes this process much easier!
        </Typography>
      </Alert>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Export Report
        </Button>
        <Button
          variant="outlined"
          startIcon={<TrendingUpIcon />}
          onClick={onContinueTracking}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Continue Tracking
        </Button>
      </Box>

      {/* Set Reminder (Placeholder) */}
      {onSetReminder && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="text"
            startIcon={<NotificationsIcon />}
            onClick={onSetReminder}
            fullWidth
            sx={{ py: 1 }}
          >
            Set Renewal Reminder (Coming Soon)
          </Button>
        </Box>
      )}
    </Paper>
  );
}
