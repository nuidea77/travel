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

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          className="rounded-full border-2 border-slate-200 p-2 text-slate-500 hover:border-primary-600 hover:text-primary-700"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
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
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              item === currentPage
                ? "bg-primary-600 text-white"
                : "text-slate-600 hover:bg-primary-50"
            }`}
          >
            {item}
          </Link>
        ),
      )}
      {currentPage < lastPage && (
        <Link
          href={hrefFor(currentPage + 1)}
          className="rounded-full border-2 border-slate-200 p-2 text-slate-500 hover:border-primary-600 hover:text-primary-700"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
