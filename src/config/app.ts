/**
 * Application configuration
 * Centralized place for app-wide constants and URLs
 */

export const APP_CONFIG = {
  name: "HourKeep",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "4.2.0",
  repository: {
    url: "https://github.com/naretakis/hourkeep",
    issuesUrl: "https://github.com/naretakis/hourkeep/issues",
  },
  license: "GPL-3.0-or-later",
  description:
    "Track work, volunteer, and education hours to meet Medicaid work requirements",
} as const;
