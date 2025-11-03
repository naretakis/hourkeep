"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  compressImage,
  validateFile,
  formatFileSize,
  ValidationError,
} from "@/lib/utils/imageCompression";

export default function TestCompressionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      validateFile(file, 10);

      // Compress image
      const compressionResult = await compressImage(file, {
        maxSizeMB: 5,
        quality: 0.8,
        maxDimension: 1920,
        onProgress: setProgress,
      });

      setResult(compressionResult);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError("Failed to compress image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Image Compression Test
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Test the image compression utility with various image sizes:
          </Typography>
          <ul>
            <li>Small images (&lt; 1MB)</li>
            <li>Medium images (1-5MB)</li>
            <li>Large images (5-10MB)</li>
          </ul>

          <Button variant="contained" component="label">
            Select Image
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
            />
          </Button>

          {file && (
            <Box>
              <Typography variant="body2">
                <strong>Selected file:</strong> {file.name}
              </Typography>
              <Typography variant="body2">
                <strong>Original size:</strong> {formatFileSize(file.size)}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {file.type}
              </Typography>
            </Box>
          )}

          {file && !loading && !result && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompress}
            >
              Compress Image
            </Button>
          )}

          {loading && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Compressing... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {result && (
            <Alert severity="success">
              <Typography variant="body2">
                <strong>Compression successful!</strong>
              </Typography>
              <Typography variant="body2">
                Original size: {formatFileSize(result.originalSize)}
              </Typography>
              <Typography variant="body2">
                Compressed size: {formatFileSize(result.compressedSize)}
              </Typography>
              <Typography variant="body2">
                Compression ratio: {(result.compressionRatio * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                Space saved:{" "}
                {formatFileSize(result.originalSize - result.compressedSize)}
              </Typography>
            </Alert>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Results Guide
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Expected behavior:</strong>
        </Typography>
        <ul>
          <li>
            Small images (&lt; 1MB): May increase slightly in size if already
            optimized
          </li>
          <li>
            Medium images (1-5MB): Should compress to 20-50% of original size
          </li>
          <li>
            Large images (5-10MB): Should compress significantly, typically to
            &lt; 2MB
          </li>
          <li>Images &gt; 10MB after compression: Should be rejected</li>
          <li>Non-JPEG/PNG files: Should show validation error</li>
        </ul>
      </Paper>
    </Box>
  );
}
