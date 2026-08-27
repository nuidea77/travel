export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={`mb-10 max-w-2xl lg:mb-14 ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <p
          className={`mb-3 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] ${
            align === "center" ? "justify-center" : ""
          } ${light ? "text-accent-400" : "text-primary-600"}`}
        >
          <span className={`h-px w-8 ${light ? "bg-accent-400/60" : "bg-primary-400"}`} />
          {eyebrow}
          {align === "center" && (
            <span className={`h-px w-8 ${light ? "bg-accent-400/60" : "bg-primary-400"}`} />
          )}
        </p>
      )}
      <h2
        className={`font-display text-3xl font-semibold tracking-tight lg:text-[2.6rem] lg:leading-[1.15] ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-primary-100/80" : "text-slate-600"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
