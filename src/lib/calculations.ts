import { Activity, MonthlySummary } from "@/types";
import { format } from "date-fns";

/**
 * Calculate monthly summary from activities
 * @param activities - Array of activities to calculate from
 * @param month - Month in YYYY-MM format (defaults to current month)
 * @returns MonthlySummary object with totals and compliance status
 */
export function calculateMonthlySummary(
  activities: Activity[],
  month?: string,
): MonthlySummary {
  // Use provided month or default to current month
  const targetMonth = month || format(new Date(), "yyyy-MM");

  // Filter activities for the target month
  const monthActivities = activities.filter((activity) =>
    activity.date.startsWith(targetMonth),
  );

  // Calculate totals by type
  let workHours = 0;
  let volunteerHours = 0;
  let educationHours = 0;

  monthActivities.forEach((activity) => {
    switch (activity.type) {
      case "work":
        workHours += activity.hours;
        break;
      case "volunteer":
        volunteerHours += activity.hours;
        break;
      case "education":
        educationHours += activity.hours;
        break;
    }
  });

  // Calculate total hours
  const totalHours = workHours + volunteerHours + educationHours;

  // Determine compliance (80 hours required)
  const isCompliant = totalHours >= 80;

  // Calculate hours needed (0 if compliant)
  const hoursNeeded = isCompliant ? 0 : 80 - totalHours;

  return {
    month: targetMonth,
    totalHours,
    workHours,
    volunteerHours,
    educationHours,
    isCompliant,
    hoursNeeded,
  };
}
