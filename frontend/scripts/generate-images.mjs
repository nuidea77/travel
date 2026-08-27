/**
 * Generates the site's flat-illustration SVG scenery (v2).
 * Layered skies, clouds, atmospheric haze, snow caps, sun glow, rolling
 * ground, grass and a soft vignette — deterministic via a seeded RNG.
 * Run: node scripts/generate-images.mjs  (writes to public/images)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 800;

// mulberry32 — stable output between runs
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let R = rng(1);
const rand = (min, max) => min + R() * (max - min);
let uid = 0;
const id = (p) => `${p}${++uid}`;

/* ---------------------------------------------------------------- palettes */
const PALETTES = {
  day: {
    sky: [[0, "#2f88bd"], [0.5, "#8fcbe2"], [1, "#eef8f2"]],
    sun: "#fff6cf", glow: "#fff3b8",
    layers: ["#a9cbc4", "#6ea99b", "#417e6e"],
    ground: ["#4f916d", "#31694c"], accent: "#1e4a37",
    cloud: "#ffffff", snow: "#ffffff",
  },
  steppe: {
    sky: [[0, "#4fb0d8"], [0.55, "#a5dbeb"], [1, "#f4f8dd"]],
    sun: "#fff8d6", glow: "#fff3b8",
    layers: ["#96c1a3", "#639e7b", "#40805d"],
    ground: ["#569569", "#3a734e"], accent: "#24523a",
    cloud: "#ffffff", snow: null,
  },
  gobi: {
    sky: [[0, "#f4a259"], [0.55, "#f9d29d"], [1, "#fdf0d5"]],
    sun: "#ff8f5e", glow: "#ffb37e",
    layers: ["#eab381", "#d18f52", "#aa6832"],
    ground: ["#cb8d48", "#9d642a"], accent: "#6e3f16",
    cloud: "#fde8c8", snow: null,
  },
  dawn: {
    sky: [[0, "#22376b"], [0.45, "#8a5a8f"], [0.8, "#ef9563"], [1, "#ffc98a"]],
    sun: "#ffd166", glow: "#ffab66",
    layers: ["#5d5789", "#453e6e", "#2f2a52"],
    ground: ["#292450", "#1c1938"], accent: "#131028",
    cloud: "#c88ba0", snow: "#e8d9ef",
  },
  dusk: {
    sky: [[0, "#27365f"], [0.5, "#7d4a6f"], [0.85, "#e9836e"], [1, "#f7b57e"]],
    sun: "#ffc37b", glow: "#ff9d6b",
    layers: ["#5a4a78", "#413459", "#2c2342"],
    ground: ["#251d3a", "#181228"], accent: "#0f0b1d",
    cloud: "#b97f92", snow: null,
  },
  winter: {
    sky: [[0, "#7aa6cf"], [0.55, "#b9d3e8"], [1, "#f0f6fb"]],
    sun: "#ffffff", glow: "#e8f1fa",
    layers: ["#c6d8ea", "#9cb8d3", "#7090b6"],
    ground: ["#e9f0f7", "#c9daea"], accent: "#47658c",
    cloud: "#ffffff", snow: "#ffffff",
  },
  lake: {
    sky: [[0, "#3fa2c6"], [0.55, "#8fd0dd"], [1, "#e6f5ee"]],
    sun: "#fff3c4", glow: "#ffedac",
    layers: ["#7cb0a5", "#4e938a", "#2e7168"],
    ground: ["#35857a", "#235f57"], accent: "#16444a",
    cloud: "#ffffff", snow: "#ffffff",
    water: ["#66c2d6", "#2f7f96"],
  },
  night: {
    sky: [[0, "#040a22"], [0.55, "#101e45"], [1, "#2c4470"]],
    sun: "#f5f0e6", glow: "#c9d3ef",
    layers: ["#1c2b52", "#141f41", "#0c1530"],
    ground: ["#0a1128", "#060b1c"], accent: "#03071a",
    cloud: "#26355c", snow: null,
  },
};

/* ------------------------------------------------------------ environment */
function sky(p) {
  const g = id("sky");
  const stops = p.sky
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("");
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#${g})"/>`;
}

