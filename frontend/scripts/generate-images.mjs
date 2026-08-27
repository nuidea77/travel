/**
 * Generates flat-illustration SVG scenery used as tour/blog imagery.
 * Run: node scripts/generate-images.mjs  (writes to public/images)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 800;

// ---------- palettes (sky top, sky bottom, sun, far, mid, near, ground, accent)
const PALETTES = {
  dawn:   { top: "#2d3a5f", bot: "#f4a261", sun: "#ffd166", far: "#5a6a94", mid: "#41528a", near: "#2b3a66", ground: "#22304f", accent: "#1a2540" },
  day:    { top: "#7fd4e8", bot: "#e8f6f8", sun: "#fff3c4", far: "#9fc7d6", mid: "#5ba8b8", near: "#2e7f8f", ground: "#3b8f7a", accent: "#20606c" },
  gobi:   { top: "#ffd89b", bot: "#ffedd5", sun: "#ff9f68", far: "#f0b478", mid: "#d98e4a", near: "#b06a2e", ground: "#c87f3c", accent: "#8a4f1d" },
  dusk:   { top: "#355070", bot: "#e56b6f", sun: "#ffcb77", far: "#6d597a", mid: "#4f4368", near: "#372f50", ground: "#2b2542", accent: "#1e1a33" },
  steppe: { top: "#a8dcec", bot: "#f2f7dc", sun: "#fff8d6", far: "#8fbf9f", mid: "#659e7d", near: "#3f7d5c", ground: "#54936b", accent: "#2c5e43" },
  winter: { top: "#8fb8d8", bot: "#eef4fa", sun: "#fefefe", far: "#c3d7e8", mid: "#9db8d2", near: "#6f8fb4", ground: "#dce9f4", accent: "#4a6a92" },
  lake:   { top: "#6ec3d8", bot: "#dff3ef", sun: "#fff3c4", far: "#7fb2a8", mid: "#4d9187", near: "#2d6f66", ground: "#3a8a9e", accent: "#1d5259" },
  night:  { top: "#0b1437", bot: "#28406e", sun: "#f5f0e6", far: "#1c2c54", mid: "#152246", near: "#0f1a38", ground: "#0a1330", accent: "#060d24" },
};

const rid = () => Math.random().toString(36).slice(2, 8);

function sky(p, id) {
  return `<defs><linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${p.top}"/><stop offset="1" stop-color="${p.bot}"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky${id})"/>`;
}

function sun(p, cx = 880, cy = 250, r = 90) {
  return `<circle cx="${cx}" cy="${cy}" r="${r + 45}" fill="${p.sun}" opacity="0.18"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.sun}" opacity="0.95"/>`;
}

function stars(n = 60) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = Math.round(Math.random() * W);
    const y = Math.round(Math.random() * H * 0.55);
    const r = (Math.random() * 1.6 + 0.5).toFixed(1);
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(Math.random() * 0.6 + 0.3).toFixed(2)}"/>`;
  }
  return s;
}

// jagged mountain ridge
function ridge(baseY, amp, peaks, color, opacity = 1, smooth = false) {
  const seg = W / peaks;
  let d = `M0 ${H} L0 ${baseY}`;
  for (let i = 0; i <= peaks; i++) {
    const x = i * seg;
    const y = baseY - (i % 2 === 0 ? 0 : amp * (0.6 + Math.random() * 0.4));
    d += smooth
      ? ` Q ${x - seg / 2} ${baseY - amp * (0.55 + Math.random() * 0.45)} ${x} ${y}`
      : ` L ${x} ${y}`;
  }
  d += ` L ${W} ${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

// smooth dunes
function dunes(baseY, amp, waves, color, opacity = 1) {
  const seg = W / waves;
  let d = `M0 ${H} L0 ${baseY}`;
  for (let i = 0; i < waves; i++) {
    const x0 = i * seg;
    d += ` C ${x0 + seg * 0.3} ${baseY - amp} ${x0 + seg * 0.7} ${baseY + amp * 0.4} ${x0 + seg} ${baseY - (i % 2 ? amp * 0.2 : 0)}`;
  }
  d += ` L ${W} ${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

function ground(color, y = 640) {
  return `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${color}"/>`;
}

// ---------- silhouettes (drawn around origin, scale/translate via <g>)
const SIL = {
  ger: `<path d="M-70 0 L-58 -34 Q0 -62 58 -34 L70 0 Z" />
        <rect x="-10" y="-26" width="20" height="26"/>
        <path d="M-14 -50 L0 -66 L14 -50 Z"/>`,
  horse: `<path d="M-52 0 L-52 -26 Q-50 -40 -34 -42 L10 -42 Q26 -42 34 -56 L40 -70 L48 -68 L44 -52 Q42 -40 30 -34 L30 -26 L36 0 L28 0 L22 -22 L-8 -22 L-14 0 L-24 0 L-28 -22 L-44 -22 L-44 0 Z"/>`,
  rider: `<path d="M-52 0 L-52 -26 Q-50 -40 -34 -42 L10 -42 Q26 -42 34 -56 L40 -70 L48 -68 L44 -52 Q42 -40 30 -34 L30 -26 L36 0 L28 0 L22 -22 L-8 -22 L-14 0 L-24 0 L-28 -22 L-44 -22 L-44 0 Z"/>
        <circle cx="-8" cy="-66" r="9"/><path d="M-16 -56 Q-8 -62 0 -56 L2 -42 L-18 -42 Z"/>`,
  camel: `<path d="M-56 0 L-56 -24 Q-56 -36 -44 -38 Q-36 -52 -26 -40 Q-16 -54 -6 -40 L20 -40 Q30 -40 36 -52 L40 -64 L48 -62 L46 -50 Q44 -38 32 -32 L34 0 L26 0 L22 -20 L-10 -20 L-14 0 L-24 0 L-28 -20 L-48 -20 L-48 0 Z"/>`,
  pine: `<path d="M0 0 L0 -18 M0 -12 L-16 -12 L0 -46 L16 -12 Z M0 -34 L-12 -34 L0 -62 L12 -34 Z M0 -52 L-9 -52 L0 -74 L9 -52 Z" stroke-width="6" stroke-linecap="round"/>
         <path d="M-16 -10 L0 -48 L16 -10 Z M-12 -32 L0 -64 L12 -32 Z M-8 -52 L0 -76 L8 -52 Z"/><rect x="-3" y="-14" width="6" height="14"/>`,
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
  jeep: `<rect x="-46" y="-30" width="92" height="20" rx="4"/><path d="M-30 -30 L-24 -46 L20 -46 L28 -30 Z"/>
         <circle cx="-26" cy="-8" r="11"/><circle cx="26" cy="-8" r="11"/>`,
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

function birds(color, n = 4, cy = 180) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = 120 + Math.random() * 800;
    const y = cy + Math.random() * 120;
    const w = 14 + Math.random() * 10;
    s += `<path d="M${x} ${y} q ${w / 2} ${-w / 2} ${w} 0 q ${w / 2} ${-w / 2} ${w} 0" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.75"/>`;
  }
  return s;
}

function frame(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
}

// ---------- scenes
const scenes = {
  "hero-steppe": () => {
    const p = PALETTES.day, id = rid();
    return frame(sky(p, id) + sun(p, 930, 210, 80) + birds(p.accent, 5) +
      ridge(430, 150, 7, p.far, 0.75, true) + ridge(500, 120, 5, p.mid, 0.9, true) +
      ground(p.ground, 610) + dunes(620, 26, 4, p.near, 0.55) +
      place("ger", 260, 700, 1.5, p.accent) + place("ger", 420, 690, 1.05, p.accent) +
      place("rider", 820, 706, 1.15, p.accent) + place("horse", 950, 700, 0.95, p.accent, true));
  },
  "gobi-dunes": () => {
    const p = PALETTES.gobi, id = rid();
    return frame(sky(p, id) + sun(p, 300, 240, 100) +
      dunes(430, 90, 3, p.far, 0.8) + dunes(520, 110, 2, p.mid, 0.92) +
      dunes(620, 90, 2, p.near) + ground(p.ground, 720) +
      place("camel", 760, 700, 1.25, p.accent) + place("camel", 880, 712, 1.0, p.accent) +
      place("rider", 620, 690, 0.9, p.accent, true));
  },
  "lake-khuvsgul": () => {
    const p = PALETTES.lake, id = rid();
    return frame(sky(p, id) + sun(p, 880, 220, 85) + birds(p.accent, 4, 150) +
      ridge(400, 170, 6, p.far, 0.8, true) + ridge(470, 130, 5, p.mid, 0.9, true) +
      `<rect x="0" y="560" width="${W}" height="${H - 560}" fill="${p.ground}"/>` +
      `<ellipse cx="600" cy="560" rx="640" ry="26" fill="#ffffff" opacity="0.25"/>` +
      `<path d="M0 640 Q 300 620 600 640 T 1200 640 L 1200 800 L 0 800 Z" fill="${p.near}" opacity="0.55"/>` +
      place("pine", 120, 566, 1.15, p.accent) + place("pine", 180, 572, 0.9, p.accent) +
      place("pine", 1080, 566, 1.2, p.accent) + place("pine", 1020, 574, 0.85, p.accent) +
      place("fisher", 300, 700, 1.1, p.accent));
  },
  "altai-peaks": () => {
    const p = PALETTES.dawn, id = rid();
    return frame(sky(p, id) + sun(p, 640, 300, 110) +
      ridge(380, 220, 5, p.far, 0.85, false) + ridge(470, 180, 6, p.mid, 0.92) +
      ridge(580, 140, 4, p.near) + ground(p.ground, 700) +
      place("eagle", 300, 220, 1.4, p.accent) + place("eagle", 420, 300, 0.9, p.accent) +
      place("hiker", 880, 690, 1.1, p.accent) + place("ovoo", 1020, 700, 1.0, p.accent));
  },
  "naadam-festival": () => {
    const p = PALETTES.steppe, id = rid();
    return frame(sky(p, id) + sun(p, 950, 200, 80) +
      ridge(460, 110, 6, p.far, 0.7, true) + ground(p.ground, 560) +
      dunes(575, 22, 5, p.mid, 0.4) +
      place("flag", 180, 640, 1.2, p.accent) + place("flag", 1040, 660, 1.1, p.accent, true) +
      place("wrestler", 380, 690, 1.25, p.accent) +
      place("archer", 620, 686, 1.2, p.accent) +
      place("rider", 860, 700, 1.1, p.accent) +
      place("ger", 120, 560, 0.8, p.accent, false, 0.85) + place("ger", 1100, 556, 0.7, p.accent, false, 0.85));
  },
  "horse-trek": () => {
    const p = PALETTES.dusk, id = rid();
    return frame(sky(p, id) + sun(p, 600, 330, 120) +
      ridge(430, 150, 6, p.far, 0.8, true) + ridge(520, 120, 5, p.mid, 0.9, true) +
      ground(p.ground, 640) +
      place("rider", 460, 700, 1.3, p.accent) + place("rider", 620, 710, 1.15, p.accent) +
      place("horse", 780, 705, 1.0, p.accent) + birds(p.accent, 3, 200));
  },
  "terelj-park": () => {
    const p = PALETTES.steppe, id = rid();
    return frame(sky(p, id) + sun(p, 260, 220, 85) + birds(p.accent, 4) +
      `<path d="M760 560 L800 380 Q830 340 860 380 L920 560 Z" fill="${p.mid}"/>` +
      `<path d="M880 560 L930 300 Q960 250 990 300 L1060 560 Z" fill="${p.near}"/>` +
      ridge(480, 120, 6, p.far, 0.75, true) + ground(p.ground, 600) +
      place("pine", 160, 606, 1.3, p.accent) + place("pine", 230, 612, 1.0, p.accent) +
      place("pine", 300, 604, 1.4, p.accent) + place("ger", 560, 700, 1.2, p.accent) +
      place("yak", 700, 716, 1.0, p.accent, true));
  },
  "kharkhorin": () => {
    const p = PALETTES.day, id = rid();
    return frame(sky(p, id) + sun(p, 900, 220, 85) +
      ridge(470, 120, 6, p.far, 0.7, true) + ground(p.ground, 580) +
      place("monastery", 600, 660, 1.7, p.accent) +
      place("stupa", 300, 660, 1.3, p.accent) + place("stupa", 900, 660, 1.3, p.accent) +
      place("stupa", 160, 650, 0.9, p.accent) + place("stupa", 1040, 650, 0.9, p.accent) +
      birds(p.accent, 3));
  },
  "eagle-hunter": () => {
    const p = PALETTES.winter, id = rid();
    return frame(sky(p, id) + sun(p, 320, 240, 90) +
      ridge(400, 200, 5, p.far, 0.9) + ridge(500, 150, 6, p.mid, 0.9) + ground(p.ground, 660) +
      place("rider", 700, 700, 1.35, p.accent) + place("eagle", 780, 480, 1.6, p.accent) +
      place("eagle", 480, 320, 1.0, p.accent) + place("pine", 150, 668, 1.1, p.accent));
  },
  "moto-adventure": () => {
    const p = PALETTES.gobi, id = rid();
    return frame(sky(p, id) + sun(p, 880, 250, 95) +
      dunes(460, 90, 3, p.far, 0.8) + dunes(560, 100, 2, p.mid, 0.9) + ground(p.ground, 680) +
      place("moto", 480, 710, 1.35, p.accent) + place("moto", 700, 720, 1.1, p.accent) +
      `<path d="M180 740 Q 400 720 560 736" stroke="${p.accent}" stroke-width="5" stroke-dasharray="14 18" fill="none" opacity="0.5"/>`);
  },
  "nomad-life": () => {
    const p = PALETTES.steppe, id = rid();
    return frame(sky(p, id) + sun(p, 940, 210, 80) + birds(p.accent, 4) +
      ridge(450, 130, 7, p.far, 0.7, true) + ground(p.ground, 570) +
      place("ger", 320, 690, 1.6, p.accent) + place("ger", 520, 680, 1.1, p.accent) +
      place("yak", 720, 710, 1.15, p.accent) + place("yak", 830, 716, 0.9, p.accent, true) +
      place("horse", 980, 706, 0.95, p.accent));
  },
  "winter-tour": () => {
    const p = PALETTES.winter, id = rid();
    return frame(sky(p, id) + sun(p, 600, 240, 80) +
      ridge(430, 170, 5, p.far, 0.85) + ridge(520, 130, 6, p.mid, 0.8) + ground(p.ground, 640) +
      place("pine", 200, 648, 1.25, p.accent) + place("pine", 270, 656, 0.95, p.accent) +
      place("ger", 560, 700, 1.3, p.accent) + place("camel", 840, 706, 1.1, p.accent) +
      `<circle cx="180" cy="180" r="3" fill="#fff"/><circle cx="420" cy="120" r="2.5" fill="#fff"/><circle cx="760" cy="160" r="3" fill="#fff"/><circle cx="1020" cy="120" r="2.5" fill="#fff"/><circle cx="900" cy="330" r="2.5" fill="#fff"/><circle cx="300" cy="300" r="2.5" fill="#fff"/>`);
  },
  "khustai-horses": () => {
    const p = PALETTES.dusk, id = rid();
    return frame(sky(p, id) + sun(p, 260, 300, 100) +
      ridge(450, 140, 6, p.far, 0.85, true) + ridge(540, 100, 5, p.mid, 0.9, true) + ground(p.ground, 650) +
      place("horse", 420, 700, 1.2, p.accent) + place("horse", 560, 712, 1.0, p.accent, true) +
      place("horse", 700, 704, 1.1, p.accent) + place("horse", 850, 716, 0.85, p.accent, true) +
      birds(p.accent, 3, 220));
  },
  "ulaanbaatar": () => {
    const p = PALETTES.night, id = rid();
    return frame(sky(p, id) + stars(70) + sun(p, 950, 180, 45) +
      ridge(430, 120, 6, p.far, 0.8, true) + ground(p.ground, 600) +
      place("skyline", 400, 600, 2.2, p.mid) + place("skyline", 850, 600, 1.7, p.near) +
      place("stupa", 130, 596, 1.1, p.near) +
      `<rect x="0" y="600" width="${W}" height="6" fill="${p.accent}"/>`);
  },
  "volcano-terkh": () => {
    const p = PALETTES.dawn, id = rid();
    return frame(sky(p, id) + sun(p, 900, 260, 90) +
      `<path d="M340 520 L470 250 L520 250 L660 520 Z" fill="${p.mid}"/>` +
      `<path d="M470 250 L495 210 L520 250 Z" fill="${p.near}"/>` +
      ridge(470, 120, 6, p.far, 0.7, true) +
      `<rect x="0" y="580" width="${W}" height="${H - 580}" fill="${p.ground}"/>` +
      `<path d="M0 640 Q 300 620 600 640 T 1200 640 L1200 800 L0 800 Z" fill="${p.near}" opacity="0.5"/>` +
      place("pine", 900, 590, 1.1, p.accent) + place("pine", 960, 596, 0.85, p.accent) +
      place("fisher", 200, 700, 1.05, p.accent, true));
  },
  "trans-mongolian": () => {
    const p = PALETTES.day, id = rid();
    return frame(sky(p, id) + sun(p, 300, 220, 85) + birds(p.accent, 4) +
      ridge(450, 140, 6, p.far, 0.75, true) + ground(p.ground, 600) +
      `<rect x="0" y="688" width="${W}" height="10" fill="${p.accent}" opacity="0.7"/>` +
      place("train", 500, 686, 1.9, p.accent) +
      place("ger", 1020, 600, 0.9, p.accent, false, 0.9));
  },
  "fishing-rafting": () => {
    const p = PALETTES.lake, id = rid();
    return frame(sky(p, id) + sun(p, 250, 210, 80) +
      ridge(420, 160, 5, p.far, 0.8, true) + ridge(500, 120, 6, p.mid, 0.85, true) +
      `<rect x="0" y="580" width="${W}" height="${H - 580}" fill="${p.ground}"/>` +
      `<path d="M0 660 Q300 640 600 660 T 1200 660 L1200 800 L0 800 Z" fill="${p.near}" opacity="0.5"/>` +
      `<path d="M640 700 L700 680 L860 680 L900 700 Q 770 716 640 700 Z" fill="${p.accent}"/>` +
      place("fisher", 760, 684, 1.0, p.accent) +
      place("pine", 140, 588, 1.2, p.accent) + place("pine", 210, 594, 0.9, p.accent));
  },
};

for (const [name, fn] of Object.entries(scenes)) {
  writeFileSync(join(OUT, `${name}.svg`), fn());
  console.log("wrote", `${name}.svg`);
}
console.log("done:", Object.keys(scenes).length, "images");
