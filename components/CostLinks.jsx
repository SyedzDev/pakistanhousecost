import Link from "next/link";
import { CITIES, SIZES, costPath } from "@/lib/config";

export default function CostLinks({ lang }) {
  return (
    <div className="cities">
      {CITIES.map((c) => (
        <div className="panel" key={c.slug}>
          <h3>{lang === "ur" ? c[lang] : c.en}</h3>
          <ul className="links">
            {SIZES.map((s) => (
              <li key={s.slug}>
                <Link href={costPath(lang, c.slug, s.slug)}>{lang === "ur" ? `${s.ur} (${c.ur})` : `${s.en} house cost in ${c.en}`}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