function sunGlow(p, cx, cy, r, { moon = false } = {}) {
  const g = id("glow");
  let s = `<defs><radialGradient id="${g}" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${p.glow}" stop-opacity="0.55"/>
    <stop offset="0.55" stop-color="${p.glow}" stop-opacity="0.2"/>
    <stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
  </radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r * 3.1}" fill="url(#${g})"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 1.35}" fill="${p.sun}" opacity="0.35"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.sun}"/>`;
  if (moon) {
    s += `<circle cx="${cx + r * 0.38}" cy="${cy - r * 0.18}" r="${r * 0.16}" fill="#d9d2c2" opacity="0.5"/>
    <circle cx="${cx - r * 0.22}" cy="${cy + r * 0.22}" r="${r * 0.1}" fill="#d9d2c2" opacity="0.45"/>
    <circle cx="${cx - r * 0.05}" cy="${cy - r * 0.32}" r="${r * 0.07}" fill="#d9d2c2" opacity="0.4"/>`;
  }
  return s;
}

function cloud(x, y, s, color, op) {
  return `<g fill="${color}" opacity="${op}">
    <ellipse cx="${x}" cy="${y}" rx="${72 * s}" ry="${20 * s}"/>
    <ellipse cx="${x - 48 * s}" cy="${y + 7 * s}" rx="${44 * s}" ry="${15 * s}"/>
    <ellipse cx="${x + 52 * s}" cy="${y + 5 * s}" rx="${50 * s}" ry="${17 * s}"/>
    <ellipse cx="${x + 6 * s}" cy="${y - 13 * s}" rx="${40 * s}" ry="${16 * s}"/>
  </g>`;
}

function clouds(p, n, yMin = 60, yMax = 260, op = 0.75) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += cloud(rand(60, W - 60), rand(yMin, yMax), rand(0.55, 1.25), p.cloud, op * rand(0.6, 1));
  }
  return s;
}

/**
 * Mountain ridge. sharp=true gives alpine peaks (line segments), otherwise
 * rolling hills (quadratic curves). Optionally paints snow caps on apexes.
 */
function ridge(baseY, amp, peaks, color, { op = 1, sharp = false, snow = null, snowMin = 0.55 } = {}) {
  const seg = W / peaks;
  const pts = [[0, baseY - amp * rand(0.1, 0.4)]];
  for (let i = 1; i <= peaks; i++) {
    const up = i % 2 === 1;
    const h = up ? amp * rand(0.62, 1) : amp * rand(0.05, 0.3);
    pts.push([i * seg + rand(-seg * 0.18, seg * 0.18), baseY - h]);
  }
  pts[pts.length - 1][0] = W;

  let d = `M0 ${H} L0 ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (sharp) {
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      const [px, py] = pts[i - 1];
      d += ` Q ${((px + x) / 2).toFixed(1)} ${(Math.min(py, y) - amp * 0.16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  d += ` L ${W} ${H} Z`;
  let s = `<path d="${d}" fill="${color}" opacity="${op}"/>`;

  if (snow) {
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i];
      if (baseY - y > amp * snowMin) {
        const w = rand(20, 34);
        const dth = rand(16, 24);
        s += `<path d="M ${(x - w).toFixed(1)} ${(y + dth).toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)} L ${(x + w).toFixed(1)} ${(y + dth).toFixed(1)} Q ${(x + w * 0.4).toFixed(1)} ${(y + dth * 0.6).toFixed(1)} ${x.toFixed(1)} ${(y + dth * 0.9).toFixed(1)} Q ${(x - w * 0.4).toFixed(1)} ${(y + dth * 0.62).toFixed(1)} ${(x - w).toFixed(1)} ${(y + dth).toFixed(1)} Z" fill="${snow}" opacity="0.92"/>`;
      }
    }
  }
  return s;
}

function dunes(baseY, amp, waves, color, op = 1) {
  const seg = W / waves;
  let d = `M0 ${H} L0 ${baseY}`;
  for (let i = 0; i < waves; i++) {
    const x0 = i * seg;
    d += ` C ${x0 + seg * 0.3} ${baseY - amp} ${x0 + seg * 0.72} ${baseY + amp * 0.35} ${x0 + seg} ${baseY - (i % 2 ? amp * 0.24 : 0)}`;
  }
  d += ` L ${W} ${H} Z`;
  let s = `<path d="${d}" fill="${color}" opacity="${op}"/>`;
  // crest highlight lines
  for (let i = 0; i < waves; i++) {
    const cx = i * seg + seg * 0.34;
    s += `<path d="M ${cx - seg * 0.16} ${baseY - amp * 0.72} Q ${cx} ${baseY - amp * 1.02} ${cx + seg * 0.2} ${baseY - amp * 0.6}" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.14"/>`;
  }
  return s;
}

