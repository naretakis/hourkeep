"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

/**
 * Exemption Screening - Redirects to How to HourKeep
 *
 * The standalone exemption screening has been replaced by the comprehensive
 * "How to HourKeep" assessment which includes exemption screening plus work
 * situation analysis to provide personalized compliance recommendations.
 *
 * This page redirects users to the new assessment flow.
 */
export default function ExemptionScreeningPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to How to HourKeep assessment
    router.push("/how-to-hourkeep");
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
