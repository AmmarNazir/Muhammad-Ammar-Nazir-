/**
 * Helper to process Google Drive links for low-storage file sharing
 */

export function getGoogleDriveDirectLink(url?: string): string {
  if (!url) return '';

  // Check if it's already a standard image or url
  if (!url.includes('drive.google.com')) {
    return url;
  }

  // Format 1: /file/d/{id}/view
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    // Google's direct preview CDN for drive images
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Format 2: ?id={id}
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    const fileId = idParamMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
}

export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}
