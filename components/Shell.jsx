import Link from "next/link";
import { T } from "@/lib/i18n";
import { CITIES, SITE_NAME, langPrefix, costPath } from "@/lib/config";

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 32 32">
        <path d="M3 15 16 4l13 11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M7 14v13h18V14" fill="#FFFFFF" opacity="0.92" />
        <rect x="13" y="19" width="6" height="8" fill="#F5B301" />
      </svg>
    </span>
  );
}

export default function Shell({ lang, altHref, children }) {
  const t = T[lang];
  const p = langPrefix(lang);
  const home = p || "/";
  const year = new Date().getFullYear();
  return (
    <>
      <a className="skip" href="#main">{t.skip}</a>
      <header className="hdr">
        <div className="wrap hdr-in">
          <Link href={home} className="brand"><Mark /><span>{SITE_NAME}</span></Link>
          <nav aria-label="Main">
            <Link href={`${home}#calculator`}>{t.nav.calc}</Link>
            <Link href={`${p}/construction-cost`}>{t.nav.cities}</Link>
            <Link href={`${p}/blog`}>{t.nav.blog}</Link>
            <Link href={`${home}#faq`}>{t.nav.faq}</Link>
            <Link href={altHref} className="lang" hrefLang={lang === "ur" ? "en" : "ur"} lang={lang === "ur" ? "en" : "ur"} title={t.switchTitle}>{t.switchLabel}</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-grid">
            <div>
              <div className="ftr-brand">{SITE_NAME}</div>
              <p>{t.foot.about}</p>
              <small>{t.foot.note}</small>
            </div>
            <div>
              <h2>{t.foot.pages}</h2>
              <ul>
                {CITIES.map((c) => (
                  <li key={c.slug}><Link href={costPath(lang, c.slug, "5-marla")}>{lang === "ur" ? `${c.ur} میں 5 مرلہ` : `${c.en} 5 marla house cost`}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{t.nav.cities}</h2>
              <ul>
                <li><Link href={`${p}/construction-cost`}>{t.nav.cities}</Link></li>
                <li><Link href={`${p}/blog`}>{t.nav.blog}</Link></li>
                <li><Link href={`${home}#calculator`}>{t.nav.calc}</Link></li>
                <li><Link href={`${home}#faq`}>{t.nav.faq}</Link></li>
              </ul>
            </div>
          </div>
          <div className="ftr-bottom">
            <span>© {year} {SITE_NAME}</span>
            <span>{t.foot.note}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
