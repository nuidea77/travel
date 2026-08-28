import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link
        href={`/blogs/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
      >
        <Image
          src={post.image ?? "/images/hero-steppe.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="img-zoom object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {post.category.name}
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            {formatDate(post.published_at)} · {post.read_time} min
          </span>
        </div>
        <h3 className="mt-2.5 text-lg font-extrabold leading-snug text-slate-900">
          <Link href={`/blogs/${post.slug}`} className="transition-colors group-hover:text-primary-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
        <Link
          href={`/blogs/${post.slug}`}
          className="mt-auto flex items-center gap-2 pt-4 text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
        >
          Read
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary-300 transition-all group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-white">
            <ArrowRight size={13} />
          </span>
        </Link>
      </div>
    </article>
  );
}
