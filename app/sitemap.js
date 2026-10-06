import { CITIES, SIZES, SITE_URL } from "@/lib/config";
import { postSlugs } from "@/lib/blog";

export default function sitemap() {
  const now = new Date();
  const en = (path) => SITE_URL + (path === "/" ? "/" : path);
  const ur = (path) => SITE_URL + "/ur" + (path === "/" ? "" : path);
  const langs = (path) => ({ languages: { en: en(path), ur: ur(path), "x-default": en(path) } });

  const entry = (url, priority, alternates) => ({
    url, lastModified: now, changeFrequency: "weekly", priority, alternates,
  });

  const paths = [
    ["/", 1],
    ["/construction-cost", 0.8],
    ["/blog", 0.7],
    ...postSlugs().map((slug) => [`/blog/${slug}`, 0.6]),
    ...CITIES.flatMap((c) => SIZES.map((s) => [`/construction-cost/${c.slug}/${s.slug}`, s.marla === 5 ? 0.9 : 0.7])),
  ];

  return paths.flatMap(([p, pr]) => [
    entry(en(p), pr, langs(p)),
    entry(ur(p), Number((pr * 0.9).toFixed(2)), langs(p)),
  ]);
}
