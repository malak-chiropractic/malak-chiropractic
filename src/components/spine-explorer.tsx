"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { AnatomyRegion } from "@/lib/content";

type Key = AnatomyRegion["key"];
type LinkRef = { slug: string; title: string };
export type ExplorerRegion = AnatomyRegion & { articleLinks: LinkRef[]; conditionLinks: LinkRef[] };

/* ─────────────────────────────────────────────────────────────
   Original, schematic lateral (side-on) view of the spine.
   Anterior faces left. Correct vertebral counts (7 cervical,
   12 thoracic, 5 lumbar, fused sacrum, coccyx) and the four
   natural curves: cervical lordosis, thoracic kyphosis,
   lumbar lordosis and sacral kyphosis.
   ───────────────────────────────────────────────────────────── */

const CX = 176;
const SEG = {
  cervical: { start: 34, count: 7, body: 11, disc: 4, w: 22, spine: 15, amp: -15 },
  thoracic: { start: 177, count: 12, body: 15, disc: 4.4, w: 28, spine: 21, amp: 28 },
  lumbar: { start: 0, count: 5, body: 22, disc: 6, w: 38, spine: 17, amp: -22 },
};
const cervLen = SEG.cervical.count * (SEG.cervical.body + SEG.cervical.disc);
SEG.thoracic.start = SEG.cervical.start + cervLen;
const thorLen = SEG.thoracic.count * (SEG.thoracic.body + SEG.thoracic.disc);
SEG.lumbar.start = SEG.thoracic.start + thorLen;
const lumbLen = SEG.lumbar.count * (SEG.lumbar.body + SEG.lumbar.disc);
const SACRUM_START = SEG.lumbar.start + lumbLen;
const SACRUM_END = SACRUM_START + 104;

function centerX(y: number): number {
  for (const s of Object.values(SEG)) {
    const len = s.count * (s.body + s.disc);
    if (y >= s.start && y <= s.start + len) return CX + s.amp * Math.sin((Math.PI * (y - s.start)) / len);
  }
  if (y > SACRUM_START) {
    const t = Math.min(1, (y - SACRUM_START) / (SACRUM_END - SACRUM_START + 40));
    return CX + 46 * Math.pow(t, 1.35);
  }
  return CX;
}
function angleAt(y: number) {
  const dx = centerX(y + 1) - centerX(y - 1);
  return (-Math.atan2(dx, 2) * 180) / Math.PI;
}

type Vert = { key: Key; label: string; y: number; x: number; a: number; h: number; w: number; spine: number; idx: number };
const VERTS: Vert[] = [];
(Object.keys(SEG) as (keyof typeof SEG)[]).forEach((k) => {
  const s = SEG[k];
  for (let i = 0; i < s.count; i++) {
    const y = s.start + i * (s.body + s.disc) + s.body / 2;
    const grow = i / s.count;
    VERTS.push({
      key: k,
      label: `${k[0].toUpperCase()}${i + 1}`,
      y,
      x: centerX(y),
      a: angleAt(y),
      h: s.body,
      w: s.w + grow * 4,
      // C7 (vertebra prominens) has a notably long spinous process
      spine: k === "cervical" && i === 6 ? 23 : s.spine,
      idx: i,
    });
  }
});

function sacrumPath() {
  const left: string[] = [];
  const right: string[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const y = SACRUM_START + ((SACRUM_END - SACRUM_START) * i) / steps;
    const w = 42 - 26 * (i / steps);
    const x = centerX(y);
    const a = (angleAt(y) * Math.PI) / 180;
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    left.push(`${(x - (w / 2 + 4) * nx).toFixed(1)},${(y - (w / 2 + 4) * ny).toFixed(1)}`);
    right.unshift(`${(x + (w / 2 - 4) * nx).toFixed(1)},${(y + (w / 2 - 4) * ny).toFixed(1)}`);
  }
  return `M${left.join(" L")} L${right.join(" L")} Z`;
}

const REGION_BOUNDS: Record<Key, [number, number]> = {
  cervical: [SEG.cervical.start - 8, SEG.thoracic.start - 1],
  thoracic: [SEG.thoracic.start - 1, SEG.lumbar.start - 1],
  lumbar: [SEG.lumbar.start - 1, SACRUM_START],
  pelvis: [SACRUM_START, SACRUM_END + 44],
};

