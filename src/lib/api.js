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

export async function getAgentPatents() {
  const response = await apiRequest("/api/agent/patents", { method: "GET" });
  if (!response.ok) {
    return {
      ok: false,
      items: [],
      status: response.status,
      data: response.data,
    };
  }

  const list = extractPatentArray(response.data).map(normalizePatent);
  return {
    ok: true,
    items: list,
    status: response.status,
    data: response.data,
  };
}

function normalizeAdminFiling(item = {}) {
  return {
    id: item.id || item.filingId || item.referenceNumber || "",
    referenceNumber: item.referenceNumber || item.referenceNo || "",
    title: item.title || item.name || "",
    type: item.type || item.filingType || "",
    status: item.status || "",
    applicantName: item.applicantName || "",
    assignedAgentId: item.assignedAgentId || item.agentId || null,
    assignedAgentName: item.assignedAgentName || item.agentName || "",
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    raw: item,
  };
}

function extractAdminArray(data) {
  const candidates = [
    data?.data?.content,
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

export async function getAdminFilings({ page = 0, size = 10, status, type, unassigned = false } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    unassigned: String(Boolean(unassigned)),
  });

  if (status) params.set("status", status);
  if (type) params.set("type", type);

  const response = await apiRequest(`/api/admin/filings?${params.toString()}`, { method: "GET" });
  if (!response.ok) {
    return {
      ok: false,
      items: [],
      pagination: {
        page,
        size,
        totalElements: 0,
        totalPages: 0,
      },
      status: response.status,
      data: response.data,
    };
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

export async function getAdminAgents() {
  const response = await apiRequest("/api/admin/agents", { method: "GET" });
  if (!response.ok) {
    return {
      ok: false,
      items: [],
      status: response.status,
      data: response.data,
    };
  }

  const candidates = [response.data?.data, response.data?.agents, response.data];
  const list = candidates.find((entry) => Array.isArray(entry)) || [];

  const items = list.map((agent = {}) => ({
    id: agent.id || agent.agentId || "",
    name: agent.name || agent.fullName || agent.email || "Agent",
    email: agent.email || "",
    activeAssignments: agent.activeAssignments || agent.assignedCount || 0,
    raw: agent,
  }));

  return {
    ok: true,
    items,
    status: response.status,
    data: response.data,
  };
}

export async function assignAdminFiling(filingId = "", agentId = "") {
  const id = String(filingId || "").trim();
  const nextAgentId = String(agentId || "").trim();
  if (!id || !nextAgentId) {
    return {
      ok: false,
      status: 400,
      data: { message: "Filing ID and agent ID are required." },
    };
  }

  const response = await apiRequest(`/api/admin/filings/${encodeURIComponent(id)}/assign`, {
    method: "PATCH",
    body: { agentId: nextAgentId },
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

export async function reassignAdminFiling(filingId = "", agentId = "") {
  const id = String(filingId || "").trim();
  const nextAgentId = String(agentId || "").trim();
  if (!id || !nextAgentId) {
    return {
      ok: false,
      status: 400,
      data: { message: "Filing ID and agent ID are required." },
    };
  }

  const response = await apiRequest(`/api/admin/filings/${encodeURIComponent(id)}/reassign`, {
    method: "PATCH",
    body: { agentId: nextAgentId },
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

export async function updateAdminFilingStatus(filingId = "", status = "") {
  const id = String(filingId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) {
    return {
      ok: false,
      status: 400,
      data: { message: "Filing ID and status are required." },
    };
  }

  const response = await apiRequest(`/api/admin/filings/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status: nextStatus },
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

export async function updateAgentPatentStatus(patentId = "", status = "") {
  const id = String(patentId || "").trim();
  const nextStatus = String(status || "").trim().toUpperCase();
  if (!id || !nextStatus) {
    return {
      ok: false,
      status: 400,
      data: { message: "Patent ID and status are required." },
    };
  }

  const response = await apiRequest(`/api/agent/patent/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: { status: nextStatus },
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
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
    submittedAt: item.submittedAt || item.createdAt || null,
    updatedAt: item.updatedAt || item.createdAt || null,
    filingType: "copyright",
    typeLabel: "COPYRIGHT FILING",
    typeId: item.copyrightId || item.id || "",
    typeIdLabel: "Copyright ID",
  };
}

function normalizeDesign(item = {}) {
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
