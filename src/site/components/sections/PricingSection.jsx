import { useState } from 'react';
import s from './PricingSection.module.css';
import Icon from '../Icon.jsx';
import Button from '../Button.jsx';

const TIERS = [
  {
    name: 'Practice',
    blurb: 'For single practices wanting compliance handled.',
    monthly: 199,
    annual:  159,
    cta: 'Start 1-month trial',
    ctaHref: '#trial',
    ctaVariant: 'secondary',
    features: [
      'Full product · all features unlocked',
      'Up to 25 staff',
      'CQC policy library + auto-updates',
      '140+ mandatory training modules',
      'Audit packs: IPC, safeguarding, fire, medicines',
      'Email + chat support',
    ],
  },
  {
    name: 'Group',
    blurb: 'For multi-site groups and clinical leads.',
    monthly: 449,
    annual:  379,
    cta: 'Book a demo',
    ctaVariant: 'primary',
    featured: true,
    badge: 'Recommended',
    features: [
      'Unlimited staff across up to 10 sites',
      'Everything in Practice',
      'Custom policies + branded portal',
      'Cross-site analytics & benchmarking',
      'Dedicated onboarding manager',
      'SSO (SAML / OIDC)',
    ],
  },
  {
    name: 'Enterprise',
    blurb: 'For large operators and NHS-aligned providers.',
    monthly: null,
    annual:  null,
    cta: 'Talk to sales',
    ctaVariant: 'secondary',
    features: [
      'Unlimited sites & users',
      'Everything in Group',
      'NHS DSPT mapping & ISO 27001 evidence',
      '99.95% uptime SLA',
      'Procurement-friendly contracting',
      '24/7 priority support',
    ],
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className={`section section--paper-3 ${s.section}`} aria-labelledby="pricing-h">
      <div className="container">
        <header className={s.head}>
          <p className={s.eyebrow}>
            <span className="eyebrow-num">05</span>
            <span className="eyebrow-divider" />
            Pricing
          </p>
          <h2 id="pricing-h" className={s.title}>
            Straightforward pricing. <em>No surprises.</em>
          </h2>
          <p className={s.lead}>
            Every plan includes unlimited audits, unlimited policies, and unlimited evidence storage. You pay for the people, not the paperwork.
          </p>

          <p id="trial" className={s.trialBanner}>
            <span className={s.trialBannerTag}>1 month free</span>
            <span className={s.trialBannerCopy}>
              <strong>No card. No subscription.</strong> Start, explore, decide.
            </span>
          </p>

          <fieldset className={s.toggle} aria-label="Billing cycle">
            <legend className="vh">Choose billing cycle</legend>
            <button
              type="button"
              className={`${s.toggleBtn} ${!annual ? s.toggleBtnOn : ''}`}
              aria-pressed={!annual}
              onClick={() => setAnnual(false)}
            >Monthly</button>
            <button
              type="button"
              className={`${s.toggleBtn} ${annual ? s.toggleBtnOn : ''}`}
              aria-pressed={annual}
              onClick={() => setAnnual(true)}
            >Annual <span className={s.save}>save 20%</span></button>
          </fieldset>
        </header>

        <ul className={s.grid}>
          {TIERS.map((t) => (
            <li key={t.name} className={`${s.tier} ${t.featured ? s.featured : ''}`}>
              {t.badge && <span className={s.badge}>{t.badge}</span>}
              <div className={s.tierHead}>
                <h3 className={s.tierName}>{t.name}</h3>
                <p className={s.tierBlurb}>{t.blurb}</p>
              </div>

              <div className={s.priceRow}>
                {t.monthly == null ? (
                  <>
                    <span className={s.priceCustom}>Custom</span>
                    <span className={s.priceCycle}>tailored to your size</span>
                  </>
                ) : (
                  <>
                    <span className={s.priceCurrency}>£</span>
                    <span className={s.priceVal}>{annual ? t.annual : t.monthly}</span>
                    <span className={s.priceCycle}>/ practice / month{annual ? ', billed annually' : ''}</span>
                  </>
                )}
              </div>

              <Button
                as="a"
                href={t.ctaHref || (t.ctaVariant === 'primary' ? '#demo' : '#contact')}
                variant={t.ctaVariant}
                size="md"
                arrow
                className={s.tierCta}
              >{t.cta}</Button>

              <ul className={s.features}>
                {t.features.map((f) => (
                  <li key={f}><Icon name="check" /><span>{f}</span></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className={s.fineprint}>
          Prices in GBP, exclude VAT. 1-month free trial on every plan — no card, no subscription, no auto-conversion at the end. Keep going if it works for you.
        </p>
      </div>
    </section>
  );
}
