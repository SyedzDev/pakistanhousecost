import { SITE_NAME, SITE_TAGLINE, SITE_URL, costPath } from "./config";
import { T } from "./i18n";

export const ogUrl = (title, sub = "") => `/og?title=${encodeURIComponent(title)}&sub=${encodeURIComponent(sub)}`;

// path: "/construction-cost/lahore/5-marla" (bina language prefix ke)
export function pageMeta({ lang, path, title, description, ogTitle, ogSub, keywords }) {
  const en = path || "/";
  const ur = "/ur" + (path === "/" ? "" : path);
  const self = lang === "ur" ? ur : en;
  return {
    title, description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: self,
      languages: { en, ur, "x-default": en },
    },
    openGraph: {
      title, description, url: self, siteName: SITE_NAME, type: "website", locale: T[lang].locale,
      images: [{ url: ogUrl(ogTitle || title, ogSub), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogUrl(ogTitle || title, ogSub)] },
  };
}

export const faqLd = (faq) => ({
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export const breadcrumbLd = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, href], i) => ({
    "@type": "ListItem", position: i + 1, name, item: SITE_URL + href,
  })),
});

// Site-wide Organization + WebSite (with SearchAction) graph.
export const siteLd = (lang) => {
  const p = lang === "ur" ? "/ur" : "";
  const url = SITE_URL + (p || "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_TAGLINE,
        areaServed: { "@type": "Country", name: "Pakistan" },
        knowsLanguage: ["en", "ur"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: T[lang].htmlLang,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}${p}/construction-cost?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
};

export const rootMetadata = (lang, siteUrl) => ({
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  keywords: [
    "house construction cost Pakistan", "construction cost calculator Pakistan",
    "grey structure cost", "marla house cost", "kanal house cost",
    "AI construction cost prediction", "ghar banane ka kharcha",
  ],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Construction",
  alternates: { canonical: lang === "ur" ? "/ur" : "/" },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website", siteName: SITE_NAME, locale: T[lang].locale,
    url: lang === "ur" ? `${siteUrl}/ur` : siteUrl,
  },
  twitter: { card: "summary_large_image", site: "@pakistanhousecost", creator: "@pakistanhousecost" },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  manifest: "/manifest.webmanifest",
});
