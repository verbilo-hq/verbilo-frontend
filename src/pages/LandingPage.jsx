/* ─────────────────────────────────────────────────────────────────────
   Public marketing site (logged-out view).

   The whole site lives under `src/site/` and is rendered inside a single
   `.vsite` wrapper. That wrapper matters: the site ships its own reset,
   design tokens and base utilities, and those are scoped to `.vsite` so
   they can never leak into the authenticated app, which owns its own
   `:root` tokens in `theme/tokens.css`.
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
import { isDemoMode } from "../lib/demoMode.js";

const DEMO_SITE_URL = "https://demo.verbilo.co.uk";

export function LandingPage({ onLoginClick, contactHref = null }) {
  useReveal();

  /* One destination for every "View demo" control on the page.
   * On the public site it links to the demo host; on the demo host itself
   * there is nowhere to link to, so it opens the in-app login instead. */
  const demoCta = isDemoMode()
    ? { href: "#demo", onClick: (e) => { e.preventDefault(); onLoginClick?.(); } }
    : { href: DEMO_SITE_URL };

  return (
    <div className="vsite">
      <a className="skip" href="#main">Skip to content</a>
      <IconSprite />
      <Nav demoCta={demoCta} />
      <main id="main">
        <LaptopScroll scale={1.3} demoCta={demoCta} />
        <LogosSection />
        <FeaturesSection />
        <ComplianceScene />
        <TrainingSection />
        <IntegrationsSection />
        <QuotesScene />
        <PricingSection demoCta={demoCta} />
        <FaqSection />
        <CtaSection demoCta={demoCta} contactHref={contactHref} />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
