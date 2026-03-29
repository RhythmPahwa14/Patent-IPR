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
  const agentId = item.assignedAgentId || item.assigned_agent_id || item.agentId || item.agent_id || item.assignedAgent?.id || item.agent?.id || item.assignedTo || item.assigned_to || null;
  const agentName = item.assignedAgentName || item.assigned_agent_name || item.agentName || item.agent_name || item.assignedAgent?.name || item.agent?.name || item.assignedAgent?.fullName || item.agent?.fullName || item.assignedToName || item.assigned_to_name || "";
  
  return {
    id: item.id || item.patentId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || item.reference_number || "",
    patentId: item.patentId || item.patent_id || item.id || "",
    title: item.title || item.name || "",
    fieldOfInvention: item.fieldOfInvention || item.field_of_invention || item.category || "",
    fieldOfInventionOther: item.fieldOfInventionOther || item.field_of_invention_other || "",
    abstractText: item.abstractText || item.abstract_text || item.abstract || item.description || item.briefDescription || item.brief_description || item.authorDetails || item.author_details || "",
    supportingDocumentUrl: item.supportingDocumentUrl || item.supporting_document_url || item.supportingDocument || item.supporting_document || item.documentUrl || item.document_url || "",
    applicantName: item.applicantName || item.applicant_name || item.client?.name || item.client?.fullName || item.user?.name || item.applicant?.name || "",
    applicantEmail: item.applicantEmail || item.applicant_email || item.client?.email || item.user?.email || item.applicant?.email || "",
    applicantMobile: item.applicantMobile || item.applicant_mobile || item.client?.mobile || item.user?.mobile || item.applicant?.mobile || "",
    status: item.status || item.patentStatus || item.patent_status || "",
    assignedAgentId: agentId,
    assignedAgentName: agentName,
    submittedAt: item.submittedAt || item.submitted_at || item.createdAt || item.created_at || null,
    updatedAt: item.updatedAt || item.updated_at || item.createdAt || item.created_at || null,
    raw: item,
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

// ─── Agent Dashboard ─────────────────────────────────────────────────────────
// GET /api/agent/dashboard
export async function getAgentDashboard() {
  const response = await apiRequest("/api/agent/dashboard", { method: "GET" });
  if (!response.ok) {
    return {
      ok: false,
      stats: {
        assignedPatentFilings: { total: 0, byStatus: {} },
        assignedNonPatentFilings: { total: 0, byStatus: {} },
        recentActivity: {},
      },
      status: response.status,
      data: response.data,
    };
  }

  const raw = response.data?.data || response.data || {};
  return {
    ok: true,
    stats: {
      assignedPatentFilings: raw.assignedPatentFilings || { total: 0, byStatus: {} },
      assignedNonPatentFilings: raw.assignedNonPatentFilings || { total: 0, byStatus: {} },
      recentActivity: raw.recentActivity || {},
    },
    status: response.status,
    data: response.data,
  };
}

// ─── Agent Profile ────────────────────────────────────────────────────────────
// GET /api/agent/profile
export async function getAgentProfile() {
  const response = await apiRequest("/api/agent/profile", { method: "GET" });
  if (!response.ok) {
    // Fall back to localStorage
    const stored = getStoredUser();
    if (stored) return { ok: true, profile: stored, status: 200, data: stored };
    return { ok: false, profile: null, status: response.status, data: response.data };
  }

  const raw = response.data?.data || response.data || {};
  return {
    ok: true,
    profile: {
      id: raw.id || "",
      name: raw.name || "",
      email: raw.email || "",
      role: raw.role || "agent",
    },
    status: response.status,
    data: response.data,
  };
}

// ─── Agent Patent Filings ─────────────────────────────────────────────────────
// GET /api/agent/patent-filings
export async function getAgentPatentFilings({ status, search, page = 0, size = 20, sort = "assignedAt,desc" } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const response = await apiRequest(`/api/agent/patent-filings?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], pagination: { page, size, totalElements: 0, totalPages: 0 }, status: response.status, data: response.data };
  }

  let list = extractPatentArray(response.data).map(normalizePatent);
  list = list.filter(i => {
    const ref = (i.referenceNumber || "").toUpperCase();
    const type = (i.raw?.type || i.raw?.filingType || "").toUpperCase();
    return !ref.includes("-TM-") && !ref.includes("-CR-") && !ref.includes("-DS-") && type !== "NON-PATENT";
  });
  const payload = response.data?.data || {};
  return {
    ok: true,
    items: list,
    pagination: {
      page: payload.pageable?.page ?? page,
      size: payload.pageable?.size ?? size,
      totalElements: payload.pageable?.totalElements ?? list.length,
      totalPages: payload.pageable?.totalPages ?? (list.length > 0 ? 1 : 0),
    },
    status: response.status,
    data: response.data,
  };
}

// GET /api/agent/patent-filings/{id}
export async function getAgentPatentFilingById(id = "") {
  const filingId = String(id || "").trim();
  if (!filingId) return { ok: false, status: 400, data: { message: "Filing ID required." } };
  const response = await apiRequest(`/api/agent/patent-filings/${encodeURIComponent(filingId)}`, { method: "GET" });
  return {
    ok: response.ok,
    filing: response.ok ? normalizePatent(response.data?.data?.patent || response.data?.data?.filing || response.data?.data || response.data || {}) : null,
    status: response.status,
    data: response.data,
  };
}

// PATCH /api/agent/patent-filings/{id}/status
export async function updateAgentPatentFilingStatus(filingId = "", status = "", agentNote = "") {
  const id = String(filingId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) return { ok: false, status: 400, data: { message: "Filing ID and status are required." } };
  const body = { status: nextStatus };
  if (agentNote) body.agentNote = agentNote;
  const response = await apiRequest(`/api/agent/patent-filings/${encodeURIComponent(id)}/status`, { method: "PATCH", body });
  return { ok: response.ok, status: response.status, data: response.data };
}

// Legacy export – kept for backward-compat with any pages still importing this name
export async function getAgentPatents({ status, search, page = 0, size = 20, sort = "assignedAt,desc" } = {}) {
  return getAgentPatentFilings({ status, search, page, size, sort });
}

// ─── Agent Non-Patent Filings ─────────────────────────────────────────────────
// GET /api/agent/non-patent-filings
export async function getAgentNonPatentFilings({ status, filingType, search, page = 0, size = 20, sort = "assignedAt,desc" } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  if (status) params.set("status", status);
  if (filingType) params.set("filingType", filingType);
  if (search) params.set("search", search);

  const response = await apiRequest(`/api/agent/non-patent-filings?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], pagination: { page, size, totalElements: 0, totalPages: 0 }, status: response.status, data: response.data };
  }

  const list = extractAdminArray(response.data).map(normalizeAdminFiling);
  const payload = response.data?.data || {};
  return {
    ok: true,
    items: list,
    pagination: {
      page: payload.pageable?.page ?? page,
      size: payload.pageable?.size ?? size,
      totalElements: payload.pageable?.totalElements ?? list.length,
      totalPages: payload.pageable?.totalPages ?? (list.length > 0 ? 1 : 0),
    },
    status: response.status,
    data: response.data,
  };
}

