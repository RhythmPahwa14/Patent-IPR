const ESTIMATOR_PREFILL_KEY = "ipr_estimator_prefill_v1";

function readPrefillStore() {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem(ESTIMATOR_PREFILL_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveEstimatorPrefill(prefill) {
  if (typeof window === "undefined") return;
  if (!prefill || typeof prefill !== "object" || !prefill.service) return;

  const store = readPrefillStore();
  store[prefill.service] = {
    ...prefill,
    savedAt: prefill.savedAt || new Date().toISOString(),
  };

  localStorage.setItem(ESTIMATOR_PREFILL_KEY, JSON.stringify(store));
}

export function getEstimatorPrefillForService(service) {
  if (typeof window === "undefined" || !service) return null;
  const store = readPrefillStore();
  const data = store[service];
  if (!data || typeof data !== "object") return null;
  return data;
}
