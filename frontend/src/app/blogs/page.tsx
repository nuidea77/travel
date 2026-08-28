import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPostCategories, getPosts } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Mongolia travel tips, destination guides, Naadam news and cultural know-how from a local team of guides.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = new URLSearchParams();
  for (const key of ["category", "search", "page"]) {
    const value = searchParams[key];
    if (typeof value === "string" && value) params.set(key, value);
  }

  const [posts, categories] = await Promise.all([
    getPosts(params),
    getPostCategories(),
  ]);
  const activeCategory =
    typeof searchParams.category === "string" ? searchParams.category : "";
  const isFirstUnfilteredPage = !activeCategory && posts.current_page === 1;
  const [featured, ...rest] = posts.data;

  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="container-site py-10 lg:py-14">
          <Breadcrumb items={[{ label: "Blogs" }]} />
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Blogs
          </h1>
          <p className="mt-3 text-slate-500">
            It is a land where you can experience wide-open spaces.
          </p>
        </div>
      </section>

      <section className="section !pt-8">
        <div className="container-site">
          {/* category pills */}
          <div className="no-scrollbar mb-8 flex gap-1.5 overflow-x-auto rounded-full bg-slate-100 p-1.5">
            <Link
              href="/blogs"
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                !activeCategory
                  ? "bg-primary-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-primary-700"
              }`}
            >
              All articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blogs?category=${cat.slug}`}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-primary-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-primary-700"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {posts.data.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-14 text-center">
              <p className="text-lg font-extrabold text-slate-800">No articles found</p>
            </div>
          ) : isFirstUnfilteredPage && featured ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {/* featured card spans 2 cols */}
              <Link
                href={`/blogs/${featured.slug}`}
                className="group relative block overflow-hidden rounded-xl sm:col-span-2 sm:row-span-1"
              >
                <div className="relative min-h-[280px] sm:min-h-[340px]">
                  <Image
                    src={featured.image ?? "/images/hero-steppe.svg"}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="img-zoom object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  {featured.category && (
                    <span className="absolute left-5 top-5 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                      {featured.category.name}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2 className="max-w-2xl text-2xl font-extrabold leading-snug text-white lg:text-3xl">
                      {featured.title}
                    </h2>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white">
                      Read more
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-slate-900">
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={posts.current_page}
            lastPage={posts.last_page}
            basePath="/blogs"
            searchParams={searchParams}
          />
        </div>
      </section>
    </>
  );
}
