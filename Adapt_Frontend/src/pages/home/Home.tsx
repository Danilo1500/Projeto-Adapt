import { ModernHeader } from "./components/ModernHeader";
import { ModernHeroSection } from "./components/ModernHeroSection";
import { ModernBenefits } from "./components/ModernBenefits";
import { ModernHowItWorks } from "./components/ModernHowItWorks";
import { ModernCategories } from "./components/ModernCategories";
import { ModernTestimonials } from "./components/ModernTestimonials";
import { ModernCTA } from "./components/ModernCTA";
import { ModernFooter } from "./components/ModernFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ModernHeader />
      <main>
        <ModernHeroSection />
        <ModernBenefits />
        <ModernHowItWorks />
        <ModernCategories />
        <ModernTestimonials />
        <ModernCTA />
      </main>
      <ModernFooter />
    </div>
  );
}
