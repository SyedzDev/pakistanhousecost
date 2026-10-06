import { SITE_URL } from "@/lib/config";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/og", "/api/"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
