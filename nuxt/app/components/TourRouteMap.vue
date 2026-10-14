<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";

type Stop = {
  day_number: number;
  title: string;
  map_label?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
};

const props = defineProps<{ stops: Stop[] }>();

const UB = { lat: 47.9188, lng: 106.9176 };
const FLIGHT_KM = 520; // straight-line jumps longer than this are drawn as flights

type Pt = { lat: number; lng: number; day?: number; label?: string; isUb?: boolean };

function kmBetween(a: Pt, b: Pt) {
  const kx = Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180) * 111.32;
  return Math.hypot((a.lng - b.lng) * kx, (a.lat - b.lat) * 110.57);
}

// route: Ulaanbaatar first, then every day stop with coordinates;
// consecutive stops at (almost) the same place collapse into one point
const route = computed<Pt[]>(() => {
  const pts: Pt[] = [{ ...UB, isUb: true }];
  for (const s of [...props.stops].sort((a, b) => a.day_number - b.day_number)) {
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    if (!s.lat || !s.lng || Number.isNaN(lat) || Number.isNaN(lng)) continue;
    const p: Pt = { lat, lng, day: s.day_number, label: s.map_label || s.title.slice(0, 26) };
    const prev = pts[pts.length - 1];
    if (prev && kmBetween(prev, p) < 12) continue;
    if (kmBetween({ ...UB } as Pt, p) < 25) p.isUb = true;
    pts.push(p);
  }
  return pts;
});

const enough = computed(() => route.value.filter((p) => !p.isUb).length >= 2);

// one marker per place: revisited stops (day 13 and 16 at the same camp)
// collapse into a single marker labelled "13·16"
const markers = computed(() => {
  const out: { lat: number; lng: number; label?: string; days: number[] }[] = [];
  for (const p of route.value) {
    if (p.isUb || !p.day) continue;
    const near = out.find((m) => kmBetween(m as Pt, p) < 14);
    if (near) near.days.push(p.day);
    else out.push({ lat: p.lat, lng: p.lng, label: p.label, days: [p.day] });
  }
  return out;
});

const el = ref<HTMLElement | null>(null);
let L: typeof Leaflet | null = null;
let map: Leaflet.Map | null = null;
let layer: Leaflet.LayerGroup | null = null;
let labelled: { marker: Leaflet.Marker; label: string }[] = [];
let zoomHooked = false;

// at country-wide zoom the names collide, so they appear on hover only;
// once the viewer zooms in they become permanent like a printed map
const LABEL_ZOOM = 6;

function applyLabels() {
  if (!map) return;
  const permanent = map.getZoom() >= LABEL_ZOOM;
  for (const { marker, label } of labelled) {
    marker.unbindTooltip();
    marker.bindTooltip(label, {
      permanent,
      direction: "right",
      offset: [15, 0],
      className: "trm-label",
    });
  }
}

async function render() {
  if (!import.meta.client || !el.value || !enough.value) return;
  if (!L) {
    L = await import("leaflet");
  }
  if (!map) {
    map = L.map(el.value, {
      scrollWheelZoom: false, // keeps page scrolling pleasant; zoom via buttons/pinch
      attributionControl: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
  }
  layer!.clearLayers();

  const pts = route.value;

  // road polylines (solid) and flight legs (dashed + plane)
  let chain: Pt[] = [];
  const flush = () => {
    if (chain.length > 1) {
      L!.polyline(
        chain.map((p) => [p.lat, p.lng]),
        { color: "#14436b", weight: 3.5, opacity: 0.9, lineJoin: "round" },
      ).addTo(layer!);
    }
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
      L.polyline(
        [
          [prev.lat, prev.lng],
          [p.lat, p.lng],
        ],
        { color: "#50607a", weight: 2.5, dashArray: "4 10", opacity: 0.9 },
      ).addTo(layer!);
      const angle = (Math.atan2(p.lat - prev.lat, (p.lng - prev.lng) * 0.68) * -180) / Math.PI;
      L.marker([(prev.lat + p.lat) / 2, (prev.lng + p.lng) / 2], {
        icon: L.divIcon({
          className: "",
          html: `<div class="trm-plane" style="transform:rotate(${angle.toFixed(0)}deg)">✈</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
        interactive: false,
      }).addTo(layer!);
      chain = [p];
    } else {
      chain.push(p);
    }
  }
  flush();

  // numbered day markers; labels are handled by applyLabels()
  labelled = [];
  for (const m of markers.value) {
    const dayText = m.days.join("·");
    const marker = L.marker([m.lat, m.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div class="trm-marker${dayText.length > 2 ? " trm-marker--wide" : ""}">${dayText}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    });
    marker.addTo(layer!);
    if (m.label) labelled.push({ marker, label: m.label });
  }

  // Ulaanbaatar star
  L.marker([UB.lat, UB.lng], {
    icon: L.divIcon({
      className: "",
      html: '<div class="trm-star">★</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
  })
    .bindTooltip("Ulaanbaatar", {
      permanent: true,
      direction: "bottom",
      offset: [0, 12],
      className: "trm-label trm-label--ub",
    })
    .addTo(layer!);

  map.fitBounds(
    L.latLngBounds(pts.map((p) => [p.lat, p.lng])),
    { padding: [46, 46] },
  );

  applyLabels();
  if (!zoomHooked) {
    map.on("zoomend", applyLabels);
    zoomHooked = true;
  }
}

onMounted(render);

watch(
  () =>
    props.stops
      .map((s) => `${s.day_number}|${s.lat}|${s.lng}|${s.map_label ?? ""}`)
      .join(";"),
  () => nextTick(render),
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  layer = null;
});
</script>

<template>
  <!-- relative z-0 isolates Leaflet's internal z-indexes from the sticky header -->
  <div v-if="enough" class="relative z-0 overflow-hidden rounded-xl border border-slate-200 shadow-card">
    <div ref="el" class="h-[380px] w-full bg-blush sm:h-[480px]" />
  </div>
</template>

<style>
.trm-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: #14436b;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  border: 2.5px solid #fff;
  box-shadow: 0 2px 6px rgba(12, 42, 68, 0.45);
}
.trm-marker--wide {
  font-size: 9.5px;
  letter-spacing: -0.3px;
}
.trm-star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #111111;
  font-size: 30px;
  line-height: 1;
  text-shadow:
    0 0 3px #fff,
    0 0 6px #fff;
}
.trm-plane {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  font-size: 19px;
  color: #14436b;
  text-shadow:
    0 0 3px #fff,
    0 0 5px #fff;
}
.trm-label {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(20, 67, 107, 0.25);
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(12, 42, 68, 0.18);
  color: #14436b;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 8px;
}
.trm-label--ub {
  font-size: 13px;
  color: #111111;
}
.trm-label.leaflet-tooltip-right::before {
  border-right-color: rgba(20, 67, 107, 0.35);
}
.trm-label.leaflet-tooltip-bottom::before {
  border-bottom-color: rgba(20, 67, 107, 0.35);
}
</style>
