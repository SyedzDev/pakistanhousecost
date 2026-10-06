import Link from "next/link";
import Shell from "./Shell";
import JsonLd from "./JsonLd";
import { T } from "@/lib/i18n";
import { POSTS } from "@/lib/blog";
import { SITE_URL, langPrefix } from "@/lib/config";
import { pageMeta, breadcrumbLd } from "@/lib/seo";

export function blogListMetadata(lang) {
  const t = T[lang].blog;
  return pageMeta({
    lang, path: "/blog", title: t.title, description: t.description,
    ogTitle: t.title, ogSub: t.sub,
    keywords: [
      "house construction cost guide Pakistan", "5 marla house cost guide",
      "grey structure vs finished", "construction cost tips Pakistan", "ghar banane ka kharcha guide",
    ],
  });
}

export default function BlogList({ lang }) {
  const t = T[lang];
  const b = t.blog;
  const p = langPrefix(lang);
  const listPath = `${p}/blog`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([[t.city.home, p || "/"], [b.h1, listPath]]),
      {
        "@type": "Blog",
        name: b.title,
        description: b.description,
        url: SITE_URL + listPath,
        inLanguage: t.htmlLang,
        blogPost: POSTS.map((post) => ({
          "@type": "BlogPosting",
          headline: post[lang].title,
          description: post[lang].description,
          url: `${SITE_URL}${listPath}/${post.slug}`,
          datePublished: post.date,
          dateModified: post.updated,
        })),
      },
    ],
  };

  return (
    <Shell lang={lang} altHref={lang === "ur" ? "/blog" : "/ur/blog"}>
      <main id="main">
        <div className="wrap">
          <div className="hero">
            <nav className="crumbs" aria-label="Breadcrumb"><ol>
              <li><Link href={p || "/"}>{t.city.home}</Link></li>
              <li aria-current="page">{b.h1}</li>
            </ol></nav>
            <span className="eyebrow">{lang === "ur" ? "گائیڈز اور مشورے" : "Guides & tips"}</span>
            <h1>{b.h1}</h1>
            <p>{b.sub}</p>
          </div>

          <section className="sec" style={{ paddingTop: 8 }} aria-label={b.h1}>
            <div className="cols3">
              {POSTS.map((post) => (
                <article className="panel" key={post.slug}>
                  <h3><Link href={`${listPath}/${post.slug}`}>{post[lang].title}</Link></h3>
                  <p>{post[lang].description}</p>
                  <p className="note" style={{ marginTop: 12 }}>
                    <Link href={`${listPath}/${post.slug}`}>{b.readMore} →</Link>
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <JsonLd data={ld} />
    </Shell>
  );
}
