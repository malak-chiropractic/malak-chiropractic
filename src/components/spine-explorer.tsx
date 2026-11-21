"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Spine3D, viewName, type IliumMotion } from "./spine-3d";
import type { AnatomyRegion } from "@/lib/content";

type Key = AnatomyRegion["key"];
type LinkRef = { slug: string; title: string };
export type ExplorerRegion = AnatomyRegion & { articleLinks: LinkRef[]; conditionLinks: LinkRef[] };

export function SpineExplorer({ regions, intro, compact = false }: { regions: ExplorerRegion[]; intro: string; compact?: boolean }) {
  const [selected, setSelected] = useState<Key>("lumbar");
  const [hover, setHover] = useState<Key | null>(null);
  const [angle, setAngle] = useState(0);
  const [motion, setMotion] = useState<IliumMotion>("neutral");
  const drag = useRef<{ x: number; a: number } | null>(null);
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, a: angle };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    setAngle((((drag.current.a + dx * 0.8) % 360) + 360) % 360);
  };
  const onUp = () => {
    drag.current = null;
  };
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const current = regions.find((r) => r.key === selected) ?? regions[0];
  const idx = regions.findIndex((r) => r.key === selected);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % regions.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + regions.length) % regions.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = regions.length - 1;
    else return;
    e.preventDefault();
    setSelected(regions[next].key);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Illustration + region selector */}
        <div className="lg:col-span-5">
          <div className="rounded-[28px] bg-white p-4 shadow-[0_1px_0_var(--color-line)] ring-1 ring-line sm:p-6">
            <div
              role="tablist"
              aria-label="Spinal regions"
              aria-orientation="horizontal"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            >
              {regions.map((r, i) => {
                const active = r.key === selected;
                return (
                  <button
                    key={r.key}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`${uid}-tab-${r.key}`}
                    aria-selected={active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setSelected(r.key)}
                    onKeyDown={onKeyDown}
                    onPointerEnter={() => setHover(r.key)}
                    onPointerLeave={() => setHover(null)}
                    className={`min-h-11 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all duration-300 ${
                      active ? "bg-ink text-white" : "bg-paper text-ink hover:bg-sky"
                    }`}
                  >
                    <span className="block leading-tight">{r.label}</span>
                    <span className={`mt-0.5 block text-[0.72rem] font-medium ${active ? "text-white/70" : "text-steel-deep"}`}>{r.range}</span>
                  </button>
                );
              })}
            </div>
            <div
              className={`relative mx-auto mt-4 cursor-grab active:cursor-grabbing ${compact ? "max-w-[320px]" : "max-w-[400px]"}`}
              style={{ aspectRatio: "460 / 800" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <Spine3D angle={angle} selected={selected} hover={hover} motion={selected === "pelvis" ? motion : "neutral"} onPick={setSelected} onHover={setHover} />
            </div>

            {/* Rotation controls */}
            <div className="mt-3 rounded-2xl bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={`${uid}-rot`} className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-deep">
                  Rotate 360°
                </label>
                <span className="text-xs font-medium text-ink" aria-live="polite">{viewName(angle)}</span>
              </div>
              <input
                id={`${uid}-rot`}
                type="range"
                min={0}
                max={359}
                value={Math.round(angle)}
                onChange={(e) => setAngle(Number(e.target.value))}
                aria-valuetext={`${Math.round(angle)} degrees, ${viewName(angle)}`}
                className="mt-2 w-full accent-burgundy"
              />
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Preset views">
                {[
                  ["Side", 0],
                  ["Back", 90],
                  ["Other side", 180],
                  ["Front", 270],
                ].map(([l, v]) => (
                  <button
                    key={l as string}
                    type="button"
                    onClick={() => setAngle(v as number)}
                    aria-pressed={Math.round(angle) === v}
                    className={`min-h-9 rounded-full px-3 text-xs font-semibold transition ${Math.round(angle) === v ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-ink"}`}
                  >
                    {l as string}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.72rem] text-steel-deep">Drag the model, use the slider, or choose a view.</p>
            </div>

            {selected === "pelvis" && (
              <div className="mt-3 rounded-2xl bg-sky/60 p-4 ring-1 ring-sky-deep/50">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-deep">Pelvic (ilium) rotation · right side</p>
                <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Ilium rotation">
                  {(
                    [
                      ["neutral", "Neutral"],
                      ["AS", "AS — anterior-superior"],
                      ["PI", "PI — posterior-inferior"],
                    ] as [IliumMotion, string][]
                  ).map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={motion === v}
                      onClick={() => {
                        setMotion(v);
                        if (v !== "neutral" && (angle > 60 && angle < 300)) setAngle(0);
                      }}
                      className={`min-h-9 rounded-full px-3 text-xs font-semibold transition ${motion === v ? "bg-burgundy text-white" : "bg-white text-ink ring-1 ring-line hover:ring-burgundy"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-[#2b2f34]">
                  {motion === "AS" && "The ilium (hip bone) rotates so the back of the pelvis (PSIS) moves forwards and up relative to the sacrum."}
                  {motion === "PI" && "The ilium rotates so the back of the pelvis (PSIS) moves backwards and down relative to the sacrum."}
                  {motion === "neutral" && "Choose AS or PI to see how the ilium can rotate at the sacroiliac joint. Side views show it best."}{" "}
                  The sacroiliac joint normally moves only a few degrees; the motion here is exaggerated so it&apos;s easy to see.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel */}
        <div className="lg:col-span-7">
          <div
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${current.key}`}
            aria-live="polite"
            tabIndex={0}
            className="h-full rounded-[28px] bg-sky/60 p-6 ring-1 ring-sky-deep/50 sm:p-9"
          >
            <div key={current.key} className="rise">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{current.range}</span>
                <span className="rounded-full bg-butter px-3 py-1 text-xs font-semibold text-ink">{current.count}</span>
              </div>
              <h3 className="font-display mt-4 text-display-md leading-tight text-ink">{current.label}</h3>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[#2b2f34]">{current.summary}</p>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Key structures</h4>
                  <ul className="mt-3 space-y-2 text-[0.95rem] leading-snug text-[#2b2f34]">
                    {current.structures.map((s) => (
                      <li key={s} className="flex gap-2.5">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">What it does</h4>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-[#2b2f34]">{current.function}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Commonly reported concerns</h4>
                  <ul className="mt-3 space-y-2 text-[0.95rem] leading-snug text-[#2b2f34]">
                    {current.symptoms.map((s) => (
                      <li key={s} className="flex gap-2.5">
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-steel" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-steel-deep">
                    Symptoms in this area can have many causes, including some unrelated to the spine. This list isn&apos;t a diagnosis.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">When to seek assessment</h4>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-[#2b2f34]">{current.seekCare}</p>
                </div>
              </div>

              {(current.articleLinks.length > 0 || current.conditionLinks.length > 0) && (
                <div className="mt-8 border-t border-sky-deep/60 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-deep">Keep reading</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {current.articleLinks.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/education/${a.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-burgundy">
                          {a.title}
                        </Link>
                      </li>
                    ))}
                    {current.conditionLinks.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/conditions/${c.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-dashed border-steel/50 px-4 text-sm font-medium text-ink transition hover:border-burgundy">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-steel-deep">{intro}</p>

      {/* Non-interactive, accessible alternative */}
      <details className="acc mt-4 rounded-2xl border border-line bg-white">
        <summary className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
          View all spinal regions as text
          <span aria-hidden className="acc-icon text-xl leading-none text-burgundy">+</span>
        </summary>
        <div className="grid gap-8 border-t border-line px-5 py-6 md:grid-cols-2">
          {regions.map((r) => (
            <section key={r.key} aria-label={r.label}>
              <h3 className="font-semibold text-ink">
                {r.label} <span className="font-normal text-steel-deep">({r.range}, {r.count})</span>
              </h3>
              <p className="mt-1 text-sm text-[#2b2f34]">{r.summary}</p>
              <p className="mt-2 text-sm text-[#2b2f34]">
                <strong>Structures:</strong> {r.structures.join("; ")}.
              </p>
              <p className="mt-1 text-sm text-[#2b2f34]">
                <strong>Function:</strong> {r.function}
              </p>
              <p className="mt-1 text-sm text-[#2b2f34]">
                <strong>Commonly reported concerns:</strong> {r.symptoms.join("; ")}.
              </p>
              <p className="mt-1 text-sm text-[#2b2f34]">
                <strong>When to seek assessment:</strong> {r.seekCare}
              </p>
            </section>
          ))}
        </div>
      </details>
    </div>
  );
}
