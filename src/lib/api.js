const FALLBACK_API_BASE = "https://patent-ipr-backend-springboot-dug6aphbfrfuadh3.southindia-01.azurewebsites.net";

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_BASE).replace(/\/+$/, "");

export function buildApiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
