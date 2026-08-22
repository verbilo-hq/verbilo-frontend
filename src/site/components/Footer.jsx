import s from './Footer.module.css';
import Brand from './Brand.jsx';
import Icon from './Icon.jsx';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features',     href: '#features'    },
      { label: 'Compliance',   href: '#compliance'  },
      { label: 'Training',     href: '#training'    },
      { label: 'Integrations', href: '#features'    },
      { label: 'Pricing',      href: '#pricing'     },
      { label: 'Changelog',    href: '#changelog'   },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',     href: '#about'     },
      { label: 'Principles', href: '#principles' },
      { label: 'Careers',   href: '#careers'   },
      { label: 'Press kit', href: '#press'     },
      { label: 'Contact',   href: 'mailto:hello@verbilo.app' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog',         href: '#blog'    },
      { label: 'Help centre',  href: '#faq'     },
      { label: 'Security',     href: '#security' },
      { label: 'Status',       href: '#status'  },
      { label: 'API docs',     href: '#docs'    },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy',  href: '#privacy' },
      { label: 'Terms',    href: '#terms'   },
      { label: 'DPA',      href: '#dpa'     },
      { label: 'Cookies',  href: '#cookies' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>
          <div className={s.brandCol}>
            <Brand />
            <p className={s.tagline}>
              The modern intranet platform for healthcare teams who care about doing things properly.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className={s.col}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={s.bottom}>
          <span className={s.copy}>© 2026 BrainPower Technologies Ltd</span>
          <div className={s.legal}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
          <div className={s.social}>
            <a href="#" aria-label="Twitter / X"><Icon name="tw" /></a>
            <a href="#" aria-label="LinkedIn"><Icon name="li" /></a>
            <a href="#" aria-label="GitHub"><Icon name="gh" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
