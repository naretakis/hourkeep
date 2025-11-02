"use client";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { Activity } from "@/types";
import { format, parseISO } from "date-fns";

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onDuplicate: (activity: Activity) => void;
}

const activityTypeColors = {
  work: "primary",
  volunteer: "success",
  education: "info",
} as const;

const activityTypeLabels = {
  work: "Work",
  volunteer: "Volunteer",
  education: "Education",
} as const;

export function ActivityList({
  activities,
  onEdit,
  onDelete,
  onDuplicate,
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No activities logged yet. Click a date on the calendar to get started!
        </Typography>
      </Paper>
    );
  }

  // Sort activities by date (most recent first)
  const sortedActivities = [...activities].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity Log
      </Typography>
      <List>
        {sortedActivities.map((activity, index) => (
          <Box key={activity.id}>
            {index > 0 && <Divider />}
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton
                    aria-label="duplicate"
                    onClick={() => onDuplicate(activity)}
                    sx={{ mr: 0.5 }}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => onEdit(activity)}
                    sx={{ mr: 0.5 }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(activity)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {format(parseISO(activity.date), "MMM d, yyyy")}
                    </Typography>
                    <Chip
                      label={activityTypeLabels[activity.type]}
                      color={activityTypeColors[activity.type]}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {activity.hours} {activity.hours === 1 ? "hour" : "hours"}
                    </Typography>
                    {activity.organization && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {" • "}
                        {activity.organization}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
}
