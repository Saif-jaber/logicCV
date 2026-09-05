import Link from "next/link";
import { BrandMark } from "./brand-mark";

const footerLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Build with AI", href: "/dashboard/resumes/new" },
  { label: "My resumes", href: "/dashboard/resumes" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-7 transition-transform duration-200 hover:scale-105" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            logicCV
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; 2026 logicCV. All rights reserved.
        </p>
      </div>
    </footer>
  );
}