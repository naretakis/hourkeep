import { useState, useCallback, useRef, useEffect } from "react";

interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
}

interface UseCameraReturn {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
  requestCameraPermission: () => Promise<boolean>;
  openCamera: () => Promise<void>;
  closeCamera: () => void;
  isCameraAvailable: boolean;
}

export function useCamera(): UseCameraReturn {
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isLoading: false,
    hasPermission: null,
  });

  const streamRef = useRef<MediaStream | null>(null);

  // Check if camera API is available
  const isCameraAvailable =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;

  // Request camera permission
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (!isCameraAvailable) {
      setState((prev) => ({
        ...prev,
        error: "Camera is not available on this device",
        hasPermission: false,
      }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Request permission by attempting to get stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prefer rear camera
        audio: false,
      });

      // Stop the stream immediately - we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop());

      setState((prev) => ({
        ...prev,
        hasPermission: true,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      let errorMessage = "Unable to access camera";

      if (error instanceof Error) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage =
            "Camera access denied. Please enable camera access in your device settings.";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage =
            "No camera found on this device. Please use the upload option.";
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          errorMessage = "Camera is already in use by another application.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage = "Camera does not meet requirements. Please try again.";
        } else if (error.name === "SecurityError") {
          errorMessage = "Camera access blocked for security reasons.";
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
        isLoading: false,
      }));

      return false;
    }
  }, [isCameraAvailable]);

  // Open camera and get stream
  const openCamera = useCallback(async (): Promise<void> => {
    if (!isCameraAvailable) {
      setState((prev) => ({
        ...prev,
        error: "Camera is not available on this device",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      setState((prev) => ({
        ...prev,
        stream,
        hasPermission: true,
        isLoading: false,
      }));
    } catch (error) {
      let errorMessage = "Unable to access camera";

      if (error instanceof Error) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage =
            "Camera access denied. Please enable camera access in your device settings.";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage =
            "No camera found on this device. Please use the upload option.";
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          errorMessage = "Camera is already in use by another application.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage = "Camera does not meet requirements. Please try again.";
        } else if (error.name === "SecurityError") {
          errorMessage = "Camera access blocked for security reasons.";
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        hasPermission: false,
        isLoading: false,
      }));
    }
  }, [isCameraAvailable]);

  // Close camera and stop stream
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      stream: null,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    stream: state.stream,
    error: state.error,
    isLoading: state.isLoading,
    hasPermission: state.hasPermission,
    requestCameraPermission,
    openCamera,
    closeCamera,
    isCameraAvailable,
  };
}
