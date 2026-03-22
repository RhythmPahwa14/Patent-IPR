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

function normalizePatent(item = {}) {
  return {
    id: item.id || item.patentId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || "",
    patentId: item.patentId || item.id || "",
    title: item.title || item.name || "",
    fieldOfInvention: item.fieldOfInvention || item.category || "",
    fieldOfInventionOther: item.fieldOfInventionOther || "",
    abstractText: item.abstractText || item.description || "",
    supportingDocumentUrl: item.supportingDocumentUrl || "",
    applicantName: item.applicantName || "",
    applicantEmail: item.applicantEmail || "",
    applicantMobile: item.applicantMobile || "",
    status: item.status || item.patentStatus || "",
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
  };
}

function extractPatentArray(data) {
  const candidates = [
    data?.data?.content,
    data?.data?.patents,
    data?.data,
    data?.content,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

export async function getClientPatents({ page = 0, size = 10, status, sort = "submittedAt,desc" } = {}) {
  const primary = await apiRequest("/api/client/patents", { method: "GET" });
  if (primary.ok) {
    const list = extractPatentArray(primary.data).map(normalizePatent);
    return {
      ok: true,
      source: "client",
      items: list,
      pagination: {
        page: 0,
        size: list.length,
        totalElements: list.length,
        totalPages: 1,
      },
      data: primary.data,
    };
  }

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (status) params.set("status", status);

  const legacy = await apiRequest(`/api/v1/patents/user/filings?${params.toString()}`, { method: "GET" });
  if (!legacy.ok) {
    return {
      ok: false,
      source: "legacy",
      items: [],
      pagination: {
        page,
        size,
        totalElements: 0,
        totalPages: 0,
      },
      data: legacy.data,
      status: legacy.status,
    };
  }

  const payload = legacy.data?.data || {};
  const list = extractPatentArray(legacy.data).map(normalizePatent);
  return {
    ok: true,
    source: "legacy",
    items: list,
    pagination: {
      page: payload.pageable?.page ?? page,
      size: payload.pageable?.size ?? size,
      totalElements: payload.pageable?.totalElements ?? list.length,
      totalPages: payload.pageable?.totalPages ?? (list.length > 0 ? 1 : 0),
    },
    data: legacy.data,
  };
}

export async function submitClientPatent(payload = {}) {
  const primaryBody = {
    title: payload.title || "",
    description: payload.abstractText || payload.description || "",
  };

  const primary = await apiRequest("/api/patent/submit", {
    method: "POST",
    body: primaryBody,
  });

  if (primary.ok) {
    return {
      ok: true,
      source: "client",
      data: primary.data,
      status: primary.status,
    };
  }

  const params = new URLSearchParams({
    title: payload.title || "",
    fieldOfInvention: payload.fieldOfInvention || "",
    abstract: payload.abstractText || payload.description || "",
    applicantName: payload.applicantName || "",
    applicantEmail: payload.applicantEmail || "",
    applicantMobile: payload.applicantMobile || "",
  });

  if (payload.fieldOfInvention === "Other" && payload.fieldOfInventionOther) {
    params.set("fieldOfInventionOther", payload.fieldOfInventionOther);
  }

  const legacy = await apiRequest(`/api/v1/patents/submit?${params.toString()}`, {
    method: "POST",
    body: {
      supportingDocument: payload.supportingDocument || "",
    },
  });

  return {
    ok: legacy.ok,
    source: "legacy",
    data: legacy.data,
    status: legacy.status,
  };
}
