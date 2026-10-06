export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com").replace(/\/$/, "");
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://costesitmatedhouse2026.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Pakistan House Cost AI";
export const SITE_TAGLINE = "AI-Powered House Construction Cost Estimation & Prediction";

// slug -> API city name (en) + Urdu name. API ki cities se match hona chahiye.
export const CITIES = [
  { slug: "lahore", en: "Lahore", ur: "لاہور" },
  { slug: "karachi", en: "Karachi", ur: "کراچی" },
  { slug: "islamabad", en: "Islamabad", ur: "اسلام آباد" },
  { slug: "faisalabad", en: "Faisalabad", ur: "فیصل آباد" },
  { slug: "multan", en: "Multan", ur: "ملتان" },
  { slug: "sahiwal", en: "Sahiwal", ur: "ساہیوال" },
];

// 1 kanal = 20 marla
export const SIZES = [
  { slug: "3-marla", marla: 3, en: "3 Marla", ur: "3 مرلہ", beds: 2, baths: 2, kitchens: 1 },
  { slug: "5-marla", marla: 5, en: "5 Marla", ur: "5 مرلہ", beds: 3, baths: 3, kitchens: 1 },
  { slug: "7-marla", marla: 7, en: "7 Marla", ur: "7 مرلہ", beds: 4, baths: 4, kitchens: 1 },
  { slug: "10-marla", marla: 10, en: "10 Marla", ur: "10 مرلہ", beds: 5, baths: 5, kitchens: 1 },
  { slug: "1-kanal", marla: 20, en: "1 Kanal", ur: "1 کنال", beds: 6, baths: 6, kitchens: 2 },
  { slug: "2-kanal", marla: 40, en: "2 Kanal", ur: "2 کنال", beds: 8, baths: 8, kitchens: 2 },
];

export const cityBySlug = (s) => CITIES.find((c) => c.slug === s);
export const sizeBySlug = (s) => SIZES.find((c) => c.slug === s);
export const sizeByMarla = (m) => SIZES.find((c) => c.marla === m);
export const langPrefix = (lang) => (lang === "ur" ? "/ur" : "");
export const costPath = (lang, city, size) => `${langPrefix(lang)}/construction-cost/${city}/${size}`;