function ground(y, [c1, c2]) {
  const g = id("gnd");
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect x="0" y="${y}" width="${W}" height="${H - y}" fill="url(#${g})"/>
  <path d="M0 ${y + 26} Q ${W * 0.28} ${y + 4} ${W * 0.55} ${y + 22} T ${W} ${y + 14} L ${W} ${y + 60} L 0 ${y + 60} Z" fill="${c2}" opacity="0.45"/>`;
}

function grass(color, n = 26, yMin = H - 130, yMax = H - 16) {
  let s = `<g stroke="${color}" stroke-width="3" stroke-linecap="round" opacity="0.5" fill="none">`;
  for (let i = 0; i < n; i++) {
    const x = rand(20, W - 20);
    const y = rand(yMin, yMax);
    const h = rand(10, 22);
    s += `<path d="M${x} ${y} q -3 ${-h * 0.7} -7 ${-h}"/><path d="M${x} ${y} q 1 ${-h} 1 ${-h - 3}"/><path d="M${x} ${y} q 4 ${-h * 0.7} 8 ${-h}"/>`;
  }
  return s + "</g>";
}

function water(yTop, [c1, c2], sunX = null) {
  const g = id("wtr");
  let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect x="0" y="${yTop}" width="${W}" height="${H - yTop}" fill="url(#${g})"/>
  <ellipse cx="${W / 2}" cy="${yTop + 3}" rx="${W * 0.55}" ry="7" fill="#ffffff" opacity="0.35"/>`;
  for (let i = 0; i < 12; i++) {
    const y = yTop + 26 + i * ((H - yTop - 40) / 12) * rand(0.7, 1.2);
    const x = rand(40, W - 260);
    s += `<rect x="${x}" y="${y}" width="${rand(60, 220)}" height="2.6" rx="1.3" fill="#ffffff" opacity="${rand(0.08, 0.2)}"/>`;
  }
  if (sunX !== null) {
    s += `<path d="M ${sunX - 46} ${yTop + 6} L ${sunX + 46} ${yTop + 6} L ${sunX + 110} ${H} L ${sunX - 110} ${H} Z" fill="#ffffff" opacity="0.12"/>`;
  }
  return s;
}

function stars(n = 90) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand(0, W);
    const y = rand(0, H * 0.6);
    const r = rand(0.6, 2);
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${rand(0.3, 0.95).toFixed(2)}"/>`;
    if (r > 1.7) {
      s += `<path d="M ${x - 6} ${y} H ${x + 6} M ${x} ${y - 6} V ${y + 6}" stroke="#fff" stroke-width="0.8" opacity="0.35"/>`;
    }
  }
  return s;
}

function birds(color, n = 4, cy = 170) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = rand(100, W - 200);
    const y = cy + rand(0, 130);
    const w = rand(12, 24);
    s += `<path d="M${x} ${y} q ${w / 2} ${-w / 2} ${w} 0 q ${w / 2} ${-w / 2} ${w} 0" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  }
  return s;
}

function vignette() {
  const g = id("vig");
  return `<defs><radialGradient id="${g}" cx="0.5" cy="0.46" r="0.75">
    <stop offset="0.62" stop-color="#0a1a18" stop-opacity="0"/>
    <stop offset="1" stop-color="#0a1a18" stop-opacity="0.2"/>
  </radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#${g})"/>`;
}

function grain() {
  const f = id("nz");
  return `<filter id="${f}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="${W}" height="${H}" filter="url(#${f})" opacity="0.05"/>`;
}

