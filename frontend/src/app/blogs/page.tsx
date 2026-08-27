import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPostCategories, getPosts } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Blog",
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

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image src="/images/trans-mongolian.svg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-primary-950/65" />
        <div className="container-site relative py-16 text-center text-white lg:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
            Your Mongolia travel guide
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-50/90">
            Everything we brief our own guests on — visas, packing, festivals,
            food and etiquette — written by the team on the ground.
          </p>
        </div>
      </section>

      <section className="section bg-slate-50 !pt-10">
        <div className="container-site">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            <Link
              href="/blogs"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                !activeCategory
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-600 shadow-sm hover:bg-primary-50"
              }`}
            >
              All articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blogs?category=${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-primary-600 text-white"
                    : "bg-white text-slate-600 shadow-sm hover:bg-primary-50"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">{cat.posts_count}</span>
              </Link>
            ))}
          </div>

          {posts.data.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-14 text-center shadow-card">
              <p className="text-lg font-bold text-slate-800">No articles found</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
