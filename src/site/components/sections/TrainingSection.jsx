import s from './TrainingSection.module.css';
import Icon from '../Icon.jsx';
import Button from '../Button.jsx';

const COURSES = [
  { code: 'IPC',     title: 'Infection Prevention & Control',   minutes: 45, status: 'complete'  },
  { code: 'SG-L1',   title: 'Safeguarding Adults — Level 1',    minutes: 30, status: 'complete'  },
  { code: 'BLS',     title: 'Basic Life Support',               minutes: 90, status: 'in-progress', pct: 64 },
  { code: 'FIRE',    title: 'Fire Safety — Annual Refresher',   minutes: 25, status: 'due', dueIn: 12 },
  { code: 'GDPR',    title: 'Data Protection in Practice',      minutes: 35, status: 'overdue' },
];

const STATUS = {
  'complete':    { tone: 'ok',    label: 'Complete'     },
  'in-progress': { tone: 'live',  label: 'In progress'  },
  'due':         { tone: 'warn',  label: 'Due soon'     },
  'overdue':     { tone: 'alert', label: 'Overdue'      },
};

export default function TrainingSection() {
  return (
    <section id="training" className={`section section--surface ${s.section}`} aria-labelledby="training-h">
      <div className="container">
        <div className={s.grid}>
          <div className={s.copy}>
            <p className={s.eyebrow}>
              <span className="eyebrow-num">03</span>
              <span className="eyebrow-divider" />
              Training
            </p>
            <h2 id="training-h" className={s.title}>
              CPD that <em>actually gets done.</em>
            </h2>
            <p className={s.lead}>
              We track every course, every certificate, every expiry — so the only thing your team has to think about is the learning itself. Managers get one dashboard. Staff get one inbox. Inspectors get a complete record.
            </p>

            <ul className={s.bullets}>
              <li><Icon name="check" /><span>Pre-built library of <strong>140+ healthcare-specific</strong> CPD modules</span></li>
              <li><Icon name="check" /><span>Auto-assignment by role — new starters land into the right pathway</span></li>
              <li><Icon name="check" /><span>Certificates filed straight into the staff record. Audit-ready.</span></li>
              <li><Icon name="check" /><span>SCORM &amp; Tin-Can support — bring your own courses if you want to</span></li>
            </ul>

            <div className={s.actions}>
              <Button href="#demo" variant="primary" arrow>Book a training demo</Button>
              <Button href="#features" variant="link" arrow>See full course catalogue</Button>
            </div>
          </div>

          <div className={s.preview} aria-hidden="true">
            <div className={s.previewChrome}>
              <span className={s.dot} /><span className={s.dot} /><span className={s.dot} />
              <span className={s.urlBar}>verbilo.app / training</span>
            </div>
            <div className={s.previewBody}>
              <div className={s.previewHead}>
                <div>
                  <p className={s.previewKicker}>This week</p>
                  <p className={s.previewH}>Mandatory training</p>
                </div>
                <div className={s.previewProgress}>
                  <span className={s.previewProgressNum}>87<small>%</small></span>
                  <span className={s.previewProgressLabel}>team compliant</span>
                </div>
              </div>
              <ul className={s.courseList}>
                {COURSES.map((c) => {
                  const meta = STATUS[c.status];
                  return (
                    <li key={c.code} className={s.course}>
                      <span className={s.courseCode}>{c.code}</span>
                      <div className={s.courseMeta}>
                        <span className={s.courseTitle}>{c.title}</span>
                        <span className={s.courseSub}>
                          {c.status === 'in-progress' ? `${c.pct}% complete · ${c.minutes} min` :
                           c.status === 'due'         ? `Due in ${c.dueIn} days · ${c.minutes} min` :
                           c.status === 'overdue'     ? `Was due last week · ${c.minutes} min` :
                                                       `${c.minutes} min · auto-filed`}
                        </span>
                      </div>
                      <span className={`${s.badge} ${s[`tone-${meta.tone}`]}`}>
                        <span className={s.badgeDot} />
                        {meta.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