// GET /api/agent/non-patent-filings/{id}
export async function getAgentNonPatentFilingById(id = "") {
  const filingId = String(id || "").trim();
  if (!filingId) return { ok: false, status: 400, data: { message: "Filing ID required." } };
  const response = await apiRequest(`/api/agent/non-patent-filings/${encodeURIComponent(filingId)}`, { method: "GET" });
  return {
    ok: response.ok,
    filing: response.ok ? normalizeAdminFiling(response.data?.data || response.data || {}) : null,
    status: response.status,
    data: response.data,
  };
}

// PATCH /api/agent/non-patent-filings/{id}/status
export async function updateAgentNonPatentFilingStatus(filingId = "", status = "", agentNote = "") {
  const id = String(filingId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) return { ok: false, status: 400, data: { message: "Filing ID and status are required." } };
  const body = { status: nextStatus };
  if (agentNote) body.agentNote = agentNote;
  const response = await apiRequest(`/api/agent/non-patent-filings/${encodeURIComponent(id)}/status`, { method: "PATCH", body });
  return { ok: response.ok, status: response.status, data: response.data };
}

function normalizeAdminFiling(item = {}) {
  return {
    id: item.id || item.filingId || item.patentId || item.patent_id || item.trademarkId || item.copyrightId || item.designId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || item.reference_number || "",
    title: item.title || item.name || item.trademarkName || item.titleOfWork || item.articleName || "",
    type: item.type || item.filingType || (item.trademarkId ? "TRADEMARK" : item.copyrightId ? "COPYRIGHT" : item.designId ? "DESIGN" : ""),
    status: item.status || "",
    applicantName: item.applicantName || item.applicant_name || item.client?.name || item.client?.fullName || item.user?.name || item.applicant?.name || "",
    applicantEmail: item.applicantEmail || item.applicant_email || item.client?.email || item.user?.email || item.applicant?.email || "",
    applicantMobile: item.applicantMobile || item.applicant_mobile || item.client?.mobile || item.user?.mobile || item.applicant?.mobile || "",
    fieldOfInvention: item.fieldOfInvention || item.field_of_invention || item.category || item.classOfTrademark || item.workType || item.locarnoClass || "",
    fieldOfInventionOther: item.fieldOfInventionOther || item.field_of_invention_other || item.colorClaim || item.languageOfWork || item.statementOfNovelty || "",
    abstractText: item.abstractText || item.abstract_text || item.abstract || item.description || item.briefDescription || item.brief_description || item.descriptionGoodsServices || (typeof item.authorDetails === 'string' ? item.authorDetails : item.authorDetails?.name) || "",
    supportingDocumentUrl: item.supportingDocumentUrl || item.supporting_document_url || item.supportingDocument || item.supporting_document || item.documentUrl || item.document_url || item.trademarkLogo || item.workFile || item.representationOfDesign || "",
    assignedAgentId: item.assignedAgentId || item.assigned_agent_id || item.agentId || item.agent_id || item.assignedAgent?.id || item.agent?.id || item.assignedTo || item.assigned_to || null,
    assignedAgentName: item.assignedAgentName || item.assigned_agent_name || item.agentName || item.agent_name || item.assignedAgent?.name || item.agent?.name || item.assignedAgent?.fullName || item.agent?.fullName || item.assignedToName || item.assigned_to_name || "",
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    estimation: item.estimation ?? null,
    client: item.client || null,
    agent: item.agent || null,
    adminNote: item.adminNote || "",
    raw: item,
  };
}

