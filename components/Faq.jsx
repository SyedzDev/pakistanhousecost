export default function Faq({ items, title }) {
  return (
    <section className="sec faq" id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <h2 id="faq-h">{title}</h2>
        {items.map(([q, a], i) => (
          <details key={i}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
