import Link from "next/link";
import Shell from "./Shell";
import Calculator from "./Calculator";
import Faq from "./Faq";
import JsonLd from "./JsonLd";
import { StackBar, TimelineChart } from "./Charts";
import { T } from "@/lib/i18n";
import { getCatalog, getEstimate } from "@/lib/api";
import { clampYear, defaultsFor } from "@/lib/estimate";
import { grp, pkr, short } from "@/lib/format";
import { CITIES, SIZES, SITE_URL, cityBySlug, sizeBySlug, langPrefix, costPath } from "@/lib/config";
import { faqLd, pageMeta } from "@/lib/seo";

async function load(city, size) {
  const cat = await getCatalog();
  const base = { city: city.en, marla: size.marla };
  const [grey, semi, fin, dbl] = await Promise.all([
    getEstimate(cat, { ...base, stage: "grey" }),
    getEstimate(cat, { ...base, stage: "semi" }),
    getEstimate(cat, { ...base, stage: "finished" }),
    getEstimate(cat, { ...base, stage: "finished", floors: 2 }),
  ]);
  return { cat, grey, semi, fin, dbl, year: clampYear(cat) };
}

export async function cityMetadata(lang, citySlug, sizeSlug) {
  const city = cityBySlug(citySlug), size = sizeBySlug(sizeSlug);
  const { fin, year } = await load(city, size);
  const t = T[lang].city;
  const tot = fin ? short(fin.total, lang) : "";
  const cn = lang === "ur" ? city.ur : city.en, sn = size[lang];
  return pageMeta({
    lang, path: `/construction-cost/${citySlug}/${sizeSlug}`,
    title: t.title(cn, sn, year), description: t.description(cn, sn, year, tot ? `PKR ${tot}` : "—"),
    ogTitle: `${size.en} House Construction Cost in ${city.en}`, ogSub: fin ? `About PKR ${short(fin.total, "en")} fully finished (${year})` : String(year),
    keywords: [
      `${size.en} house construction cost ${city.en}`, `${size.en} house cost ${city.en} ${year}`,
      `grey structure cost ${city.en}`, `construction cost ${city.en}`, `${size.en} ghar banane ka kharcha`,
      `house construction cost Pakistan ${year}`,
    ],
  });
}

