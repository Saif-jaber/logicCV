import { cn } from "@/lib/utils";

export type DocumentPreviewTone = "gray" | "orange";

type DocumentPreviewProps = {
  tone?: DocumentPreviewTone;
  className?: string;
};

const palettes = {
  gray: {
    avatar: "#D1D5DB",
    heading: "#9CA3AF",
    subline: "#D1D5DB",
    rule: "#E5E7EB",
    section: "#D1D5DB",
    row: "#E5E7EB",
  },
  orange: {
    avatar: "#FDBA74",
    heading: "#FB923C",
    subline: "#FDBA74",
    rule: "#FED7AA",
    section: "#FDBA74",
    row: "#FED7AA",
  },
} as const;

export function DocumentPreview({
  tone = "gray",
  className,
}: DocumentPreviewProps) {
  const palette = palettes[tone];

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center p-4",
        tone === "orange" ? "bg-orange-100" : "bg-gray-100",
        className
      )}
    >
      <svg
        viewBox="0 0 160 200"
        className="h-full max-h-52 w-full"
        aria-hidden="true"
      >
        <circle cx="40" cy="32" r="12" fill={palette.avatar} />
        <rect x="60" y="24" width="64" height="8" rx="4" fill={palette.heading} />
        <rect x="60" y="37" width="40" height="6" rx="3" fill={palette.subline} />
        <rect x="28" y="60" width="104" height="2" rx="1" fill={palette.rule} />
        <rect x="28" y="76" width="52" height="7" rx="3.5" fill={palette.section} />
        <rect x="28" y="92" width="104" height="7" rx="3.5" fill={palette.row} />
        <rect x="28" y="104" width="88" height="7" rx="3.5" fill={palette.row} />
        <rect x="28" y="116" width="96" height="7" rx="3.5" fill={palette.row} />
        <rect x="28" y="132" width="64" height="7" rx="3.5" fill={palette.section} />
        <rect x="28" y="148" width="104" height="7" rx="3.5" fill={palette.row} />
        <rect x="28" y="160" width="76" height="7" rx="3.5" fill={palette.row} />
      </svg>
    </div>
  );
}