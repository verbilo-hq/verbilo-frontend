import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { useClickOutside } from "../hooks/useClickOutside";
import {
  listGroupUpdates, listTips, listLinkIcons, listQuickLinks,
  fetchNews, listInternalNews, saveInternalNews,
} from "../services/dashboard.service";
import styles from "./DashboardPage.module.css";

/* ─── Tip-of-the-day colour config (UI only, not data) ─── */
const TIP_CFG = {
  "Clinical":     { color: "#f57c00", bg: "rgba(245,124,0,0.08)"  },
  "Compliance":   { color: "#c62828", bg: "rgba(198,40,40,0.08)"  },
  "Patient Care": { color: "#2e7d32", bg: "rgba(46,125,50,0.08)"  },
  "CPD":          { color: "#1565c0", bg: "rgba(21,101,192,0.08)" },
  "Team":         { color: "#6a1b9a", bg: "rgba(106,27,154,0.08)" },
};

/* ─── Icon picker dropdown ─── */
const IconSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className={styles.iconSelectWrap} ref={ref}>
      <button
        type="button"
        className={styles.iconSelectTrigger}
        onClick={() => setOpen(o => !o)}
      >
        <I name={value} size={16} color="var(--primary)" />
        <span className={styles.iconSelectLabel}>{value}</span>
        <span style={{ marginLeft: "auto" }}>
          <I name="chevrondown" size={13} color="var(--on-surface-variant)" />
        </span>
      </button>
      {open && (
        <div className={styles.iconDropPanel}>
          {options.map(icon => (
            <div
              key={icon}
              className={value === icon ? `${styles.iconDropOption} ${styles.iconDropOptionSelected}` : styles.iconDropOption}
              onClick={() => { onChange(icon); setOpen(false); }}
            >
              <I name={icon} size={15} color={value === icon ? "var(--primary)" : "var(--on-surface-variant)"} />
              <span>{icon}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const DashboardPage = ({ currentUser, onNav }) => {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [suggestion,   setSuggestion]   = useState("");
  const [submitted,    setSubmitted]    = useState(false);
  const [liveNews,     setLiveNews]     = useState([]);
  const [newsLoading,  setNewsLoading]  = useState(true);
  const [internalNews, setInternalNews] = useState(() => listInternalNews());
  const [activeItem,   setActiveItem]   = useState(null);
  const [links,         setLinks]         = useState([]);
  const [showManage,    setShowManage]    = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [newLabel,      setNewLabel]      = useState("");
  const [newIcon,       setNewIcon]       = useState("external");
  const [newHref,       setNewHref]       = useState("");
  const [groupUpdates,  setGroupUpdates]  = useState([]);
  const [tips,          setTips]          = useState([]);
  const [linkIcons,     setLinkIcons]     = useState([]);

  const isAdmin = currentUser?.role === "manager";

  const update   = groupUpdates[activeIdx];
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayTip = tips.length > 0 ? tips[dayIndex % tips.length] : null;
  const tipCfg   = todayTip ? TIP_CFG[todayTip.category] : null;

  useEffect(() => {
    listGroupUpdates().then(setGroupUpdates);
    listTips().then(setTips);
    listQuickLinks().then(setLinks);
    listLinkIcons().then(setLinkIcons);
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeItem]);

  /* Fetch all feeds via service (cached daily) */
  useEffect(() => {
    let cancelled = false;
    fetchNews().then((items) => {
      if (cancelled) return;
      setLiveNews(items);
      setNewsLoading(false);
    });
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

  const closeManage = () => {
    setShowManage(false);
    setPendingDelete(null);
    setShowAddForm(false);
    setNewLabel(""); setNewIcon("external"); setNewHref("");
  };

  const handleAddLink = () => {
    if (!newLabel.trim()) return;
    const dest = newHref.trim();
    const isExternal = dest.startsWith("http");
    setLinks(prev => [...prev, {
      label: newLabel.trim(),
      icon: newIcon,
      ...(isExternal ? { href: dest } : { nav: dest }),
    }]);
    setNewLabel(""); setNewIcon("external"); setNewHref("");
    setShowAddForm(false);
  };

  const handleDeleteLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
    setPendingDelete(null);
  };

  const displayNews = newsLoading ? [] : liveNews;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateDay  = now.toLocaleDateString("en-GB", { weekday: "long" });
  const dateFull = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      {/* ══ 0. Welcome Banner ══ */}
      <div className={styles.welcome}>
        <div className={styles.welcomeText}>
          <h1 className={styles.welcomeTitle}>{greeting}, {currentUser?.displayName}.</h1>
          <p className={styles.welcomeSub}>Here's what's happening at Dental Group today.</p>
        </div>
        <div className={styles.welcomeDate}>
          <span className={styles.welcomeDateDay}>{dateDay}</span>
          <span className={styles.welcomeDateFull}>{dateFull}</span>
        </div>
      </div>

      {/* ══ 1. Group Update Hero ══ */}
      {update && (
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
      )}

      {/* ══ 2. Quick Links ══ */}
      {isAdmin && (
        <div className={styles.quickLinksBar}>
          <button className={styles.editLinksBtn} onClick={() => setShowManage(true)}>
            <I name="edit" size={12} /> Edit Links
          </button>
        </div>
      )}
      <div className={styles.quickLinks}>
        {links.map((link, idx) => (
          <a
            key={idx}
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
      {todayTip && tipCfg && (
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
          <span className={styles.tipCounter}>{(dayIndex % tips.length) + 1} / {tips.length}</span>
        </div>
      )}

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

      {/* ══ Manage Quick Links Modal ══ */}
      {showManage && (
        <div className={styles.videoModalBackdrop} onClick={closeManage}>
          <div className={styles.manageLinksModal} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.addLinkModalHeader}>
              <span className={styles.addLinkModalTitle}>Manage Quick Links</span>
              <button className={styles.videoModalClose} onClick={closeManage}>
                <I name="xcircle" size={20} color="var(--on-surface-variant)" />
              </button>
            </div>

            {/* Existing links list */}
            <div className={styles.manageLinksList}>
              {links.map((link, idx) => (
                pendingDelete === idx ? (
                  <div key={idx} className={styles.manageConfirmRow}>
                    <span className={styles.manageConfirmText}>Remove <strong>"{link.label}"</strong>?</span>
                    <div className={styles.manageConfirmActions}>
                      <button className={styles.manageConfirmNo} onClick={() => setPendingDelete(null)}>Cancel</button>
                      <button className={styles.manageConfirmYes} onClick={() => handleDeleteLink(idx)}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className={styles.manageLinkRow}>
                    <div className={styles.manageLinkIconWrap}>
                      <I name={link.icon} size={16} color="var(--primary)" />
                    </div>
                    <div className={styles.manageLinkInfo}>
                      <span className={styles.manageLinkName}>{link.label}</span>
                      <span className={styles.manageLinkDest}>{link.href || link.nav || "—"}</span>
                    </div>
                    <button
                      className={styles.manageLinkDeleteBtn}
                      onClick={() => { setPendingDelete(idx); setShowAddForm(false); }}
                      title="Delete link"
                    >
                      <I name="trash" size={14} color="var(--error)" />
                    </button>
                  </div>
                )
              ))}
            </div>

            {/* Add new link section */}
            <div className={styles.manageAddSection}>
              {showAddForm ? (
                <div className={styles.addLinkModalBody}>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Name</label>
                    <input
                      className={styles.addLinkInput}
                      placeholder="e.g. NHS BSA Portal"
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddLink()}
                      autoFocus
                    />
                  </div>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Icon</label>
                    <IconSelect value={newIcon} onChange={setNewIcon} options={linkIcons} />
                  </div>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Link</label>
                    <input
                      className={styles.addLinkInput}
                      placeholder="https://... or page name (training, staff, cpd, hr…)"
                      value={newHref}
                      onChange={e => setNewHref(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddLink()}
                    />
                  </div>
                  <div className={styles.addLinkModalFooter}>
                    <button className={styles.addLinkCancelBtn} onClick={() => { setShowAddForm(false); setNewLabel(""); setNewIcon("external"); setNewHref(""); }}>
                      Cancel
                    </button>
                    <button
                      className={styles.addLinkSaveBtn}
                      onClick={handleAddLink}
                      disabled={!newLabel.trim()}
                    >
                      <I name="plus" size={14} /> Add Link
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.showAddFormBtn}
                  onClick={() => { setShowAddForm(true); setPendingDelete(null); }}
                >
                  <I name="plus" size={14} /> Add New Link
                </button>
              )}
            </div>

          </div>
        </div>
      )}

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
