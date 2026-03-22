const FALLBACK_API_BASE = "https://patent-ipr-backend-express.onrender.com";
const PROXY_BASE = "/backend";

const resolveApiBase = () => {
  const directBase = process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_BASE;

  // In browser, prefer same-origin proxy to avoid CORS issues.
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_USE_DIRECT_API === "true" ? directBase : PROXY_BASE;
  }

  return directBase;
};

export const API_BASE = resolveApiBase().replace(/\/+$/, "");

export function buildApiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiRequest(path, { method = "GET", body, headers = {}, withAuth = true } = {}) {
  const token = getToken();
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (withAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
