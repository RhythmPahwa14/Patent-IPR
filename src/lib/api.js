const FALLBACK_API_BASE = "https://express-backend-ajedhzd3h0bfbse5.westindia-01.azurewebsites.net";
export const API_BASE = FALLBACK_API_BASE.replace(/\/+$/, "");

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
  const primaryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (status) primaryParams.set("status", status);

  const primary = await apiRequest(`/api/client/patents?${primaryParams.toString()}`, { method: "GET" });
  if (primary.ok) {
    const list = extractPatentArray(primary.data).map(normalizePatent);
    const payload = primary.data?.data || {};
    return {
      ok: true,
      source: "client",
      items: list,
      pagination: {
        page: payload.pageable?.page ?? page,
        size: payload.pageable?.size ?? size,
        totalElements: payload.pageable?.totalElements ?? list.length,
        totalPages: payload.pageable?.totalPages ?? (list.length > 0 ? 1 : 0),
      },
      data: primary.data,
    };
  }

  // If modern endpoint exists but returns a business/validation error,
  // surface that directly instead of forcing legacy fallback.
  if (![404, 405, 501].includes(primary.status)) {
    return {
      ok: false,
      source: "client",
      items: [],
      pagination: {
        page,
        size,
        totalElements: 0,
        totalPages: 0,
      },
      data: primary.data,
      status: primary.status,
    };
  }

  const legacyParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (status) legacyParams.set("status", status);

  const legacy = await apiRequest(`/api/v1/patents/user/filings?${legacyParams.toString()}`, { method: "GET" });
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

  const modernBody = {
    title: clean.title,
    fieldOfInvention: clean.fieldOfInvention,
    fieldOfInventionOther:
      clean.fieldOfInvention === "Other"
        ? clean.fieldOfInventionOther
        : "Not Applicable",
    abstractText: clean.description,
    // Some backend builds validate `abstract` while others validate `abstractText`.
    abstract: clean.description,
    applicantName: clean.applicantName,
    applicantEmail: clean.applicantEmail,
    applicantMobile: clean.applicantMobile,
    saveAsDraft: false,
  };
  if (/^https?:\/\//i.test(clean.supportingDocument)) {
    modernBody.supportingDocumentUrl = clean.supportingDocument;
    modernBody.supportingDocument = clean.supportingDocument;
  }

  const modern = await apiRequest("/api/patent-filings", {
    method: "POST",
    body: modernBody,
  });

  return {
    ok: modern.ok,
    source: "modern",
    data: modern.data,
    status: modern.status,
  };
}

export async function getPatentByReference(referenceNumber = "") {
  const ref = String(referenceNumber || "").trim();
  if (!ref) {
    return { ok: false, source: "none", data: null, status: 400 };
  }

  const encodedRef = encodeURIComponent(ref);

  const primary = await apiRequest(`/api/patent-filings/${encodedRef}`);
  if (primary.ok) {
    const payload = primary.data?.data || primary.data || {};
    return {
      ok: true,
      source: "modern",
      data: normalizePatent(payload),
      status: primary.status,
      raw: primary.data,
    };
  }

  const legacy = await apiRequest(`/api/v1/patents/${encodedRef}`);
  if (!legacy.ok) {
    return {
      ok: false,
      source: "legacy",
      data: legacy.data,
      status: legacy.status,
    };
  }

  const legacyPayload = legacy.data?.data || legacy.data || {};
  return {
    ok: true,
    source: "legacy",
    data: normalizePatent(legacyPayload),
    status: legacy.status,
    raw: legacy.data,
  };
}
