import { Headset } from "lucide-react";
import type { Settings } from "@/lib/types";
import ContactForm from "./ContactForm";

export default function HelpCard({ settings }: { settings: Settings }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-primary-100 p-2.5 text-primary-700">
          <Headset size={22} />
        </span>
        <div>
          <h3 className="font-extrabold text-slate-900">
            Need help planning your vacation?
          </h3>
          <p className="text-xs text-slate-500">
            Real humans in Ulaanbaatar, replying within 24h.
          </p>
        </div>
      </div>
      <div className="mt-5">
        <ContactForm compact />
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Prefer to talk? Call {settings.phone}
      </p>
    </div>
  );
}
