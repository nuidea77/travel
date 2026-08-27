import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock3 } from "lucide-react";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
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
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700">
            {post.category.name}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} /> {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} /> {post.read_time} min read
          </span>
        </div>
        <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug text-slate-900">
          <Link href={`/blogs/${post.slug}`} className="hover:text-primary-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
        <Link
          href={`/blogs/${post.slug}`}
          className="mt-auto pt-4 text-sm font-bold text-primary-600 hover:text-primary-800"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}
