const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8000";

async function call(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchCollection(name: string) {
  const data = await call(`/${name}`);
  // { count, items }
  return data.items || [];
}

export async function fetchCollectionTimed(name: string) {
  const t0 = performance.now();
  const data = await call(`/${name}`);
  const t1 = performance.now();
  const fetchTimeMs = Math.round(t1 - t0);
  // backend may return serverTimeMs
  const serverTimeMs = data?.serverTimeMs ?? null;
  return { items: data.items || [], fetchTimeMs, serverTimeMs };
}

export async function listKeys(pattern = "*") {
  const data = await call(`/keys?pattern=${encodeURIComponent(pattern)}`);
  return data.keys || [];
}

export async function fetchKey(key: string) {
  const data = await call(`/key/${encodeURIComponent(key)}`);
  return data.items || [];
}
