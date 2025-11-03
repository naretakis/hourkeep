"use client";

import { useState } from "react";
import { Box, Paper, Typography, IconButton, styled } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface CalendarProps {
  onDateClick: (date: Date, event: React.MouseEvent<HTMLElement>) => void;
  activeDates?: Set<string>; // Set of YYYY-MM-DD strings
  dateHours?: Map<string, number>; // Map of date to total hours
  dateActivityCount?: Map<string, number>; // Map of date to activity count
}

const DayCell = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isCurrentMonth" && prop !== "isToday" && prop !== "hasActivity",
})<{
  isCurrentMonth: boolean;
  isToday: boolean;
  hasActivity: boolean;
}>(({ theme, isCurrentMonth, isToday, hasActivity }) => ({
  aspectRatio: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: isCurrentMonth ? "pointer" : "default",
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  opacity: isCurrentMonth ? 1 : 0.3,
  backgroundColor: isToday ? theme.palette.primary.main : "transparent",
  color: isToday ? theme.palette.primary.contrastText : "inherit",
  border: hasActivity ? `2px solid ${theme.palette.success.main}` : "none",
  "&:hover": isCurrentMonth
    ? {
        backgroundColor: isToday
          ? theme.palette.primary.dark
          : theme.palette.action.hover,
      }
    : {},
}));

export function Calendar({
  onDateClick,
  activeDates = new Set(),
  dateHours = new Map(),
  dateActivityCount = new Map(),
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Paper sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Header with month navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Weekday headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: { xs: 0.5, sm: 1 },
          mb: 1,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              fontWeight: "bold",
              color: "text.secondary",
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar days */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const hasActivity = activeDates.has(dateStr);
          const hours = dateHours.get(dateStr);
          const activityCount = dateActivityCount.get(dateStr) || 0;

          return (
            <DayCell
              key={day.toISOString()}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              hasActivity={hasActivity}
              onClick={(e) => isCurrentMonth && onDateClick(day, e)}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: hasActivity ? 600 : 400 }}
              >
                {format(day, "d")}
              </Typography>
              {hasActivity && hours !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    color: isTodayDate ? "inherit" : "success.main",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {hours}h
                  {activityCount > 1 && (
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.6rem",
                        ml: 0.25,
                        opacity: 0.7,
                      }}
                    >
                      ({activityCount})
                    </Typography>
                  )}
                </Typography>
              )}
            </DayCell>
          );
        })}
      </Box>
    </Paper>
  );
}
