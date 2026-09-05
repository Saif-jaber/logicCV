export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      role="img"
      aria-label="logicCV logo"
      className={className}
    >
      <defs>
        <linearGradient id="brand-mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="56" height="56" rx="14" fill="url(#brand-mark-bg)" />
      <path
        d="M23 10h14a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H23a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z"
        fill="#ffffff"
      />
      <path d="M37 10l8 8h-8z" fill="#bfdbfe" />
      <rect x="19" y="23" width="18" height="3" rx="1.5" fill="#93c5fd" />
      <rect x="19" y="30" width="13" height="3" rx="1.5" fill="#93c5fd" />
      <path
        d="M21 37l4 4 8-8"
        fill="none"
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}