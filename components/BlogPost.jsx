import Link from "next/link";
import Shell from "./Shell";
import JsonLd from "./JsonLd";
import { T } from "@/lib/i18n";
import { POSTS, postBySlug } from "@/lib/blog";
import { SITE_URL, SITE_NAME, langPrefix } from "@/lib/config";
import { pageMeta, breadcrumbLd } from "@/lib/seo";

export function blogPostMetadata(lang, slug) {
  const post = postBySlug(slug);
  if (!post) return {};
  const c = post[lang];
  return pageMeta({
    lang, path: `/blog/${slug}`, title: c.title, description: c.description,
    ogTitle: c.title, ogSub: c.description,
  });
}

export default function BlogPost({ lang, slug }) {
  const t = T[lang];
  const b = t.blog;
  const post = postBySlug(slug);
  const c = post[lang];
  const p = langPrefix(lang);
  const listPath = `${p}/blog`;
  const path = `${listPath}/${slug}`;
  const related = POSTS.filter((x) => x.slug !== slug).slice(0, 2);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([[t.city.home, p || "/"], [b.h1, listPath], [c.title, path]]),
      {
        "@type": "BlogPosting",
        headline: c.title,
        description: c.description,
        url: SITE_URL + path,
        mainEntityOfPage: { "@type": "WebPage", "@id": SITE_URL + path },
        datePublished: post.date,
        dateModified: post.updated,
        inLanguage: t.htmlLang,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
    ],
  };

  return (
    <Shell lang={lang} altHref={lang === "ur" ? `/blog/${slug}` : `/ur/blog/${slug}`}>
      <main id="main">
        <div className="wrap">
          <div className="hero">
            <nav className="crumbs" aria-label="Breadcrumb"><ol>
              <li><Link href={p || "/"}>{t.city.home}</Link></li>
              <li><Link href={listPath}>{b.h1}</Link></li>
              <li aria-current="page">{c.title}</li>
            </ol></nav>
            <h1>{c.h1}</h1>
            <p className="note" style={{ marginTop: 0 }}>
              {b.updated}: {new Date(post.updated).toLocaleDateString(lang === "ur" ? "ur-PK" : "en-PK", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <article className="prose sec" style={{ paddingTop: 8 }} dangerouslySetInnerHTML={{ __html: c.body }} />

          <section className="sec" aria-label={b.ctaTitle}>
            <div className="panel ai-panel">
              <h3>{b.ctaTitle}</h3>
              <p>{b.ctaText}</p>
              <p style={{ marginTop: 16 }}>
                <Link className="btn" href={`${p || "/"}#calculator`}>{b.ctaBtn}</Link>
              </p>
            </div>
          </section>

          {related.length > 0 && (
            <section className="sec" aria-label={b.related}>
              <h2>{b.related}</h2>
              <div className="cols3">
                {related.map((r) => (
                  <article className="panel" key={r.slug}>
                    <h3><Link href={`${listPath}/${r.slug}`}>{r[lang].title}</Link></h3>
                    <p>{r[lang].description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <p className="sec" style={{ paddingTop: 24 }}>
            <Link href={listPath}>← {b.back}</Link>
          </p>
        </div>
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}
