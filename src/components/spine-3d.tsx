"use client";

/* ─────────────────────────────────────────────────────────────
   Rotatable schematic spine and pelvis (original illustration).
   A light 3D model projected to SVG: no WebGL, no libraries.

   Model axes:  x = left/right (patient's right is +x)
                y = down
                z = anterior (−) / posterior (+)
   View angle θ rotates the model around the vertical axis:
     θ = 0   → side view from the patient's left (anterior on screen-left)
     θ = 90  → view from behind
     θ = 180 → side view from the right
     θ = 270 → view from the front
   ───────────────────────────────────────────────────────────── */

export type RegionKey = "cervical" | "thoracic" | "lumbar" | "pelvis";
export type IliumMotion = "neutral" | "AS" | "PI";

type Seg = { start: number; count: number; body: number; disc: number; w: number; spine: number; amp: number; drop: number };
const SEG: Record<"cervical" | "thoracic" | "lumbar", Seg> = {
  cervical: { start: 40, count: 7, body: 11, disc: 4, w: 22, spine: 15, amp: -15, drop: 0.35 },
  thoracic: { start: 0, count: 12, body: 15, disc: 4.4, w: 28, spine: 21, amp: 28, drop: 1.0 },
  lumbar: { start: 0, count: 5, body: 22, disc: 6, w: 38, spine: 17, amp: -22, drop: 0.05 },
};
const len = (s: Seg) => s.count * (s.body + s.disc);
SEG.thoracic.start = SEG.cervical.start + len(SEG.cervical);
SEG.lumbar.start = SEG.thoracic.start + len(SEG.thoracic);
export const SACRUM_START = SEG.lumbar.start + len(SEG.lumbar);
export const SACRUM_END = SACRUM_START + 100;

/** Sagittal offset of the spinal column (z) at height y: the four natural curves. */
function zAt(y: number): number {
  for (const s of Object.values(SEG)) {
    const L = len(s);
    if (y >= s.start && y <= s.start + L) return s.amp * Math.sin((Math.PI * (y - s.start)) / L);
  }
  if (y > SACRUM_START) {
    const t = Math.min(1.2, (y - SACRUM_START) / (SACRUM_END - SACRUM_START));
    return 46 * Math.pow(t, 1.35);
  }
  return 0;
}
const tiltAt = (y: number) => Math.atan2(zAt(y + 1) - zAt(y - 1), 2); // sagittal tilt (radians)

type V3 = [number, number, number];

export const REGION_BOUNDS: Record<RegionKey, [number, number]> = {
  cervical: [SEG.cervical.start - 8, SEG.thoracic.start - 1],
  thoracic: [SEG.thoracic.start - 1, SEG.lumbar.start - 1],
  lumbar: [SEG.lumbar.start - 1, SACRUM_START],
  pelvis: [SACRUM_START, SACRUM_END + 70],
};

const CX = 200;

const tones = {
  sel: { body: "var(--color-burgundy)", stroke: "var(--color-burgundy-deep)", disc: "var(--color-sky-deep)", post: "#a5566e" },
  hov: { body: "#c9ced3", stroke: "var(--color-steel)", disc: "var(--color-sky)", post: "#d6dade" },
  off: { body: "#ffffff", stroke: "#9aa3aa", disc: "#e8f2f8", post: "#f1f3f4" },
};

/** Rotate a point about the x axis through a pivot (used for ilium AS/PI motion). */
function rotX(p: V3, pivot: V3, a: number): V3 {
  const dy = p[1] - pivot[1];
  const dz = p[2] - pivot[2];
  return [p[0], pivot[1] + dy * Math.cos(a) - dz * Math.sin(a), pivot[2] + dy * Math.sin(a) + dz * Math.cos(a)];
}

