"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import type { Settings } from "@/lib/types";
import Logo from "./Logo";

type NavGroup = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV: NavGroup[] = [
  {
    label: "Tours",
    href: "/tours",
    children: [
      { label: "All tours", href: "/tours" },
      { label: "Best seller tours", href: "/tours?category=best-seller" },
      { label: "Join in tours", href: "/tours?type=join" },
      { label: "Tailor made tours", href: "/tours?type=private" },
      { label: "Trip calendar", href: "/trip-calendar" },
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
  {
    label: "Blogs",
    href: "/blogs",
    children: [
      { label: "All articles", href: "/blogs" },
      { label: "Travel tips", href: "/blogs?category=travel-tips" },
      { label: "Places to visit", href: "/blogs?category=places-to-visit" },
      { label: "News & events", href: "/blogs?category=news-events" },
    ],
  },
  { label: "Trip Calendar", href: "/trip-calendar" },
  { label: "About Us", href: "/about-us" },
  { label: "Car Rental", href: "/car-rental" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waLink = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="container-site grid grid-cols-[1fr_auto_1fr] items-center py-2.5">
        <button
          onClick={() => setOpen(true)}
          className="flex w-fit items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold uppercase tracking-wide text-slate-800 transition-colors hover:bg-slate-100"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={20} />
          <span className="hidden sm:inline">Menu</span>
        </button>

        <Link href="/" aria-label="Home" className="justify-self-center">
          <Logo name={settings.site_name} />
        </Link>

        <div className="flex items-center justify-end">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp btn-sm sm:btn-md !gap-2"
          >
            <MessageCircle size={16} />
            <span className="hidden md:inline">Chat with us on WhatsApp</span>
            <span className="md:hidden">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* drawer */}
      {open && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[92%] max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <Logo name={settings.site_name} />
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 px-6 py-5" aria-label="Main">
              {NAV.map((group) => (
                <div key={group.label} className="border-b border-slate-100 py-3 last:border-0">
                  <Link
                    href={group.href}
                    className="block text-[15px] font-extrabold uppercase tracking-wide text-slate-900 transition-colors hover:text-primary-700"
                  >
                    {group.label}
                  </Link>
                  {group.children && (
                    <div className="mt-2 grid grid-cols-2 gap-x-4">
                      {group.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="rounded py-1.5 text-sm text-slate-500 transition-colors hover:text-primary-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="space-y-2.5 border-t border-slate-100 bg-slate-50 px-6 py-5 text-sm">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 font-semibold text-slate-700 hover:text-primary-700">
                <Phone size={15} className="text-primary-700" /> {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 font-semibold text-slate-700 hover:text-primary-700">
                <Mail size={15} className="text-primary-700" /> {settings.email}
              </a>
              <a href={waLink} target="_blank" rel="noreferrer" className="btn-whatsapp btn-md mt-2 w-full">
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
