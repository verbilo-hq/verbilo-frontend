/**
 * SOP Library — published SOPs across all governance packs.
 *
 * Minimal Phase 1 / Slice landing version: lists tenant's published documents
 * grouped by pack with category filters. Full version (per-role visibility,
 * full search, version history) lives in Phase 2.
 */

import { useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { listDocuments, getCurrentVersion } from "../../services/governance/documents.service";
import { getPackConfig } from "../../services/governance/packConfig";
import { DocumentStatus } from "../../services/governance/types";
import { SopPreview } from "../../components/SopPreview";
import { Store, TABLES } from "../../services/governance/store";
import styles from "./SopLibrary.module.css";

const TYPE_LABEL = {
  policy: "Policy", sop: "SOP", log_template: "Log",
  audit_tool: "Audit", evidence_template: "Evidence", appendix: "Appendix",
};

export function SopLibrary({ tenantId }) {
  const [activePackKey, setActivePackKey] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [openDocId, setOpenDocId] = useState(null);

  const data = useMemo(() => {
    const allDocs = listDocuments(tenantId, { includeArchived: false });
    const published = allDocs.filter((d) => d.status === DocumentStatus.published);
    const packKeys = Array.from(new Set(published.map((d) => d.packKey))).filter(Boolean);
    const types = Array.from(new Set(published.map((d) => d.type))).filter(Boolean);
    return { published, packKeys, types };
  }, [tenantId]);

  const filtered = data.published.filter((d) => {
    if (activePackKey !== "all" && d.packKey !== activePackKey) return false;
    if (activeType !== "all" && d.type !== activeType) return false;
    if (search.trim() && !d.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const openDoc = openDocId ? Store.get(tenantId, TABLES.documents, openDocId) : null;
  const openVersion = openDoc ? getCurrentVersion(tenantId, openDoc.id) : null;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>SOP Library</h1>
          <p className={styles.lead}>
            Published SOPs across all governance packs. Use filters to drill in by pack or document type.
          </p>
        </div>
        <div className={styles.searchBox}>
          <I name="search" size={14} color="var(--outline)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SOP titles…"
            className={styles.searchInput}
          />
        </div>
      </header>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Pack:</span>
          <FilterChip active={activePackKey === "all"} onClick={() => setActivePackKey("all")}>All packs</FilterChip>
          {data.packKeys.map((k) => {
            const cfg = getPackConfig(k);
            return (
              <FilterChip key={k} active={activePackKey === k} onClick={() => setActivePackKey(k)}>
                {cfg?.name ?? k}
              </FilterChip>
            );
          })}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type:</span>
          <FilterChip active={activeType === "all"} onClick={() => setActiveType("all")}>All types</FilterChip>
          {data.types.map((t) => (
            <FilterChip key={t} active={activeType === t} onClick={() => setActiveType(t)}>
              {TYPE_LABEL[t] ?? t}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card hover={false} className={styles.empty}>
          <I name="file" size={28} color="var(--outline-variant)" />
          <p>No published SOPs match the current filters.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ overflow: "hidden" }}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Pack</span>
            <span>Type</span>
            <span>Category</span>
            <span>Version</span>
            <span>Published</span>
          </div>
          {filtered.map((d) => {
            const v = getCurrentVersion(tenantId, d.id);
            const cfg = getPackConfig(d.packKey);
            return (
              <div key={d.id} className={styles.tableRow} onClick={() => setOpenDocId(d.id)}>
                <span className={styles.titleCell}>
                  <I name="file" size={13} color="var(--outline)" />
                  <span>{d.title}</span>
                </span>
                <span className={styles.dim}>{cfg?.name ?? d.packKey}</span>
                <span><Pill bg="var(--surface-low)" color="var(--on-surface)" small>{TYPE_LABEL[d.type] ?? d.type}</Pill></span>
                <span className={styles.dim}>{d.category}</span>
                <span className={styles.dim}>v{v?.versionNumber ?? "—"}</span>
                <span className={styles.dim}>{v?.publishedAt?.split("T")[0] ?? "—"}</span>
              </div>
            );
          })}
        </Card>
      )}

      {openDoc && openVersion && (
        <div className={styles.modalScrim} onClick={() => setOpenDocId(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h3 className={styles.modalTitle}>{openDoc.title}</h3>
                <p className={styles.modalSub}>
                  {TYPE_LABEL[openDoc.type] ?? openDoc.type} · v{openVersion.versionNumber} ·{" "}
                  <Pill bg="rgba(46,125,50,0.14)" color="#2e7d32" small>Published</Pill>
                </p>
              </div>
              <button onClick={() => setOpenDocId(null)} className={styles.closeBtn}>
                <I name="xcircle" size={18} color="var(--outline)" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <SopPreview body={openVersion.body} template={{
                title: openDoc.title, version: openVersion.versionNumber,
                status: openDoc.status, id: openDoc.id, packKey: openDoc.packKey,
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
  >
    {children}
  </button>
);
