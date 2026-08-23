/**
 * Structured viewer for a single controlled clinical protocol.
 *
 * Renders the protocol-pattern layout from a data object (not a PDF blob).
 * Three vertical sections:
 *   1. INFORMATION — the protocol body (header strip, standard callout,
 *      purpose, controls, workflow, decision table, pathway, audit prompts,
 *      documentation prompts, clinical sources)
 *   2. VERSION CONTROL — v1.0 / status / dates / owner / approver / reviewer +
 *      change summary
 *   3. READ & APPROVED BY — list of captured signatures + an electronic
 *      sign-off form for the current user (typed name + role + Sign button)
 *
 * The viewer is content-agnostic — any protocol that conforms to the shape
 * in services/governance/protocols/perio-01.js will render the same way.
 */

import { useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { formatDate, formatDateTime } from "./Shared";
import {
  getAdoption, listAcknowledgements, signProtocol, revokeSignature,
} from "../../services/governance/protocolSignatures.service";
import { getClinicalDirector } from "../../services/governance/packs.service";
import { UserRole } from "../../services/governance/types";
import { getCategoryMeta } from "./ProtocolLibrary";
import styles from "./Governance.module.css";

/** Smooth-scroll to an element by id. Used by the viewer's section nav and
 *  the primary CTA in the sticky header — both scroll to anchors rather than
 *  manipulating state, so the viewer body stays declarative. */
function scrollToSection(id) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const STATUS_PILL = {
  published:  { label: "Live",        color: "#2e7d32" },
  draft:      { label: "Draft",        color: "#1565c0" },
  in_review:  { label: "In Review",   color: "#6a1b9a" },
  approved:   { label: "Approved",    color: "#0277bd" },
  review_due: { label: "Review Due",  color: "#b36000" },
  expired:    { label: "Expired",     color: "#e53935" },
  archived:   { label: "Archived",    color: "#475569" },
};

/* ─── Section renderers ──────────────────────────────────────────────────── */

const HeaderStrip = ({ meta }) => (
  <div className={styles.pvHeaderStrip}>
    {[
      { label: "Applies to", value: meta.appliesTo },
      { label: "Frequency", value: meta.frequency },
      { label: "Lead",      value: meta.lead },
      { label: "Evidence",  value: meta.evidence },
    ].map((cell) => (
      <div key={cell.label} className={styles.pvHeaderCell}>
        <span className={styles.pvHeaderCellLabel}>{cell.label}</span>
        <span className={styles.pvHeaderCellValue}>{cell.value}</span>
      </div>
    ))}
  </div>
);

/* The label above the standard text is protocol-specific in endo PDFs
 * ("Diagnostic standard", "Asepsis standard", etc.). Falls back to a
 * generic label for perio-style protocols that don't supply one. */
const ProtocolStandard = ({ text, label }) => (
  <div className={styles.pvStandard}>
    <span className={styles.pvStandardLabel}>{label ?? "Protocol standard"}</span>
    <p className={styles.pvStandardText}>{text}</p>
  </div>
);

/* Generic boilerplate from the source PDFs explaining why the protocol set
 * exists. Rendered as a small annotation tile, not a full section. */
const ClinicalIntent = ({ text }) => (
  <div className={styles.pvIntent}>
    <span className={styles.pvIntentLabel}>Clinical intent</span>
    <p className={styles.pvIntentText}>{text}</p>
  </div>
);

/* Purpose + Critical Controls — perio shape. Either or both may be missing;
 * lays out 2-col when both present, single column when only one. */
const PurposeControls = ({ purpose, criticalControls }) => {
  if (!purpose && !criticalControls) return null;
  const both = purpose && criticalControls;
  return (
    <div className={both ? styles.pvTwoCol : undefined}>
      {purpose && (
        <div className={styles.pvPurposeBox}>
          <h4 className={styles.pvSectionTitle}>Purpose</h4>
          <ul className={styles.pvBulletList}>
            {purpose.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
      {criticalControls && (
        <div className={styles.pvControlsBox}>
          <h4 className={styles.pvSectionTitle}>Critical controls</h4>
          <ul className={styles.pvBulletList}>
            {criticalControls.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

/* Endo-style safety/escalation box with a per-protocol title (e.g. "Red flags
 * and diagnostic caution", "When isolation is not adequate"). Same visual
 * weight as criticalControls but the title is sourced from the protocol so
 * the displayed content matches the source PDF verbatim. */
const SafetyBox = ({ box }) => (
  <div className={styles.pvControlsBox}>
    <h4 className={styles.pvSectionTitle}>{box.title}</h4>
    <ul className={styles.pvBulletList}>
      {box.items.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  </div>
);

/* Ordered list of titled bullet boxes for source content that doesn't fit
 * the named slots — e.g. the Whitening pack has "Pre-treatment assessment
 * checklist", "Consent discussion must cover", "Patient instructions to
 * provide", "Equipment and preparation", "Post-treatment advice",
 * "Common causes to consider". Renders each block with the source title
 * preserved verbatim so the viewer matches what the CD adopted. */
const Notes = ({ notes }) => (
  <>
    {notes.map((n, i) => (
      <div key={i} className={styles.pvControlsBox}>
        <h4 className={styles.pvSectionTitle}>{n.title}</h4>
        <ul className={styles.pvBulletList}>
          {n.items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      </div>
    ))}
  </>
);

const Workflow = ({ steps }) => (
  <div>
    <h4 className={styles.pvSectionTitle}>Core clinical workflow</h4>
    <div className={styles.pvWorkflow}>
      {steps.map((s) => (
        <div key={s.n} className={styles.pvWorkflowStep}>
          <div className={styles.pvWorkflowNum}>{s.n}</div>
          <div>
            <div className={styles.pvWorkflowTitle}>{s.title}</div>
            <div className={styles.pvWorkflowDesc}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DecisionTable = ({ table }) => (
  <div>
    <h4 className={styles.pvSectionTitle}>{table.title}</h4>
    <table className={styles.pvTable}>
      <thead>
        <tr>{table.columns.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pathway = ({ phases }) => (
  <div>
    <h4 className={styles.pvSectionTitle}>Pathway snapshot</h4>
    <div className={styles.pvPathway}>
      {phases.map((p, i) => (
        <div key={p.phase} className={styles.pvPathwayPhase}>
          <div className={styles.pvPathwayPhaseTitle}>{p.phase}</div>
          <div className={styles.pvPathwayPhaseDesc}>{p.desc}</div>
          {i < phases.length - 1 && <I name="arrow" size={12} color="var(--outline)" />}
        </div>
      ))}
    </div>
  </div>
);

const AuditPrompts = ({ prompts }) => (
  <div className={styles.pvAuditBox}>
    <h4 className={styles.pvSectionTitle}>Audit prompts</h4>
    <ul className={styles.pvBulletList}>{prompts.map((p, i) => <li key={i}>{p}</li>)}</ul>
  </div>
);

const DocumentationPrompts = ({ prompts }) => (
  <div className={styles.pvDocPromptBox}>
    <h4 className={styles.pvSectionTitle}>Clinical documentation prompts</h4>
    <p className={styles.pvDocPromptCaption}>
      The platform expects these fields to appear in the patient record after each application of this protocol.
    </p>
    <div className={styles.pvDocPromptGrid}>
      {prompts.map((p) => (
        <div key={p.id} className={styles.pvDocPromptField}>
          <span className={styles.pvDocPromptLabel}>{p.label}</span>
          <div className={styles.pvDocPromptLine} />
        </div>
      ))}
    </div>
  </div>
);

/* Endo-style minimum record set — the page-2 boxed list of fields that must
 * appear in the patient record after each application of the protocol. Same
 * concept as DocumentationPrompts but the source PDFs render it as a simple
 * bullet list with a fixed heading, not a fillable grid. */
const MinimumRecordSet = ({ items }) => (
  <div className={styles.pvDocPromptBox}>
    <h4 className={styles.pvSectionTitle}>Minimum record set</h4>
    <p className={styles.pvDocPromptCaption}>
      The following must appear in the patient record after each application of this protocol.
    </p>
    <ul className={styles.pvBulletList}>
      {items.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  </div>
);

/* Boilerplate local sign-off note from the source PDFs. Rendered as a small
 * annotation tile so the practice can see the adaptation expectation
 * verbatim. */
const LocalSignOffNote = ({ text }) => (
  <div className={styles.pvSignOffNote}>
    <span className={styles.pvIntentLabel}>Local sign-off</span>
    <p className={styles.pvIntentText}>{text}</p>
  </div>
);

/* Sources from the source PDFs may be external (BSP, BES, SDCEP, GDC) with a
 * URL or internal references (e.g. "Local radiography protocol", "Practice
 * consent policy") with no URL. Render external as a link, internal as
 * plain text — preserving exactly what the source cites without inventing a
 * URL. */
const ClinicalSources = ({ sources }) => (
  <div>
    <h4 className={styles.pvSectionTitle}>Reference standards</h4>
    <ul className={styles.pvSourceList}>
      {sources.map((s, i) => (
        <li key={s.url ?? `${s.name}-${i}`}>
          {s.url ? (
            <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.pvSourceLink}>
              <I name="external" size={11} color="var(--primary)" /> {s.name}
            </a>
          ) : (
            <span className={styles.pvSourceLocal}>
              <I name="file" size={11} color="var(--outline)" /> {s.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

/* ── Section 2: Version Control panel ────────────────────────────────────── */
const VersionControlPanel = ({ version, protocolReference }) => {
  const pill = STATUS_PILL[version.status] ?? { label: version.status, color: "#6b7280" };
  return (
    <Card hover={false} className={styles.pvVersionCard}>
      <div className={styles.pvVersionHead}>
        <div>
          <div className={styles.pvVersionEyebrow}>Version control</div>
          <h3 className={styles.pvVersionTitle}>
            {protocolReference} · v{version.number}
            <Pill bg={`color-mix(in srgb, ${pill.color} 14%, transparent)`} color={pill.color} small>
              {pill.label}
            </Pill>
          </h3>
        </div>
        <BtnSecondary disabled style={{ opacity: 0.65 }}>
          <I name="download" size={12} /> Export PDF (Phase 2)
        </BtnSecondary>
      </div>

      <div className={styles.pvVersionGrid}>
        <div><span className={styles.pvKvLabel}>Effective from</span><span>{formatDate(version.effectiveDate)}</span></div>
        <div><span className={styles.pvKvLabel}>Next review</span><span>{formatDate(version.nextReviewDate)}</span></div>
        <div><span className={styles.pvKvLabel}>Published</span><span>{formatDate(version.publishedAt)}</span></div>
        <div><span className={styles.pvKvLabel}>Owner</span><span>{version.ownerName} · {version.ownerRole}</span></div>
        <div><span className={styles.pvKvLabel}>Approver</span><span>{version.approverName} · {version.approverRole}</span></div>
        <div><span className={styles.pvKvLabel}>Reviewer</span><span>{version.reviewerName} · {version.reviewerRole}</span></div>
      </div>

      <div className={styles.pvChangeSummary}>
        <span className={styles.pvKvLabel}>Change summary</span>
        <p>{version.changeSummary}</p>
      </div>
    </Card>
  );
};

/* ── Section 3: Group adoption + clinician acknowledgements ──────────────── */

/* ── 3a. Adoption — captured ONCE per (group, protocol version) by the CD. */
const AdoptionSection = ({ user, protocol, cd, adoption, onChanged }) => {
  const canAdopt = (
    (cd && user.id === cd.id) ||
    user.role === UserRole.super_admin ||
    user.role === UserRole.governance_lead
  );

  const [typedName, setTypedName] = useState(cd?.displayName ?? user.displayName ?? "");
  const [typedRole, setTypedRole] = useState("Clinical Director");
  const [confirm,   setConfirm]   = useState(false);
  const [err,       setErr]       = useState(null);

  const handleAdopt = () => {
    setErr(null);
    try {
      signProtocol(user, {
        protocolId: protocol.id,
        versionNumber: protocol.version.number,
        typedName, typedRole, kind: "adoption",
      });
      setConfirm(false);
      onChanged();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleRevoke = (sigId) => {
    if (!window.confirm("Revoke this adoption? Existing clinician acknowledgements remain on record. The protocol returns to 'awaiting adoption'.")) return;
    revokeSignature(user, sigId);
    onChanged();
  };

  return (
    <div className={styles.pvAdoptSection}>
      <div className={styles.pvAdoptHead}>
        <h4 className={styles.pvSectionTitle}>
          Group adoption{" "}
          {adoption
            ? <Pill bg="rgba(46,125,50,0.12)" color="#2e7d32" small>Adopted</Pill>
            : <Pill bg="rgba(176,96,0,0.12)" color="#b36000" small>Awaiting adoption</Pill>}
        </h4>
        <p className={styles.pvSigCaption}>
          The Clinical Director adopts each protocol on behalf of the group. Until adopted, the
          protocol is not active for the practice and clinicians cannot acknowledge it.
        </p>
      </div>

      {adoption ? (
        <ul className={styles.pvSigList}>
          <li className={styles.pvSigRow}>
            <div className={styles.pvSigInitials}>
              {adoption.typedName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className={styles.pvSigInfo}>
              <div className={styles.pvSigName}>Adopted by {adoption.typedName}</div>
              <div className={styles.pvSigRole}>{adoption.typedRole || "—"}</div>
            </div>
            <div className={styles.pvSigTimestamp}>{formatDateTime(adoption.signedAt)}</div>
            {(canAdopt || adoption.userId === user.id) && (
              <button className={styles.linkBtn} onClick={() => handleRevoke(adoption.id)}>Revoke</button>
            )}
          </li>
        </ul>
      ) : canAdopt ? (
        <div className={styles.pvSigFormWrap}>
          {!confirm ? (
            <div className={styles.pvSigForm}>
              <div className={styles.pvSigField}>
                <label className={styles.pvDocPromptLabel}>Your name (typed signature)</label>
                <input
                  className={styles.pvSigInput}
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={cd?.displayName ?? "e.g. Callum Lead"}
                />
              </div>
              <div className={styles.pvSigField}>
                <label className={styles.pvDocPromptLabel}>Your role</label>
                <input
                  className={styles.pvSigInput}
                  value={typedRole}
                  onChange={(e) => setTypedRole(e.target.value)}
                  placeholder="Clinical Director"
                />
              </div>
              <div className={styles.pvSigActions}>
                <BtnPrimary onClick={() => setConfirm(true)} disabled={!typedName.trim()}>
                  <I name="checkcircle" size={12} color="var(--on-primary)" /> Adopt for the group
                </BtnPrimary>
              </div>
              {err && <div className={styles.pvSigError}>{err}</div>}
            </div>
          ) : (
            <div className={styles.pvSigConfirm}>
              <p>
                By adopting <strong>{protocol.reference} v{protocol.version.number}</strong>{" "}
                as <strong>{typedName}</strong>{typedRole && <> ({typedRole})</>} you confirm
                this protocol is adopted by the group and that clinicians will follow it. The
                action is logged with your username and a timestamp.
              </p>
              <div className={styles.pvSigActions}>
                <BtnPrimary onClick={handleAdopt}>
                  <I name="checkcircle" size={12} color="var(--on-primary)" /> Confirm adoption
                </BtnPrimary>
                <BtnSecondary onClick={() => setConfirm(false)}>Cancel</BtnSecondary>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.pvSigEmpty}>
          <I name="usercheck" size={20} color="var(--outline-variant)" />
          <span>
            Pending adoption by the Clinical Director{cd?.displayName ? ` (${cd.displayName})` : " — not yet named"}.
            Adoption is required before clinicians can acknowledge this protocol.
          </span>
        </div>
      )}
    </div>
  );
};

/* ── 3b. Acknowledgements — one per clinician per (protocol version). */
const AcknowledgementsSection = ({ user, protocol, acks, onChanged }) => {
  const alreadyAcked = acks.some((a) => a.userId === user.id);
  const [typedName, setTypedName] = useState(user.displayName ?? "");
  const [typedRole, setTypedRole] = useState("");
  const [confirm,   setConfirm]   = useState(false);
  const [err,       setErr]       = useState(null);

  const handleAck = () => {
    setErr(null);
    try {
      signProtocol(user, {
        protocolId: protocol.id,
        versionNumber: protocol.version.number,
        typedName, typedRole, kind: "acknowledgement",
      });
      setConfirm(false);
      onChanged();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleRevoke = (sigId) => {
    if (!window.confirm("Revoke your acknowledgement? You'll need to read and acknowledge this version again.")) return;
    revokeSignature(user, sigId);
    onChanged();
  };

  return (
    <div className={styles.pvAckSection}>
      <div className={styles.pvAdoptHead}>
        <h4 className={styles.pvSectionTitle}>
          Clinician acknowledgements{" "}
          <Pill bg="color-mix(in srgb, var(--primary) 12%, transparent)" color="var(--primary)" small>
            {acks.length}
          </Pill>
        </h4>
        <p className={styles.pvSigCaption}>
          Each clinician who follows this protocol must read this version and sign below. The
          acknowledgement, role and timestamp are recorded in the practice's audit trail.
        </p>
      </div>

      {acks.length > 0 && (
        <ul className={styles.pvSigList}>
          {acks.map((s) => (
            <li key={s.id} className={styles.pvSigRow}>
              <div className={styles.pvSigInitials}>
                {s.typedName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className={styles.pvSigInfo}>
                <div className={styles.pvSigName}>{s.typedName}</div>
                <div className={styles.pvSigRole}>{s.typedRole || "—"}</div>
              </div>
              <div className={styles.pvSigTimestamp}>{formatDateTime(s.signedAt)}</div>
              {s.userId === user.id && (
                <button className={styles.linkBtn} onClick={() => handleRevoke(s.id)}>Revoke</button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.pvSigFormWrap}>
        {alreadyAcked ? (
          <div className={styles.pvSigAlreadyMsg}>
            <I name="check" size={13} color="#2e7d32" /> You've already acknowledged this version.
          </div>
        ) : !confirm ? (
          <div className={styles.pvSigForm}>
            <div className={styles.pvSigField}>
              <label className={styles.pvDocPromptLabel}>Your name (typed signature)</label>
              <input
                className={styles.pvSigInput}
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="e.g. James Wright"
              />
            </div>
            <div className={styles.pvSigField}>
              <label className={styles.pvDocPromptLabel}>Your role</label>
              <input
                className={styles.pvSigInput}
                value={typedRole}
                onChange={(e) => setTypedRole(e.target.value)}
                placeholder="e.g. Dentist"
              />
            </div>
            <div className={styles.pvSigActions}>
              <BtnPrimary onClick={() => setConfirm(true)} disabled={!typedName.trim()}>
                <I name="checkcircle" size={12} color="var(--on-primary)" /> Acknowledge as read
              </BtnPrimary>
            </div>
            {err && <div className={styles.pvSigError}>{err}</div>}
          </div>
        ) : (
          <div className={styles.pvSigConfirm}>
            <p>
              By acknowledging <strong>{protocol.reference} v{protocol.version.number}</strong>{" "}
              you confirm that you have read it and will follow it in your clinical work. The
              acknowledgement is recorded with your username and a timestamp.
            </p>
            <div className={styles.pvSigActions}>
              <BtnPrimary onClick={handleAck}>
                <I name="checkcircle" size={12} color="var(--on-primary)" /> Confirm acknowledgement
              </BtnPrimary>
              <BtnSecondary onClick={() => setConfirm(false)}>Cancel</BtnSecondary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── 3. Combined panel — group adoption above, clinician acks below. ────── */
const SignaturesPanel = ({ user, protocol, onSigned }) => {
  const cd = getClinicalDirector(user.tenantId);
  const adoption = getAdoption(user.tenantId, protocol.id, protocol.version.number);
  const acks = listAcknowledgements(user.tenantId, protocol.id, protocol.version.number);

  return (
    <Card hover={false} className={styles.pvSigCard}>
      <h3 className={styles.pvSectionTitle}>Read & approved by</h3>
      <AdoptionSection user={user} protocol={protocol} cd={cd} adoption={adoption} onChanged={onSigned} />
      {adoption && (
        <AcknowledgementsSection user={user} protocol={protocol} acks={acks} onChanged={onSigned} />
      )}
    </Card>
  );
};

/* ─── Root component ─────────────────────────────────────────────────────── */

export const ProtocolViewer = ({ user, protocol, onBack }) => {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  // tick is referenced via SignaturesPanel re-reading on every render — no other use
  void tick;

  /* State read up-front so the sticky header can show it. */
  const adoption = getAdoption(user.tenantId, protocol.id, protocol.version.number);
  const acks = listAcknowledgements(user.tenantId, protocol.id, protocol.version.number);
  /* (`userAcked` derivation removed — it only fed the sticky-header
   * "Acknowledge as read" CTA, which itself was removed with the
   * rest of the header actions.) */
  const catMeta = getCategoryMeta(protocol.category);

  /* (The sticky-header "Adopt for the group" CTA was removed in the
   * role-based cleanup — the sign-off panel in the right rail is now
   * the single, intentional entry point for both group adoption and
   * personal acknowledgement, and `userAcked` is no longer needed
   * at this scope.) */

  return (
    <div className={styles.pvRoot}>
      {/* ── Sticky top header — back, category, title, status, primary CTA */}
      <div
        className={styles.pvStickyHeader}
        style={{ borderTopColor: catMeta.color }}
      >
        <div className={styles.pvStickyTop}>
          <button className={styles.pvBackBtn} onClick={onBack}>
            <I name="back" size={13} /> Back to protocol library
          </button>
          <Pill
            bg={`color-mix(in srgb, ${catMeta.color} 14%, transparent)`}
            color={catMeta.color}
            small
          >
            {protocol.category}
          </Pill>
        </div>

        <div className={styles.pvStickyMid}>
          <div className={styles.pvStickyTitleWrap}>
            <div className={styles.pvStickyRef}>{protocol.reference} · v{protocol.version.number}</div>
            <h2 className={styles.pvStickyTitle}>{protocol.title}</h2>
            <p className={styles.pvStickySubtitle}>{protocol.subtitle}</p>
          </div>

          <div className={styles.pvStickyActions}>
            <div className={styles.pvStickyStatus}>
              {adoption ? (
                <Pill bg="rgba(46,125,50,0.12)" color="#2e7d32" small>
                  <I name="check" size={10} /> Adopted
                </Pill>
              ) : (
                <Pill bg="rgba(176,96,0,0.12)" color="#b36000" small>
                  Awaiting adoption
                </Pill>
              )}
              {acks.length > 0 && (
                <Pill
                  bg="color-mix(in srgb, var(--primary) 12%, transparent)"
                  color="var(--primary)"
                  small
                >
                  <I name="usercheck" size={10} /> {acks.length} acknowledged
                </Pill>
              )}
            </div>
            {/* "Adopt for the group" primary CTA removed from the top
             *  header per the role-based cleanup — group-level adoption
             *  belongs to the Clinical Director / Governance Lead only,
             *  and they now perform it from the sticky action rail's
             *  Sign-off panel on the right. Keeping a duplicate trigger
             *  up here misled general staff into thinking they could
             *  adopt on the group's behalf. The status pills above
             *  remain so the read state is still glanceable. */}
          </div>
        </div>

        {/* Section quick-nav removed — the new two-pane reading layout
         * presents the entire document as a single continuous scroll
         * (left) with the metadata + signature locked to the right,
         * so jump-tabs would just compete for attention. The sticky
         * header CTA above still scrolls to the sign-off panel for
         * one-click adoption. */}
      </div>

      {/* ── Two-pane reading layout ───────────────────────────────────
       *  • Left pane (pvScrollPane):  fixed-height container that
       *    scrolls the entire protocol body as a continuous PDF-style
       *    document — Information, Workflow, Decision, Safety,
       *    Records, Sources all merged into one Card with the
       *    existing dark-grey enterprise headings.
       *  • Right rail  (pvActionRail): sticky column that pins the
       *    Version metadata at the top and the Read & approved by +
       *    signature card at the bottom, so the Submit Signature CTA
       *    stays in view while the reader scans the document. */}
      <div className={styles.pvReadingGrid}>
        <div className={styles.pvScrollPane}>
      {/* ── 1. Information — every section conditional. Different source
       *      documents populate different subsets and the viewer renders
       *      whatever is present without inventing fields. */}
      <section id="section-info">
        <Card hover={false} className={styles.pvBodyCard}>
          {protocol.metaStrip && <HeaderStrip meta={protocol.metaStrip} />}
          {protocol.protocolStandard && (
            <ProtocolStandard text={protocol.protocolStandard} label={protocol.standardLabel} />
          )}
          {protocol.clinicalIntent && <ClinicalIntent text={protocol.clinicalIntent} />}
          <PurposeControls purpose={protocol.purpose} criticalControls={protocol.criticalControls} />

          <section id="section-workflow">
            <Workflow steps={protocol.workflow} />
          </section>

          {protocol.decisionTable && (
            <section id="section-decision">
              <DecisionTable table={protocol.decisionTable} />
            </section>
          )}
          {protocol.pathway && <Pathway phases={protocol.pathway} />}

          {protocol.safetyBox && (
            <section id="section-safety">
              <SafetyBox box={protocol.safetyBox} />
            </section>
          )}

          {protocol.notes && protocol.notes.length > 0 && (
            <section id="section-notes">
              <Notes notes={protocol.notes} />
            </section>
          )}

          {(protocol.auditPrompts || protocol.documentationPrompts || protocol.minimumRecordSet) && (
            <section id="section-records">
              <div className={protocol.auditPrompts && (protocol.documentationPrompts || protocol.minimumRecordSet) ? styles.pvTwoCol : undefined}>
                {protocol.auditPrompts && <AuditPrompts prompts={protocol.auditPrompts} />}
                {protocol.documentationPrompts && <DocumentationPrompts prompts={protocol.documentationPrompts} />}
                {!protocol.documentationPrompts && protocol.minimumRecordSet && <MinimumRecordSet items={protocol.minimumRecordSet} />}
              </div>
            </section>
          )}
          {protocol.localSignOffNote && <LocalSignOffNote text={protocol.localSignOffNote} />}

          <section id="section-sources">
            <ClinicalSources sources={protocol.clinicalSources} />
          </section>
        </Card>
      </section>
        </div>{/* /pvScrollPane (left) */}

        {/* ── Right rail — sticky alongside the scrollable document.
         *   Version metadata pinned to the top of the rail, the
         *   signature panel pinned to the bottom (margin-top: auto
         *   inside the column flex), so the Submit Signature CTA
         *   sits at the bottom-right of the modal at all times. */}
        <aside className={styles.pvActionRail} aria-label="Protocol metadata and adoption signature">
          {/* ── 2. Version control ─────────────────────────────── */}
          <section id="section-version" className={styles.pvActionRailTop}>
            <VersionControlPanel version={protocol.version} protocolReference={protocol.reference} />
          </section>

          {/* ── 3. Read & approved by + e-signature ────────────── */}
          <section id="section-signoff" className={styles.pvActionRailBottom}>
            <SignaturesPanel user={user} protocol={protocol} onSigned={refresh} />
          </section>
        </aside>
      </div>{/* /pvReadingGrid */}
    </div>
  );
};
