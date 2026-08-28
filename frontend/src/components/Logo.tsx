export default function Logo({
  name = "Nomad Horizons",
  light = false,
}: {
  name?: string;
  light?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden>
        <circle cx="24" cy="24" r="23" className={light ? "fill-primary-500" : "fill-primary-600"} />
        {/* ger silhouette */}
        <path d="M10 32 L13 24 Q24 17 35 24 L38 32 Z" fill="#fff" />
        <rect x="21.5" y="26" width="5" height="6" className={light ? "fill-primary-500" : "fill-primary-600"} />
        <path d="M20 20.5 L24 15 L28 20.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* sun */}
        <circle cx="33.5" cy="13.5" r="3.2" fill="#fbbf24" />
      </svg>
      <span className="leading-tight">
        <span className={`block text-lg font-extrabold uppercase tracking-tight ${light ? "text-white" : "text-primary-700"}`}>
          {name}
        </span>
        <span className={`block text-[11px] italic ${light ? "text-primary-200" : "text-primary-600"}`}>
          Authentic Mongolian Tours
        </span>
      </span>
    </span>
  );
}
