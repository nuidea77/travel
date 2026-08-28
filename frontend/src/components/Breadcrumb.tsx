import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

export default function Breadcrumb({
  items,
  light = false,
}: {
  items: { label: string; href?: string }[];
  light?: boolean;
}) {
  const base = light ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-slate-700";
  const current = light ? "text-white/90" : "text-slate-600";

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold">
      <Link href="/" className={base} aria-label="Home">
        <House size={13} />
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight size={12} className={light ? "text-white/50" : "text-slate-300"} />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className={base}>
              {item.label}
            </Link>
          ) : (
            <span className={current}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