export default async function CityPage({ lang, citySlug, sizeSlug }) {
  const t = T[lang], ct = t.city;
  const city = cityBySlug(citySlug), size = sizeBySlug(sizeSlug);
  const { cat, grey, semi, fin, dbl, year } = await load(city, size);
  const cn = lang === "ur" ? city.ur : city.en, sn = size[lang];
  const p = langPrefix(lang);
  const path = `${p}/construction-cost/${citySlug}/${sizeSlug}`;
  const d = defaultsFor(size.marla);
  const R = (e) => e && { total: pkr(e.total), low: pkr(e.low), high: pkr(e.high) };

  const crumbs = [
    [ct.home, p || "/"], [ct.hub, `${p}/construction-cost`], [`${cn} ${sn}`, path],
  ];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE_URL + href })) },
      ...(fin ? [faqLd(ct.faq(cn, sn, year, R(fin), pkr(grey?.total ?? 0), pkr(semi?.total ?? 0), pkr(dbl?.total ?? 0)))] : []),
    ],
  };

  const stageRows = fin && grey && semi ? [
    [t.calc.stages.grey, grey], [t.calc.stages.semi, semi], [t.calc.stages.finished, fin], ...(dbl ? [[ct.double, dbl]] : []),
  ] : [];
  const drivers = fin ? [...fin.lines].sort((a, b) => b.cost - a.cost).slice(0, 8) : [];
  const altHref = lang === "ur" ? `/construction-cost/${citySlug}/${sizeSlug}` : `/ur/construction-cost/${citySlug}/${sizeSlug}`;

  return (
    <Shell lang={lang} altHref={altHref}>
      <main id="main">
        <div className="wrap">
          <div className="hero">
            <nav className="crumbs" aria-label="Breadcrumb"><ol>
              {crumbs.map(([n, h], i) => (
                <li key={h} aria-current={i === crumbs.length - 1 ? "page" : undefined}>{i < crumbs.length - 1 ? <Link href={h}>{n}</Link> : n}</li>
              ))}
            </ol></nav>
            <span className="eyebrow">{lang === "ur" ? `${year} کے تازہ ریٹس` : `${year} updated rates`}</span>
            <h1>{ct.h1(cn, sn, year)}</h1>
            {fin && grey && semi && dbl && <p>{ct.intro(cn, sn, year, R(fin), pkr(grey.total), pkr(semi.total), pkr(dbl.total))}</p>}
            <p style={{ fontSize: ".95rem" }}>{ct.assume(d)}</p>
          </div>

          {stageRows.length > 0 && (
            <section aria-labelledby="stage-h" className="sec" style={{ paddingTop: 8 }}>
              <h2 id="stage-h">{ct.stageTitle(cn, sn)}</h2>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead><tr>
                    <th scope="col">{ct.th.stage}</th><th scope="col" className="num">{ct.th.est}</th>
                    <th scope="col" className="num">{ct.th.range}</th><th scope="col" className="num">{ct.th.sqft}</th>
                  </tr></thead>
                  <tbody>
                    {stageRows.map(([name, e]) => (
                      <tr key={name}>
                        <th scope="row">{name}</th>
                        <td className="num">{pkr(e.total)} <span className="hint">({short(e.total, lang)})</span></td>
                        <td className="num">{short(e.low, lang)} – {short(e.high, lang)}</td>
                        <td className="num">{pkr(e.per_sqft)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {fin && (
            <div className="two sec" style={{ paddingTop: 32 }}>
              <section aria-labelledby="drv-h" className="panel">
                <h2 id="drv-h">{ct.driversTitle}</h2>
                <StackBar groups={fin.groups} labels={t.calc.groups} />
                <div className="tbl-wrap" style={{ marginTop: 14 }}>
                  <table className="tbl" style={{ minWidth: 0 }}>
                    <thead><tr><th scope="col">{t.calc.th.item}</th><th scope="col" className="num">{t.calc.th.cost}</th><th scope="col" className="num">{t.calc.th.share}</th></tr></thead>
                    <tbody>
                      {drivers.map((l) => (
                        <tr key={l.id}><th scope="row">{lang === "ur" ? l.ur : l.en}</th><td className="num">{grp(l.cost)}</td><td className="num">{l.share}%</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <section aria-labelledby="yrs-h" className="panel">
                <h2 id="yrs-h">{ct.yearsTitle(cn, sn)}</h2>
                <TimelineChart timeline={fin.timeline} lang={lang} label={ct.yearsTitle(cn, sn)} />
                <div className="tbl-wrap">
                  <table className="tbl" style={{ minWidth: 0 }}>
                    <thead><tr><th scope="col">{ct.th2.year}</th><th scope="col" className="num">{ct.th2.total}</th><th scope="col">{ct.th2.type}</th></tr></thead>
                    <tbody>
                      {fin.timeline.map((r) => (
                        <tr key={r.year}><th scope="row">{r.year}</th><td className="num">{short(r.total, lang)}</td><td>{r.forecast ? t.calc.forecast : t.calc.actual}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="note">{ct.yearsNote}</p>
              </section>
            </div>
          )}

          <div className="sec">
            <h2>{ct.calcTitle}</h2>
            <p className="lead" style={{ color: "var(--mute)" }}>{ct.calcSub}</p>
            <Calculator lang={lang} catalog={cat} initialCity={city.en} initialMarla={size.marla} heading={t.calc.title} />
          </div>
        </div>

        {fin && grey && semi && dbl && <Faq title={t.home.faqTitle} items={ct.faq(cn, sn, year, R(fin), pkr(grey.total), pkr(semi.total), pkr(dbl.total))} />}

        <section className="sec" aria-label="Related">
          <div className="wrap two">
            <div>
              <h2>{ct.otherSizes(cn)}</h2>
              <ul className="links">
                {SIZES.filter((s) => s.slug !== sizeSlug).map((s) => (
                  <li key={s.slug}><Link href={costPath(lang, citySlug, s.slug)}>{s[lang]}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{ct.otherCities(sn)}</h2>
              <ul className="links">
                {CITIES.filter((c) => c.slug !== citySlug).map((c) => (
                  <li key={c.slug}><Link href={costPath(lang, c.slug, sizeSlug)}>{c[lang === "ur" ? "ur" : "en"]}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}
