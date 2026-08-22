import s from './IntegrationsSection.module.css';
import Icon from '../Icon.jsx';

const INTEGRATIONS = [
  { name: 'Microsoft 365', icon: 'doc',       tone: 'cyan'   },
  { name: 'Google Workspace', icon: 'folder', tone: 'green'  },
  { name: 'Slack',         icon: 'message',   tone: 'purple' },
  { name: 'SharePoint',    icon: 'layers',    tone: 'blue'   },
  { name: 'iAuditor',      icon: 'clipboard', tone: 'amber'  },
  { name: 'BambooHR',      icon: 'users',     tone: 'teal'   },
  { name: 'Single sign-on (SAML / OIDC)', icon: 'lock', tone: 'slate' },
  { name: 'Webhooks & REST API', icon: 'zap', tone: 'pink'   },
];

export default function IntegrationsSection() {
  return (
    <section className={`section section--tight ${s.section}`} aria-labelledby="integrations-h">
      <div className="container">
        <header className={s.head}>
          <p className={s.eyebrow}>
            <span className="eyebrow-num">04</span>
            <span className="eyebrow-divider" />
            Integrations
          </p>
          <h2 id="integrations-h" className={s.title}>
            Plays nicely with <em>the tools you already trust.</em>
          </h2>
        </header>
        <ul className={s.grid}>
          {INTEGRATIONS.map((it) => (
            <li key={it.name} className={s.item}>
              <span className={`${s.icon} ${s[`tone-${it.tone}`]}`}>
                <Icon name={it.icon} />
              </span>
              <span className={s.name}>{it.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
