import type { Metadata } from "next";
import { Clock4, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSettings } from "@/lib/api";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to our Ulaanbaatar team about tours, private itineraries, car rental or anything Mongolia.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const items = [
    {
      icon: MapPin,
      title: "Visit us",
      lines: [settings.address],
    },
    {
      icon: Phone,
      title: "Call us",
      lines: [settings.phone, "Mon–Sat, 09:00–18:00 (UTC+8)"],
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      lines: [settings.whatsapp, "Fastest for travelers on the road"],
    },
    {
      icon: Mail,
      title: "Email",
      lines: [settings.email, "We reply within one business day"],
    },
  ];

  return (
    <>
      <PageHero
        title="Contact us"
        subtitle="Real humans in Ulaanbaatar — tell us your dates, dreams and questions."
        image="/images/ulaanbaatar.svg"
      />
      <section className="section !pt-12">
        <div className="container-site grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                <span className="h-fit rounded-xl bg-primary-100 p-2.5 text-primary-700">
                  <item.icon size={20} />
                </span>
                <div>
                  <h2 className="font-extrabold text-slate-900">{item.title}</h2>
                  {item.lines.map((line, i) => (
                    <p
                      key={line}
                      className={i === 0 ? "mt-0.5 text-sm font-semibold text-slate-700" : "text-xs text-slate-500"}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-2xl bg-primary-50 p-5 text-sm text-slate-600">
              <Clock4 size={18} className="shrink-0 text-primary-600" />
              Ulaanbaatar is UTC+8 — we answer overnight requests first thing
              each morning.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card lg:p-9">
            <h2 className="text-2xl font-extrabold text-slate-900">Send a message</h2>
            <p className="mt-1 text-sm text-slate-500">
              Planning a trip? Include rough dates and group size and we&apos;ll
              come back with a draft itinerary.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
