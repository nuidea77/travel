import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, User } from "lucide-react";
import { getPost } from "@/lib/api";
import BlogCard, { formatDate } from "@/components/BlogCard";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <article>
        <header className="relative isolate overflow-hidden">
          <Image
            src={post.image ?? "/images/hero-steppe.svg"}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/45 to-primary-950/30" />
          <div className="container-site relative pb-14 pt-24 text-white lg:pb-20 lg:pt-32">
            {post.category && (
              <Link
                href={`/blogs?category=${post.category.slug}`}
                className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur hover:bg-white/25"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-primary-50/90">
              <span className="flex items-center gap-1.5">
                <User size={15} /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} /> {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={15} /> {post.read_time} min read
              </span>
            </div>
          </div>
        </header>

        <div className="container-site section !pt-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-lg font-medium leading-relaxed text-slate-700">
              {post.excerpt}
            </p>
            <div
              className="prose-site mt-8"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
            <div className="mt-12 rounded-2xl bg-primary-50 p-7 text-center">
              <h2 className="text-xl font-extrabold text-slate-900">
                Ready to see it for yourself?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Our team turns articles like this into real itineraries every day.
              </p>
              <Link href="/tours" className="btn-primary btn-md mt-5">
                Browse Mongolia tours
              </Link>
            </div>
          </div>
        </div>
      </article>

      {post.related && post.related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-site">
            <SectionHeading eyebrow="Keep reading" title="Related articles" />
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {post.related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