function extractAdminArray(data) {
  const candidates = [
    data?.data?.content,
    data?.data?.filings?.content,
    data?.data?.filings,
    data?.data,
    data?.content,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function extractAdminPageable(data, fallbackPage, fallbackSize, fallbackTotal = 0) {
  const pageable = data?.data?.pageable || data?.data?.filings?.pageable || data?.pageable;

  return {
    page: pageable?.page ?? fallbackPage,
    size: pageable?.size ?? fallbackSize,
    totalElements: pageable?.totalElements ?? fallbackTotal,
    totalPages: pageable?.totalPages ?? (fallbackTotal > 0 ? 1 : 0),
  };
}


// Legacy alias kept for backward-compat – delegates to spec-compliant function
export async function updateAgentPatentStatus(patentId = "", status = "", agentNote = "") {
  return updateAgentPatentFilingStatus(patentId, status, agentNote);
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

const NON_PATENT_FILING_ENDPOINTS = {
  trademark: "/api/trademark-filings",
  copyright: "/api/copyright-filings",
  design: "/api/design-filings",
};

export async function submitNonPatentFiling(filingType = "", payload = {}) {
  const type = String(filingType || "").trim().toLowerCase();
  const endpoint = NON_PATENT_FILING_ENDPOINTS[type];

  if (!endpoint) {
    return {
      ok: false,
      source: "none",
      status: 400,
      data: { message: `Unsupported filing type: ${filingType}` },
    };
  }

  const body = Object.entries(payload || {}).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return acc;
      acc[key] = trimmed;
      return acc;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return acc;
      acc[key] = value;
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});

  body.saveAsDraft = false;

  const response = await apiRequest(endpoint, {
    method: "POST",
    body,
  });

  return {
    ok: response.ok,
    source: type,
    data: response.data,
    status: response.status,
  };
}

const NON_PATENT_LIST_ENDPOINTS = {
  trademark: "/api/client/trademark-filings",
  copyright: "/api/client/copyright-filings",
  design: "/api/client/design-filings",
};

const NON_PATENT_DETAIL_ENDPOINTS = {
  trademark: "/api/trademark-filings",
  copyright: "/api/copyright-filings",
  design: "/api/design-filings",
};

function normalizeTrademark(item = {}) {
  const agentId = item.assignedAgentId || item.assigned_agent_id || item.agentId || item.agent_id || item.assignedAgent?.id || item.agent?.id || item.assignedTo || item.assigned_to || null;
  const agentName = item.assignedAgentName || item.assigned_agent_name || item.agentName || item.agent_name || item.assignedAgent?.name || item.agent?.name || item.assignedAgent?.fullName || item.agent?.fullName || item.assignedToName || item.assigned_to_name || "";
  return {
    id: item.id || item.trademarkId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || "",
    patentId: item.trademarkId || item.id || "",
    title: item.trademarkName || item.title || "",
    fieldOfInvention: item.classOfTrademark || "Trademark",
    fieldOfInventionOther: item.colorClaim || "",
    abstractText: item.descriptionGoodsServices || item.description || "",
    supportingDocumentUrl: item.trademarkLogo || item.supportingDocumentUrl || "",
    applicantName: item.applicantName || "",
    applicantEmail: item.applicantEmail || "",
    applicantMobile: item.applicantMobile || "",
    status: item.status || "",
    assignedAgentId: agentId,
    assignedAgentName: agentName,
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    filingType: "trademark",
    typeLabel: "TRADEMARK FILING",
    typeId: item.trademarkId || item.id || "",
    typeIdLabel: "Trademark ID",
  };
}

function normalizeCopyright(item = {}) {
  const authorText =
    typeof item.authorDetails === "string"
      ? item.authorDetails
      : item.authorDetails?.name || "";

  const agentId = item.assignedAgentId || item.assigned_agent_id || item.agentId || item.agent_id || item.assignedAgent?.id || item.agent?.id || item.assignedTo || item.assigned_to || null;
  const agentName = item.assignedAgentName || item.assigned_agent_name || item.agentName || item.agent_name || item.assignedAgent?.name || item.agent?.name || item.assignedAgent?.fullName || item.agent?.fullName || item.assignedToName || item.assigned_to_name || "";

  return {
    id: item.id || item.copyrightId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || "",
    patentId: item.copyrightId || item.id || "",
    title: item.titleOfWork || item.title || "",
    fieldOfInvention: item.workType || "Copyright",
    fieldOfInventionOther: item.languageOfWork || "",
    abstractText: item.briefDescription || authorText || "",
    supportingDocumentUrl: item.workFile || item.supportingDocumentUrl || "",
    applicantName: item.applicantName || "",
    applicantEmail: item.applicantEmail || "",
    applicantMobile: item.applicantMobile || "",
    status: item.status || "",
    assignedAgentId: agentId,
    assignedAgentName: agentName,
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    filingType: "copyright",
    typeLabel: "COPYRIGHT FILING",
    typeId: item.copyrightId || item.id || "",
    typeIdLabel: "Copyright ID",
  };
}

function normalizeDesign(item = {}) {
  const agentId = item.assignedAgentId || item.assigned_agent_id || item.agentId || item.agent_id || item.assignedAgent?.id || item.agent?.id || item.assignedTo || item.assigned_to || null;
  const agentName = item.assignedAgentName || item.assigned_agent_name || item.agentName || item.agent_name || item.assignedAgent?.name || item.agent?.name || item.assignedAgent?.fullName || item.agent?.fullName || item.assignedToName || item.assigned_to_name || "";
  return {
    id: item.id || item.designId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || "",
    patentId: item.designId || item.id || "",
    title: item.articleName || item.title || "",
    fieldOfInvention: item.locarnoClass || "Design",
    fieldOfInventionOther: item.statementOfNovelty || "",
    abstractText: item.briefDescription || item.description || "",
    supportingDocumentUrl: item.representationOfDesign || item.supportingDocumentUrl || "",
    applicantName: item.applicantName || "",
    applicantEmail: item.applicantEmail || "",
    applicantMobile: item.applicantMobile || "",
    status: item.status || "",
    assignedAgentId: agentId,
    assignedAgentName: agentName,
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    filingType: "design",
    typeLabel: "DESIGN FILING",
    typeId: item.designId || item.id || "",
    typeIdLabel: "Design ID",
  };
}

function normalizeFilingByType(type, item = {}) {
  if (type === "trademark") return normalizeTrademark(item);
  if (type === "copyright") return normalizeCopyright(item);
  if (type === "design") return normalizeDesign(item);

  return {
    ...normalizePatent(item),
    filingType: "patent",
    typeLabel: "PATENT FILING",
    typeId: item.patentId || item.id || "",
    typeIdLabel: "Patent ID",
  };
}

function sortFilings(items = [], sort = "submittedAt,desc") {
  const [fieldRaw, directionRaw] = String(sort || "submittedAt,desc").split(",");
  const field = (fieldRaw || "submittedAt").trim();
  const dir = String(directionRaw || "desc").trim().toLowerCase() === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const left = a?.[field] ?? "";
    const right = b?.[field] ?? "";

    if (field.toLowerCase().includes("at") || field.toLowerCase().includes("date")) {
      const leftTime = left ? new Date(left).getTime() : 0;
      const rightTime = right ? new Date(right).getTime() : 0;
      return (leftTime - rightTime) * dir;
    }

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * dir;
    }

    return String(left).localeCompare(String(right)) * dir;
  });
}

