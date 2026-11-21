"use client";

import { useMemo, useState, type ReactNode } from "react";

export type LibraryItem = { slug: string; title: string; summary: string; category: string; audiences: string[]; text: string };

/** Search + category filter. Cards are rendered on the server and passed in, keyed by slug. */
export function ArticleLibrary({
  items,
  categories,
  audiences,
  cards,
}: {
  items: LibraryItem[];
  categories: { key: string; label: string; count: number }[];
  audiences: { key: string; label: string; count: number }[];
  cards: Record<string, ReactNode>;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [aud, setAud] = useState<string>("all");
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((i) => (cat === "all" || i.category === cat) && (aud === "all" || i.audiences.includes(aud) || i.audiences.includes("everyone")) && terms.every((t) => i.text.includes(t)));
  }, [items, q, cat, aud]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <label htmlFor="article-search" className="sr-only">Search articles</label>
          <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-steel" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" strokeLinecap="round" />
          </svg>
          <input
            id="article-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search — e.g. sciatica, posture, headache"
            className="min-h-12 w-full rounded-full border border-line-strong bg-white pl-12 pr-4 text-ink outline-none transition focus:border-burgundy focus:ring-4 focus:ring-burgundy/10"
          />
        </div>
        <p className="text-sm text-steel-deep" aria-live="polite">
          {results.length} {results.length === 1 ? "article" : "articles"}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="audience" className="text-sm font-semibold text-ink">Written for</label>
        <select
          id="audience"
          value={aud}
          onChange={(e) => setAud(e.target.value)}
          className="min-h-11 rounded-full border border-line-strong bg-white px-4 text-sm text-ink outline-none focus:border-burgundy focus:ring-4 focus:ring-burgundy/10 sm:w-auto"
        >
          <option value="all">Anyone</option>
          {audiences.filter((a) => a.key !== "everyone" && a.count > 0).map((a) => (
            <option key={a.key} value={a.key}>{a.label}</option>
          ))}
        </select>
      </div>
      <div role="group" aria-label="Filter by category" className="mt-4 flex flex-wrap gap-2">
        {[{ key: "all", label: "All", count: items.length }, ...categories].map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={cat === c.key}
            onClick={() => setCat(c.key)}
            disabled={c.count === 0}
            className={`min-h-10 rounded-full px-4 text-sm font-medium transition ${
              cat === c.key ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {c.label} {c.key !== "all" && <span className={cat === c.key ? "text-white/60" : "text-steel-deep"}>· {c.count}</span>}
          </button>
        ))}
      </div>
      {results.length ? (
        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{results.map((r) => <div key={r.slug}>{cards[r.slug]}</div>)}</div>
      ) : (
        <div className="mt-12 rounded-[22px] bg-white p-10 text-center ring-1 ring-line">
          <p className="font-display text-2xl text-ink">No articles match that yet.</p>
          <p className="mt-2 text-steel-deep">Try a broader word, or clear the filters.</p>
          <button type="button" onClick={() => { setQ(""); setCat("all"); setAud("all"); }} className="mt-5 min-h-11 rounded-full bg-ink px-5 font-semibold text-white">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
