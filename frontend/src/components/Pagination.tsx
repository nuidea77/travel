import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  lastPage,
  basePath,
  searchParams,
}: {
  currentPage: number;
  lastPage: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (lastPage <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "string" && key !== "page") params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1,
  );

  const items: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("…");
    items.push(p);
  });

  const navCls =
    "flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-primary-700 hover:text-primary-700";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={hrefFor(currentPage - 1)} className={navCls} aria-label="Previous page">
          <ChevronLeft size={15} />
        </Link>
      )}
      {items.map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition-colors ${
              item === currentPage
                ? "bg-primary-700 text-white shadow-sm"
                : "border border-slate-200 text-slate-600 hover:border-primary-700 hover:text-primary-700"
            }`}
          >
            {item}
          </Link>
        ),
      )}
      {currentPage < lastPage && (
        <Link href={hrefFor(currentPage + 1)} className={navCls} aria-label="Next page">
          <ChevronRight size={15} />
        </Link>
      )}
    </nav>
  );
}
