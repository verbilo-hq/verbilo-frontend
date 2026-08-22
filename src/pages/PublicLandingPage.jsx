/* ─────────────────────────────────────────────────────────────────────
   Public marketing site (surface === "public").

   The site lives under `src/site/` and renders inside a single `.vsite`
   wrapper. That wrapper is load-bearing: the site ships its own reset,
   design tokens and base utilities, and they are scoped to `.vsite` so
   they can never leak into the tenant or admin surfaces, which own their
   own `:root` tokens.
   ───────────────────────────────────────────────────────────────────── */

import "../site/styles/reset.css";
import "../site/styles/tokens.css";
import "../site/styles/base.css";

import IconSprite from "../site/components/IconSprite.jsx";
import Nav from "../site/components/Nav.jsx";
import Footer from "../site/components/Footer.jsx";
import LaptopScroll from "../site/components/LaptopScroll.jsx";
import ComplianceScene from "../site/components/scenes/ComplianceScene.jsx";
import QuotesScene from "../site/components/scenes/QuotesScene.jsx";
import LogosSection from "../site/components/sections/LogosSection.jsx";
import FeaturesSection from "../site/components/sections/FeaturesSection.jsx";
import TrainingSection from "../site/components/sections/TrainingSection.jsx";
import IntegrationsSection from "../site/components/sections/IntegrationsSection.jsx";
import PricingSection from "../site/components/sections/PricingSection.jsx";
import FaqSection from "../site/components/sections/FaqSection.jsx";
import CtaSection from "../site/components/sections/CtaSection.jsx";
import useReveal from "../site/hooks/useReveal.js";

export const PublicLandingPage = () => {
  useReveal();

  return (
    <div className="vsite">
      <a className="skip" href="#main">Skip to content</a>
      <IconSprite />
      <Nav />
      <main id="main">
        <LaptopScroll scale={1.3} />
        <LogosSection />
        <FeaturesSection />
        <ComplianceScene />
        <TrainingSection />
        <IntegrationsSection />
        <QuotesScene />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLandingPage;
