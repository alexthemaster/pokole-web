const STORAGE_KEY_API = "api_url";
const STORAGE_KEY_FRONT = "front_url";
const DEFAULT_API_URL = "http://localhost:8080";

export const getApiUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_API) || DEFAULT_API_URL;
};

export const setApiUrl = (url: string): void => {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY_API);
    return;
  }
  const normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  localStorage.setItem(STORAGE_KEY_API, normalizedUrl);
};

export const getFrontUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_FRONT) || "";
};

export const setFrontUrl = (url: string): void => {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY_FRONT);
    return;
  }
  let normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  // Ensure protocol is present if not provided, for better UX
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = "https://" + normalizedUrl;
  }
  localStorage.setItem(STORAGE_KEY_FRONT, normalizedUrl);
};

export const getDisplayUrl = (originalUrl: string): string => {
  const front = getFrontUrl();
  if (!front || !originalUrl) return originalUrl;

  try {
    const urlObj = new URL(originalUrl);
    // Replace the origin (protocol + host + port) with the configured frontend URL
    return originalUrl.replace(urlObj.origin, front);
  } catch {
    // If it is a relative path, prepend the frontend URL
    if (originalUrl.startsWith("/")) {
      return `${front}${originalUrl}`;
    }
    return `${front}/${originalUrl}`;
  }
};
