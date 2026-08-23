import { useState } from 'react';
import s from './FaqSection.module.css';
import Icon from '../Icon.jsx';
import Button from '../Button.jsx';

const FAQS = [
  {
    q: 'What does the 1-month free trial actually include?',
    a: 'The full product. Every feature on the Practice plan, unlocked, with no caps on policies, audits, training assignments, or storage. We import your staff records and configure your policy library before you start. No card, no subscription — when the month ends, nothing auto-bills and nothing auto-cancels. You decide.',
  },
  {
    q: 'How long does Verbilo take to set up?',
    a: 'We aim to have any new practice running within a week. Your onboarding contact imports your staff records, configures your policy library, and runs a one-hour walkthrough with your team. After that, the system runs itself.',
  },
  {
    q: 'Is Verbilo CQC-compliant?',
    a: 'Verbilo is built around CQC’s five Key Lines of Enquiry. Every policy, audit, and training record is mapped to the relevant KLOE so you can produce a complete evidence pack on demand. We also support GDC, GMC, NMC, and NHS DSPT frameworks.',
  },
  {
    q: 'Can we bring our own policies and courses?',
    a: 'Yes. Upload your existing policies (Word, PDF, HTML) and we’ll version-control them alongside our standard library. For training, we support SCORM 1.2 and Tin-Can / xAPI courses out of the box.',
  },
  {
    q: 'Where is our data stored?',
    a: 'All customer data lives on UK-based AWS infrastructure (eu-west-2). Verbilo is GDPR-aligned, ISO 27001-mapped, and signed up to the NHS Data Security and Protection Toolkit. We sign a Data Processing Agreement with every customer.',
  },
  {
    q: 'What happens if we want to leave?',
    a: 'You own your data. At any time you can export a full archive of your policies, audits, certificates, and staff records in standard formats. No lock-in clauses, no exit fees.',
  },
  {
    q: 'Do you offer NHS-aligned procurement?',
    a: 'Yes. Verbilo is available through G-Cloud and Health Systems Support Framework. Reach out to our enterprise team for a procurement-friendly contract and DPIA documentation.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen((cur) => (cur === i ? -1 : i));

  return (
    <section id="faq" className={`section ${s.section}`} aria-labelledby="faq-h">
      <div className={`container container--tight ${s.inner}`}>
        <header className={s.head}>
          <p className={s.eyebrow}>
            <span className="eyebrow-num">06</span>
            <span className="eyebrow-divider" />
            Frequently asked
          </p>
          <h2 id="faq-h" className={s.title}>
            Questions, <em>answered straight.</em>
          </h2>
          <p className={s.lead}>
            Still need a hand? Our team replies in under an hour during UK business hours.
          </p>
        </header>

        <ul className={s.list}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`${s.item} ${isOpen ? s.itemOpen : ''}`}>
                <button
                  type="button"
                  className={s.q}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span>{f.q}</span>
                  <span className={s.qIcon} aria-hidden="true">
                    <Icon name={isOpen ? 'minus' : 'plus'} />
                  </span>
                </button>
                <div
                  id={`faq-a-${i}`}
                  className={s.aWrap}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <p className={s.a}>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={s.footer}>
          <p>Have a more specific question?</p>
          <Button href="mailto:hello@verbilo.app" variant="link" arrow>Email our team</Button>
        </div>
      </div>
    </section>
  );
}
