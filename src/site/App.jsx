import IconSprite from './components/IconSprite.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import LaptopScroll from './components/LaptopScroll.jsx';
import ComplianceScene from './components/scenes/ComplianceScene.jsx';
import QuotesScene from './components/scenes/QuotesScene.jsx';
import LogosSection from './components/sections/LogosSection.jsx';
import FeaturesSection from './components/sections/FeaturesSection.jsx';
import TrainingSection from './components/sections/TrainingSection.jsx';
import IntegrationsSection from './components/sections/IntegrationsSection.jsx';
import PricingSection from './components/sections/PricingSection.jsx';
import FaqSection from './components/sections/FaqSection.jsx';
import CtaSection from './components/sections/CtaSection.jsx';
import useReveal from './hooks/useReveal.js';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <IconSprite />
      <Nav />
      <main id="main">
        <LaptopScroll scale={0.85} />
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
    </>
  );
}
