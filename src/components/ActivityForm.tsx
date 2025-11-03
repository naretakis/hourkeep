"use client";

import { useState, useEffect } from "react";
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
  Badge,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Alert,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Activity } from "@/types";
import { Document } from "@/types/documents";
import { DocumentCapture } from "@/components/documents/DocumentCapture";
import { DocumentMetadataForm } from "@/components/documents/DocumentMetadataForm";
import {
  getDocumentsByActivity,
  deleteDocument,
  getDocumentBlob,
} from "@/lib/storage/documents";

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

type DocumentCaptureMode = "form" | "capture" | "metadata";

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

  // Document capture state
  const [captureMode, setCaptureMode] = useState<DocumentCaptureMode>("form");
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  // Document display state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentUrls, setDocumentUrls] = useState<Map<number, string>>(
    new Map(),
  );
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

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

  // Document capture handlers
  const handleAddDocument = () => {
    setCaptureMode("capture");
  };

  const handleDocumentCapture = (blob: Blob) => {
    setCapturedBlob(blob);
    setCaptureMode("metadata");
  };

  const handleDocumentSave = async (documentId: number) => {
    console.log("Document saved with ID:", documentId);
    setCapturedBlob(null);
    setCaptureMode("form");
    // Reload documents
    if (existingActivity?.id) {
      await loadDocuments(existingActivity.id);
    }
  };

  const handleDocumentCancel = () => {
    setCapturedBlob(null);
    setCaptureMode("form");
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocument(documentId);
      // Reload documents
      if (existingActivity?.id) {
        await loadDocuments(existingActivity.id);
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Load documents for the activity
  const loadDocuments = async (activityId: number) => {
    setLoadingDocuments(true);
    try {
      const docs = await getDocumentsByActivity(activityId);
      setDocuments(docs);

      // Load blob URLs for thumbnails
      const urls = new Map<number, string>();
      for (const doc of docs) {
        try {
          const blobData = await getDocumentBlob(doc.blobId);
          if (blobData) {
            const url = URL.createObjectURL(blobData.blob);
            urls.set(doc.id!, url);
          }
        } catch (error) {
          console.error("Error loading document blob:", error);
        }
      }
      setDocumentUrls(urls);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Load documents when activity changes
  useEffect(() => {
    if (existingActivity?.id) {
      loadDocuments(existingActivity.id);
    }

    // Cleanup blob URLs on unmount
    return () => {
      documentUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [existingActivity?.id]);

  if (!selectedDate) return null;

  // Show document capture view
  if (captureMode === "capture") {
    return (
      <>
        <DialogTitle>Add Document</DialogTitle>
        <DialogContent>
          <DocumentCapture
            onCapture={handleDocumentCapture}
            onCancel={handleDocumentCancel}
          />
        </DialogContent>
      </>
    );
  }

  // Show document metadata form
  if (captureMode === "metadata" && capturedBlob && existingActivity?.id) {
    return (
      <>
        <DialogTitle>Document Details</DialogTitle>
        <DialogContent>
          <DocumentMetadataForm
            blob={capturedBlob}
            activityId={existingActivity.id}
            captureMethod="camera"
            onSave={handleDocumentSave}
            onCancel={handleDocumentCancel}
          />
        </DialogContent>
      </>
    );
  }

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

          {/* Documents Section - Only show for existing activities */}
          {existingActivity?.id && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Documents
                {documents.length > 0 && (
                  <Badge
                    badgeContent={documents.length}
                    color="primary"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>

              {loadingDocuments ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : documents.length === 0 ? (
                <Alert severity="info" sx={{ mt: 1 }}>
                  No documents yet. Click &quot;Add Document&quot; below to
                  attach verification documents.
                </Alert>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    py: 1,
                    "&::-webkit-scrollbar": {
                      height: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderRadius: 4,
                    },
                  }}
                >
                  {documents.map((doc) => (
                    <Card
                      key={doc.id}
                      sx={{
                        minWidth: 120,
                        maxWidth: 120,
                        flexShrink: 0,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={documentUrls.get(doc.id!) || ""}
                        alt={doc.type}
                        sx={{
                          objectFit: "cover",
                          backgroundColor: "grey.200",
                        }}
                      />
                      <CardActions
                        sx={{
                          p: 0.5,
                          justifyContent: "space-between",
                          minHeight: "auto",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            // TODO: Implement full-size viewer in task 7
                            console.log("View document:", doc.id);
                          }}
                          title="View"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirm(doc.id!)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Delete Confirmation */}
              {deleteConfirm !== null && (
                <Alert
                  severity="warning"
                  sx={{ mt: 2 }}
                  action={
                    <Box>
                      <Button
                        size="small"
                        onClick={() => handleDeleteDocument(deleteConfirm)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  }
                >
                  Delete this document?
                </Alert>
              )}
            </Box>
          )}
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
        {existingActivity?.id && (
          <Button
            onClick={handleAddDocument}
            startIcon={<AttachFileIcon />}
            disabled={saving}
            sx={{ mr: "auto" }}
          >
            Add Document
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