async function getClientNonPatentFilings(type, { page = 0, size = 10, status, sort = "submittedAt,desc" } = {}) {
  const endpoint = NON_PATENT_LIST_ENDPOINTS[type];
  if (!endpoint) {
    return { ok: false, items: [], status: 400, data: { message: `Unsupported filing type: ${type}` } };
  }

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (status) params.set("status", status);

  const response = await apiRequest(`${endpoint}?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return {
      ok: false,
      items: [],
      status: response.status,
      data: response.data,
      pagination: {
        page,
        size,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }

  const payload = response.data?.data || {};
  const list = extractPatentArray(response.data).map((item) => normalizeFilingByType(type, item));

  return {
    ok: true,
    items: list,
    status: response.status,
    data: response.data,
    pagination: {
      page: payload.pageable?.page ?? page,
      size: payload.pageable?.size ?? size,
      totalElements: payload.pageable?.totalElements ?? list.length,
      totalPages: payload.pageable?.totalPages ?? (list.length > 0 ? 1 : 0),
    },
  };
}

export async function getClientFilings({ page = 0, size = 10, status, sort = "submittedAt,desc" } = {}) {
  const fetchSize = Math.max((page + 1) * size, 100);

  const [patents, trademark, copyright, design] = await Promise.all([
    getClientPatents({ page: 0, size: fetchSize, status, sort }),
    getClientNonPatentFilings("trademark", { page: 0, size: fetchSize, status, sort }),
    getClientNonPatentFilings("copyright", { page: 0, size: fetchSize, status, sort }),
    getClientNonPatentFilings("design", { page: 0, size: fetchSize, status, sort }),
  ]);

  const successfulResults = [patents, trademark, copyright, design].filter((result) => result.ok);
  if (successfulResults.length === 0) {
    const firstFailed = patents || trademark || copyright || design;
    return {
      ok: false,
      source: "combined",
      items: [],
      pagination: {
        page,
        size,
        totalElements: 0,
        totalPages: 0,
      },
      status: firstFailed?.status || 500,
      data: firstFailed?.data || null,
    };
  }

  const combined = sortFilings(
    [
      ...(patents.items || []).map((item) => normalizeFilingByType("patent", item)),
      ...(trademark.items || []),
      ...(copyright.items || []),
      ...(design.items || []),
    ],
    sort
  );

  const start = page * size;
  const end = start + size;
  const paged = combined.slice(start, end);

  return {
    ok: true,
    source: "combined",
    items: paged,
    pagination: {
      page,
      size,
      totalElements: combined.length,
      totalPages: Math.ceil(combined.length / size),
    },
    data: {
      data: {
        content: paged,
        pageable: {
          page,
          size,
          totalElements: combined.length,
          totalPages: Math.ceil(combined.length / size),
        },
      },
    },
  };
}

export async function getFilingByReference(referenceNumber = "") {
  const ref = String(referenceNumber || "").trim();
  if (!ref) {
    return { ok: false, source: "none", data: null, status: 400 };
  }

  const patent = await getPatentByReference(ref);
  if (patent.ok) {
    return {
      ok: true,
      source: "patent",
      data: normalizeFilingByType("patent", patent.data || {}),
      status: patent.status,
      raw: patent.raw,
    };
  }

  const encodedRef = encodeURIComponent(ref);
  for (const type of ["trademark", "copyright", "design"]) {
    const endpoint = NON_PATENT_DETAIL_ENDPOINTS[type];
    const response = await apiRequest(`${endpoint}/${encodedRef}`, { method: "GET" });
    if (!response.ok) continue;

    const payload = response.data?.data || response.data || {};
    return {
      ok: true,
      source: type,
      data: normalizeFilingByType(type, payload),
      status: response.status,
      raw: response.data,
    };
  }

  return {
    ok: false,
    source: "combined",
    data: patent.data,
    status: patent.status || 404,
  };
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────
// GET /api/admin/dashboard
export async function getAdminDashboard() {
  const response = await apiRequest("/api/admin/dashboard", { method: "GET" });

  if (!response.ok) {
    return {
      ok: false,
      stats: {
        users: { total: 0, clients: 0, agents: 0 },
        patentFilings: { total: 0, byStatus: {} },
        nonPatentFilings: { total: 0, byStatus: {} },
        recentActivity: {},
      },
      status: response.status,
      data: response.data,
    };
  }

  const raw = response.data?.data || response.data || {};
  return {
    ok: true,
    stats: {
      users: raw.users || { total: 0, clients: 0, agents: 0 },
      patentFilings: raw.patentFilings || { total: 0, byStatus: {} },
      nonPatentFilings: raw.nonPatentFilings || { total: 0, byStatus: {} },
      recentActivity: raw.recentActivity || {},
    },
    status: response.status,
    data: response.data,
  };
}

// ─── Admin Users ────────────────────────────────────────────────────────────
function _normalizeUser(item = {}) {
  return {
    id: item.id || "",
    name: item.name || item.fullName || item.email || "",
    email: item.email || "",
    role: item.role || "client",
    createdAt: item.createdAt || null,
    raw: item,
  };
}

function _extractUserArray(data) {
  const candidates = [data?.data?.content, data?.data?.users, data?.data, data?.content, data];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function _extractUserPageable(data, fallbackPage, fallbackSize, fallbackTotal = 0) {
  const pageable = data?.data?.pageable || data?.pageable;
  return {
    page: pageable?.page ?? fallbackPage,
    size: pageable?.size ?? fallbackSize,
    totalElements: pageable?.totalElements ?? fallbackTotal,
    totalPages: pageable?.totalPages ?? (fallbackTotal > 0 ? 1 : 0),
  };
}

// GET /api/admin/users
export async function getAdminUsers({ role, search, page = 0, size = 20, sort = "createdAt,desc" } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  if (role) params.set("role", role);
  if (search) params.set("search", search);

  const response = await apiRequest(`/api/admin/users?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], pagination: { page, size, totalElements: 0, totalPages: 0 }, status: response.status, data: response.data };
  }

  const list = _extractUserArray(response.data).map(_normalizeUser);
  return { ok: true, items: list, pagination: _extractUserPageable(response.data, page, size, list.length), status: response.status, data: response.data };
}

