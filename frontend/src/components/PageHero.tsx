import Image from "next/image";
import Breadcrumb from "./Breadcrumb";

export default function PageHero({
  title,
  subtitle,
  image = "/images/hero-steppe.svg",
  breadcrumb,
}: {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  breadcrumb?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image src={image ?? "/images/hero-steppe.svg"} alt="" fill className="object-cover opacity-90" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/60" />
      <div className="container-site relative py-16 text-white lg:py-24">
        <Breadcrumb light items={[{ label: breadcrumb ?? title }]} />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl leading-relaxed text-white/85">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
