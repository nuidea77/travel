import type { Settings } from "@/lib/types";
import ContactForm from "./ContactForm";

export default function HelpCard({ settings }: { settings: Settings }) {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-50 shadow-card">
      <div className="bg-primary-700 px-6 py-4">
        <h3 className="font-extrabold text-white">Need Help Planning Your Vacation?</h3>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-600">
          Our friendly local experts will respond to your request with
          lightning speed.
        </p>
        <div className="mt-4">
          <ContactForm compact />
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Prefer to talk? Call {settings.phone}
        </p>
      </div>
    </div>
  );
}