export async function getAdminClients({ page = 0, size = 20, search } = {}) {
  return getAdminUsers({ role: "client", page, size, search });
}

export async function getAdminAgentUsers({ page = 0, size = 20, search } = {}) {
  return getAdminUsers({ role: "agent", page, size, search });
}

// GET /api/admin/users/{id}
export async function getAdminUserById(userId = "") {
  const id = String(userId || "").trim();
  if (!id) return { ok: false, status: 400, data: { message: "User ID required." } };
  const response = await apiRequest(`/api/admin/users/${encodeURIComponent(id)}`, { method: "GET" });
  return { ok: response.ok, user: response.ok ? _normalizeUser(response.data?.data || response.data || {}) : null, status: response.status, data: response.data };
}

// POST /api/admin/users
export async function createAdminUser({ name, email, password, role } = {}) {
  if (!name || !email || !password || !role) {
    return { ok: false, status: 400, data: { message: "name, email, password, and role are required." } };
  }
  const response = await apiRequest("/api/admin/users", { method: "POST", body: { name, email, password, role } });
  return { ok: response.ok, status: response.status, data: response.data };
}

// PATCH /api/admin/users/{id}/role
export async function updateAdminUserRole(userId = "", role = "") {
  const id = String(userId || "").trim();
  if (!id || !role) return { ok: false, status: 400, data: { message: "User ID and role are required." } };
  const response = await apiRequest(`/api/admin/users/${encodeURIComponent(id)}/role`, { method: "PATCH", body: { role } });
  return { ok: response.ok, status: response.status, data: response.data };
}

