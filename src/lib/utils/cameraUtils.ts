/**
 * Check if camera is available on the device
 * This checks for the presence of the MediaDevices API and getUserMedia
 */
export function isCameraAvailable(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Check if the device is likely a mobile device
 * Useful for determining default camera behavior
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Get the preferred camera facing mode based on device type
 */
export function getPreferredCameraFacingMode(): "user" | "environment" {
  return isMobileDevice() ? "environment" : "user";
}
