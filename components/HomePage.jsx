import Shell from "./Shell";
import Calculator from "./Calculator";
import CostLinks from "./CostLinks";
import Faq from "./Faq";
import JsonLd from "./JsonLd";
import { T } from "@/lib/i18n";
import { getCatalog, getEstimate } from "@/lib/api";
import { clampYear } from "@/lib/estimate";
import { pkr } from "@/lib/format";
import { SITE_URL, SITE_NAME, langPrefix } from "@/lib/config";
import { faqLd, pageMeta } from "@/lib/seo";

export async function homeMetadata(lang) {
  const cat = await getCatalog();
  const y = clampYear(cat);
  const t = T[lang].home;
  return pageMeta({
    lang, path: "/", title: t.title(y), description: t.description(y),
    ogTitle: "Pakistan House Construction Cost Estimation & Prediction",
    ogSub: "AI-powered grey structure, semi-finished and fully finished estimates",
    keywords: [
      "house construction cost Pakistan", "construction cost calculator Pakistan",
      "AI house cost prediction", "grey structure cost Pakistan", "marla house cost",
      "kanal house cost", "ghar banane ka kharcha", "construction cost Lahore Karachi Islamabad",
    ],
  });
}

export default async function HomePage({ lang }) {
  const t = T[lang];
  const h = t.home;
  const cat = await getCatalog();
  const sample = await getEstimate(cat, { city: "Lahore", marla: 5 });
  const s = sample && { total: pkr(sample.total), low: pkr(sample.low), high: pkr(sample.high) };
  const faq = h.faq(s);
  const url = SITE_URL + langPrefix(lang) + "/";
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: SITE_NAME, url, inLanguage: t.htmlLang },
      {
        "@type": "WebApplication", name: h.h1, url, applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
        inLanguage: t.htmlLang, areaServed: { "@type": "Country", name: "Pakistan" }, description: h.description(clampYear(cat)),
        offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      },
      faqLd(faq),
    ],
  };

  return (
    <Shell lang={lang} altHref={lang === "ur" ? "/" : "/ur"}>
      <main id="main">
        <div className="wrap">
          <div className="hero">
            <span className="eyebrow">{h.eyebrow || (lang === "ur" ? "پاکستان بھر میں تازہ ریٹس" : "Live rates across Pakistan")}</span>
            <h1>{h.h1}</h1>
            <p>{h.sub}</p>
          </div>
          <Calculator lang={lang} catalog={cat} />
        </div>

        <section className="sec ai-sec" aria-labelledby="ai-h">
          <div className="wrap">
            <span className="ai-badge">{h.aiBadge}</span>
            <h2 id="ai-h">{h.aiTitle}</h2>
            <p className="lead">{h.aiSub}</p>
            <div className="cols3">
              {h.aiPoints.map(([a, b]) => <div className="panel ai-panel" key={a}><h3>{a}</h3><p>{b}</p></div>)}
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="how-h">
          <div className="wrap">
            <h2 id="how-h">{h.howTitle}</h2>
            <div className="cols3">
              {h.how.map(([a, b]) => <div className="panel" key={a}><h3>{a}</h3><p>{b}</p></div>)}
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="st-h">
          <div className="wrap">
            <h2 id="st-h">{h.stagesTitle}</h2>
            <div className="cols3">
              {h.stagesBody.map(([a, b]) => <div className="panel" key={a}><h3>{a}</h3><p>{b}</p></div>)}
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="ct-h">
          <div className="wrap">
            <h2 id="ct-h">{h.citiesTitle}</h2>
            <p className="lead">{h.citiesSub}</p>
            <CostLinks lang={lang} />
          </div>
        </section>

        <Faq items={faq} title={h.faqTitle} />
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}