// DELETE /api/admin/users/{id}
export async function deleteAdminUser(userId = "") {
  const id = String(userId || "").trim();
  if (!id) return { ok: false, status: 400, data: { message: "User ID required." } };
  const response = await apiRequest(`/api/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  return { ok: response.ok, status: response.status, data: response.data };
}

// ─── Agent Workload ─────────────────────────────────────────────────────────
// GET /api/admin/agents/workload
export async function getAdminAgents() {
  const response = await apiRequest("/api/admin/agents/workload", { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], status: response.status, data: response.data };
  }

  const candidates = [response.data?.data, response.data?.agents, response.data];
  const list = candidates.find((entry) => Array.isArray(entry)) || [];

  const items = list.map((agent = {}) => ({
    id: agent.id || agent.agentId || "",
    name: agent.name || agent.fullName || agent.email || "Agent",
    email: agent.email || "",
    patentFilingsCount: agent.patent_filings_count ?? agent.patentFilingsCount ?? 0,
    nonPatentFilingsCount: agent.non_patent_filings_count ?? agent.nonPatentFilingsCount ?? 0,
    totalFilings: agent.total_filings ?? agent.totalFilings ?? 0,
    activeAssignments: agent.total_filings ?? agent.totalFilings ?? agent.activeAssignments ?? 0,
    raw: agent,
  }));

  return { ok: true, items, status: response.status, data: response.data };
}

// ─── Admin Patent Filings ───────────────────────────────────────────────────
// GET /api/admin/patent-filings
export async function getAdminPatentFilings({ status, userId, search, page = 0, size = 20, sort = "submittedAt,desc" } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  if (status) params.set("status", status);
  if (userId) params.set("userId", userId);
  if (search) params.set("search", search);

  const response = await apiRequest(`/api/admin/patent-filings?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], pagination: { page, size, totalElements: 0, totalPages: 0 }, status: response.status, data: response.data };
  }

  let list = extractAdminArray(response.data).map(normalizeAdminFiling);
  list = list.filter(i => {
    const ref = (i.referenceNumber || "").toUpperCase();
    const type = (i.type || "").toUpperCase();
    return !ref.includes("-TM-") && !ref.includes("-CR-") && !ref.includes("-DS-") && type !== "NON-PATENT";
  });
  return { ok: true, items: list, pagination: extractAdminPageable(response.data, page, size, list.length), status: response.status, data: response.data };
}

// GET /api/admin/patent-filings/{id}
export async function getAdminPatentFilingById(id = "") {
  const filingId = String(id || "").trim();
  if (!filingId) return { ok: false, status: 400, data: { message: "Filing ID required." } };
  const response = await apiRequest(`/api/admin/patent-filings/${encodeURIComponent(filingId)}`, { method: "GET" });
  return { ok: response.ok, filing: response.ok ? normalizeAdminFiling(response.data?.data?.patent || response.data?.data?.filing || response.data?.data || response.data || {}) : null, status: response.status, data: response.data };
}

