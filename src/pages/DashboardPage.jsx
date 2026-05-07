import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import styles from "./DashboardPage.module.css";

/* ─── Group Update content ─── */
const groupUpdates = [
  {
    id: 1,
    type: "video",
    tag: "Coffee With...",
    title: "Coffee with Dr. Sarah Jenkins",
    desc: "Sarah talks about transitioning from associate to partner, managing a mixed NHS/private list, and what she loves most about working at Inspire Dental.",
    host: "Dr. Sarah Jenkins",
    role: "Dentist · London Flagship",
    date: "2 May 2026",
    duration: "12 min",
    color: "#006974",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 2,
    type: "news",
    tag: "Group Update",
    title: "Inspire Acquires Third Practice in Manchester",
    desc: "We're pleased to announce the acquisition of Deansgate Dental, expanding our network to Greater Manchester. The practice joins Inspire from June 2026.",
    host: "Mark Thompson",
    role: "Group Practice Manager",
    date: "28 Apr 2026",
    color: "#9C27B0",
    body: `Inspire Dental Group is delighted to confirm the acquisition of Deansgate Dental, a well-established mixed NHS and private practice in Manchester city centre. The practice, which has served the Deansgate community for over 15 years, will join the Inspire network from 1 June 2026.\n\nDeansgate Dental brings a skilled team of three associates and two dental nurses, a fully digitalised workflow including intraoral scanning, and an excellent CQC rating of Good across all five domains.\n\nThis acquisition marks a significant step in Inspire's growth strategy, extending our footprint to Greater Manchester and bringing our total number of practices to three. The existing team will be supported through our full onboarding programme, and all patients will continue to be seen without disruption to their care.\n\nFurther details on integration timelines and team introductions will follow over the coming weeks. We are thrilled to welcome the Deansgate team to the Inspire family.\n\n— Mark Thompson, Group Practice Manager`,
  },
  {
    id: 3,
    type: "video",
    tag: "Year in Review",
    title: "Group Results 2025 — A Message from the Directors",
    desc: "Record patient satisfaction scores, three new associates, and ambitious plans for 2026. The leadership team reflects on a landmark year for Inspire.",
    host: "Inspire Leadership Team",
    role: "",
    date: "10 Jan 2026",
    duration: "8 min",
    color: "#E91E63",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];

/* ─── Tip of the Day ─── */
const TIP_CFG = {
  "Clinical":     { color: "#f57c00", bg: "rgba(245,124,0,0.08)"   },
  "Compliance":   { color: "#c62828", bg: "rgba(198,40,40,0.08)"   },
  "Patient Care": { color: "#2e7d32", bg: "rgba(46,125,50,0.08)"   },
  "CPD":          { color: "#1565c0", bg: "rgba(21,101,192,0.08)"  },
  "Team":         { color: "#6a1b9a", bg: "rgba(106,27,154,0.08)"  },
};

const TIPS = [
  { category: "Clinical",     tip: "The maximum safe dose of lidocaine 2% with 1:80,000 adrenaline is 4.4 mg/kg, up to 300 mg — approximately 8 cartridges for a 70 kg adult. Always calculate before treating medically complex patients." },
  { category: "Compliance",   tip: "Radiograph justification must be documented before taking an X-ray, not retrospectively. A clear clinical indication referenced against selection criteria is required — 'routine' alone is insufficient." },
  { category: "Patient Care", tip: "Tell-show-do is more effective than verbal reassurance alone for anxious patients. Narrating each step before you do it significantly reduces the startle response and builds trust." },
  { category: "CPD",          tip: "GDC requirement: 100 verifiable CPD hours over 5 years, with at least 10 in the first 2-year period. Check your hours are on track — the CPD Hub lets you log and track progress." },
  { category: "Team",         tip: "A quick team brief at the start of each session — flagging complex patients, equipment issues, or staffing gaps — reduces in-session stress for everyone and is a hallmark of a well-run practice." },
  { category: "Clinical",     tip: "Articaine 4% provides more reliable anaesthesia for mandibular buccal infiltrations than lidocaine — a useful option when inferior alveolar nerve blocks are insufficient for lower posteriors." },
  { category: "Compliance",   tip: "The Bowie-Dick test must be run daily on first use of a porous-load autoclave before any instruments are processed. Record the result and retain the test sheet." },
  { category: "Patient Care", tip: "When presenting a treatment plan, lead with the patient's concern, then explain the clinical need, then discuss options. Patients who feel heard are significantly more likely to accept treatment." },
  { category: "CPD",          tip: "Completing a Significant Event Analysis (SEA) after an incident counts as verifiable CPD. Document what happened, what you learned, and what changed — it improves safety and fulfils a CPD requirement." },
  { category: "Team",         tip: "Near-miss reporting is one of the most powerful safety tools in dentistry. An incident that was caught in time is just as worth recording as one that wasn't — the learning is identical." },
  { category: "Clinical",     tip: "BPE codes 3 and 4 require a full 6-point periodontal chart before finalising a treatment plan. This is a GDC standards requirement — not optional clinical practice." },
  { category: "Compliance",   tip: "Clinical waste must be segregated correctly: sharps in yellow-lidded containers, soft clinical waste in yellow bags, amalgam separately. Mixing waste streams is a breach of HTM 07-01." },
  { category: "Patient Care", tip: "Informed consent is a process, not a signature. Ensure patients understand the nature, purpose, risks, and alternatives before signing. One conversation may not be sufficient for complex treatment." },
  { category: "CPD",          tip: "SDCEP's 'Drug Prescribing for Dentistry' (2016) is freely available online and covers all common antibiotic and analgesic scenarios. Worth bookmarking as a clinical quick-reference." },
  { category: "Team",         tip: "Patient feedback — positive and negative — must be collected and acted upon as a GDC standards requirement. Ensure your practice has a documented process and findings are reviewed regularly." },
  { category: "Clinical",     tip: "After a needlestick, encourage bleeding, wash under running water for at least 2 minutes, report to your manager immediately and follow the practice post-exposure prophylaxis protocol." },
  { category: "Compliance",   tip: "CQC Regulation 12 requires documented evidence that risks have been assessed for each procedure. Consent records should reflect specific risks discussed — generic forms alone are insufficient." },
  { category: "Patient Care", tip: "If a patient discloses domestic abuse, listen without pressure, document accurately in their own words, and refer to the practice safeguarding lead. Do not confront alleged perpetrators." },
  { category: "CPD",          tip: "Peer review sessions count as verifiable CPD when structured with learning outcomes and reflective notes. A monthly case discussion with colleagues is one of the most practical ways to fulfil this requirement." },
  { category: "Team",         tip: "If you are unsure about a drug interaction or dose, the BNF online (bnf.nice.org.uk) is free, updated monthly, and the definitive UK clinical reference. Do not rely on memory for prescribing decisions." },
  { category: "Clinical",     tip: "GTN spray is first-line for confirmed angina in the dental chair — one 400 mcg spray sublingually, repeated once after 5 minutes if needed. If still no relief, treat as acute MI and call 999." },
  { category: "Compliance",   tip: "Dental unit water line testing should be carried out weekly and results documented. HTM 01-05 requires outlet water to achieve ≤200 CFU/mL. Failure to test is a CQC compliance risk." },
  { category: "Patient Care", tip: "For patients with learning disabilities, contact their carer or advocate before the appointment to understand communication preferences and any reasonable adjustments required under the Equality Act 2010." },
  { category: "CPD",          tip: "The GDC's 'Scope of Practice' document defines what each registrant type can and cannot do. Worth reviewing before delegating tasks to dental nurses or hygienist/therapists." },
  { category: "Clinical",     tip: "A negative radiograph finding is clinically significant — document 'no caries detected' or 'no periapical pathology' rather than leaving the record silent. Omissions can look like errors in retrospect." },
];

/* ─── Quick links ─── */
const quickLinks = [
  { label: "NHS BSA Portal",   icon: "external",  href: "https://www.nhsbsa.nhs.uk" },
  { label: "BDA",              icon: "building",  href: "https://www.bda.org"        },
  { label: "GDC Registration", icon: "award",     href: "https://www.gdc-uk.org"     },
  { label: "CQC Website",      icon: "shield",    href: "https://www.cqc.org.uk"     },
  { label: "Training Hub",     icon: "training",  nav: "training"                    },
  { label: "CPD Hub",           icon: "barchart",  nav: "cpd"                         },
];

/* ─── Live feed config — update URLs if a feed address changes ─── */
const RSS2JSON = "https://api.rss2json.com/v1/api.json?count=3&rss_url=";

const RSS_FEEDS = [
  {
    url:       "https://www.cqc.org.uk/rss/news.xml",
    tag:       "Compliance",
    icon:      "shield",
    bg:        "rgba(168,56,54,0.08)",
    color:     "var(--error)",
  },
  {
    url:       "https://www.gdc-uk.org/rss",
    tag:       "Regulatory",
    icon:      "award",
    bg:        "rgba(245,124,0,0.08)",
    color:     "#F57C00",
  },
  {
    url:       "https://www.bda.org/news-centre/news-rss.xml",
    tag:       "Industry",
    icon:      "building",
    bg:        "rgba(0,105,116,0.08)",
    color:     "var(--primary)",
  },
];

/* ─── Fallback shown when all feeds fail ─── */
const FALLBACK_NEWS = [
  {
    tag: "Compliance", bg: "rgba(168,56,54,0.08)",  color: "var(--error)",   icon: "shield",
    title: "CQC — latest news and press releases",
    desc:  "Stay up to date with CQC inspections, new frameworks, and regulatory changes affecting dental practices.",
    date:  "",
    href:  "https://www.cqc.org.uk/news",
  },
  {
    tag: "Regulatory", bg: "rgba(245,124,0,0.08)",  color: "#F57C00",        icon: "award",
    title: "GDC — news and updates",
    desc:  "Fitness to practise decisions, standards updates, and registration news from the General Dental Council.",
    date:  "",
    href:  "https://www.gdc-uk.org/about-us/what-we-do/news-and-blog/news",
  },
  {
    tag: "Industry",   bg: "rgba(0,105,116,0.08)",  color: "var(--primary)", icon: "building",
    title: "BDA — news for dental professionals",
    desc:  "Contract news, pay guidance, workforce updates, and clinical resources from the British Dental Association.",
    date:  "",
    href:  "https://www.bda.org/news-centre",
  },
];

/* ─── Helpers ─── */
const stripHtml = (html) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

const fmtDate = (str) => {
  try {
    return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return ""; }
};

/* ─────────────────────────────────────────────────────────── */

const INTERNAL_KEY = "inspire_internal_news";

/* ─────────────────────────────────────────────────────────── */


export const DashboardPage = ({ currentUser, onNav }) => {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [suggestion,   setSuggestion]   = useState("");
  const [submitted,    setSubmitted]    = useState(false);
  const [liveNews,     setLiveNews]     = useState([]);
  const [newsLoading,  setNewsLoading]  = useState(true);
  const [internalNews, setInternalNews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(INTERNAL_KEY)) || []; }
    catch { return []; }
  });
  const [activeItem,   setActiveItem]   = useState(null);

  const update   = groupUpdates[activeIdx];
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayTip = TIPS[dayIndex % TIPS.length];
  const tipCfg   = TIP_CFG[todayTip.category];

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeItem]);

  /* Fetch all feeds in parallel on mount */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled(
        RSS_FEEDS.map(feed =>
          fetch(`${RSS2JSON}${encodeURIComponent(feed.url)}`)
            .then(r => r.json())
            .then(data => {
              if (data.status !== "ok") return [];
              return data.items.slice(0, 2).map(item => ({
                tag:   feed.tag,
                icon:  feed.icon,
                bg:    feed.bg,
                color: feed.color,
                title: item.title?.trim() ?? "",
                desc:  stripHtml(item.description),
                date:  fmtDate(item.pubDate),
                href:  item.link,
                _ts:   new Date(item.pubDate).getTime(),
              }));
            })
        )
      );
      if (cancelled) return;
      const items = results
        .filter(r => r.status === "fulfilled")
        .flatMap(r => r.value)
        .sort((a, b) => b._ts - a._ts)
        .slice(0, 5);
      setLiveNews(items.length ? items : FALLBACK_NEWS);
      setNewsLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSuggest = () => {
    if (!suggestion.trim()) return;
    setSubmitted(true);
    setSuggestion("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleQuickLink = (link, e) => {
    if (link.nav && onNav) { e.preventDefault(); onNav(link.nav); }
  };

  const displayNews = newsLoading ? [] : liveNews;

  return (
    <div>
      {/* ══ 1. Group Update Hero ══ */}
      <div className={styles.hero}>
        {/* Left: media thumbnail */}
        <div
          className={styles.heroMedia}
          style={{ background: `linear-gradient(145deg, ${update.color} 0%, ${update.color}99 100%)`, cursor: "pointer" }}
          onClick={() => setActiveItem(update)}
        >
          <div className={styles.heroBlob} style={{ background: `${update.color}44` }} />
          <div className={styles.heroBlob2} style={{ background: `${update.color}33` }} />
          <div className={styles.heroMediaOverlay} />
          <div className={styles.heroPlayBtn}>
            <I name={update.videoSrc ? "play" : "eye"} size={30} color="white" />
          </div>
          {update.duration && (
            <span className={styles.heroDuration}>{update.duration}</span>
          )}
        </div>

        {/* Right: content */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <Pill bg="rgba(0,0,0,0.12)" color="var(--on-surface-variant)" small>{update.tag}</Pill>
            <span className={styles.heroDate}>{update.date}</span>
          </div>
          <h2 className={styles.heroTitle}>{update.title}</h2>
          <p className={styles.heroDesc}>{update.desc}</p>
          <div className={styles.heroHost}>
            <Avatar name={update.host} size={30} />
            <div>
              <div className={styles.heroHostName}>{update.host}</div>
              {update.role && <div className={styles.heroHostRole}>{update.role}</div>}
            </div>
          </div>
          <div className={styles.heroFooter}>
            <BtnPrimary
              style={{ padding: "9px 18px", fontSize: 12 }}
              onClick={() => setActiveItem(update)}
            >
              <I name={update.videoSrc ? "play" : "arrow"} size={13} />
              {update.videoSrc ? "Watch Now" : "Read More"}
            </BtnPrimary>
            <div className={styles.heroDots}>
              {groupUpdates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={i === activeIdx ? `${styles.heroDot} ${styles.heroDotActive}` : styles.heroDot}
                  style={i === activeIdx ? { background: update.color } : {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ 2. Quick Links ══ */}
      <div className={styles.quickLinks}>
        {quickLinks.map(link => (
          <a
            key={link.label}
            className={styles.quickLink}
            href={link.href || "#"}
            target={link.href ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={link.nav ? (e) => handleQuickLink(link, e) : undefined}
          >
            <div className={styles.quickLinkIcon}>
              <I name={link.icon} size={20} color="var(--primary)" />
            </div>
            <span className={styles.quickLinkLabel}>{link.label}</span>
          </a>
        ))}
      </div>

      {/* ══ 3. Tip of the Day ══ */}
      <div className={styles.tipCard} style={{ borderLeftColor: tipCfg.color }}>
        <div className={styles.tipIconWrap} style={{ background: tipCfg.bg }}>
          <I name="lightbulb" size={22} color={tipCfg.color} />
        </div>
        <div className={styles.tipContent}>
          <div className={styles.tipTop}>
            <span className={styles.tipLabel}>Tip of the Day</span>
            <span className={styles.tipPill} style={{ background: tipCfg.bg, color: tipCfg.color }}>
              {todayTip.category}
            </span>
          </div>
          <p className={styles.tipText}>{todayTip.tip}</p>
        </div>
        <span className={styles.tipCounter}>{(dayIndex % TIPS.length) + 1} / {TIPS.length}</span>
      </div>

      {/* ══ 4. News & Updates + Suggestion Box ══ */}
      <div className={styles.bottomGrid}>

        {/* News & Updates */}
        <Card hover={false} className={styles.newsCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardHeading}>
              <I name="zap" size={16} color="var(--primary)" /> News & Updates
            </h3>
          </div>

          {/* ── Industry news (live feeds) ── */}
          <div className={styles.newsSectionLabel}>
            <span>Industry</span>
            {!newsLoading && <span className={styles.liveTag}><span className={styles.liveDot} /> Live</span>}
          </div>

          {newsLoading ? (
            <div className={styles.newsList}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.newsRow}>
                  <div className={styles.skeletonIcon} />
                  <div style={{ flex: 1 }}>
                    <div className={styles.skeletonLine} style={{ width: "40%", marginBottom: 8 }} />
                    <div className={styles.skeletonLine} style={{ width: "85%", marginBottom: 6 }} />
                    <div className={styles.skeletonLine} style={{ width: "65%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.newsList}>
              {displayNews.map((n, idx) => (
                <a
                  key={idx}
                  className={styles.newsRow}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div className={styles.newsIconWrap} style={{ background: n.bg }}>
                    <I name={n.icon} size={15} color={n.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.newsTop}>
                      <Pill bg={n.bg} color={n.color} small>{n.tag}</Pill>
                      <span className={styles.newsDate}>{n.date}</span>
                    </div>
                    <h4 className={styles.newsTitle}>{n.title}</h4>
                    <p className={styles.newsDesc}>{n.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* ── Internal group news ── */}
          <div className={styles.newsSectionDivider} />
          <div className={styles.newsSectionLabel}>
            <span>Group</span>
          </div>

          {internalNews.length === 0 ? (
            <div className={styles.internalEmpty}>
              <I name="zap" size={15} color="var(--outline)" />
              <span>No group updates yet.</span>
            </div>
          ) : (
            <div className={styles.newsList}>
              {internalNews.map(post => (
                <div key={post.id} className={styles.newsRow}>
                  <div className={styles.newsIconWrap} style={{ background: "rgba(156,39,176,0.08)" }}>
                    <I name="building" size={15} color="#9C27B0" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.newsTop}>
                      <Pill bg="rgba(156,39,176,0.08)" color="#9C27B0" small>Group</Pill>
                      <span className={styles.newsDate}>{post.date} · {post.author}</span>
                    </div>
                    <h4 className={styles.newsTitle}>{post.title}</h4>
                    {post.desc && <p className={styles.newsDesc}>{post.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Suggestion Box */}
        <Card hover={false} className={styles.suggestionCard}>
          <div className={styles.suggestionTop}>
            <div className={styles.suggestionIconWrap}>
              <I name="lightbulb" size={20} color="var(--primary)" />
            </div>
            <h3 className={styles.suggestionTitle}>Suggestion Box</h3>
          </div>
          <p className={styles.suggestionDesc}>
            Got an idea to improve the practice? All submissions are anonymous and reviewed weekly by the management team.
          </p>
          {submitted ? (
            <div className={styles.suggestionThanks}>
              <I name="checkcircle" size={18} color="var(--success)" />
              <span>Thank you — your suggestion has been submitted.</span>
            </div>
          ) : (
            <>
              <textarea
                rows={5}
                placeholder="Share your idea or suggestion..."
                className={styles.suggestionTextarea}
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
              />
              <BtnPrimary
                onClick={handleSuggest}
                style={{ width: "100%", justifyContent: "center", marginTop: 12, fontSize: 13 }}
              >
                <I name="send" size={14} /> Submit Anonymously
              </BtnPrimary>
            </>
          )}
        </Card>

      </div>

      {/* ══ Media / Article Modal ══ */}
      {activeItem && (
        <div className={styles.videoModalBackdrop} onClick={() => setActiveItem(null)}>
          <div
            className={activeItem.videoSrc ? styles.videoModalInner : styles.articleModalInner}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.videoModalHeader}>
              <div>
                <div className={styles.videoModalTag}>{activeItem.tag}</div>
                <div className={styles.videoModalTitle}>{activeItem.title}</div>
              </div>
              <button className={styles.videoModalClose} onClick={() => setActiveItem(null)}>
                <I name="xcircle" size={22} color="var(--on-surface-variant)" />
              </button>
            </div>

            {activeItem.videoSrc ? (
              <video
                className={styles.videoModalPlayer}
                src={activeItem.videoSrc}
                controls
                autoPlay
              />
            ) : (
              <div className={styles.articleBody}>
                <div className={styles.articleMeta}>
                  <Avatar name={activeItem.host} size={36} />
                  <div>
                    <div className={styles.articleAuthor}>{activeItem.host}</div>
                    {activeItem.role && <div className={styles.articleRole}>{activeItem.role}</div>}
                    <div className={styles.articleDate}>{activeItem.date}</div>
                  </div>
                </div>
                <div className={styles.articleDivider} />
                {activeItem.body.split("\n\n").map((para, i) => (
                  <p key={i} className={styles.articlePara}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
