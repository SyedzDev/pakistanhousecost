import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export default function manifest() {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8F7",
    theme_color: "#0E5C46",
    lang: "en",
    dir: "ltr",
    categories: ["utilities", "finance", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
