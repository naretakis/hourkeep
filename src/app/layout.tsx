"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme/theme";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { StorageWarning } from "@/components/settings/StorageWarning";
import createEmotionCache from "@/lib/emotion-cache";
import "./globals.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Get the base path from the environment
// In production (GitHub Pages), this will be "/hourkeep"
// In development, this will be ""
const basePath = process.env.NODE_ENV === "production" ? "/hourkeep" : "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="application-name" content="HourKeep" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HourKeep" />
        <meta
          name="description"
          content="Track your work hours to maintain your Medicaid benefits"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${basePath}/icon-192x192.png`} />

        {/* Plausible Analytics - Privacy-first, lightweight analytics */}
        {/* Tracks: anonymous page views, device types, browsers, and regions/states */}
        {/* Does NOT track: personal data, activity logs, documents, or exemption data */}
        {/* Automatically respects "Do Not Track" browser setting */}
        {/* Learn more: https://plausible.io/privacy */}
        <script
          async
          src="https://plausible.io/js/pa-64XPjrue2mBz6ntqkjaaZ.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <CacheProvider value={clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <OfflineIndicator />
            <StorageWarning />
            {children}
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
