"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  Warning as WarningIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

interface RescreenDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RescreenDialog({
  open,
  onClose,
  onConfirm,
}: RescreenDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="rescreen-dialog-title"
    >
      <DialogTitle id="rescreen-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Re-screen for Exemptions?
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ready to check your exemption status again? Starting a new screening
          will update your current results.
        </Typography>

        <Alert severity="info" icon={<HistoryIcon />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Don&apos;t worry:</strong> Your current results will be
            saved in your history, so you can always look back at them.
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          Re-screening is helpful when your situation changes, like:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Your health, family, or caregiving situation changed
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            You joined a new program (like SNAP, TANF, or treatment)
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Your work or living situation changed
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ minHeight: 44 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{ minHeight: 44 }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
