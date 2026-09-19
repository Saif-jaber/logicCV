import Link from "next/link";
import { BrandMark } from "./brand-mark";

const footerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Wall of love", href: "#wall-of-love" },
];

export function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer__inner">
          <span className="inline-flex items-center gap-2">
            <BrandMark className="size-5" />
            © 2026 logicCV
          </span>
          <nav className="lp-footer__links" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="lp-focus">
                {link.label}
              </Link>
            ))}
          </nav>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}