// PATCH /api/admin/patent-filings/{id}/status
export async function updateAdminPatentFilingStatus(filingId = "", status = "", adminNote = "") {
  const id = String(filingId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) return { ok: false, status: 400, data: { message: "Filing ID and status are required." } };
  const body = { status: nextStatus };
  if (adminNote) body.adminNote = adminNote;
  const response = await apiRequest(`/api/admin/patent-filings/${encodeURIComponent(id)}/status`, { method: "PATCH", body });
  return { ok: response.ok, status: response.status, data: response.data };
}

// PATCH /api/admin/patent-filings/{id}/assign-agent
export async function assignAdminPatentFiling(filingId = "", agentId = "") {
  const id = String(filingId || "").trim();
  const nextAgentId = String(agentId || "").trim();
  if (!id || !nextAgentId) return { ok: false, status: 400, data: { message: "Filing ID and agent ID are required." } };
  const response = await apiRequest(`/api/admin/patent-filings/${encodeURIComponent(id)}/assign-agent`, { method: "PATCH", body: { agentId: nextAgentId } });
  return { ok: response.ok, status: response.status, data: response.data };
}

// PATCH /api/admin/patent-filings/{id}/estimation
export async function setAdminPatentFilingEstimation(filingId = "", estimation = 0) {
  const id = String(filingId || "").trim();
  if (!id) return { ok: false, status: 400, data: { message: "Filing ID required." } };
  const response = await apiRequest(`/api/admin/patent-filings/${encodeURIComponent(id)}/estimation`, { method: "PATCH", body: { estimation: Number(estimation) } });
  return { ok: response.ok, status: response.status, data: response.data };
}

