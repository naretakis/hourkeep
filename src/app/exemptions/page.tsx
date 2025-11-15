"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

/**
 * Exemption Screening - Redirects to Find Your Path
 *
 * The standalone exemption screening has been replaced by the comprehensive
 * "Find Your Path" assessment which includes exemption screening plus work
 * situation analysis to provide personalized compliance recommendations.
 *
 * This page redirects users to the new assessment flow.
 */
export default function ExemptionScreeningPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Find Your Path assessment
    router.push("/find-your-path");
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
