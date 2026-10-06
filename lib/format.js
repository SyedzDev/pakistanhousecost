// Lakh-style grouping: 3689665 -> 36,89,665
export function grp(n) {
  const s = String(Math.round(Number(n) || 0));
  if (s.length <= 3) return s;
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + s.slice(-3);
}
export const pkr = (n) => "PKR " + grp(n);

// 3689665 -> "36.9 Lakh" / "1.25 Crore"
export function short(n, lang = "en") {
  const v = Number(n) || 0;
  const u = lang === "ur" ? { cr: "کروڑ", lk: "لاکھ" } : { cr: "Crore", lk: "Lakh" };
  if (v >= 1e7) return `${+(v / 1e7).toFixed(2)} ${u.cr}`;
  if (v >= 1e5) return `${+(v / 1e5).toFixed(1)} ${u.lk}`;
  return grp(v);
}

export const unitLabel = (u) => ({ "x ref house": "× ref. house", "door-units": "doors" }[u] || u);
