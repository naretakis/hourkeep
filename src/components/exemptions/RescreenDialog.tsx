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
          Starting a new screening will replace your current exemption results.
        </Typography>

        <Alert severity="info" icon={<HistoryIcon />} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Don&apos;t worry:</strong> Your current results will be
            saved in your screening history for future reference.
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          You should re-screen if your circumstances have changed, such as:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Your age, health, or family situation has changed
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            You&apos;ve enrolled in new programs (SNAP, TANF, rehabilitation)
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Your employment or caregiving status has changed
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
