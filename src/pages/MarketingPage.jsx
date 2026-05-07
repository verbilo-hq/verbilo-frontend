import { useState, useRef } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./MarketingPage.module.css";

/* ── Seed data ─────────────────────────────────────────────────────────────── */

const seedCampaigns = [
  { id: 1, name: "Summer Whitening 2026", desc: "Seasonal promotion for laser whitening packages.", startDate: "2026-06-01", endDate: "2026-08-31", color: "#006974" },
  { id: 2, name: "National Smile Month", desc: "Annual awareness campaign for preventive care.", startDate: "2026-05-15", endDate: "2026-06-15", color: "#2E7D32" },
];

const initialSocials = [
  {
    id: 1, campaignId: 2,
    tag: "National Smile Month", color: "var(--success)", imageUrl: null,
    title: "Radiant Smiles Campaign",
    desc: "Educational content focusing on preventive care and routine check-ups.",
    captions: [
      { tone: "Professional",    text: "This National Smile Month, we're celebrating the power of preventive care. Regular check-ups are the cornerstone of a healthy, confident smile. Book yours today. 🦷✨\n\n#NationalSmileMonth #InspireDental #PreventiveDentistry #OralHealth" },
      { tone: "Friendly",        text: "Smiles are our speciality — and this month we're putting them front and centre! Whether it's your first visit or your annual check-up, our team is here to make it a great experience. 😊\n\nBook now via the link in bio! #SmileMonth #DentalCare #InspireDentalGroup" },
      { tone: "Patient-focused", text: "Did you know? 1 in 4 adults don't brush their teeth twice a day. This National Smile Month, let's build better habits together. Our friendly team is here to support your journey to a healthier smile. 💚\n\n#OralHealth #NationalSmileMonth #InspireDental" },
      { tone: "Hashtag-rich",    text: "✨ Happy National Smile Month! ✨ Your smile matters to us every single day. Come see us for your check-up and leave feeling confident.\n\n#NationalSmileMonth #Dentist #DentalHealth #SmileMore #HealthySmile #InspireDental #London #DentalCare #TeethCleaning #PreventiveDentistry" },
    ],
  },
  {
    id: 2, campaignId: 1,
    tag: "Limited Offer", color: "var(--primary)", imageUrl: null,
    title: "Summer Whitening Special",
    desc: "Promotional graphic for the 20% off laser whitening seasonal package.",
    captions: [
      { tone: "Professional",    text: "This summer, achieve the bright, confident smile you deserve. Our laser whitening treatment is now available at 20% off throughout July and August. Limited appointments — book now to avoid disappointment.\n\n#TeethWhitening #InspireDental #SummerSmile" },
      { tone: "Friendly",        text: "Summer is HERE and your smile should match the sunshine ☀️ We're offering 20% off laser whitening this season — don't miss out!\n\n#SummerWhitening #WhiterTeeth #InspireDentalGroup #SummerGlow" },
      { tone: "Patient-focused", text: "Feeling self-conscious about the shade of your smile? Our safe, clinically proven laser whitening treatment can lift your smile by several shades in a single session. This summer, treat yourself — 20% off for a limited time.\n\n#LaserWhitening #ConfidentSmile #InspireDental" },
      { tone: "Hashtag-rich",    text: "🌟 20% OFF Laser Whitening this summer! 🌟 Book now and walk away with a brighter smile before the season ends.\n\n#TeethWhitening #LaserWhitening #WhiteTeeth #SummerSmile #DentalOffer #InspireDental #London #SmileGoals #Whitening #DentistLondon" },
    ],
  },
  {
    id: 3, campaignId: null,
    tag: "Engagement", color: "var(--error)", imageUrl: null,
    title: "New Patient Welcome",
    desc: "Welcoming our community with a tour of our clinical sanctuary and friendly staff.",
    captions: [
      { tone: "Professional",    text: "At Inspire Dental Group, we believe exceptional care starts from the very first visit. We're proud to welcome new patients to our clinical sanctuary.\n\n#NewPatients #InspireDental #DentalWellness #ClinicalExcellence" },
      { tone: "Friendly",        text: "New to Inspire? Welcome to the family! 🎉 Whether you're nervous about dentistry or simply looking for a fresh start, we promise to make every visit comfortable.\n\n#NewPatient #WelcomeToInspire #InspireDentalGroup" },
      { tone: "Patient-focused", text: "Dental anxiety is more common than you think — and we get it. That's why we've designed every part of our practice around your comfort.\n\nBook a no-pressure consultation today. #DentalAnxiety #ComfortableDentistry #InspireDental" },
      { tone: "Hashtag-rich",    text: "Welcome, welcome, welcome! 🏡 We're now accepting new patients at Inspire Dental Group.\n\n#NewPatients #Dentist #DentalClinic #LondonDentist #InspireDental #FamilyDentist #DentalCare #SmileMakeover #DentalHealth" },
    ],
  },
];

