/**
 * Renders the article and condition illustrations from the same 3D spine model
 * used on the site, plus matching bone drawings. Run: npx tsx scripts/render-illustrations.tsx
 */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Spine3D, type RegionKey } from "../src/components/spine-3d";

const C = { ink: "#17191c", burg: "#762d43", burgD: "#5e2235", sky: "#dcecf5", skyD: "#b9d8ea", butter: "#f5e7a8", steel: "#66717a", steelD: "#525c64", line: "#9aa3aa", paper: "#f8f9fa", grey: "#e7eaec" };
const VARS: Record<string, string> = {
  "--color-burgundy": C.burg, "--color-burgundy-deep": C.burgD, "--color-sky": C.sky, "--color-sky-deep": C.skyD,
  "--color-butter": C.butter, "--color-steel": C.steel, "--color-steel-deep": C.steelD, "--color-ink": C.ink,
};
function mix(hex: string, pct: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (pct / 100) + 255 * (1 - pct / 100)));
  return "#" + ch.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function resolve(svg: string) {
  let s = svg.replace(/var\((--[\w-]+)\)/g, (_, v) => VARS[v] ?? C.ink);
  s = s.replace(/color-mix\(in srgb, (#[0-9a-f]{6}) (\d+)%, white\)/g, (_, h, p) => mix(h, Number(p)));
  s = s.replace(/ class="[^"]*"/g, "").replace(/ style="[^"]*transition[^"]*"/g, "");
  return s;
}

const W = 1200, H = 900;
function frame(bg: string, inner: string, circle?: [number, number, number, string, number]) {
  let grid = "";
  for (let x = 0; x <= W; x += 60) grid += `<path d="M${x} 0V${H}" stroke="${C.ink}" stroke-opacity=".05"/>`;
  for (let y = 0; y <= H; y += 60) grid += `<path d="M0 ${y}H${W}" stroke="${C.ink}" stroke-opacity=".05"/>`;
  const c = circle ? `<circle cx="${circle[0]}" cy="${circle[1]}" r="${circle[2]}" fill="${circle[3]}" fill-opacity="${circle[4]}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${grid}${c}${inner}</svg>`;
}

/** Spine model cropped to a box (in model coordinates 460×800), centred in the frame. */
function spine(opts: { angle: number; highlight: RegionKey[]; crop: [number, number, number, number]; bg: string; extra?: React.ReactNode; circle?: [number, number, number, string, number] }) {
  const markup = renderToStaticMarkup(
    <Spine3D bare angle={opts.angle} highlight={opts.highlight} selected="lumbar" hover={null} motion="neutral" onPick={() => {}} onHover={() => {}}>
      {opts.extra}
    </Spine3D>
  );
  const [cx, cy, cw, ch] = opts.crop;
  const inner = markup
    .replace(/^<svg[^>]*>/, `<svg x="60" y="45" width="1080" height="810" viewBox="${cx} ${cy} ${cw} ${ch}" preserveAspectRatio="xMidYMid meet">`);
  return resolve(frame(opts.bg, inner, opts.circle));
}

/* Bone drawings in the same visual language: white fill, steel outline, sky cartilage, burgundy focus. */
const bone = (d: string, w: number) => `<path d="${d}" stroke="${C.line}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="#ffffff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

function elbow() {
  const inner =
    bone("M150 260 L560 430", 70) + // humerus
    `<ellipse cx="585" cy="440" rx="62" ry="50" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + // distal humerus
    bone("M610 470 L860 760", 44) + // radius
    bone("M560 480 L800 790", 40) + // ulna
    `<path d="M592 452 C 660 520 760 620 860 740" stroke="${C.burg}" stroke-opacity=".22" stroke-width="46" stroke-linecap="round" fill="none"/>` + // extensor origin & tendon
    `<circle cx="612" cy="430" r="18" fill="${C.burg}"/><circle cx="612" cy="430" r="40" fill="none" stroke="${C.burg}" stroke-width="3"/><circle cx="612" cy="430" r="66" fill="none" stroke="${C.burg}" stroke-width="2" stroke-dasharray="4 10"/>` +
    `<path d="M548 470 C 560 490 590 500 615 492" stroke="${C.skyD}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  return frame(C.butter, inner, [880, 300, 170, "#ffffff", 0.55]);
}
function knee(withStairs = false) {
  let s = "";
  if (withStairs) {
    let d = "M120 840 ";
    for (let i = 0; i < 6; i++) d += `H${120 + i * 170} V${840 - (i + 1) * 110} `;
    s += `<path d="${d}" stroke="${C.line}" stroke-width="3" fill="none" stroke-opacity=".7"/>`;
  }
  s +=
    bone("M600 60 L600 330", 96) +
    `<path d="M520 340 C 500 420 540 450 590 440 L610 440 C 660 450 700 420 680 340 Z" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + // condyles
    `<path d="M505 470 C 560 455 640 455 695 470" stroke="${C.skyD}" stroke-width="14" fill="none" stroke-linecap="round"/>` + // cartilage / joint space
    `<path d="M510 480 L690 480 C 690 520 660 540 640 545 L560 545 C 540 540 510 520 510 480 Z" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + // tibial plateau
    bone("M600 545 L600 860", 82) +
    bone("M705 520 L700 860", 22) + // fibula
    `<ellipse cx="600" cy="360" rx="44" ry="54" fill="#fff" stroke="${C.line}" stroke-width="3" opacity=".9"/>` + // patella
    [0, 1, 2, 3].map((i) => `<circle cx="${530 + i * 46}" cy="468" r="7" fill="${C.burg}"/>`).join("");
  return frame(withStairs ? C.butter : C.sky, s, [600, 470, 230, "#ffffff", 0.55]);
}
function shoulder() {
  const s =
    `<path d="M420 300 L760 260 L700 700 Z" fill="#fff" stroke="${C.line}" stroke-width="3" stroke-linejoin="round"/>` + // scapula
    bone("M330 230 L760 250", 34) + // clavicle
    `<path d="M740 250 C 800 240 850 260 860 300" stroke="${C.line}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M740 250 C 800 240 850 260 860 300" stroke="#fff" stroke-width="25" fill="none" stroke-linecap="round"/>` + // acromion
    `<circle cx="830" cy="370" r="74" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + // humeral head
    bone("M860 430 L940 820", 64) +
    `<path d="M760 320 C 800 300 860 300 890 320" stroke="${C.burg}" stroke-width="12" stroke-opacity=".75" fill="none" stroke-linecap="round"/>` + // rotator cuff
    `<path d="M770 330 A 80 80 0 0 1 900 360" stroke="${C.burg}" stroke-width="2" stroke-dasharray="4 10" fill="none"/>`;
  return frame(C.grey, s, [830, 370, 200, C.burg, 0.08]);
}

const nerve = (
  <g>
    <path d="M214 470 C 236 540 248 610 254 690 L262 800" stroke="#f5e7a8" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M214 470 C 236 540 248 610 254 690 L262 800" stroke="#762d43" strokeWidth="2.5" fill="none" strokeDasharray="7 7" strokeLinecap="round" />
  </g>
);
const headache = (
  <g stroke="#762d43" strokeWidth="2" fill="none" strokeLinecap="round">
    <circle cx="214" cy="30" r="5" fill="#762d43" stroke="none" />
    <path d="M232 14 l16 -12" /><path d="M238 30 h20" /><path d="M232 46 l16 12" />
  </g>
);

const CROP = {
  cervical: [60, -10, 280, 210] as [number, number, number, number],
  thoracic: [20, 120, 360, 270] as [number, number, number, number],
  lumbar: [50, 330, 300, 225] as [number, number, number, number],
  pelvis: [25, 470, 360, 270] as [number, number, number, number],
  lowerBody: [-40, 380, 480, 360] as [number, number, number, number],
  whole: [-240, 10, 940, 705] as [number, number, number, number],
  upper: [-20, -10, 440, 330] as [number, number, number, number],
};

const out = (dir: string, name: string, svg: string) => {
  const p = path.join("public/images", dir, `${name}.svg`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, svg);
};

// Articles (anatomical ones re-drawn; concept diagrams kept)
out("articles", "neck-pain-and-headaches", spine({ angle: 20, highlight: ["cervical"], crop: CROP.cervical, bg: C.grey, extra: headache, circle: [600, 300, 230, C.burg, 0.08] }));
out("articles", "neck-stiffness-with-age", spine({ angle: 320, highlight: ["cervical"], crop: CROP.cervical, bg: C.sky, circle: [600, 450, 260, "#ffffff", 0.5] }));
out("articles", "lower-back-pain-causes", spine({ angle: 25, highlight: ["lumbar"], crop: CROP.lumbar, bg: C.sky, circle: [600, 450, 260, "#ffffff", 0.5] }));
out("articles", "tennis-elbow", elbow());
out("articles", "arthritis-and-chiropractic-care", knee());
out("articles", "stairs-difficulty", knee(true));

// Conditions
out("conditions", "neck-pain", spine({ angle: 0, highlight: ["cervical"], crop: CROP.cervical, bg: C.sky, circle: [600, 450, 260, "#ffffff", 0.5] }));
out("conditions", "headaches", spine({ angle: 20, highlight: ["cervical"], crop: CROP.cervical, bg: C.grey, extra: headache, circle: [600, 300, 230, C.burg, 0.08] }));
out("conditions", "mid-back-pain", spine({ angle: 30, highlight: ["thoracic"], crop: CROP.thoracic, bg: C.sky, circle: [600, 450, 280, "#ffffff", 0.5] }));
out("conditions", "lower-back-pain", spine({ angle: 25, highlight: ["lumbar"], crop: CROP.lumbar, bg: C.sky, circle: [600, 450, 260, "#ffffff", 0.5] }));
out("conditions", "sciatica", spine({ angle: 0, highlight: ["lumbar"], crop: CROP.lowerBody, bg: C.butter, extra: nerve, circle: [600, 450, 280, "#ffffff", 0.5] }));
out("conditions", "hip-pain", spine({ angle: 270, highlight: ["pelvis"], crop: [20, 430, 360, 270], bg: C.butter, circle: [600, 450, 280, "#ffffff", 0.5] }));
out("conditions", "persistent-pain", spine({ angle: 45, highlight: [], crop: CROP.whole, bg: C.grey, circle: [600, 450, 300, C.butter, 0.6] }));
out("conditions", "work-related-discomfort", spine({ angle: 10, highlight: ["cervical", "thoracic"], crop: CROP.upper, bg: C.sky, circle: [600, 450, 280, "#ffffff", 0.5] }));
out("conditions", "shoulder-pain", shoulder());
out("conditions", "knee-pain", knee());
out("conditions", "tennis-elbow", elbow());
console.log("illustrations rendered");
