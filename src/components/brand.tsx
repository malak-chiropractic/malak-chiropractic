import { LOCKUP, MC, WORDS } from "./brand-paths";

/**
 * Malak Chiropractic logo, traced from the supplied artwork so it stays
 * crisp at any size and can be recoloured from the palette.
 *
 *  <Monogram />   the interlocked MC with the anatomical figure (primary mark)
 *  <Words />      "MALAK" / "CHIROPRACTIC" only
 *  <Lockup />     MALAK + figure + CHIROPRACTIC (full logo)
 *  <Figure />     the anatomical figure on its own
 */

type Tone = "light" | "dark";

const tones = {
  light: { m: "var(--color-steel)", c: "var(--color-ink)", malak: "var(--color-steel)", chiro: "var(--color-ink)", figFilter: undefined as string | undefined, figOpacity: 1 },
  dark: { m: "#ffffff", c: "var(--color-butter)", malak: "#ffffff", chiro: "#cfd4d8", figFilter: "invert(1)", figOpacity: 0.85 },
};

export function Monogram({
  tone = "light",
  figure = true,
  className = "",
  title = "Malak Chiropractic",
  animate = false,
}: {
  tone?: Tone;
  figure?: boolean;
  className?: string;
  title?: string;
  animate?: boolean;
}) {
  const t = tones[tone];
  const [, , w, h] = MC.viewBox;
  const f = MC.figure;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
      <path d={MC.M} fill={t.m} className={animate ? "rise" : undefined} />
      {figure && (
        <image
          href="/brand/mc-figure.webp"
          x={f.x}
          y={f.y}
          width={f.w}
          height={f.h}
          opacity={t.figOpacity}
          style={{ filter: t.figFilter, ...(animate ? { animationDelay: "350ms" } : {}) }}
          className={animate ? "rise" : undefined}
        />
      )}
      <path d={MC.C} fill={t.c} className={animate ? "rise" : undefined} style={animate ? { animationDelay: "180ms" } : undefined} />
    </svg>
  );
}

export function Words({ tone = "light", className = "", stacked = true }: { tone?: Tone; className?: string; stacked?: boolean }) {
  const t = tones[tone];
  const mw = WORDS.malak.viewBox[2];
  const mh = WORDS.malak.viewBox[3];
  const cw = WORDS.chiro.viewBox[2];
  const ch = WORDS.chiro.viewBox[3];
  if (!stacked) {
    const s = ch / mh; // match cap heights
    const gap = ch * 0.45;
    return (
      <svg viewBox={`0 0 ${mw * s + gap + cw} ${ch}`} className={className} role="img" aria-label="Malak Chiropractic">
        <g transform={`scale(${s})`}>
          <path d={WORDS.malak.d} fill={t.malak} />
        </g>
        <g transform={`translate(${mw * s + gap} 0)`}>
          <path d={WORDS.chiro.d} fill={t.chiro} />
        </g>
      </svg>
    );
  }
  // MALAK scaled to the width of CHIROPRACTIC's first half, stacked
  const s = (cw * 0.62) / mw;
  const gap = ch * 0.35;
  return (
    <svg viewBox={`0 0 ${cw} ${mh * s + gap + ch}`} className={className} role="img" aria-label="Malak Chiropractic">
      <g transform={`scale(${s})`}>
        <path d={WORDS.malak.d} fill={t.malak} />
      </g>
      <g transform={`translate(0 ${mh * s + gap})`}>
        <path d={WORDS.chiro.d} fill={t.chiro} />
      </g>
    </svg>
  );
}

export function Lockup({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  const t = tones[tone];
  const [, , w, h] = LOCKUP.viewBox;
  const f = LOCKUP.figure;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Malak Chiropractic">
      <path d={LOCKUP.malak} fill={t.malak} />
      <path d={LOCKUP.chiro} fill={t.chiro} />
      <image href="/brand/figure.webp" x={f.x} y={f.y} width={f.w} height={f.h} style={{ filter: t.figFilter }} opacity={t.figOpacity} />
    </svg>
  );
}

export function Figure({ tone = "light", className = "", alt = "" }: { tone?: Tone; className?: string; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/figure.webp"
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      style={{ filter: tone === "dark" ? "invert(1)" : undefined }}
      loading="lazy"
    />
  );
}