const assets = [
  { label: "Primary Logo",  formats: ["SVG", "PNG", "PDF"], dims: "2400 × 800px", primary: false, big: false },
  { label: "Icon Mark",     formats: ["SVG", "PNG"],        dims: "512 × 512px",  primary: false, big: true  },
  { label: "White Variant", formats: ["SVG", "PNG"],        dims: "2400 × 800px", primary: true,  big: false },
];

const palette = [
  { name: "Primary Teal",   hex: "#006974", textDark: false },
  { name: "Teal Light",     hex: "#4DB6AC", textDark: false },
  { name: "On-Primary",     hex: "#FFFFFF", textDark: true  },
  { name: "Surface Low",    hex: "#F0F4F4", textDark: true  },
  { name: "Surface Lowest", hex: "#E4ECEC", textDark: true  },
  { name: "On-Surface",     hex: "#1A2B2B", textDark: false },
  { name: "Error / Alert",  hex: "#E53935", textDark: false },
  { name: "Success",        hex: "#2E7D32", textDark: false },
];

const typography = [
  { role: "Display / Headings", family: "Poppins", weight: "700–800", sample: "Aa Bb Cc 123" },
  { role: "Body / UI",          family: "Inter",   weight: "400–600", sample: "The quick brown fox" },
];

const rules = [
  { icon: "palette", label: "Clear Space",  desc: "Maintain a minimum margin of the 'I' cap-height around all logo marks." },
  { icon: "shield",  label: "Don'ts",       desc: "Never stretch, rotate, recolour, or place the logo on a busy background." },
  { icon: "target",  label: "Minimum Size", desc: "Logo must never appear smaller than 24px tall in any digital context." },
];

const TAG_OPTIONS = ["National Smile Month", "Limited Offer", "Engagement", "Awareness", "Promotion", "Team Spotlight", "Patient Story", "Educational", "Event", "Other"];
const CAMPAIGN_COLORS = ["#006974", "#2E7D32", "#E53935", "#F57C00", "#7B1FA2", "#1565C0"];
const TONES = ["Professional", "Friendly", "Patient-focused", "Hashtag-rich"];

