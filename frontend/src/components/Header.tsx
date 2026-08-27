"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import type { Settings } from "@/lib/types";
import Logo from "./Logo";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV: NavItem[] = [
  {
    label: "Tours",
    href: "/tours",
    children: [
      { label: "All tours", href: "/tours" },
      { label: "Join a group", href: "/tours?type=join" },
      { label: "Private tours", href: "/tours?type=private" },
      { label: "Best sellers", href: "/tours?category=best-seller" },
      { label: "Naadam Festival", href: "/tours?category=naadam-events" },
      { label: "Winter tours", href: "/tours?category=winter" },
    ],
  },
  {
    label: "About Mongolia",
    href: "/about-mongolia",
    children: [
      { label: "Country guide", href: "/about-mongolia" },
      { label: "Destinations", href: "/about-mongolia#destinations" },
      { label: "Culture & history", href: "/blogs?category=culture-history" },
      { label: "Things to know", href: "/blogs?category=things-to-know" },
    ],
  },
  { label: "Blogs", href: "/blogs" },
  { label: "Trip Calendar", href: "/trip-calendar" },
  { label: "About Us", href: "/about-us" },
  { label: "Car Rental", href: "/car-rental" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: Settings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* top bar */}
      <div className="hidden bg-primary-900 text-primary-50 lg:block">
        <div className="container-site flex items-center justify-between py-1.5 text-xs">
          <p className="font-medium tracking-wide">{settings.tagline}</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone size={13} /> {settings.phone}
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
              className="flex items-center gap-1.5 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail size={13} /> {settings.email}
            </a>
          </div>
        </div>
      </div>

      {/* main nav */}
      <div className="container-site flex items-center justify-between py-3">
        <Link href="/" aria-label="Home">
          <Logo name={settings.site_name} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                >
                  {item.label}
                  <ChevronDown size={14} className="mt-0.5" />
                </Link>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full w-56 pt-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-card">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/tours" className="btn-accent btn-md ml-2">
            Book a tour
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white lg:hidden" aria-label="Mobile">
          <div className="container-site space-y-1 py-4">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-primary-50"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-slate-100 pl-3">
                    {item.children.slice(1).map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-primary-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-3">
              <a href={`tel:${settings.phone}`} className="btn-outline btn-md flex-1">
                <Phone size={15} /> Call
              </a>
              <Link href="/tours" className="btn-accent btn-md flex-1">
                Book a tour
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
