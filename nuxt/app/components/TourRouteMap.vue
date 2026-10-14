<script setup lang="ts">
import { MN_OUTLINE } from "~/utils/mn-outline";

type Stop = {
  day_number: number;
  title: string;
  map_label?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
};

const props = defineProps<{ stops: Stop[] }>();

const W = 760;
const H = 540;
const UB = { lat: 47.919, lng: 106.917 };
const FLIGHT_KM = 520; // straight-line jumps longer than this are drawn as flights

type Pt = { lat: number; lng: number; day?: number; label?: string; isUb?: boolean };

function kmBetween(a: Pt, b: Pt) {
  const kx = Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180) * 111.32;
  const dx = (a.lng - b.lng) * kx;
  const dy = (a.lat - b.lat) * 110.57;
  return Math.hypot(dx, dy);
}

// route points: Ulaanbaatar first, then every day stop with coordinates;
// consecutive stops at (almost) the same place collapse into one marker
const route = computed<Pt[]>(() => {
  const pts: Pt[] = [{ ...UB, isUb: true }];
  for (const s of [...props.stops].sort((a, b) => a.day_number - b.day_number)) {
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    if (!s.lat || !s.lng || Number.isNaN(lat) || Number.isNaN(lng)) continue;
    const p: Pt = { lat, lng, day: s.day_number, label: s.map_label || s.title.slice(0, 24) };
    const prev = pts[pts.length - 1];
    if (prev && kmBetween(prev, p) < 12) continue; // same stop again
    if (kmBetween({ ...UB } as Pt, p) < 25) p.isUb = true; // returning to the capital
    pts.push(p);
  }
  return pts;
});

const enough = computed(() => route.value.filter((p) => !p.isUb).length >= 2);

// fit the viewport to the route (plus margins), equirectangular projection
const proj = computed(() => {
  const pts = route.value;
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180) * 111.32;
  const xs = pts.map((p) => p.lng * kx);
  const ys = pts.map((p) => -p.lat * 110.57);
  const pad = 0.16;
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 120);
  const spanY = Math.max(maxY - minY, 90);
  minX -= spanX * pad;
  maxX += spanX * pad;
  minY -= spanY * (pad + 0.06); // a little extra headroom for labels
  maxY += spanY * pad;
  const s = Math.min(W / (maxX - minX), H / (maxY - minY));
  const ox = (W - (maxX - minX) * s) / 2 - minX * s;
  const oy = (H - (maxY - minY) * s) / 2 - minY * s;
  return {
    x: (lng: number) => lng * kx * s + ox,
    y: (lat: number) => -lat * 110.57 * s + oy,
    kmToPx: s,
  };
});

const P = computed(() => route.value.map((p) => ({ ...p, x: proj.value.x(p.lng), y: proj.value.y(p.lat) })));

// country outline in projected space
const outlinePath = computed(() => {
  const { x, y } = proj.value;
  return (
    MN_OUTLINE.map(([lng, lat], i) => `${i === 0 ? "M" : "L"}${x(lng).toFixed(1)} ${y(lat).toFixed(1)}`).join(" ") +
    " Z"
  );
});

// smooth road segments + dashed flight segments
const segments = computed(() => {
  const pts = P.value;
  const road: string[] = [];
  const flights: { d: string; mx: number; my: number; angle: number }[] = [];
  let chain: typeof pts = [];
  const flush = () => {
    if (chain.length > 1) road.push(catmullRom(chain));
    chain = [];
  };
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    if (i === 0) {
      chain.push(p);
      continue;
    }
    const prev = pts[i - 1]!;
    if (kmBetween(prev, p) > FLIGHT_KM) {
      flush();
      flights.push({
        d: `M${prev.x} ${prev.y} L${p.x} ${p.y}`,
        mx: (prev.x + p.x) / 2,
        my: (prev.y + p.y) / 2,
        angle: (Math.atan2(p.y - prev.y, p.x - prev.x) * 180) / Math.PI,
      });
      chain = [p];
    } else {
      chain.push(p);
    }
  }
  flush();
  return { road, flights };
});

