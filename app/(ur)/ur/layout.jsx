import "@/app/globals.css";
import { SITE_URL } from "@/lib/config";
import { rootMetadata, siteLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = rootMetadata("ur", SITE_URL);
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0E5C46" };

export default function RootLayout({ children }) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Inter:wght@400;600&display=swap"
        />
      </head>
      <body>
        {children}
        <JsonLd data={siteLd("ur")} />
      </body>
    </html>
  );
}
