const FALLBACK_API_BASE = "https://express-backend-ajedhzd3h0bfbse5.westindia-01.azurewebsites.net";
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
  const raw = localStorage.getItem("token");
  if (!raw) return null;

  const normalized = raw.replace(/^Bearer\s+/i, "").trim();
  return normalized || null;
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
  const clean = {
    title: (payload.title || "").trim(),
    description: (payload.abstractText || payload.description || "").trim(),
    fieldOfInvention: (payload.fieldOfInvention || "").trim(),
    fieldOfInventionOther: (payload.fieldOfInventionOther || "").trim(),
    applicantName: (payload.applicantName || "").trim(),
    applicantEmail: (payload.applicantEmail || "").trim(),
    applicantMobile: (payload.applicantMobile || "").replace(/\D/g, "").trim(),
    supportingDocument: (payload.supportingDocument || "").trim(),
  };

  const params = new URLSearchParams({
    title: clean.title,
    fieldOfInvention: clean.fieldOfInvention,
    abstract: clean.description,
    applicantName: clean.applicantName,
    applicantEmail: clean.applicantEmail,
    applicantMobile: clean.applicantMobile,
  });

  if (clean.fieldOfInvention === "Other" && clean.fieldOfInventionOther) {
    params.set("fieldOfInventionOther", clean.fieldOfInventionOther);
  }

  const legacyBody = {};
  // Legacy contract expects URL string for supportingDocument; avoid posting base64/file blobs.
  if (/^https?:\/\//i.test(clean.supportingDocument)) {
    legacyBody.supportingDocument = clean.supportingDocument;
  }

  const legacy = await apiRequest(`/api/v1/patents/submit?${params.toString()}`, {
    method: "POST",
    body: legacyBody,
  });

  if (legacy.ok || ![404, 405, 501].includes(legacy.status)) {
    return {
      ok: legacy.ok,
      source: "legacy",
      data: legacy.data,
      status: legacy.status,
    };
  }

  // Optional fallback for deployments that expose the newer submit route.
  const modern = await apiRequest("/api/patent/submit", {
    method: "POST",
    body: {
      title: clean.title,
      description: clean.description,
    },
  });

  return {
    ok: modern.ok,
    source: "client",
    data: modern.data,
    status: modern.status,
  };
}
