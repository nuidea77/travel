/** Generic circular "Travellers' Choice"-style award medallion. */
export default function AwardBadge({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Travellers' Choice award 2025"
      className="drop-shadow-lg"
    >
      <circle cx="60" cy="60" r="58" fill="#00aa6c" />
      <circle cx="60" cy="60" r="58" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" />
      {/* laurel branches */}
      {[-1, 1].map((dir) => (
        <g key={dir} transform={`translate(60 62) scale(${dir} 1)`} fill="#ffffff" opacity="0.95">
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = -35 + i * 21;
            return (
              <ellipse
                key={i}
                cx="0"
                cy="0"
                rx="3.1"
                ry="7.5"
                transform={`rotate(${angle}) translate(0 -37)`}
              />
            );
          })}
        </g>
      ))}
      <text
        x="60"
        y="48"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="1"
        fontFamily="system-ui, sans-serif"
      >
        TRAVELLERS&apos;
      </text>
      <text
        x="60"
        y="60"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="1.6"
        fontFamily="system-ui, sans-serif"
      >
        CHOICE
      </text>
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="15"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        2025
      </text>
    </svg>
  );
}
