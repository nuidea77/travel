import Image from "next/image";

export default function PageHero({
  title,
  subtitle,
  image = "/images/hero-steppe.svg",
}: {
  title: string;
  subtitle?: string | null;
  image?: string | null;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={image ?? "/images/hero-steppe.svg"} alt="" fill className="object-cover" aria-hidden />
      <div className="absolute inset-0 bg-primary-950/65" />
      <div className="container-site relative py-16 text-center text-white lg:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-primary-50/90">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