function SpineSvg({ selected, hover, onPick, onHover }: { selected: Key; hover: Key | null; onPick: (k: Key) => void; onHover: (k: Key | null) => void }) {
  const tone = (k: Key) => (k === selected ? "sel" : k === hover ? "hov" : "off");
  const fills = {
    sel: { body: "var(--color-burgundy)", stroke: "var(--color-burgundy-deep)", disc: "var(--color-sky-deep)", post: "#9a4a62" },
    hov: { body: "#c9ced3", stroke: "var(--color-steel)", disc: "var(--color-sky)", post: "#d6dade" },
    off: { body: "#ffffff", stroke: "#9aa3aa", disc: "#e8f2f8", post: "#f1f3f4" },
  };
  const label = (k: Key) => ({ cervical: "Cervical", thoracic: "Thoracic", lumbar: "Lumbar", pelvis: "Sacrum & pelvis" })[k];
  const sacTone = fills[tone("pelvis")];

  return (
    <svg viewBox="0 0 420 760" className="h-full w-full" aria-hidden focusable="false">
      {/* ribs (context) */}
      {VERTS.filter((v) => v.key === "thoracic").map((v) => (
        <path
          key={`rib-${v.idx}`}
          d={`M${v.x - 6} ${v.y} C ${v.x - 40} ${v.y - 6}, ${v.x - 92} ${v.y + 8}, ${v.x - 104} ${v.y + 34 + v.idx * 1.5}`}
          fill="none"
          stroke={selected === "thoracic" ? "var(--color-sky-deep)" : "#e2e5e8"}
          strokeWidth="1.1"
          className="transition-[stroke] duration-500"
        />
      ))}
      {/* pelvis / ilium (context) */}
      <path
        d={`M${CX + 70} ${SACRUM_START - 34} C ${CX + 128} ${SACRUM_START - 26}, ${CX + 138} ${SACRUM_START + 46}, ${CX + 96} ${SACRUM_START + 92} C ${CX + 66} ${SACRUM_START + 124}, ${CX + 6} ${SACRUM_START + 132}, ${CX - 34} ${SACRUM_START + 118} C ${CX - 64} ${SACRUM_START + 106}, ${CX - 52} ${SACRUM_START + 52}, ${CX - 6} ${SACRUM_START + 4} C ${CX + 18} ${SACRUM_START - 22}, ${CX + 44} ${SACRUM_START - 36}, ${CX + 70} ${SACRUM_START - 34} Z`}
        fill={selected === "pelvis" ? "color-mix(in srgb, var(--color-sky) 70%, white)" : "#f4f6f7"}
        stroke={selected === "pelvis" ? "var(--color-sky-deep)" : "#dde1e4"}
        strokeWidth="1.2"
        className="transition-[fill,stroke] duration-500"
      />
      <circle cx={CX - 18} cy={SACRUM_START + 96} r="17" fill="none" stroke={selected === "pelvis" ? "var(--color-steel)" : "#d3d8dc"} strokeWidth="1.2" />

      {/* spinal cord / canal line */}
      <path
        d={`M${VERTS.map((v) => `${(v.x + Math.cos((v.a * Math.PI) / 180) * (v.w / 2 + 3)).toFixed(1)},${(v.y + Math.sin((v.a * Math.PI) / 180) * (v.w / 2 + 3)).toFixed(1)}`).join(" L")}`}
        fill="none"
        stroke="var(--color-butter)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* vertebrae */}
      {VERTS.map((v, i) => {
        const f = fills[tone(v.key)];
        const next = VERTS[i + 1];
        const discY = v.y + v.h / 2 + (SEG[v.key as keyof typeof SEG].disc / 2);
        return (
          <g key={v.label}>
            <g transform={`translate(${v.x.toFixed(1)} ${v.y.toFixed(1)}) rotate(${v.a.toFixed(2)})`} className="transition-all duration-500">
              {/* posterior elements: pedicle, lamina and spinous process (angled downwards) */}
              <path
                d={`M${v.w / 2 - 6} ${-v.h / 2 + 1} L${v.w / 2 + 8} ${-v.h / 2 + 1} L${v.w / 2 + 8 + v.spine} ${v.key === "thoracic" ? v.h * 0.9 : v.key === "lumbar" ? -1 : v.h * 0.35} L${v.w / 2 + 6 + v.spine} ${v.key === "thoracic" ? v.h * 1.15 : v.key === "lumbar" ? v.h / 2 - 2 : v.h * 0.7} L${v.w / 2 + 4} ${v.h / 2 - 1} L${v.w / 2 - 6} ${v.h / 2 - 1} Z`}
                fill={f.post}
                stroke={f.stroke}
                strokeWidth="0.9"
                strokeLinejoin="round"
                style={{ transition: "fill .5s, stroke .5s" }}
              />
              {/* vertebral body (anterior) */}
              <rect x={-v.w / 2 - 4} y={-v.h / 2} width={v.w} height={v.h} rx={Math.min(5, v.h / 3)} fill={f.body} stroke={f.stroke} strokeWidth="1" style={{ transition: "fill .5s, stroke .5s" }} />
            </g>
            {/* intervertebral disc (none between C1 and C2) */}
            {next && next.key === v.key && !(v.key === "cervical" && v.idx === 0) && (
              <g transform={`translate(${centerX(discY).toFixed(1)} ${discY.toFixed(1)}) rotate(${angleAt(discY).toFixed(2)})`}>
                <rect x={-v.w / 2 - 2} y={-SEG[v.key as keyof typeof SEG].disc / 2 + 0.6} width={v.w - 4} height={SEG[v.key as keyof typeof SEG].disc - 1.2} rx="2" fill={f.disc} style={{ transition: "fill .5s" }} />
              </g>
            )}
          </g>
        );
      })}

      {/* sacrum + coccyx */}
      <path d={sacrumPath()} fill={sacTone.body} stroke={sacTone.stroke} strokeWidth="1" strokeLinejoin="round" style={{ transition: "fill .5s, stroke .5s" }} />
      {[1, 2, 3, 4].map((n) => {
        const y = SACRUM_START + n * ((SACRUM_END - SACRUM_START) / 5);
        const x = centerX(y);
        const a = (angleAt(y) * Math.PI) / 180;
        const w = 42 - 26 * (n / 5);
        return (
          <line
            key={n}
            x1={x - (w / 2 + 2) * Math.cos(a)}
            y1={y - (w / 2 + 2) * Math.sin(a)}
            x2={x + (w / 2 - 6) * Math.cos(a)}
            y2={y + (w / 2 - 6) * Math.sin(a)}
            stroke={selected === "pelvis" ? "rgba(255,255,255,.55)" : "#d3d8dc"}
            strokeWidth="1"
          />
        );
      })}
      {[0, 1, 2].map((n) => {
        const y = SACRUM_END + 9 + n * 11;
        return <ellipse key={n} cx={centerX(y) - 2} cy={y} rx={6 - n * 1.4} ry="4.4" fill={sacTone.body} stroke={sacTone.stroke} strokeWidth="0.9" />;
      })}

      {/* region labels with leader lines */}
      {(Object.keys(REGION_BOUNDS) as Key[]).map((k) => {
        const [a, b] = REGION_BOUNDS[k];
        const mid = (a + b) / 2;
        const active = k === selected;
        return (
          <g key={k} className="transition-opacity">
            <line x1={centerX(mid) + 52} y1={mid} x2={300} y2={mid} stroke={active ? "var(--color-burgundy)" : "#c9ced3"} strokeWidth="1" />
            <circle cx={300} cy={mid} r="3" fill={active ? "var(--color-burgundy)" : "#c9ced3"} />
            <text x={310} y={mid + 4} fontSize="13" fontWeight={active ? 700 : 500} fill={active ? "var(--color-ink)" : "var(--color-steel-deep)"} fontFamily="var(--font-sans)">
              {label(k)}
            </text>
          </g>
        );
      })}

      {/* hit areas for pointer and touch */}
      {(Object.keys(REGION_BOUNDS) as Key[]).map((k) => {
        const [a, b] = REGION_BOUNDS[k];
        return (
          <rect
            key={`hit-${k}`}
            x="60"
            y={a}
            width="380"
            height={b - a}
            fill="transparent"
            className="cursor-pointer"
            onClick={() => onPick(k)}
            onPointerEnter={() => onHover(k)}
            onPointerLeave={() => onHover(null)}
          />
        );
      })}

      <text x="24" y="752" fontSize="11" fill="var(--color-steel-deep)" fontFamily="var(--font-sans)" letterSpacing="1.5">
        ← ANTERIOR (FRONT)
      </text>
      <text x="396" y="752" fontSize="11" fill="var(--color-steel-deep)" fontFamily="var(--font-sans)" letterSpacing="1.5" textAnchor="end">
        POSTERIOR (BACK) →
      </text>
    </svg>
  );
}

export function SpineExplorer({ regions, intro, compact = false }: { regions: ExplorerRegion[]; intro: string; compact?: boolean }) {
  const [selected, setSelected] = useState<Key>("lumbar");
  const [hover, setHover] = useState<Key | null>(null);
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
            <div className={`relative mx-auto mt-4 ${compact ? "max-w-[320px]" : "max-w-[400px]"}`} style={{ aspectRatio: "420 / 760" }}>
              <SpineSvg selected={selected} hover={hover} onPick={setSelected} onHover={setHover} />
            </div>
            <p className="mt-2 text-center text-xs text-steel-deep">Original schematic illustration · side view</p>
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
