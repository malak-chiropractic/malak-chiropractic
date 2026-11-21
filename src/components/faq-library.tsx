"use client";

import { useMemo, useState } from "react";

type Item = { category: string; question: string; answer: string };

function Answer({ text }: { text: string }) {
  const parts = text.split(/(\[TO CONFIRM:[^\]]*\])/g);
  return <>{parts.map((p, i) => (p.startsWith("[TO CONFIRM:") ? <mark key={i} className="tc">{p}</mark> : <span key={i}>{p}</span>))}</>;
}

export function FaqLibrary({ categories, items }: { categories: { key: string; label: string }[]; items: Item[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => {
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((i) => (cat === "all" || i.category === cat) && t.every((w) => `${i.question} ${i.answer}`.toLowerCase().includes(w)));
  }, [q, cat, items]);
  const groups = categories.map((c) => ({ ...c, items: filtered.filter((i) => i.category === c.key) })).filter((g) => g.items.length);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <label htmlFor="faq-search" className="text-sm font-semibold text-ink">Search questions</label>
          <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Medicare, X-ray, pregnancy" className="mt-2 min-h-12 w-full rounded-full border border-line-strong bg-white px-5 text-ink outline-none focus:border-burgundy focus:ring-4 focus:ring-burgundy/10" />
          <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {[{ key: "all", label: "All questions" }, ...categories].map((c) => (
              <button key={c.key} type="button" aria-pressed={cat === c.key} onClick={() => setCat(c.key)} className={`min-h-10 rounded-full px-4 text-left text-sm font-medium transition ${cat === c.key ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink"}`}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm text-steel-deep" aria-live="polite">{filtered.length} {filtered.length === 1 ? "question" : "questions"}</p>
        </div>
      </div>
      <div className="lg:col-span-8">
        {groups.length === 0 && <p className="rounded-[20px] bg-white p-8 text-steel-deep ring-1 ring-line">No questions match. Try another word, or contact us.</p>}
        {groups.map((g) => (
          <section key={g.key} className="mb-12" aria-labelledby={`faq-${g.key}`}>
            <h2 id={`faq-${g.key}`} className="font-display text-display-sm text-ink">{g.label}</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {g.items.map((f) => (
                <details key={f.question} className="acc">
                  <summary className="flex items-center justify-between gap-6 py-5 font-semibold text-ink">
                    {f.question}
                    <span aria-hidden className="acc-icon text-2xl font-light leading-none text-burgundy">+</span>
                  </summary>
                  <p className="pb-6 pr-10 leading-relaxed text-[#2b2f34]"><Answer text={f.answer} /></p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
