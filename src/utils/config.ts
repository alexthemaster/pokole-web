const STORAGE_KEY_URL = "front_url";

export const getPokoleUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_URL) || "";
};

export const setPokoleUrl = (url: string): void => {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY_URL);
    return;
  }
  let normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  // Ensure protocol is present if not provided, for better UX
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = "https://" + normalizedUrl;
  }
  localStorage.setItem(STORAGE_KEY_URL, normalizedUrl);
};

export const getDisplayUrl = (shortUrl: string): string => {
  return `${getPokoleUrl()}/${shortUrl}`;
};
