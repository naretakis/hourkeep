"use client";

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Work as WorkIcon,
  VolunteerActivism as VolunteerIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { Activity } from "@/types";

interface DateActivityMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  activities: Activity[];
  onAddNew: () => void;
  onEditActivity: (activity: Activity) => void;
  selectedDateStr: string;
}

const activityIcons = {
  work: <WorkIcon fontSize="small" />,
  volunteer: <VolunteerIcon fontSize="small" />,
  education: <SchoolIcon fontSize="small" />,
};

const activityColors = {
  work: "primary",
  volunteer: "success",
  education: "info",
} as const;

export function DateActivityMenu({
  anchorEl,
  open,
  onClose,
  activities,
  onAddNew,
  onEditActivity,
  selectedDateStr,
}: DateActivityMenuProps) {
  const handleAddNew = () => {
    onAddNew();
    onClose();
  };

  const handleEdit = (activity: Activity) => {
    onEditActivity(activity);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {selectedDateStr}
        </Typography>
      </Box>

      <MenuItem onClick={handleAddNew}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add New Activity</ListItemText>
      </MenuItem>

      {activities.length > 0 && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Edit Existing:
            </Typography>
          </Box>
          {activities.map((activity) => (
            <MenuItem key={activity.id} onClick={() => handleEdit(activity)}>
              <ListItemIcon>{activityIcons[activity.type]}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={activity.type}
                      color={activityColors[activity.type]}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Typography variant="body2">{activity.hours}h</Typography>
                  </Box>
                }
                secondary={activity.organization}
              />
            </MenuItem>
          ))}
        </>
      )}
    </Menu>
  );
}
