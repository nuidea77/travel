import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import Logo from "./Logo";

type IconProps = { size?: number };

const stroke = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function FacebookIcon({ size = 15 }: IconProps) {
  return (
    <svg {...stroke(size)} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 15 }: IconProps) {
  return (
    <svg {...stroke(size)} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 15 }: IconProps) {
  return (
    <svg {...stroke(size)} aria-hidden>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: IconProps) {
  return (
    <svg {...stroke(size)} aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z" />
    </svg>
  );
}

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Tours",
    links: [
      { label: "All tours", href: "/tours" },
      { label: "Best seller tours", href: "/tours?category=best-seller" },
      { label: "Join a group", href: "/tours?type=join" },
      { label: "Private & tailor-made", href: "/tours?type=private" },
      { label: "Trip calendar", href: "/trip-calendar" },
    ],
  },
  {
    title: "About Mongolia",
    links: [
      { label: "Country guide", href: "/about-mongolia" },
      { label: "Destinations", href: "/about-mongolia#destinations" },
      { label: "Culture & history", href: "/blogs?category=culture-history" },
      { label: "Places to visit", href: "/blogs?category=places-to-visit" },
      { label: "Things to know", href: "/blogs?category=things-to-know" },
    ],
  },
  {
    title: "Travel Tools",
    links: [
      { label: "Travel blog", href: "/blogs" },
      { label: "Travel tips", href: "/blogs?category=travel-tips" },
      { label: "Visa information", href: "/blogs/mongolia-visa-rules-2026" },
      { label: "Packing guide", href: "/blogs/what-to-pack-for-the-gobi" },
      { label: "Best time to travel", href: "/blogs/best-time-to-visit-mongolia" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about-us" },
      { label: "Car rental", href: "/car-rental" },
      { label: "Contact us", href: "/contact" },
      { label: "Booking inquiry", href: "/contact" },
    ],
  },
];

const SOCIAL_ICONS: Record<string, React.ComponentType<IconProps>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
};

export default function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-primary-100">
      <div className="container-site section !pb-10">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Home">
              <Logo name={settings.site_name} light />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-200/80">
              {settings.tagline}. Locally owned and operated in Ulaanbaatar
              since {settings.founded_year}.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                {settings.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-primary-400" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-primary-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-primary-200/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-800/60 pt-6 sm:flex-row">
          <p className="text-xs text-primary-300/70">
            © {settings.legal_name ?? settings.site_name}{" "}
            {settings.founded_year} – {year}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {Object.entries(settings.socials ?? {}).map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key];
              if (!Icon) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="rounded-full bg-primary-800/60 p-2 text-primary-200 transition-colors hover:bg-primary-500 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