function catmullRom(pts: { x: number; y: number }[]) {
  if (pts.length === 2) return `M${pts[0]!.x} ${pts[0]!.y} L${pts[1]!.x} ${pts[1]!.y}`;
  let d = `M${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// one marker per place: revisited stops (e.g. day 13 and 16 at the same camp)
// collapse into a single marker labelled "13·16"
const markers = computed(() => {
  const out: { x: number; y: number; label?: string; days: number[] }[] = [];
  for (const p of P.value) {
    if (p.isUb || !p.day) continue;
    const near = out.find((m) => Math.hypot(m.x - p.x, m.y - p.y) < 14);
    if (near) {
      near.days.push(p.day);
    } else {
      out.push({ x: p.x, y: p.y, label: p.label, days: [p.day] });
    }
  }
  return out.map((m) => ({ ...m, dayText: m.days.join("·") }));
});

const ub = computed(() => P.value.find((p) => p.isUb));

const ubAnchor = computed(() => ((ub.value?.x ?? 0) > W * 0.72 ? "end" : "start"));

// greedy label placement: nudge labels vertically until they stop overlapping
const labels = computed(() => {
  type Rect = { x1: number; y1: number; x2: number; y2: number };
  const placed: Rect[] = [];
  const u = ub.value;
  if (u) {
    const w = 118;
    const x1 = ubAnchor.value === "start" ? u.x + 18 : u.x - 18 - w;
    placed.push({ x1, y1: u.y + 8, x2: x1 + w, y2: u.y + 30 });
    placed.push({ x1: u.x - 16, y1: u.y - 16, x2: u.x + 16, y2: u.y + 16 });
  }
  // marker circles are obstacles too, so labels never sit on a number
  for (const m of markers.value) {
    placed.push({ x1: m.x - 15, y1: m.y - 15, x2: m.x + 15, y2: m.y + 15 });
  }
  return markers.value.map((p) => {
    const text = p.label ?? "";
    const w = text.length * 7.4 + 6;
    const prefer: "start" | "end" = p.x > W * 0.72 ? "end" : "start";
    const sides: ("start" | "end")[] = prefer === "start" ? ["start", "end"] : ["end", "start"];
    let pick = { anchor: prefer, dy: 0 };
    let found = false;
    for (const anchor of sides) {
      const bx = anchor === "start" ? p.x + 19 : p.x - 19 - w;
      if (bx < 4 || bx + w > W - 4) continue; // keep labels on the canvas
      for (const dy of [0, -17, 17, -31, 31]) {
        const r: Rect = { x1: bx, y1: p.y - 8 + dy, x2: bx + w, y2: p.y + 9 + dy };
        if (!placed.some((q) => r.x1 < q.x2 && r.x2 > q.x1 && r.y1 < q.y2 && r.y2 > q.y1)) {
          placed.push(r);
          pick = { anchor, dy };
          found = true;
          break;
        }
      }
      if (found) break;
    }
    return {
      x: pick.anchor === "start" ? p.x + 19 : p.x - 19,
      y: p.y + 4.5 + pick.dy,
      anchor: pick.anchor,
      text,
    };
  });
});

// decorative "forest" blobs, deterministic per route
const blobs = computed(() => {
  let seed = route.value.reduce((a, p) => (a + p.lat * 7 + p.lng * 13) | 0, 9);
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: 8 }, () => ({
    cx: 40 + rnd() * (W - 80),
    cy: 40 + rnd() * (H - 80),
    rx: 36 + rnd() * 70,
    ry: 22 + rnd() * 44,
    o: 0.35 + rnd() * 0.3,
  }));
});

// inset mini-map (only when the view is a regional zoom, not the whole country)
const inset = computed(() => {
  const lngs = MN_OUTLINE.map((p) => p[0]);
  const lats = MN_OUTLINE.map((p) => p[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const rLats = route.value.map((p) => p.lat);
  const rLngs = route.value.map((p) => p.lng);
  const covers =
    (Math.max(...rLngs) - Math.min(...rLngs)) / (maxLng - minLng) > 0.62 &&
    (Math.max(...rLats) - Math.min(...rLats)) / (maxLat - minLat) > 0.4;
  const iw = 148;
  const ih = 86;
  const m = 8;
  const s = Math.min((iw - m * 2) / (maxLng - minLng) / Math.cos((46.8 * Math.PI) / 180), 1000);
  const sx = (iw - m * 2) / (maxLng - minLng);
  const sy = (ih - m * 2 - 12) / (maxLat - minLat);
  const sc = Math.min(sx, sy);
  const px = (lng: number) => m + (lng - minLng) * sc;
  const py = (lat: number) => m + (maxLat - lat) * sc;
  const path = MN_OUTLINE.map(([lng, lat], i) => `${i === 0 ? "M" : "L"}${px(lng).toFixed(1)} ${py(lat).toFixed(1)}`).join(" ") + " Z";
  return {
    show: !covers,
    w: iw,
    h: ih,
    path,
    rect: {
      x: px(Math.min(...rLngs)) - 2,
      y: py(Math.max(...rLats)) - 2,
      w: (Math.max(...rLngs) - Math.min(...rLngs)) * sc + 4,
      h: (Math.max(...rLats) - Math.min(...rLats)) * sc + 4,
    },
  };
});
</script>

<template>
  <figure v-if="enough" class="overflow-hidden rounded-xl border border-slate-200 bg-[#f8f5ec] shadow-card">
    <svg :viewBox="`0 0 ${W} ${H}`" class="block h-auto w-full" role="img" aria-label="Tour route map">
      <!-- paper + country -->
      <rect :width="W" :height="H" fill="#f8f5ec" />
      <clipPath id="mn-clip"><path :d="outlinePath" /></clipPath>
      <path :d="outlinePath" fill="#f3efe2" stroke="#d9d2ba" stroke-width="2" />
      <g clip-path="url(#mn-clip)">
        <ellipse
          v-for="(b, i) in blobs"
          :key="i"
          :cx="b.cx"
          :cy="b.cy"
          :rx="b.rx"
          :ry="b.ry"
          fill="#d6e6c5"
          :opacity="b.o"
        />
      </g>

      <!-- route -->
      <path
        v-for="(d, i) in segments.road"
        :key="'r' + i"
        :d="d"
        fill="none"
        stroke="#3d4a56"
        stroke-width="3"
        stroke-linecap="round"
      />
      <g v-for="(f, i) in segments.flights" :key="'f' + i">
        <path :d="f.d" fill="none" stroke="#6b7682" stroke-width="2.4" stroke-dasharray="3 7" stroke-linecap="round" />
        <text
          :transform="`translate(${f.mx} ${f.my}) rotate(${f.angle > 90 || f.angle < -90 ? f.angle + 180 : f.angle})`"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="19"
          fill="#3d4a56"
          stroke="#f8f5ec"
          stroke-width="3"
          paint-order="stroke"
          font-family="system-ui, sans-serif"
        >
          ✈
        </text>
      </g>

      <!-- day markers -->
      <g v-for="(p, i) in markers" :key="p.dayText">
        <circle :cx="p.x" :cy="p.y" :r="p.dayText.length > 2 ? 15 : 12.5" fill="#434b55" stroke="#ffffff" stroke-width="2.6" />
        <text
          :x="p.x"
          :y="p.y + (p.dayText.length > 2 ? 3.6 : 4.4)"
          text-anchor="middle"
          :font-size="p.dayText.length > 2 ? 9.5 : 12.5"
          font-weight="700"
          fill="#ffffff"
          font-family="inherit"
        >
          {{ p.dayText }}
        </text>
        <text
          :x="labels[i]!.x"
          :y="labels[i]!.y"
          :text-anchor="labels[i]!.anchor"
          font-size="13.5"
          font-weight="600"
          fill="#273240"
          stroke="#f8f5ec"
          stroke-width="3.5"
          paint-order="stroke"
          font-family="inherit"
        >
          {{ labels[i]!.text }}
        </text>
      </g>

      <!-- Ulaanbaatar star -->
      <g v-if="ub">
        <path
          :transform="`translate(${ub.x} ${ub.y}) scale(1.35)`"
          d="M0 -11 L2.6 -3.6 10.4 -3.4 4.2 1.4 6.4 8.9 0 4.4 -6.4 8.9 -4.2 1.4 -10.4 -3.4 -2.6 -3.6 Z"
          fill="#1b2430"
          stroke="#ffffff"
          stroke-width="2"
        />
        <text
          :x="ubAnchor === 'start' ? ub.x + 18 : ub.x - 18"
          :y="ub.y + 21"
          :text-anchor="ubAnchor"
          font-size="16.5"
          font-weight="800"
          fill="#1b2430"
          stroke="#f8f5ec"
          stroke-width="4"
          paint-order="stroke"
          font-family="inherit"
        >
          Ulaanbaatar
        </text>
      </g>

      <!-- inset: where in Mongolia -->
      <g v-if="inset.show" :transform="`translate(${W - inset.w - 14} ${H - inset.h - 14})`">
        <rect :width="inset.w" :height="inset.h" rx="8" fill="#ffffff" stroke="#d9d2ba" opacity="0.94" />
        <path :d="inset.path" fill="#e8e3d2" stroke="#b9b194" stroke-width="1.2" />
        <rect
          :x="inset.rect.x"
          :y="inset.rect.y"
          :width="inset.rect.w"
          :height="inset.rect.h"
          fill="none"
          stroke="#2c3744"
          stroke-width="1.6"
          stroke-dasharray="3 2"
        />
        <text :x="inset.w / 2" :y="inset.h - 7" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.5" fill="#8d8568" font-family="inherit">
          MONGOLIA
        </text>
      </g>
    </svg>
  </figure>
</template>
