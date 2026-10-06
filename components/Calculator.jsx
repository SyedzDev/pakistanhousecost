"use client";
import { useEffect, useMemo, useState } from "react";
import { T } from "@/lib/i18n";
import { API_URL, CITIES, SIZES } from "@/lib/config";
import { defaultEnabled, defaultsFor, makeBody, clampYear } from "@/lib/estimate";
import { grp, pkr, short, unitLabel } from "@/lib/format";
import { StackBar, TimelineChart } from "./Charts";
import fallback from "@/lib/catalog.fallback.json";

function Seg({ name, value, options, onChange, legend }) {
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="seg">
        {options.map(([k, label]) => (
          <label key={k} className={String(value) === String(k) ? "on" : ""}>
            <input type="radio" name={name} value={k} checked={String(value) === String(k)} onChange={() => onChange(k)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const opts = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export default function Calculator({ lang = "en", catalog, initialCity = "Lahore", initialMarla = 5, initialStage = "finished", heading }) {
  const t = T[lang];
  const c = t.calc;
  const cat = catalog || fallback;
  const cityName = (en) => (lang === "ur" ? CITIES.find((x) => x.en === en)?.ur || en : en);

  const [f, setF] = useState(() => ({
    city: initialCity, marla: initialMarla, floors: 1, year: clampYear(cat),
    stage: initialStage, level: "market", ...defaultsFor(initialMarla),
  }));
  const [marlaText, setMarlaText] = useState(String(initialMarla));
  const [enabled, setEnabled] = useState(() => defaultEnabled(cat, initialStage));
  const [variants, setVariants] = useState({});
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setStage = (v) => { set("stage", v); setEnabled(defaultEnabled(cat, v)); };
  const setMarla = (m) => { setMarlaText(String(m)); setF((p) => ({ ...p, marla: m, ...defaultsFor(m) })); };
  const onMarlaInput = (e) => {
    const v = e.target.value;
    setMarlaText(v);
    const n = Number(v);
    if (n >= 1 && n <= 40) setF((p) => ({ ...p, marla: n, ...defaultsFor(Math.round(n)) }));
  };
  const marlaValid = Number(marlaText) >= 1 && Number(marlaText) <= 40;

  const body = useMemo(() => makeBody(cat, f, enabled, variants), [cat, f, enabled, variants]);

  useEffect(() => {
    if (!marlaValid) return;
    const ctrl = new AbortController();
    setLoading(true); setError(false);
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`${API_URL}/api/estimate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body), signal: ctrl.signal,
        });
        if (!r.ok) throw new Error(String(r.status));
        setRes(await r.json());
        setLoading(false);
      } catch (e) {
        if (e.name !== "AbortError") { setError(true); setLoading(false); }
      }
    }, 350);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [body, tick, marlaValid]);

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const r = await fetch(`${API_URL}/api/quote.pdf`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error();
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url; a.download = "house-quotation.pdf"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (e) { setError(true); }
    setPdfBusy(false);
  }

  function shareWhatsApp() {
    if (!res) return;
    const text = `${c.shareText(cityName(f.city), f.marla, `${pkr(res.total)} (${short(res.total, lang)})`)}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  const groupsOfItems = useMemo(() => {
    const g = {};
    cat.items.forEach((it) => { (g[it.group] ||= []).push(it); });
    return g;
  }, [cat]);

  const sizeLabel = (m) => SIZES.find((s) => s.marla === m)?.[lang] || `${m}`;

  return (
    <section id="calculator" className="calc" aria-label={heading || c.title}>
      <form className="panel" onSubmit={(e) => e.preventDefault()}>
        <h2>{heading || c.title}</h2>

        <div className="field">
          <label htmlFor="city">{c.city}</label>
          <select id="city" className="in" value={f.city} onChange={(e) => set("city", e.target.value)}>
            {cat.cities.map((x) => <option key={x} value={x}>{cityName(x)}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="marla">{c.marla} <span className="hint">({c.marlaHint})</span></label>
          <input id="marla" className="in" type="number" inputMode="decimal" min="1" max="40" step="0.5" value={marlaText} onChange={onMarlaInput} aria-invalid={!marlaValid} />
          <div className="chips" role="group" aria-label={c.marla}>
            {SIZES.map((s) => (
              <button type="button" key={s.slug} className="chip" aria-pressed={Number(marlaText) === s.marla} onClick={() => setMarla(s.marla)}>{s[lang]}</button>
            ))}
          </div>
          {!marlaValid && <p className="hint" role="alert">1 – 40</p>}
        </div>

        <Seg name="stage" legend={c.stage} value={f.stage} onChange={setStage}
          options={cat.stages.map((s) => [s, c.stages[s]])} />
        <p className="stage-help" style={{ marginTop: -8, marginBottom: 16 }}>{c.stageHelp[f.stage]}</p>

        <Seg name="floors" legend={c.floors} value={f.floors} onChange={(v) => set("floors", Number(v))}
          options={[1, 2, 3].map((n) => [n, c.floorsOpt[n]])} />
        <Seg name="level" legend={c.level} value={f.level} onChange={(v) => set("level", v)}
          options={cat.levels.map((l) => [l, c.levels[l]])} />

        <div className="row3 field">
          <div><label htmlFor="beds">{c.beds}</label>
            <select id="beds" className="in" value={f.beds} onChange={(e) => set("beds", Number(e.target.value))}>{opts(1, 10).map((n) => <option key={n}>{n}</option>)}</select></div>
          <div><label htmlFor="baths">{c.baths}</label>
            <select id="baths" className="in" value={f.baths} onChange={(e) => set("baths", Number(e.target.value))}>{opts(1, 10).map((n) => <option key={n}>{n}</option>)}</select></div>
          <div><label htmlFor="kitchens">{c.kitchens}</label>
            <select id="kitchens" className="in" value={f.kitchens} onChange={(e) => set("kitchens", Number(e.target.value))}>{opts(1, 4).map((n) => <option key={n}>{n}</option>)}</select></div>
        </div>

        <div className="field">
          <label htmlFor="year">{c.year}</label>
          <select id="year" className="in" value={f.year} onChange={(e) => set("year", Number(e.target.value))}>
            {opts(cat.years.min, cat.years.max).map((y) => (
              <option key={y} value={y}>{y}{y > cat.years.last_actual ? ` (${c.forecast})` : ""}</option>
            ))}
          </select>
        </div>

        <details className="more">
          <summary>{c.customize}</summary>
          {Object.entries(groupsOfItems).map(([g, list]) => (
            <div className="grp" key={g}>
              <h3>{c.groups[g] || g}</h3>
              {list.map((it) => (
                <div className="item" key={it.id}>
                  <input id={`it-${it.id}`} type="checkbox" checked={it.required ? true : !!enabled[it.id]} disabled={it.required}
                    onChange={(e) => setEnabled((p) => ({ ...p, [it.id]: e.target.checked }))} />
                  <label htmlFor={`it-${it.id}`}>{lang === "ur" ? it.ur : it.en}</label>
                  {it.required && <span className="tag">{c.required}</span>}
                  {it.assumed && <span className="tag warn">{c.assumed}</span>}
                  {it.variants.length > 0 && (
                    <select className="in" aria-label={`${it.en} ${c.variant}`} value={variants[it.id] || it.variants[0].key}
                      onChange={(e) => setVariants((p) => ({ ...p, [it.id]: e.target.value }))}>
                      {it.variants.map((v) => <option key={v.key} value={v.key}>{v.label}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          ))}
        </details>
      </form>

      <div>
        {error && (
          <div className="err" role="alert">
            <p>{c.error}</p>
            <button type="button" className="btn alt" onClick={() => setTick((n) => n + 1)}>{c.retry}</button>
          </div>
        )}
        {!error && !res && <div className="slip" data-busy="true"><p className="slip-label">{c.loading}</p><p className="slip-total">—</p></div>}
        {res && !error && (
          <div className="slip" data-busy={loading} aria-live="polite">
            <p className="slip-label">
              {cityName(f.city)}, {sizeLabel(f.marla)} — {c.stages[f.stage]}
              <span className={`badge ${res.is_forecast ? "fc" : ""}`}>{res.is_forecast ? c.forecast : c.actual} {f.year}</span>
              <span className="badge ai">{t.home.aiBadge}</span>
            </p>
            <p className="slip-total" aria-label={c.total_aria}>{pkr(res.total)}</p>
            <p className="slip-short">≈ {short(res.total, lang)}</p>
            <dl className="stats">
              <div><dt>{c.range}</dt><dd>{short(res.low, lang)} – {short(res.high, lang)}</dd></div>
              <div><dt>{c.perSqft}</dt><dd>{pkr(res.per_sqft)}</dd></div>
              <div><dt>{c.covered}</dt><dd>{grp(res.covered_sqft)} {c.sqft}</dd></div>
            </dl>

            <h3>{c.byGroup}</h3>
            <StackBar groups={res.groups} labels={c.groups} />

            <h3>{c.lines}</h3>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>
                  <th scope="col">{c.th.item}</th><th scope="col" className="num">{c.th.qty}</th>
                  <th scope="col" className="num">{c.th.rate}</th><th scope="col" className="num">{c.th.cost}</th><th scope="col" className="num">{c.th.share}</th>
                </tr></thead>
                <tbody>
                  {[...res.lines].sort((a, b) => b.cost - a.cost).map((l) => (
                    <tr key={l.id}>
                      <th scope="row">{lang === "ur" ? l.ur : l.en}{l.variant ? ` (${l.variant})` : ""}{l.scope < 1 ? ` [${Math.round(l.scope * 100)}%]` : ""}{l.assumed ? " *" : ""}</th>
                      <td className="num">{grp(l.qty)} {unitLabel(l.unit)}</td>
                      <td className="num">{grp(l.unit_rate)}</td>
                      <td className="num">{grp(l.cost)}</td>
                      <td className="num"><span className="mini" style={{ width: Math.max(2, l.share * 0.6) }} />{l.share}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><td colSpan={3}>{c.total}</td><td className="num" colSpan={2}>{pkr(res.total)}</td></tr></tfoot>
              </table>
            </div>

            <h3>{c.timeline}</h3>
            <TimelineChart timeline={res.timeline} lang={lang} label={c.timeline} />

            <div className="actions">
              <button type="button" className="btn" onClick={downloadPdf} disabled={pdfBusy}>{pdfBusy ? c.pdfBusy : c.pdf}</button>
              <button type="button" className="btn alt" onClick={shareWhatsApp}>{c.whatsapp}</button>
            </div>
            <p className="note">{c.disclaimer}</p>
          </div>
        )}
      </div>

      {res && !error && (
        <a className="mbar" href="#calculator" aria-label={c.total_aria}>
          <span>{c.total}</span><span>{short(res.total, lang)}</span>
        </a>
      )}
    </section>
  );
}