/* ------------------------------------------------------------- silhouettes */
const SIL = {
  ger: `<path d="M-70 0 L-58 -34 Q0 -62 58 -34 L70 0 Z" />
        <rect x="-10" y="-26" width="20" height="26"/>
        <path d="M-14 -50 L0 -66 L14 -50 Z"/>`,
  horse: `<path d="M-52 0 L-52 -26 Q-50 -40 -34 -42 L10 -42 Q26 -42 34 -56 L40 -70 L48 -68 L44 -52 Q42 -40 30 -34 L30 -26 L36 0 L28 0 L22 -22 L-8 -22 L-14 0 L-24 0 L-28 -22 L-44 -22 L-44 0 Z"/>`,
  rider: `<path d="M-52 0 L-52 -26 Q-50 -40 -34 -42 L10 -42 Q26 -42 34 -56 L40 -70 L48 -68 L44 -52 Q42 -40 30 -34 L30 -26 L36 0 L28 0 L22 -22 L-8 -22 L-14 0 L-24 0 L-28 -22 L-44 -22 L-44 0 Z"/>
        <circle cx="-8" cy="-66" r="9"/><path d="M-16 -56 Q-8 -62 0 -56 L2 -42 L-18 -42 Z"/>`,
  camel: `<path d="M-56 0 L-56 -24 Q-56 -36 -44 -38 Q-36 -52 -26 -40 Q-16 -54 -6 -40 L20 -40 Q30 -40 36 -52 L40 -64 L48 -62 L46 -50 Q44 -38 32 -32 L34 0 L26 0 L22 -20 L-10 -20 L-14 0 L-24 0 L-28 -20 L-48 -20 L-48 0 Z"/>`,
  pine: `<path d="M-16 -10 L0 -48 L16 -10 Z M-12 -32 L0 -64 L12 -32 Z M-8 -52 L0 -76 L8 -52 Z"/><rect x="-3" y="-14" width="6" height="14"/>`,
  stupa: `<rect x="-34" y="-14" width="68" height="14"/><rect x="-24" y="-30" width="48" height="16"/>
          <path d="M-18 -30 Q-18 -58 0 -58 Q18 -58 18 -30 Z"/><rect x="-4" y="-74" width="8" height="16"/>
          <path d="M-8 -74 L0 -86 L8 -74 Z"/>`,
  monastery: `<rect x="-60" y="-30" width="120" height="30"/>
          <path d="M-70 -30 L-60 -44 L60 -44 L70 -30 Z"/>
          <rect x="-38" y="-58" width="76" height="14"/>
          <path d="M-46 -58 L-38 -70 L38 -70 L46 -58 Z"/>
          <rect x="-4" y="-84" width="8" height="14"/>`,
  eagle: `<path d="M0 0 Q-14 -8 -44 -4 Q-20 -14 -10 -12 Q-30 -30 -54 -34 Q-22 -34 -6 -18 Q-2 -22 0 -22 Q2 -22 6 -18 Q22 -34 54 -34 Q30 -30 10 -12 Q20 -14 44 -4 Q14 -8 0 0 Z"/>`,
  flag: `<rect x="-2" y="-90" width="4" height="90"/><path d="M2 -88 L40 -80 L2 -66 Z"/>`,
  moto: `<circle cx="-30" cy="-12" r="14" fill="none" stroke-width="7"/><circle cx="30" cy="-12" r="14" fill="none" stroke-width="7"/>
         <path d="M-30 -12 L-12 -34 L14 -34 L30 -12 M-12 -34 L-20 -48 L-8 -48 M14 -34 L22 -44 L30 -44" stroke-width="7" fill="none" stroke-linecap="round"/>
         <circle cx="0" cy="-56" r="8"/><path d="M-8 -48 Q0 -54 8 -48 L10 -34 L-10 -34 Z"/>`,
  archer: `<circle cx="0" cy="-66" r="9"/><path d="M-10 -56 Q0 -62 10 -56 L12 -30 L8 0 L2 0 L0 -24 L-2 0 L-8 0 L-12 -30 Z"/>
         <path d="M10 -52 L34 -46 M-34 -70 Q-44 -50 -34 -30" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  ovoo: `<path d="M-40 0 L-20 -44 L0 -58 L20 -44 L40 0 Z"/><rect x="-2" y="-78" width="4" height="22"/>
         <path d="M2 -76 L20 -72 L2 -64 Z M-2 -70 L-18 -66 L-2 -60 Z"/>`,
  yak: `<path d="M-46 0 L-46 -30 Q-46 -42 -32 -42 L18 -42 Q30 -42 34 -52 L44 -56 L46 -48 L38 -44 L38 -6 Q30 2 24 -4 L20 -18 L-14 -18 Q-24 4 -34 -4 Z"/>
        <path d="M40 -58 Q48 -64 50 -56" fill="none" stroke-width="4"/>`,
  fisher: `<circle cx="0" cy="-58" r="8"/><path d="M-8 -50 Q0 -55 8 -50 L10 -26 L6 0 L-6 0 L-10 -26 Z"/>
        <path d="M8 -46 L44 -70 L46 -30" stroke-width="4" fill="none"/>`,
  hiker: `<circle cx="0" cy="-62" r="8"/><path d="M-8 -54 Q0 -59 8 -54 L12 -30 L6 -28 L14 0 L6 0 L-2 -22 L-8 0 L-16 0 L-10 -30 Z"/>
        <rect x="-14" y="-52" width="10" height="20" rx="3"/><path d="M16 -44 L20 0" stroke-width="4" fill="none"/>`,
  train: `<rect x="-70" y="-36" width="140" height="26" rx="6"/><rect x="-58" y="-30" width="18" height="10" fill-opacity="0.4"/>
        <rect x="-30" y="-30" width="18" height="10" fill-opacity="0.4"/><rect x="-2" y="-30" width="18" height="10" fill-opacity="0.4"/>
        <rect x="26" y="-30" width="18" height="10" fill-opacity="0.4"/><circle cx="-46" cy="-6" r="8"/><circle cx="-14" cy="-6" r="8"/><circle cx="18" cy="-6" r="8"/><circle cx="46" cy="-6" r="8"/>`,
  skyline: `<rect x="-90" y="-46" width="24" height="46"/><rect x="-60" y="-70" width="28" height="70"/>
        <rect x="-26" y="-54" width="22" height="54"/><rect x="0" y="-84" width="30" height="84"/>
        <rect x="36" y="-60" width="24" height="60"/><rect x="66" y="-40" width="24" height="40"/>
        <rect x="6" y="-92" width="8" height="8"/>`,
  wrestler: `<circle cx="-16" cy="-58" r="9"/><path d="M-26 -48 Q-16 -54 -6 -48 L-2 -30 L-6 0 L-14 0 L-16 -20 L-20 0 L-28 0 L-30 -30 Z"/>
        <circle cx="16" cy="-58" r="9"/><path d="M6 -48 Q16 -54 26 -48 L30 -30 L28 0 L20 0 L16 -20 L14 0 L6 0 L2 -30 Z"/>
        <path d="M-6 -46 L6 -46" stroke-width="6"/>`,
};

function place(name, x, y, scale = 1, color = "#000", flip = false, opacity = 1) {
  const inner = SIL[name] || "";
  return `<g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" fill="${color}" stroke="${color}" stroke-width="0" opacity="${opacity}">${inner}</g>`;
}

