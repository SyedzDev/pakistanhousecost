import { grp, pkr, short } from "@/lib/format";

export function StackBar({ groups, labels }) {
  const entries = Object.entries(groups || {});
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  return (
    <>
      <div className="stack" role="img" aria-label={entries.map(([k, v]) => `${labels[k] || k} ${Math.round((v / total) * 100)}%`).join(", ")}>
        {entries.map(([k, v]) => <i key={k} className={`g-${k}`} style={{ width: `${(v / total) * 100}%` }} />)}
      </div>
      <ul className="legend">
        {entries.map(([k, v]) => (
          <li key={k}>
            <span className={`dot g-${k}`} />
            {labels[k] || k}
            <b>{pkr(v)} ({Math.round((v / total) * 100)}%)</b>
          </li>
        ))}
      </ul>
    </>
  );
}

export function TimelineChart({ timeline, lang, label }) {
  if (!timeline?.length) return null;
  const W = 480, H = 250, L = 78, R = 14, T = 14, B = 30;
  const max = Math.max(...timeline.map((p) => p.total)) * 1.08;
  const x = (i) => L + (i * (W - L - R)) / (timeline.length - 1);
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const lastActual = timeline.map((p) => p.forecast).lastIndexOf(false);
  const pts = (arr) => arr.map((p) => `${x(timeline.indexOf(p))},${y(p.total)}`).join(" ");
  const actual = timeline.filter((p) => !p.forecast);
  const fc = timeline.slice(Math.max(lastActual, 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#E4E8E5" strokeWidth="1" />
          <text x={L - 8} y={y(v) + 4} textAnchor="end">{short(v, lang)}</text>
        </g>
      ))}
      <polyline points={pts(actual)} fill="none" stroke="#0B4A38" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {fc.length > 1 && <polyline points={pts(fc)} fill="none" stroke="#B8860B" strokeWidth="2.5" strokeDasharray="6 6" strokeLinejoin="round" strokeLinecap="round" />}
      {timeline.map((p, i) => (
        <g key={p.year}>
          <circle cx={x(i)} cy={y(p.total)} r="4" fill={p.forecast ? "#B8860B" : "#0B4A38"} stroke="#fff" strokeWidth="1.5" />
          {i % 2 === 0 && <text x={x(i)} y={H - 8} textAnchor="middle">{p.year}</text>}
        </g>
      ))}
    </svg>
  );
}