export function Spine3D({
  angle,
  selected,
  hover,
  motion,
  onPick,
  onHover,
  bare = false,
  highlight,
  children,
}: {
  bare?: boolean; // illustration mode: no labels or hit areas
  highlight?: RegionKey[];
  children?: React.ReactNode;
  angle: number; // degrees
  selected: RegionKey;
  hover: RegionKey | null;
  motion: IliumMotion;
  onPick: (k: RegionKey) => void;
  onHover: (k: RegionKey | null) => void;
}) {
  const th = (angle * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const P = ([x, y, z]: V3) => ({ x: CX + z * c + x * s, y, d: -z * s + x * c });
  const tone = (k: RegionKey) => tones[highlight ? (highlight.includes(k) ? "sel" : "off") : k === selected ? "sel" : k === hover ? "hov" : "off"];

  type Item = { d: number; el: React.ReactNode };
  const items: Item[] = [];

  /* Vertebrae */
  (Object.keys(SEG) as (keyof typeof SEG)[]).forEach((k) => {
    const sg = SEG[k];
    const t = tone(k);
    for (let i = 0; i < sg.count; i++) {
      const y = sg.start + i * (sg.body + sg.disc) + sg.body / 2;
      const z = zAt(y);
      const a = tiltAt(y);
      const w = sg.w + (i / sg.count) * 4;
      const Rz = w / 2;
      const Rx = w * 0.62;
      const bodyC: V3 = [0, y, z - 4];
      const canal: V3 = [0, y, z + Rz + 3];
      // local sagittal offset rotated by tilt
      const off = (dz: number, dy: number): V3 => [0, y + dy * Math.cos(a) + dz * Math.sin(a), z + dz * Math.cos(a) - dy * Math.sin(a)];
      const spineLen = k === "cervical" && i === 6 ? 23 : sg.spine;
      const tip = off(Rz + 8 + spineLen, sg.body * sg.drop);
      const tpL: V3 = [-(Rx + (k === "lumbar" ? 14 : 10)), y, z + Rz - 2];
      const tpR: V3 = [Rx + (k === "lumbar" ? 14 : 10), y, z + Rz - 2];

      const pb = P(bodyC);
      const hw = Math.sqrt((Rz * c) ** 2 + (Rx * s) ** 2);
      const screenTilt = ((a * c) * 180) / Math.PI;
      const pc = P(canal);
      const pt = P(tip);
      const pl = P(tpL);
      const pr = P(tpR);
      const stroke = (from: { x: number; y: number }, to: { x: number; y: number }, wdt: number, key: string) => (
        <g key={key}>
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={t.stroke} strokeWidth={wdt + 1.8} strokeLinecap="round" />
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={t.post} strokeWidth={wdt} strokeLinecap="round" />
        </g>
      );
      const pw = Math.max(3, sg.body * 0.42);
      items.push({ d: (pc.d + pt.d) / 2, el: stroke(pc, pt, pw, `${k}${i}sp`) });
      items.push({ d: (pc.d + pl.d) / 2, el: stroke(pc, pl, pw * 0.8, `${k}${i}tl`) });
      items.push({ d: (pc.d + pr.d) / 2, el: stroke(pc, pr, pw * 0.8, `${k}${i}tr`) });
      items.push({
        d: pb.d,
        el: (
          <rect
            key={`${k}${i}b`}
            x={pb.x - hw}
            y={pb.y - sg.body / 2}
            width={hw * 2}
            height={sg.body}
            rx={Math.min(5, sg.body / 3)}
            fill={t.body}
            stroke={t.stroke}
            strokeWidth="1"
            transform={`rotate(${-screenTilt.toFixed(2)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)})`}
            style={{ transition: "fill .4s, stroke .4s" }}
          />
        ),
      });
      // disc below (none between C1 and C2)
      if (i < sg.count - 1 && !(k === "cervical" && i === 0)) {
        const dy = y + sg.body / 2 + sg.disc / 2;
        const pd = P([0, dy, zAt(dy) - 4]);
        items.push({
          d: pd.d + 0.01,
          el: <rect key={`${k}${i}d`} x={pd.x - hw + 2} y={pd.y - sg.disc / 2 + 0.6} width={hw * 2 - 4} height={sg.disc - 1.2} rx="2" fill={t.disc} />,
        });
      }
      // ribs (thoracic)
      if (k === "thoracic") {
        for (const side of [-1, 1]) {
          const pts: string[] = [];
          const rr = 62 + Math.min(i, 6) * 4;
          const rx = 70 + Math.min(i, 7) * 6 - Math.max(0, i - 8) * 6;
          const zc = z + Rz - rr;
          let dsum = 0;
          for (let f = 0; f <= 10; f++) {
            const phi = (f / 10) * Math.PI * (i < 10 ? 0.92 : 0.55);
            const p = P([side * rx * Math.sin(phi), y + phi * 14, zc + rr * Math.cos(phi)]);
            dsum += p.d;
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
          }
          items.push({
            d: dsum / 11 - 40,
            el: (
              <polyline
                key={`${k}${i}r${side}`}
                points={pts.join(" ")}
                fill="none"
                stroke={(highlight ? highlight.includes("thoracic") : selected === "thoracic") ? "var(--color-sky-deep)" : "#dfe3e6"}
                strokeWidth="1.3"
                style={{ transition: "stroke .4s" }}
              />
            ),
          });
        }
      }
    }
  });

  /* Spinal cord */
  {
    const pts: string[] = [];
    for (let y = SEG.cervical.start; y < SACRUM_START + 10; y += 6) {
      const p = P([0, y, zAt(y) + 12]);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    items.push({ d: P([0, 300, 12]).d, el: <polyline key="cord" points={pts.join(" ")} fill="none" stroke="var(--color-butter)" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" /> });
  }

  /* Sacrum + coccyx */
  {
    const t = tone("pelvis");
    const L: string[] = [];
    const R: string[] = [];
    for (let f = 0; f <= 10; f++) {
      const y = SACRUM_START + ((SACRUM_END - SACRUM_START) * f) / 10;
      const z = zAt(y);
      const thick = 20 - 11 * (f / 10);
      const lat = 40 - 30 * (f / 10);
      const hw = Math.sqrt((thick * c) ** 2 + (lat * s) ** 2);
      const p = P([0, y, z]);
      L.push(`${(p.x - hw).toFixed(1)},${y.toFixed(1)}`);
      R.unshift(`${(p.x + hw).toFixed(1)},${y.toFixed(1)}`);
    }
    items.push({ d: P([0, SACRUM_START + 40, zAt(SACRUM_START + 40)]).d, el: <polygon key="sacrum" points={[...L, ...R].join(" ")} fill={t.body} stroke={t.stroke} strokeWidth="1" style={{ transition: "fill .4s" }} /> });
    [0, 1, 2].forEach((n) => {
      const y = SACRUM_END + 9 + n * 10;
      const p = P([0, y, zAt(y)]);
      items.push({ d: p.d, el: <ellipse key={`cx${n}`} cx={p.x} cy={y} rx={6 - n * 1.4} ry="4.2" fill={t.body} stroke={t.stroke} strokeWidth="0.9" /> });
    });
  }

  /* Pelvis: two ilia, pubis and femoral heads. The right ilium shows AS / PI motion. */
  {
    const S = SACRUM_START;
    const zs = zAt(S + 30);
    const sel = highlight ? highlight.includes("pelvis") : selected === "pelvis";
    const motionAngle = motion === "AS" ? -0.22 : motion === "PI" ? 0.22 : 0; // exaggerated for visibility
    for (const side of [-1, 1]) {
      const pivot: V3 = [side * 32, S + 30, zs + 4]; // sacroiliac joint
      const raw: V3[] = [
        [side * 34, S - 6, zs + 26], // PSIS
        [side * 78, S - 34, zs + 10],
        [side * 112, S - 30, zs - 26], // iliac crest
        [side * 104, S - 2, zs - 76], // ASIS
        [side * 92, S + 40, zs - 72],
        [side * 84, S + 84, zs - 58], // acetabulum region
        [side * 58, S + 132, zs - 14], // ischial tuberosity
        [side * 38, S + 78, zs + 14],
      ];
      const pts3 = side === 1 ? raw.map((p) => rotX(p, pivot, motionAngle)) : raw;
      const proj = pts3.map(P);
      const dAvg = proj.reduce((a, p) => a + p.d, 0) / proj.length;
      const moving = side === 1 && motion !== "neutral";
      items.push({
        d: dAvg - 60,
        el: (
          <polygon
            key={`ilium${side}`}
            points={proj.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
            fill={moving ? "color-mix(in srgb, var(--color-burgundy) 22%, white)" : sel ? "color-mix(in srgb, var(--color-sky) 75%, white)" : "#f2f4f5"}
            stroke={moving ? "var(--color-burgundy)" : sel ? "var(--color-sky-deep)" : "#d5dadd"}
            strokeWidth="1.3"
            strokeLinejoin="round"
            style={{ transition: "fill .4s, stroke .4s" }}
          />
        ),
      });
      // landmarks: PSIS and ASIS dots on the moving side
      if (moving) {
        const psis = P(pts3[0]);
        const asis = P(pts3[3]);
        items.push({ d: 999, el: <circle key="psis" cx={psis.x} cy={psis.y} r="3.4" fill="var(--color-burgundy)" /> });
        items.push({ d: 999, el: <circle key="asis" cx={asis.x} cy={asis.y} r="3.4" fill="var(--color-burgundy)" /> });
      }
      // femoral head
      const fh = P(rotX([side * 84, S + 84, zs - 58], pivot, side === 1 ? motionAngle : 0));
      items.push({ d: fh.d - 50, el: <circle key={`fh${side}`} cx={fh.x} cy={fh.y + 6} r="13" fill="#fff" stroke={sel ? "var(--color-steel)" : "#d3d8dc"} strokeWidth="1.2" /> });
    }
    // pubic symphysis link
    const pl = P([-14, S + 112, zs - 96]);
    const pr = P([14, S + 112, zs - 96]);
    items.push({ d: pl.d - 60, el: <line key="pubis" x1={pl.x} y1={pl.y} x2={pr.x} y2={pr.y} stroke={sel ? "var(--color-sky-deep)" : "#d5dadd"} strokeWidth="6" strokeLinecap="round" /> });
  }

  items.sort((a, b) => a.d - b.d);

  const label = (k: RegionKey) => ({ cervical: "Cervical", thoracic: "Thoracic", lumbar: "Lumbar", pelvis: "Sacrum & pelvis" })[k];

  return (
    <svg viewBox="0 0 460 800" className="h-full w-full touch-none select-none" aria-hidden focusable="false">
      {items.map((it) => it.el)}
      {children}
      {!bare && (<>

      {(Object.keys(REGION_BOUNDS) as RegionKey[]).map((k) => {
        const [a, b] = REGION_BOUNDS[k];
        const mid = (a + b) / 2;
        const active = k === selected;
        return (
          <g key={`lbl-${k}`}>
            <line x1={346} y1={mid} x2={356} y2={mid} stroke={active ? "var(--color-burgundy)" : "#c9ced3"} strokeWidth="1" />
            <circle cx={346} cy={mid} r="3" fill={active ? "var(--color-burgundy)" : "#c9ced3"} />
            <text x={362} y={mid + 4} fontSize="12.5" fontWeight={active ? 700 : 500} fill={active ? "var(--color-ink)" : "var(--color-steel-deep)"} fontFamily="var(--font-sans)">
              {label(k)}
            </text>
          </g>
        );
      })}

      {(Object.keys(REGION_BOUNDS) as RegionKey[]).map((k) => {
        const [a, b] = REGION_BOUNDS[k];
        return (
          <rect
            key={`hit-${k}`}
            x="20"
            y={a}
            width="440"
            height={b - a}
            fill="transparent"
            className="cursor-pointer"
            onClick={() => onPick(k)}
            onPointerEnter={() => onHover(k)}
            onPointerLeave={() => onHover(null)}
          />
        );
      })}
      </>)}
    </svg>
  );
}

export function viewName(angle: number) {
  const a = ((angle % 360) + 360) % 360;
  if (a < 23 || a >= 338) return "Side view (from the left)";
  if (a < 68) return "Back-left view";
  if (a < 113) return "Back view";
  if (a < 158) return "Back-right view";
  if (a < 203) return "Side view (from the right)";
  if (a < 248) return "Front-right view";
  if (a < 293) return "Front view";
  return "Front-left view";
}