// ─── Admin Non-Patent Filings ───────────────────────────────────────────────
// GET /api/admin/non-patent-filings
export async function getAdminNonPatentFilings({ status, filingType, userId, search, page = 0, size = 20, sort = "submittedAt,desc" } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort });
  if (status) params.set("status", status);
  if (filingType) params.set("filingType", filingType);
  if (userId) params.set("userId", userId);
  if (search) params.set("search", search);

  const response = await apiRequest(`/api/admin/non-patent-filings?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return { ok: false, items: [], pagination: { page, size, totalElements: 0, totalPages: 0 }, status: response.status, data: response.data };
  }

  const list = extractAdminArray(response.data).map(normalizeAdminFiling);
  return { ok: true, items: list, pagination: extractAdminPageable(response.data, page, size, list.length), status: response.status, data: response.data };
}

// GET /api/admin/non-patent-filings/{id}
export async function getAdminNonPatentFilingById(id = "") {
  const filingId = String(id || "").trim();
  if (!filingId) return { ok: false, status: 400, data: { message: "Filing ID required." } };
  const response = await apiRequest(`/api/admin/non-patent-filings/${encodeURIComponent(filingId)}`, { method: "GET" });
  return { ok: response.ok, filing: response.ok ? normalizeAdminFiling(response.data?.data?.filing || response.data?.data || response.data || {}) : null, status: response.status, data: response.data };
}

// PATCH /api/admin/non-patent-filings/{id}/status
export async function updateAdminNonPatentFilingStatus(filingId = "", status = "", adminNote = "") {
  const id = String(filingId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) return { ok: false, status: 400, data: { message: "Filing ID and status are required." } };
  const body = { status: nextStatus };
  if (adminNote) body.adminNote = adminNote;
  const response = await apiRequest(`/api/admin/non-patent-filings/${encodeURIComponent(id)}/status`, { method: "PATCH", body });
  return { ok: response.ok, status: response.status, data: response.data };
}

// PATCH /api/admin/non-patent-filings/{id}/assign-agent
export async function assignAdminNonPatentFiling(filingId = "", agentId = "") {
  const id = String(filingId || "").trim();
  const nextAgentId = String(agentId || "").trim();
  if (!id || !nextAgentId) return { ok: false, status: 400, data: { message: "Filing ID and agent ID are required." } };
  const response = await apiRequest(`/api/admin/non-patent-filings/${encodeURIComponent(id)}/assign-agent`, { method: "PATCH", body: { agentId: nextAgentId } });
  return { ok: response.ok, status: response.status, data: response.data };
}

// ─── Combined view helpers ───────────────────────────────────────────────────
export async function getAdminFilings({ status, filingType, page = 0, size = 20, sort = "submittedAt,desc" } = {}) {
  const NPF_TYPES = ["TRADEMARK", "COPYRIGHT", "DESIGN"];
  if (filingType && NPF_TYPES.includes(String(filingType).toUpperCase())) {
    return getAdminNonPatentFilings({ status, filingType, page, size, sort });
  }
  if (filingType && String(filingType).toLowerCase() === "patent") {
    return getAdminPatentFilings({ status, page, size, sort });
  }

  const [patentRes, nonPatentRes] = await Promise.all([
    getAdminPatentFilings({ status, page: 0, size: 100, sort }),
    getAdminNonPatentFilings({ status, page: 0, size: 100, sort }),
  ]);

  const all = [
    ...(patentRes.items || []).map((i) => ({ ...i, filingCategory: "patent" })),
    ...(nonPatentRes.items || []).map((i) => ({ ...i, filingCategory: "non-patent" })),
  ];
  const totalElements = all.length;
  const totalPages = Math.ceil(totalElements / size) || 0;
  return {
    ok: patentRes.ok || nonPatentRes.ok,
    items: all.slice(page * size, page * size + size),
    pagination: { page, size, totalElements, totalPages },
    status: 200,
    data: null,
  };
}

export async function getAdminUnassignedFilings({ filingType, page = 0, size = 20 } = {}) {
  const res = await getAdminFilings({ filingType, page: 0, size: 200 });
  if (!res.ok) return res;
  const unassigned = res.items.filter((i) => !i.assignedAgentId);
  const totalElements = unassigned.length;
  return { ok: true, items: unassigned.slice(page * size, page * size + size), pagination: { page, size, totalElements, totalPages: Math.ceil(totalElements / size) || 0 }, status: 200, data: null };
}

export async function getAdminAssignments({ filingType, page = 0, size = 20 } = {}) {
  const res = await getAdminFilings({ filingType, page: 0, size: 200 });
  if (!res.ok) return res;
  const assigned = res.items.filter((i) => !!i.assignedAgentId);
  const totalElements = assigned.length;
  return { ok: true, items: assigned.slice(page * size, page * size + size), pagination: { page, size, totalElements, totalPages: Math.ceil(totalElements / size) || 0 }, status: 200, data: null };
}

export async function getAdminDecisions({ status, filingType, page = 0, size = 20 } = {}) {
  const res = await getAdminFilings({ filingType, page: 0, size: 200 });
  if (!res.ok) return res;
  const DECIDED = ["APPROVED", "REJECTED"];
  const decided = res.items.filter((i) => (status ? i.status === status : DECIDED.includes(i.status)));
  const totalElements = decided.length;
  return { ok: true, items: decided.slice(page * size, page * size + size), pagination: { page, size, totalElements, totalPages: Math.ceil(totalElements / size) || 0 }, status: 200, data: null };
}

// ─── Unified assign / status helpers ─────────────────────────────────────────
export async function assignAdminFiling(filingId = "", agentId = "", filingCategory = "patent") {
  if (filingCategory === "non-patent") return assignAdminNonPatentFiling(filingId, agentId);
  return assignAdminPatentFiling(filingId, agentId);
}

export async function reassignAdminFiling(filingId = "", agentId = "", filingCategory = "patent") {
  return assignAdminFiling(filingId, agentId, filingCategory);
}

export async function updateAdminFilingStatus(filingId = "", status = "", adminNote = "", filingCategory = "patent") {
  if (filingCategory === "non-patent") return updateAdminNonPatentFilingStatus(filingId, status, adminNote);
  return updateAdminPatentFilingStatus(filingId, status, adminNote);
}

// ─── Admin Profile (from localStorage) ────────────────────────────────────────
export async function getAdminProfile() {
  const stored = getStoredUser();
  if (!stored) return { ok: false, profile: null, status: 404, data: { message: "Profile not available." } };

  const dashRes = await getAdminDashboard();
  let summary = {
    totalAgents: 0,
    totalClients: 0,
    totalFilings: 0,
    activeFilings: 0,
    decidedFilings: 0,
  };

  if (dashRes.ok) {
    const s = dashRes.stats;
    const patentTotal = s?.patentFilings?.total || 0;
    const npTotal = s?.nonPatentFilings?.total || 0;

    const pByStatus = s?.patentFilings?.byStatus || {};
    const npByStatus = s?.nonPatentFilings?.byStatus || {};

    const sumStatus = (statusArr) => {
      let sum = 0;
      for (const obj of [pByStatus, npByStatus]) {
        for (const [k, v] of Object.entries(obj)) {
          if (statusArr.includes(String(k).toUpperCase())) sum += v;
        }
      }
      return sum;
    };

    summary = {
      totalAgents: s?.users?.agents || 0,
      totalClients: s?.users?.clients || 0,
      totalFilings: patentTotal + npTotal,
      activeFilings: sumStatus(["PENDING", "IN_REVIEW"]),
      decidedFilings: sumStatus(["APPROVED", "REJECTED"]),
    };
  }

  return { 
    ok: true, 
    profile: { ...stored, createdAt: stored.createdAt || new Date().toISOString(), summary }, 
    status: 200, 
    data: stored 
  };
}