// warm window glow inside a ger at night/dusk
function gerLit(x, y, scale, color, glow = "#ffcf7a") {
  return place("ger", x, y, scale, color) +
    `<rect x="${x - 7 * scale}" y="${y - 22 * scale}" width="${14 * scale}" height="${18 * scale}" rx="${3 * scale}" fill="${glow}" opacity="0.9"/>`;
}

function smoke(x, y, color = "#ffffff") {
  return `<path d="M ${x} ${y} q 8 -14 2 -26 q -7 -13 1 -26 q 8 -12 4 -22" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.35"/>`;
}

function frame(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
}

/* ------------------------------------------------------------------ scenes */
const scenes = {
  "hero-steppe": (p = PALETTES.day) =>
    sky(p) + sunGlow(p, 930, 190, 66) + clouds(p, 4, 70, 220, 0.85) + birds(p.accent, 5) +
    ridge(430, 180, 6, p.layers[0], { op: 0.75, snow: p.snow, snowMin: 0.7 }) +
    ridge(505, 130, 5, p.layers[1], { op: 0.9 }) +
    ground(600, p.ground) +
    place("ger", 250, 705, 1.55, p.accent) + place("ger", 415, 692, 1.05, p.accent) +
    smoke(258, 608) +
    place("rider", 830, 708, 1.15, p.accent) + place("horse", 960, 700, 0.95, p.accent, true) +
    grass(p.accent) + vignette() + grain(),

  "gobi-dunes": (p = PALETTES.gobi) =>
    sky(p) + sunGlow(p, 310, 225, 92) + clouds(p, 2, 70, 170, 0.5) +
    dunes(440, 95, 3, p.layers[0], 0.85) +
    dunes(535, 115, 2, p.layers[1], 0.95) +
    dunes(645, 95, 2, p.layers[2]) +
    ground(730, p.ground) +
    place("camel", 755, 700, 1.3, p.accent) + place("camel", 885, 712, 1.05, p.accent) +
    place("rider", 615, 688, 0.92, p.accent, true) +
    vignette() + grain(),

  "lake-khuvsgul": (p = PALETTES.lake) =>
    sky(p) + sunGlow(p, 880, 195, 72) + clouds(p, 3, 60, 200, 0.8) + birds(p.accent, 4, 140) +
    ridge(392, 190, 6, p.layers[0], { op: 0.8, sharp: true, snow: p.snow, snowMin: 0.6 }) +
    ridge(462, 140, 5, p.layers[1], { op: 0.9 }) +
    water(545, p.water, 880) +
    `<path d="M0 660 Q 300 638 600 658 T 1200 656 L 1200 800 L 0 800 Z" fill="${p.ground[1]}"/>` +
    place("pine", 118, 668, 1.3, p.accent) + place("pine", 185, 676, 1.0, p.accent) +
    place("pine", 1085, 664, 1.35, p.accent) + place("pine", 1020, 674, 0.9, p.accent) +
    place("fisher", 330, 710, 1.15, p.accent) +
    grass(p.accent, 14, H - 90, H - 14) + vignette() + grain(),

  "altai-peaks": (p = PALETTES.dawn) =>
    sky(p) + stars(36) + sunGlow(p, 640, 315, 105) + clouds(p, 3, 150, 300, 0.4) +
    ridge(370, 240, 5, p.layers[0], { op: 0.9, sharp: true, snow: p.snow, snowMin: 0.55 }) +
    ridge(465, 190, 6, p.layers[1], { op: 0.94, sharp: true, snow: p.snow, snowMin: 0.72 }) +
    ridge(575, 150, 4, p.layers[2], { sharp: true }) +
    ground(700, p.ground) +
    place("eagle", 300, 215, 1.5, p.accent) + place("eagle", 430, 300, 0.95, p.accent) +
    place("hiker", 880, 692, 1.1, p.accent) + place("ovoo", 1025, 700, 1.05, p.accent) +
    vignette() + grain(),

  "naadam-festival": (p = PALETTES.steppe) =>
    sky(p) + sunGlow(p, 950, 180, 66) + clouds(p, 4, 60, 210, 0.85) +
    ridge(455, 120, 6, p.layers[0], { op: 0.7 }) +
    ground(555, p.ground) +
    place("flag", 175, 645, 1.25, p.accent) + place("flag", 1045, 662, 1.1, p.accent, true) +
    place("wrestler", 380, 692, 1.3, p.accent) +
    place("archer", 625, 688, 1.22, p.accent) +
    place("rider", 862, 700, 1.12, p.accent) +
    place("ger", 118, 560, 0.82, p.accent, false, 0.9) + place("ger", 1102, 556, 0.72, p.accent, false, 0.9) +
    grass(p.accent) + vignette() + grain(),

  "horse-trek": (p = PALETTES.dusk) =>
    sky(p) + sunGlow(p, 600, 330, 110) + clouds(p, 3, 90, 260, 0.5) + birds(p.accent, 3, 190) +
    ridge(425, 165, 6, p.layers[0], { op: 0.82 }) +
    ridge(510, 125, 5, p.layers[1], { op: 0.92 }) +
    ground(635, p.ground) +
    place("rider", 455, 700, 1.32, p.accent) + place("rider", 620, 712, 1.16, p.accent) +
    place("horse", 780, 705, 1.02, p.accent) +
    grass(p.accent, 20) + vignette() + grain(),

  "terelj-park": (p = PALETTES.steppe) =>
    sky(p) + sunGlow(p, 255, 200, 72) + clouds(p, 4, 60, 200, 0.85) + birds(p.accent, 4) +
    `<path d="M745 565 L795 370 Q 828 328 860 370 L 925 565 Z" fill="${p.layers[1]}"/>` +
    `<path d="M870 565 L928 285 Q 958 238 990 285 L 1065 565 Z" fill="${p.layers[2]}"/>` +
    `<ellipse cx="965" cy="300" rx="26" ry="10" fill="#ffffff" opacity="0.5"/>` +
    ridge(475, 125, 6, p.layers[0], { op: 0.72 }) +
    ground(595, p.ground) +
    place("pine", 152, 612, 1.35, p.accent) + place("pine", 228, 620, 1.05, p.accent) +
    place("pine", 300, 608, 1.45, p.accent) +
    gerLit(560, 702, 1.25, p.accent) + smoke(566, 626) +
    place("yak", 705, 716, 1.05, p.accent, true) +
    grass(p.accent) + vignette() + grain(),

  kharkhorin: (p = PALETTES.day) =>
    sky(p) + sunGlow(p, 905, 195, 70) + clouds(p, 3, 60, 190, 0.85) + birds(p.accent, 3) +
    ridge(465, 130, 6, p.layers[0], { op: 0.7 }) +
    ground(572, p.ground) +
    place("monastery", 600, 660, 1.75, p.accent) +
    place("stupa", 298, 662, 1.32, p.accent) + place("stupa", 902, 662, 1.32, p.accent) +
    place("stupa", 158, 652, 0.92, p.accent) + place("stupa", 1042, 652, 0.92, p.accent) +
    grass(p.accent, 18) + vignette() + grain(),

  "eagle-hunter": (p = PALETTES.winter) =>
    sky(p) + sunGlow(p, 315, 215, 82) + clouds(p, 3, 60, 190, 0.9) +
    ridge(385, 225, 5, p.layers[0], { op: 0.92, sharp: true, snow: p.snow, snowMin: 0.5 }) +
    ridge(495, 165, 6, p.layers[1], { op: 0.92, sharp: true, snow: p.snow, snowMin: 0.66 }) +
    ground(650, p.ground) +
    place("rider", 705, 700, 1.4, p.accent) + place("eagle", 790, 470, 1.65, p.accent) +
    place("eagle", 470, 310, 1.0, p.accent) + place("pine", 148, 662, 1.15, p.accent) +
    `<circle cx="180" cy="170" r="3" fill="#fff"/><circle cx="430" cy="120" r="2.6" fill="#fff"/><circle cx="760" cy="150" r="3" fill="#fff"/><circle cx="1030" cy="115" r="2.6" fill="#fff"/><circle cx="905" cy="320" r="2.6" fill="#fff"/><circle cx="300" cy="295" r="2.6" fill="#fff"/><circle cx="620" cy="230" r="2.4" fill="#fff"/>` +
    vignette() + grain(),

  "moto-adventure": (p = PALETTES.gobi) =>
    sky(p) + sunGlow(p, 875, 235, 88) + clouds(p, 2, 70, 170, 0.5) +
    dunes(455, 92, 3, p.layers[0], 0.85) +
    dunes(560, 105, 2, p.layers[1], 0.95) +
    ground(675, p.ground) +
    place("moto", 480, 712, 1.4, p.accent) + place("moto", 705, 722, 1.12, p.accent) +
    `<path d="M170 742 Q 400 720 560 738" stroke="${p.accent}" stroke-width="5" stroke-dasharray="14 18" fill="none" opacity="0.45"/>` +
    `<path d="M545 690 q 14 -20 34 -26 M760 700 q 12 -18 30 -24" stroke="${p.accent}" stroke-width="3" fill="none" opacity="0.3"/>` +
    vignette() + grain(),

  "nomad-life": (p = PALETTES.steppe) =>
    sky(p) + sunGlow(p, 945, 185, 68) + clouds(p, 4, 60, 210, 0.85) + birds(p.accent, 4) +
    ridge(445, 140, 7, p.layers[0], { op: 0.72 }) +
    ridge(520, 100, 5, p.layers[1], { op: 0.85 }) +
    ground(565, p.ground) +
    gerLit(315, 692, 1.62, p.accent) + place("ger", 512, 680, 1.12, p.accent) +
    smoke(322, 592) +
    place("yak", 715, 712, 1.18, p.accent) + place("yak", 828, 718, 0.92, p.accent, true) +
    place("horse", 975, 706, 0.98, p.accent) +
    grass(p.accent) + vignette() + grain(),

  "winter-tour": (p = PALETTES.winter) =>
    sky(p) + sunGlow(p, 600, 215, 72) + clouds(p, 3, 60, 180, 0.9) +
    ridge(420, 190, 5, p.layers[0], { op: 0.9, sharp: true, snow: p.snow, snowMin: 0.5 }) +
    ridge(515, 140, 6, p.layers[1], { op: 0.85, snow: p.snow, snowMin: 0.7 }) +
    ground(635, p.ground) +
    place("pine", 195, 648, 1.3, p.accent) + place("pine", 268, 658, 1.0, p.accent) +
    gerLit(560, 702, 1.32, p.accent) + smoke(566, 620) +
    place("camel", 845, 708, 1.12, p.accent) +
    `<circle cx="180" cy="185" r="3" fill="#fff"/><circle cx="420" cy="120" r="2.6" fill="#fff"/><circle cx="760" cy="160" r="3" fill="#fff"/><circle cx="1020" cy="125" r="2.6" fill="#fff"/><circle cx="900" cy="330" r="2.6" fill="#fff"/><circle cx="300" cy="300" r="2.6" fill="#fff"/><circle cx="660" cy="260" r="2.4" fill="#fff"/><circle cx="520" cy="380" r="2.4" fill="#fff"/>` +
    vignette() + grain(),

  "khustai-horses": (p = PALETTES.dusk) =>
    sky(p) + sunGlow(p, 265, 300, 95) + clouds(p, 3, 80, 240, 0.5) + birds(p.accent, 3, 200) +
    ridge(445, 150, 6, p.layers[0], { op: 0.85 }) +
    ridge(532, 105, 5, p.layers[1], { op: 0.92 }) +
    ground(645, p.ground) +
    place("horse", 420, 700, 1.25, p.accent) + place("horse", 565, 714, 1.02, p.accent, true) +
    place("horse", 705, 706, 1.12, p.accent) + place("horse", 852, 718, 0.88, p.accent, true) +
    grass(p.accent, 20) + vignette() + grain(),

  ulaanbaatar: (p = PALETTES.night) =>
    sky(p) + stars(110) + sunGlow(p, 950, 165, 46, { moon: true }) +
    ridge(425, 130, 6, p.layers[0], { op: 0.85 }) +
    ground(598, p.ground) +
    place("skyline", 400, 600, 2.25, p.layers[1]) + place("skyline", 850, 600, 1.75, p.layers[2]) +
    // lit windows
    Array.from({ length: 42 }, () =>
      `<rect x="${rand(210, 1000).toFixed(0)}" y="${rand(430, 585).toFixed(0)}" width="5" height="7" fill="#ffd97a" opacity="${rand(0.35, 0.95).toFixed(2)}"/>`
    ).join("") +
    place("stupa", 128, 596, 1.12, p.layers[2]) +
    `<rect x="0" y="600" width="${W}" height="5" fill="${p.accent}"/>` +
    vignette() + grain(),

  "volcano-terkh": (p = PALETTES.dawn) =>
    sky(p) + stars(24) + sunGlow(p, 905, 250, 84) + clouds(p, 3, 100, 250, 0.45) +
    `<path d="M330 520 L465 245 Q 495 205 525 245 L 665 520 Z" fill="${p.layers[1]}"/>` +
    `<path d="M465 245 L495 205 L525 245 L508 262 L482 262 Z" fill="${p.snow}" opacity="0.85"/>` +
    ridge(465, 125, 6, p.layers[0], { op: 0.7 }) +
    water(575, ["#4b4a7e", "#262347"], 905) +
    `<path d="M0 655 Q 300 632 600 652 T 1200 648 L 1200 800 L 0 800 Z" fill="${p.ground[1]}"/>` +
    place("pine", 905, 600, 1.15, p.accent) + place("pine", 968, 608, 0.9, p.accent) +
    place("fisher", 205, 706, 1.08, p.accent, true) +
    vignette() + grain(),

  "trans-mongolian": (p = PALETTES.day) =>
    sky(p) + sunGlow(p, 295, 195, 74) + clouds(p, 4, 60, 200, 0.85) + birds(p.accent, 4) +
    ridge(445, 150, 6, p.layers[0], { op: 0.75, snow: p.snow, snowMin: 0.75 }) +
    ridge(520, 110, 5, p.layers[1], { op: 0.85 }) +
    ground(595, p.ground) +
    `<rect x="0" y="686" width="${W}" height="10" fill="${p.accent}" opacity="0.75"/>` +
    Array.from({ length: 24 }, (_, i) => `<rect x="${i * 52 + 8}" y="682" width="6" height="16" fill="${p.accent}" opacity="0.5"/>`).join("") +
    place("train", 500, 684, 1.95, p.accent) +
    smoke(370, 616) +
    place("ger", 1032, 598, 0.92, p.accent, false, 0.92) +
    grass(p.accent, 16) + vignette() + grain(),

  "fishing-rafting": (p = PALETTES.lake) =>
    sky(p) + sunGlow(p, 245, 190, 72) + clouds(p, 3, 60, 190, 0.8) +
    ridge(408, 175, 5, p.layers[0], { op: 0.82, sharp: true, snow: p.snow, snowMin: 0.65 }) +
    ridge(488, 130, 6, p.layers[1], { op: 0.88 }) +
    water(560, p.water, 245) +
    `<path d="M0 668 Q 300 648 600 664 T 1200 660 L 1200 800 L 0 800 Z" fill="${p.ground[1]}"/>` +
    `<path d="M640 700 L700 680 L860 680 L900 700 Q 770 718 640 700 Z" fill="${p.accent}"/>` +
    place("fisher", 762, 684, 1.05, p.accent) +
    place("pine", 138, 690, 1.25, p.accent) + place("pine", 208, 698, 0.95, p.accent) +
    vignette() + grain(),
};

for (const [name, fn] of Object.entries(scenes)) {
  R = rng([...name].reduce((a, c) => a + c.charCodeAt(0) * 37, 7));
  uid = 0;
  writeFileSync(join(OUT, `${name}.svg`), frame(fn()));
  console.log("wrote", `${name}.svg`);
}
console.log("done:", Object.keys(scenes).length, "images");