/* ── Caption modal ─────────────────────────────────────────────────────────── */
const CaptionModal = ({ post, onClose }) => {
  const [activeTone, setActiveTone] = useState(0);
  const [copied, setCopied] = useState(false);
  const caption = post.captions[activeTone];
  const handleCopy = () => {
    navigator.clipboard.writeText(caption.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.captionModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.captionModalHeader}>
          <div>
            <Pill bg={post.color} color="white" small>{post.tag}</Pill>
            <h3 className={styles.captionModalTitle}>{post.title}</h3>
          </div>
          <button className={styles.modalClose} onClick={onClose}><I name="xcircle" size={22} /></button>
        </div>
        <div className={styles.toneTabs}>
          {TONES.map((t, i) => (
            <button key={t} className={i === activeTone ? `${styles.toneTab} ${styles.toneTabActive}` : styles.toneTab}
              onClick={() => { setActiveTone(i); setCopied(false); }}>{t}</button>
          ))}
        </div>
        <div className={styles.captionTextWrap}>
          <p className={styles.captionText}>{caption.text}</p>
        </div>
        <div className={styles.captionFooter}>
          <span className={styles.captionHint}><I name="info" size={13} /> Customise before posting — avoid identical copy across channels.</span>
          <BtnPrimary style={{ padding: "9px 18px", fontSize: 13 }} onClick={handleCopy}>
            {copied ? <><I name="check" size={14} /> Copied!</> : <><I name="clipboard" size={14} /> Copy Caption</>}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ── New Content modal ─────────────────────────────────────────────────────── */
const emptyNewContent = () => ({
  title: "", tag: TAG_OPTIONS[0], description: "", campaignId: "",
  imageUrl: null,
  captions: { Professional: "", Friendly: "", "Patient-focused": "", "Hashtag-rich": "" },
});

const NewContentModal = ({ campaigns, onSave, onClose }) => {
  const [form, setForm] = useState(emptyNewContent());
  const [activeTone, setActiveTone] = useState(0);
  const [errors, setErrors] = useState({});
  const imgRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setCaption = (tone, v) => setForm((f) => ({ ...f, captions: { ...f.captions, [tone]: v } }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("imageUrl", URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const captions = TONES.map((t) => ({ tone: t, text: form.captions[t] }));
    onSave({
      id: Date.now(),
      campaignId: form.campaignId ? Number(form.campaignId) : null,
      tag: form.tag,
      title: form.title.trim(),
      desc: form.description.trim(),
      color: form.campaignId
        ? (campaigns.find((c) => c.id === Number(form.campaignId))?.color || "var(--primary)")
        : "var(--primary)",
      imageUrl: form.imageUrl,
      captions,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.wideModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.wideModalHeader}>
          <div>
            <h3 className={styles.wideModalTitle}>Add New Content</h3>
            <p className={styles.wideModalSub}>Upload content from your agency or create your own.</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}><I name="xcircle" size={22} /></button>
        </div>

        <div className={styles.wideModalBody}>
          {/* Left: details */}
          <div className={styles.wideModalLeft}>
            {/* Image upload */}
            <div className={styles.ncImageUpload} onClick={() => imgRef.current.click()}
              style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
              {!form.imageUrl && <><I name="upload" size={28} color="var(--on-surface-variant)" /><span className={styles.ncImageHint}>Upload graphic / image</span></>}
              {form.imageUrl && <div className={styles.ncImageOverlay}><I name="edit" size={18} color="#fff" /></div>}
              <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
            </div>

            {/* Title */}
            <div className={styles.ncField}>
              <label className={styles.ncLabel}>Title *</label>
              <input className={errors.title ? `${styles.ncInput} ${styles.ncInputErr}` : styles.ncInput}
                value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Summer Whitening Special" />
              {errors.title && <span className={styles.ncError}>{errors.title}</span>}
            </div>

            {/* Tag */}
            <div className={styles.ncField}>
              <label className={styles.ncLabel}>Tag</label>
              <select className={styles.ncSelect} value={form.tag} onChange={(e) => set("tag", e.target.value)}>
                {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Campaign */}
            <div className={styles.ncField}>
              <label className={styles.ncLabel}>Campaign <span className={styles.ncOptional}>(optional)</span></label>
              <select className={styles.ncSelect} value={form.campaignId} onChange={(e) => set("campaignId", e.target.value)}>
                <option value="">— None —</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Description */}
            <div className={styles.ncField}>
              <label className={styles.ncLabel}>Description <span className={styles.ncOptional}>(optional)</span></label>
              <input className={styles.ncInput} value={form.description}
                onChange={(e) => set("description", e.target.value)} placeholder="Short summary of the content" />
            </div>
          </div>

          {/* Right: captions */}
          <div className={styles.wideModalRight}>
            <div className={styles.ncCaptionHead}>
              <span className={styles.ncLabel}>Captions</span>
              <span className={styles.ncOptional}>Paste captions from your agency for each tone</span>
            </div>
            <div className={styles.toneTabs} style={{ marginBottom: 12 }}>
              {TONES.map((t, i) => (
                <button key={t} className={i === activeTone ? `${styles.toneTab} ${styles.toneTabActive}` : styles.toneTab}
                  onClick={() => setActiveTone(i)}>{t}</button>
              ))}
            </div>
            <textarea
              className={styles.ncTextarea}
              value={form.captions[TONES[activeTone]]}
              onChange={(e) => setCaption(TONES[activeTone], e.target.value)}
              placeholder={`Paste or type the ${TONES[activeTone].toLowerCase()} caption here…\n\nInclude hashtags at the end.`}
            />
            <p className={styles.captionHint} style={{ marginTop: 8 }}>
              <I name="info" size={12} /> Each tone is stored separately — staff can pick the right voice when posting.
            </p>
          </div>
        </div>

        <div className={styles.wideModalFooter}>
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleSave}><I name="plus" size={14} /> Add to Hub</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ── Campaigns modal ───────────────────────────────────────────────────────── */
const emptyCampaign = { name: "", desc: "", startDate: "", endDate: "", color: CAMPAIGN_COLORS[0] };

const CampaignsModal = ({ campaigns, socials, activeFilter, onFilter, onAddCampaign, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCampaign);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Campaign name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAddCampaign({ ...form, id: Date.now() });
    setForm(emptyCampaign);
    setShowForm(false);
  };

  const handleFilter = (id) => {
    onFilter(id === activeFilter ? null : id);
    onClose();
  };

  const contentCount = (id) => socials.filter((s) => s.campaignId === id).length;

  const fmt = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.campaignsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.wideModalHeader}>
          <div>
            <h3 className={styles.wideModalTitle}>Campaigns</h3>
            <p className={styles.wideModalSub}>Group content by campaign. Click a campaign to filter the socials grid.</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <BtnSecondary style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => { setShowForm((s) => !s); setErrors({}); }}>
              <I name="plus" size={13} /> New Campaign
            </BtnSecondary>
            <button className={styles.modalClose} onClick={onClose}><I name="xcircle" size={22} /></button>
          </div>
        </div>

        {/* New campaign form */}
        {showForm && (
          <div className={styles.campaignForm}>
            <div className={styles.campaignFormRow}>
              <div className={styles.ncField} style={{ flex: 2 }}>
                <label className={styles.ncLabel}>Campaign Name *</label>
                <input className={errors.name ? `${styles.ncInput} ${styles.ncInputErr}` : styles.ncInput}
                  value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Summer Whitening 2026" />
                {errors.name && <span className={styles.ncError}>{errors.name}</span>}
              </div>
              <div className={styles.ncField}>
                <label className={styles.ncLabel}>Start Date</label>
                <input type="date" className={styles.ncInput} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div className={styles.ncField}>
                <label className={styles.ncLabel}>End Date</label>
                <input type="date" className={styles.ncInput} value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
              </div>
            </div>
            <div className={styles.campaignFormRow}>
              <div className={styles.ncField} style={{ flex: 2 }}>
                <label className={styles.ncLabel}>Description <span className={styles.ncOptional}>(optional)</span></label>
                <input className={styles.ncInput} value={form.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Brief description" />
              </div>
              <div className={styles.ncField}>
                <label className={styles.ncLabel}>Colour</label>
                <div className={styles.colorPicker}>
                  {CAMPAIGN_COLORS.map((c) => (
                    <button key={c} className={form.color === c ? `${styles.colorDot} ${styles.colorDotActive}` : styles.colorDot}
                      style={{ background: c }} onClick={() => set("color", c)} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <BtnSecondary style={{ fontSize: 12 }} onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</BtnSecondary>
              <BtnPrimary style={{ fontSize: 12 }} onClick={handleAdd}><I name="plus" size={13} /> Create Campaign</BtnPrimary>
            </div>
          </div>
        )}

        {/* Campaign list */}
        <div className={styles.campaignList}>
          {campaigns.length === 0 && (
            <div className={styles.campaignEmpty}>
              <I name="layers" size={32} color="var(--on-surface-variant)" />
              <p>No campaigns yet. Create one above to start grouping content.</p>
            </div>
          )}
          {campaigns.map((c) => {
            const count = contentCount(c.id);
            const isActive = activeFilter === c.id;
            return (
              <div key={c.id} className={isActive ? `${styles.campaignCard} ${styles.campaignCardActive}` : styles.campaignCard}
                onClick={() => handleFilter(c.id)}>
                <div className={styles.campaignCardAccent} style={{ background: c.color }} />
                <div className={styles.campaignCardBody}>
                  <div className={styles.campaignCardTop}>
                    <span className={styles.campaignCardName}>{c.name}</span>
                    <span className={styles.campaignCardCount}>{count} piece{count !== 1 ? "s" : ""}</span>
                  </div>
                  {c.desc && <p className={styles.campaignCardDesc}>{c.desc}</p>}
                  {(c.startDate || c.endDate) && (
                    <p className={styles.campaignCardDates}>
                      <I name="calendar" size={11} />
                      {fmt(c.startDate)}{c.startDate && c.endDate ? " → " : ""}{fmt(c.endDate)}
                    </p>
                  )}
                </div>
                {isActive && <div className={styles.campaignActiveTag}><I name="check" size={12} /> Filtering</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Colour swatch ─────────────────────────────────────────────────────────── */
const Swatch = ({ name, hex, textDark }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard.writeText(hex).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <button className={styles.swatch} style={{ background: hex, color: textDark ? "#1A2B2B" : "#fff" }} onClick={copy} title={`Copy ${hex}`}>
      <span className={styles.swatchName}>{copied ? "Copied!" : name}</span>
      <span className={styles.swatchHex}>{hex}</span>
    </button>
  );
};

/* ── Page ──────────────────────────────────────────────────────────────────── */
export const MarketingPage = () => {
  const [socials, setSocials]             = useState(initialSocials);
  const [campaigns, setCampaigns]         = useState(seedCampaigns);
  const [captionPost, setCaptionPost]     = useState(null);
  const [showNewContent, setShowNewContent] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [activeFilter, setActiveFilter]   = useState(null);

  const visibleSocials = activeFilter ? socials.filter((s) => s.campaignId === activeFilter) : socials;
  const activeCampaign = campaigns.find((c) => c.id === activeFilter);

  const addContent  = (item) => setSocials((prev) => [item, ...prev]);
  const addCampaign = (c)    => setCampaigns((prev) => [...prev, c]);

  return (
    <div>
      <SearchBar placeholder="Search brand assets, campaigns, or photography..." />
      <TopBar title="Marketing Hub" subtitle="Elevating the Inspire Dental Group brand, together." />

      {/* Brand row */}
      <div className={styles.assetsRow}>
        <Card hover={false} style={{ padding: 28, gridColumn: "span 2" }}>
          <div className={styles.assetsHeader}>
            <div>
              <h3 className={styles.heading}>Brand Assets</h3>
              <p className={styles.helpText}>Access official Inspire Dental Group logos and identifiers.</p>
            </div>
            <BtnPrimary style={{ padding: "12px 20px", fontSize: 12 }}>
              <I name="download" size={14} /> Download All (.ZIP)
            </BtnPrimary>
          </div>
          <div className={styles.assetGrid}>
            {assets.map((a) => (
              <div key={a.label} className={a.primary ? `${styles.assetTile} ${styles.assetTilePrimary}` : styles.assetTile}>
                <span className={a.big ? `${styles.assetWordmark} ${styles.assetWordmarkLg}` : styles.assetWordmark}>
                  {a.big ? "I" : "INSPIRE\nDENTAL"}
                </span>
                <span className={styles.assetCaption}>{a.label}</span>
                <span className={styles.assetDims}>{a.dims}</span>
                <div className={styles.assetFormats}>
                  {a.formats.map((f) => (
                    <span key={f} className={a.primary ? `${styles.assetFormatPill} ${styles.assetFormatPillWhite}` : styles.assetFormatPill}>{f}</span>
                  ))}
                </div>
                <button className={a.primary ? `${styles.assetDownloadBtn} ${styles.assetDownloadBtnWhite}` : styles.assetDownloadBtn}>
                  <I name="download" size={12} /> Download
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 className={styles.standardsTitle}>Colour Palette</h3>
            <div className={styles.swatchGrid}>
              {palette.map((c) => <Swatch key={c.hex} {...c} />)}
            </div>
            <p className={styles.swatchHint}>Click any swatch to copy the hex value.</p>
          </div>
          <div>
            <h3 className={styles.standardsTitle}>Typography</h3>
            {typography.map((t) => (
              <div key={t.family} className={styles.typographyRow}>
                <div className={styles.typographySample} style={{ fontFamily: t.family }}>{t.sample}</div>
                <div className={styles.typographyMeta}>
                  <span className={styles.typographyFamily}>{t.family}</span>
                  <span className={styles.typographyRole}>{t.role} · {t.weight}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className={styles.standardsTitle}>Brand Rules</h3>
            {rules.map((v) => (
              <div key={v.label} className={styles.standardItem}>
                <div className={styles.standardIcon}><I name={v.icon} size={16} /></div>
                <div>
                  <div className={styles.standardLabel}>{v.label}</div>
                  <div className={styles.standardDesc}>{v.desc}</div>
                </div>
              </div>
            ))}
            <BtnSecondary style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>View Full Brand Book</BtnSecondary>
          </div>
        </Card>
      </div>

      {/* Socials */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.heading}>Ready-to-Post Socials</h3>
            <p className={styles.sectionLead}>Fresh content for Instagram, Facebook, and LinkedIn.</p>
          </div>
          <div className={styles.headerActions}>
            <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }} onClick={() => setShowNewContent(true)}>
              <I name="plus" size={13} /> New Content
            </BtnSecondary>
            <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }} onClick={() => setShowCampaigns(true)}>
              <I name="layers" size={13} /> Campaigns {campaigns.length > 0 && <span className={styles.campaignBadge}>{campaigns.length}</span>}
            </BtnSecondary>
          </div>
        </div>

        {/* Campaign filter bar */}
        {campaigns.length > 0 && (
          <div className={styles.filterBar}>
            <button className={activeFilter === null ? `${styles.filterPill} ${styles.filterPillActive}` : styles.filterPill}
              onClick={() => setActiveFilter(null)}>All</button>
            {campaigns.map((c) => (
              <button key={c.id} className={activeFilter === c.id ? `${styles.filterPill} ${styles.filterPillActive}` : styles.filterPill}
                style={activeFilter === c.id ? { borderColor: c.color, background: c.color, color: "#fff" } : {}}
                onClick={() => setActiveFilter(activeFilter === c.id ? null : c.id)}>
                <span className={styles.filterDot} style={{ background: c.color }} />
                {c.name}
              </button>
            ))}
          </div>
        )}

        {visibleSocials.length === 0 && (
          <div className={styles.emptyState}>
            <I name="layers" size={32} color="var(--on-surface-variant)" />
            <p>No content in <strong>{activeCampaign?.name}</strong> yet. Add some using New Content.</p>
          </div>
        )}

        <div className={styles.socialsGrid}>
          {visibleSocials.map((s) => (
            <Card key={s.id} className={styles.socialCard} style={{ overflow: "hidden" }}>
              <div className={styles.socialMedia}
                style={s.imageUrl
                  ? { backgroundImage: `url(${s.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: `linear-gradient(135deg, ${s.color} 0%, color-mix(in srgb, ${s.color} 70%, #006974) 100%)` }
                }>
                <Pill bg="rgba(255,255,255,0.2)" color="white" small>{s.tag}</Pill>
                {!s.imageUrl && <I name="tooth" size={60} color="rgba(255,255,255,0.12)" />}
              </div>
              <div className={styles.socialBody}>
                <h4 className={styles.socialTitle}>{s.title}</h4>
                <p className={styles.socialDesc}>{s.desc}</p>
                <div className={styles.socialActions}>
                  <BtnPrimary style={{ padding: "8px 16px", fontSize: 12 }}>
                    <I name="download" size={12} /> Download
                  </BtnPrimary>
                  <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }} onClick={() => setCaptionPost(s)}>
                    <I name="clipboard" size={12} /> Caption
                  </BtnSecondary>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Photography */}
      <div>
        <div className={styles.galleryHeader}>
          <h3 className={styles.galleryTitle}>Team & Clinic Photography</h3>
        </div>
        <div className={styles.galleryGrid}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i}
              className={i === 0 ? `${styles.galleryTile} ${styles.galleryTileWide}` : styles.galleryTile}
              style={{ background: `hsl(${180 + i * 15}, 30%, ${75 - i * 5}%)` }}>
              <I name="camera" size={24} />
            </div>
          ))}
        </div>
      </div>

      {captionPost    && <CaptionModal    post={captionPost} onClose={() => setCaptionPost(null)} />}
      {showNewContent && <NewContentModal campaigns={campaigns} onSave={addContent} onClose={() => setShowNewContent(false)} />}
      {showCampaigns  && <CampaignsModal  campaigns={campaigns} socials={socials} activeFilter={activeFilter}
                           onFilter={setActiveFilter} onAddCampaign={addCampaign} onClose={() => setShowCampaigns(false)} />}
    </div>
  );
};
