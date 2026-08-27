import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src="/images/gobi-dunes.svg" alt="" fill className="object-cover" aria-hidden />
      <div className="absolute inset-0 bg-primary-950/70" />
      <div className="container-site relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center text-white">
        <p className="text-7xl font-extrabold text-accent-400">404</p>
        <h1 className="mt-3 text-2xl font-extrabold lg:text-3xl">
          You&apos;ve wandered off the trail
        </h1>
        <p className="mt-2 max-w-md text-primary-50/85">
          Even our best guides can&apos;t find this page. The steppe is vast —
          let&apos;s get you back to camp.
        </p>
        <div className="mt-7 flex gap-4">
          <Link href="/" className="btn-accent btn-md">
            Back to home
          </Link>
          <Link href="/tours" className="btn btn-md border-2 border-white/70 text-white hover:bg-white/10">
            Browse tours
          </Link>
        </div>
      </div>
    </section>
  );
}
