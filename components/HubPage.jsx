import Shell from "./Shell";
import CostLinks from "./CostLinks";
import JsonLd from "./JsonLd";
import { T } from "@/lib/i18n";
import { getCatalog } from "@/lib/api";
import { clampYear } from "@/lib/estimate";
import { SITE_URL, langPrefix } from "@/lib/config";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export async function hubMetadata(lang) {
  const y = clampYear(await getCatalog());
  const t = T[lang].hub;
  return pageMeta({
    lang, path: "/construction-cost", title: t.title(y), description: t.description(y),
    ogTitle: "House Construction Cost in Pakistan", ogSub: "By city and plot size",
    keywords: [
      "house construction cost Pakistan", "construction cost by city Pakistan",
      "marla house cost", "kanal house cost", "grey structure cost Pakistan",
      "construction cost Lahore Karachi Islamabad Faisalabad Multan Sahiwal",
    ],
  });
}

export default function HubPage({ lang }) {
  const t = T[lang];
  const p = langPrefix(lang);
  const ld = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.city.home, item: SITE_URL + (p || "/") },
      { "@type": "ListItem", position: 2, name: t.city.hub, item: SITE_URL + p + "/construction-cost" },
    ],
  };
  return (
    <Shell lang={lang} altHref={lang === "ur" ? "/construction-cost" : "/ur/construction-cost"}>
      <main id="main">
        <div className="wrap">
          <div className="hero">
            <nav className="crumbs" aria-label="Breadcrumb"><ol>
              <li><Link href={p || "/"}>{t.city.home}</Link></li><li aria-current="page">{t.city.hub}</li>
            </ol></nav>
            <span className="eyebrow">{lang === "ur" ? "شہر کے لحاظ سے ریٹس" : "Rates by city"}</span>
            <h1>{t.hub.h1}</h1>
            <p>{t.hub.sub}</p>
          </div>
          <CostLinks lang={lang} />
        </div>
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}
