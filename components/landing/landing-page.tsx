import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingSections } from "./landing-sections";
import { LandingFooter } from "./landing-footer";
import { AuthModalProvider } from "./auth-modal";

export function LandingPage() {
  return (
    <AuthModalProvider>
      <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
        <LandingNav />
        <main>
          <LandingHero />
          <LandingSections />
        </main>
        <LandingFooter />
      </div>
    </AuthModalProvider>
  );
}