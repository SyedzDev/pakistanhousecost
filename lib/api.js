// Server-side helpers (build / ISR). Browser calculator alag se fetch karta hai.
import { API_URL } from "./config";
import fallback from "./catalog.fallback.json";
import { makeBody, defaultsFor, clampYear } from "./estimate";

const memo = new Map();

async function post(path, body) {
  const key = path + JSON.stringify(body);
  if (memo.has(key)) return memo.get(key);
  const p = (async () => {
    for (let i = 0; i < 2; i++) {
      try {
        const r = await fetch(API_URL + path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(25000),
          next: { revalidate: 86400 },
        });
        if (r.ok) return await r.json();
      } catch (e) { /* retry */ }
    }
    return null;
  })();
  memo.set(key, p);
  return p;
}

let catalogP;
export function getCatalog() {
  catalogP ||= (async () => {
    try {
      const r = await fetch(API_URL + "/api/catalog", { signal: AbortSignal.timeout(25000), next: { revalidate: 86400 } });
      if (r.ok) return await r.json();
    } catch (e) { /* use fallback */ }
    return fallback;
  })();
  return catalogP;
}

export async function getEstimate(catalog, { city, marla, floors = 1, stage = "finished", level = "market" }) {
  const d = defaultsFor(marla);
  const f = { city, marla, floors, year: clampYear(catalog), stage, level, ...d };
  return post("/api/estimate", makeBody(catalog, f));
}
