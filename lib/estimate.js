import { SIZES } from "./config";

// API ke liye items payload: har stage ke default items on, baqi off.
// (items = {} bhejne par sirf "required" grey items aate hain, is liye ye zaroori hai.)
export function buildItems(catalog, stage, enabledOverride, variants = {}) {
  const items = {};
  for (const it of catalog.items) {
    const enabled = it.required ? true : enabledOverride ? !!enabledOverride[it.id] : !!it.stage[stage];
    const variant = variants[it.id] || (it.variants[0] && it.variants[0].key) || null;
    items[it.id] = { enabled, variant };
  }
  return items;
}

export function defaultEnabled(catalog, stage) {
  const o = {};
  for (const it of catalog.items) o[it.id] = it.required ? true : !!it.stage[stage];
  return o;
}

export function defaultsFor(marla) {
  const s = SIZES.find((x) => x.marla === marla);
  if (s) return { beds: s.beds, baths: s.baths, kitchens: s.kitchens };
  const n = Math.max(1, Math.min(8, Math.round(marla / 3)));
  return { beds: n, baths: n, kitchens: marla >= 15 ? 2 : 1 };
}

export const clampYear = (catalog) => {
  const y = new Date().getFullYear();
  return Math.min(Math.max(y, catalog.years.min), catalog.years.max);
};

export function makeBody(catalog, f, enabledOverride, variants) {
  return {
    city: f.city, marla: Number(f.marla), floors: Number(f.floors), year: Number(f.year),
    stage: f.stage, level: f.level, beds: Number(f.beds), baths: Number(f.baths), kitchens: Number(f.kitchens),
    items: buildItems(catalog, f.stage, enabledOverride, variants),
  };
}
