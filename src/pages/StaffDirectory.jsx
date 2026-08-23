import { useState, useEffect, useId, useMemo, useRef } from "react";
import { I } from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { ThemedSelect } from "../components/ui/ThemedSelect";
import {
  AREA_SITE_TARGETS,
  ROLE_LABELS,
  createAreaWithManagerForCreator,
  createDirectReportForManager,
  createSiteForManager,
  defaultGdcTypeForRole,
  deleteAreaForManager,
  deleteUserForManager,
  editUserForManager,
  getTimeOffDashboard,
  isClinicalRole,
  moveUserForManager,
  updateCompanySettingsForCreator,
  updateLeaveEntitlementsForManager,
} from "../services/timeOff.service";
import { buildStaffDirectorySections } from "../utils/staffDirectorySections";
import { OrgMapModal, DeleteUserModal } from "./HrPage";
import { useModalA11y } from "../hooks/useModalA11y";
import styles from "./StaffDirectory.module.css";

const initialsFor = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const flattenDescendants = (person) =>
  (person?.children ?? []).flatMap((child) => [child, ...flattenDescendants(child)]);

const yearOf = (iso) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.getFullYear();
};

const formatSinceDate = (iso) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const formatRenewalDate = (iso) => {
  if (!iso) return "—";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const generateTempPassword = () => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@!#$&";
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const pool = upper + lower + digits + symbols;
  const rest = Array.from({ length: 6 }, () => pick(pool));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
};

const slugifyName = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");

const suggestUsernameFromName = (name = "") => slugifyName(name).slice(0, 24);

const suggestEmailFromName = (name = "", suffix = "verbilo.co.uk") => {
  const slug = slugifyName(name);
  return slug ? `${slug}@${suffix}` : "";
};

const genderOptions = [
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
];

const gdcTypeOptions = [
  { value: "Dentist", label: "Dentist" },
  { value: "Dental Nurse", label: "Dental Nurse" },
  { value: "Dental Hygienist", label: "Dental Hygienist" },
  { value: "Dental Therapist", label: "Dental Therapist" },
  { value: "Orthodontic Therapist", label: "Orthodontic Therapist" },
  { value: "Dental Technician", label: "Dental Technician" },
];

const nextJobTitleForRoleChange = (currentTitle, currentRole, nextRole) => {
  const trimmed = currentTitle?.trim() ?? "";
  const currentRoleLabel = ROLE_LABELS[currentRole] ?? "";
  const nextRoleLabel = ROLE_LABELS[nextRole] ?? "";
  return !trimmed || trimmed === currentRoleLabel ? nextRoleLabel : currentTitle;
};

const Portrait = ({ name, src, className, style }) =>
  src ? (
    <img
      src={src}
      alt={name}
      className={`${className} ${styles.avatarImage}`}
      style={style}
      draggable={false}
    />
  ) : (
    <div className={className} style={style}>
      {initialsFor(name)}
    </div>
  );

const Avatar = ({ name, src, size = 48, alt = false, online }) => (
  <div className={styles.cardAvatarWrap}>
    <Portrait
      name={name}
      src={src}
      className={`${styles.cardAvatar} ${alt ? styles.cardAvatarAlt : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
    />
    {online !== undefined && (
      <span
        className={`${styles.onlineDot} ${online ? "" : styles.onlineDotOffline}`}
        aria-label={online ? "Online" : "Offline"}
      />
    )}
  </div>
);

const StaffCard = ({ person, onClick }) => {
  const clinical = isClinicalRole(person.role);
  const isAreaManager = person.role === "areaManager";
  const areaManagerLabel = isAreaManager
    ? person.managedSiteLabel || person.areaName || "Area"
    : null;
  return (
    <button type="button" className={styles.staffCard} onClick={() => onClick(person)}>
      <Avatar name={person.name} src={person.profileImage} size={72} online={person.isOnline} />
      <h3 className={styles.cardName}>{person.name}</h3>
      <div className={styles.cardRole}>{person.roleLabel}</div>
      {areaManagerLabel ? (
        <span className={`${styles.cardBadge} ${styles.cardBadgeClinical}`}>
          <I name="building" size={10} /> {areaManagerLabel}
        </span>
      ) : clinical && person.gdcType ? (
        <span className={`${styles.cardBadge} ${styles.cardBadgeClinical}`}>
          <I name="shield" size={10} /> {person.gdcType}
        </span>
      ) : (
        <span className={styles.cardBadge}>{person.siteName || "Group"}</span>
      )}
      {clinical && person.gdcNumber && (
        <div className={styles.cardGdc}>GDC {person.gdcNumber}</div>
      )}
    </button>
  );
};

const StaffFeaturedCard = ({ person, onClick }) => {
  if (!person) return null;
  return (
    <div className={styles.featuredCard} onClick={() => onClick(person)}>
      <div className={styles.featuredAvatarWrap}>
        <img
          src="/profile-photos/founder.svg"
          alt={person.name}
          className={styles.featuredAvatar}
          draggable={false}
        />
        <span className={styles.featuredBadge}>Founder</span>
      </div>
      <div className={styles.featuredCopy}>
        <div className={styles.featuredEyebrow}>Founder &amp; Group Director</div>
        <h2 className={styles.featuredName}>{person.name}</h2>
        <div className={styles.featuredMeta}>
          {person.roleLabel}
          {person.startDate && ` · Since ${yearOf(person.startDate)}`}
        </div>
        {person.bio && <p className={styles.featuredBio}>{person.bio}</p>}
        <button
          type="button"
          className={styles.featuredCta}
          onClick={(e) => {
            e.stopPropagation();
            onClick(person);
          }}
        >
          <I name="person" size={14} /> View Profile
        </button>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, icon, value, options, onChange, valueLabel }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const active = Boolean(value);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className={styles.filterDropdownWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.filterPill} ${active ? styles.filterPillActive : ""}`}
        onClick={() => setOpen((value) => !value)}
      >
        {icon && <I name={icon} size={13} />} {active ? `${label}: ${valueLabel}` : label}
        <I name="arrow" size={12} />
      </button>
      {open && (
        <div className={styles.filterDropdown} role="listbox">
          {active && (
            <button
              type="button"
              className={styles.filterResetBtn}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <I name="reset" size={12} /> Reset filter
            </button>
          )}
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className={`${styles.filterOption} ${value === option.value ? styles.filterOptionActive : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AreasAndSitesPanel = ({ areaManagement, onAddArea, onAddSite }) => {
  if (!areaManagement?.areas?.length && !areaManagement?.canCreateAreas) return null;

  return (
    <section className={styles.areaPanel}>
      <div className={styles.areaPanelHeader}>
        <div>
          <div className={styles.areaEyebrow}>
            <I name="building" size={14} color="var(--primary)" /> Areas & Sites
          </div>
          <h2 className={styles.areaPanelTitle}>Multi-site operating map</h2>
          <p className={styles.areaPanelLead}>
            Set up the real-world areas, practice locations, and coverage boundaries for the group.
          </p>
        </div>
        {areaManagement.canCreateAreas && (
          <BtnPrimary onClick={onAddArea}>
            <I name="plus" size={15} color="var(--on-primary)" /> Add Area
          </BtnPrimary>
        )}
      </div>

      <div className={styles.areaGrid}>
        {areaManagement.areas.map((area) => (
          <article key={area.id} className={styles.areaCard}>
            <div className={styles.areaCardTop}>
              <div>
                <h3 className={styles.areaCardTitle}>{area.name}</h3>
                <div className={styles.areaManagerLine}>
                  {area.managerName || "No area manager assigned"}
                </div>
              </div>
              <span className={styles.areaStatus}>{area.status || "active"}</span>
            </div>
            {area.description && <p className={styles.areaDescription}>{area.description}</p>}
            <div className={styles.areaStats}>
              <span>{area.sites.length} sites</span>
              <span>{area.peopleCount} people</span>
            </div>
            <div className={styles.siteChipWrap}>
              {area.sites.length ? (
                area.sites.map((site) => (
                  <span key={site.id} className={styles.siteChip}>
                    {site.name}
                    {site.managerName && <em>{site.managerName}</em>}
                  </span>
                ))
              ) : (
                <span className={styles.emptySiteChip}>No sites yet</span>
              )}
            </div>
            {area.canCreateSite && (
              <button type="button" className={styles.areaTextButton} onClick={() => onAddSite(area)}>
                <I name="plus" size={13} /> Add Site
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

const leaveDraftsFromPeople = (people) =>
  Object.fromEntries(
    people.map((person) => [
      person.id,
      {
        annualLeaveEntitlement: String(person.annualLeaveEntitlement ?? 25),
        sickLeaveEntitlement: String(person.sickLeaveEntitlement ?? 10),
      },
    ]),
  );

const HOLIDAY_YEAR_MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const HOLIDAY_YEAR_DAYS = Array.from({ length: 28 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

const pad2 = (n) => String(n).padStart(2, "0");

const formatHolidayWindow = (window) => {
  if (!window?.start || !window?.end) return "";
  const fmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startDate = new Date(`${window.start}T00:00:00Z`);
  const endDate = new Date(`${window.end}T00:00:00Z`);
  return `${fmt.format(startDate)} – ${fmt.format(endDate)}`;
};

const previewHolidayWindow = (month, day) => {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const year = today.getUTCFullYear();
  const anniversary = `${year}-${pad2(month)}-${pad2(day)}`;
  const nextAnniversary = `${year + 1}-${pad2(month)}-${pad2(day)}`;
  const prevAnniversary = `${year - 1}-${pad2(month)}-${pad2(day)}`;
  const subOneDay = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() - 1);
    return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
  };
  return todayIso >= anniversary
    ? { start: anniversary, end: subOneDay(nextAnniversary) }
    : { start: prevAnniversary, end: subOneDay(anniversary) };
};

const LeaveSettingsModal = ({ dashboard, currentUserId, onClose, onSubmitted }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const people = dashboard?.leaveSettings?.people ?? [];
  const initialYear = dashboard?.settings?.holidayYear ?? { month: 1, day: 1 };
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState(() => leaveDraftsFromPeople(people));
  const [submittingId, setSubmittingId] = useState("");
  const [rowErrors, setRowErrors] = useState({});
  const [yearMonth, setYearMonth] = useState(initialYear.month);
  const [yearDay, setYearDay] = useState(initialYear.day);
  const [yearSaving, setYearSaving] = useState(false);
  const [yearError, setYearError] = useState("");
  const [yearSavedFlash, setYearSavedFlash] = useState(false);

  const previewWindow = useMemo(
    () => previewHolidayWindow(yearMonth, yearDay),
    [yearMonth, yearDay],
  );

  const yearChanged =
    yearMonth !== initialYear.month || yearDay !== initialYear.day;

  const handleSaveYear = async () => {
    if (yearSaving) return;
    setYearSaving(true);
    setYearError("");
    setYearSavedFlash(false);
    try {
      const next = await updateCompanySettingsForCreator(currentUserId, {
        holidayYear: { month: Number(yearMonth), day: Number(yearDay) },
      });
      onSubmitted(next);
      setYearSavedFlash(true);
      setTimeout(() => setYearSavedFlash(false), 2500);
    } catch (err) {
      setYearError(err.message || "Unable to save the holiday year.");
    } finally {
      setYearSaving(false);
    }
  };
  const peopleSignature = people
    .map(
      (person) =>
        `${person.id}:${person.annualLeaveEntitlement}:${person.sickLeaveEntitlement}:${person.usedLeaveDays}:${person.usedSickDays}`,
    )
    .join("|");

  useEffect(() => {
    setDrafts(leaveDraftsFromPeople(people));
    setRowErrors({});
  }, [peopleSignature]);

  const filteredPeople = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return people;
    return people.filter((person) =>
      [
        person.name,
        person.roleLabel,
        person.jobTitle,
        person.siteName,
        person.areaName,
        person.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lowered),
    );
  }, [people, query]);

  const totals = useMemo(
    () => ({
      people: people.length,
      holiday: people.reduce((sum, person) => sum + Number(person.annualLeaveEntitlement ?? 0), 0),
      sick: people.reduce((sum, person) => sum + Number(person.sickLeaveEntitlement ?? 0), 0),
    }),
    [people],
  );

  const updateDraft = (personId, patch) => {
    setDrafts((prev) => ({
      ...prev,
      [personId]: {
        ...(prev[personId] ?? {}),
        ...patch,
      },
    }));
    setRowErrors((prev) => ({ ...prev, [personId]: "" }));
  };

  const validateDraft = (person, draft) => {
    const annual = Number(draft.annualLeaveEntitlement);
    const sick = Number(draft.sickLeaveEntitlement);
    if (!Number.isFinite(annual) || annual < 0) return "Holiday entitlement must be zero or higher.";
    if (!Number.isFinite(sick) || sick < 0) return "Sick entitlement must be zero or higher.";
    if (annual < (person.usedLeaveDays ?? 0)) {
      return "Holiday entitlement cannot be lower than holiday already used.";
    }
    if (sick < (person.usedSickDays ?? 0)) {
      return "Sick entitlement cannot be lower than sick days already used.";
    }
    return "";
  };

  const handleSave = async (person) => {
    if (submittingId) return;
    const draft = drafts[person.id];
    const validationError = validateDraft(person, draft);
    if (validationError) {
      setRowErrors((prev) => ({ ...prev, [person.id]: validationError }));
      return;
    }

    setSubmittingId(person.id);
    setRowErrors((prev) => ({ ...prev, [person.id]: "" }));
    try {
      const next = await updateLeaveEntitlementsForManager(currentUserId, person.id, {
        annualLeaveEntitlement: Number(draft.annualLeaveEntitlement),
        sickLeaveEntitlement: Number(draft.sickLeaveEntitlement),
      });
      onSubmitted(next);
    } catch (err) {
      setRowErrors((prev) => ({
        ...prev,
        [person.id]: err.message || "Unable to update leave settings.",
      }));
    } finally {
      setSubmittingId("");
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(event) => event.target === event.currentTarget && !submittingId && onClose()}
    >
      <div
        ref={dialogRef}
        className={styles.leaveSettingsModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editHeader}>
          <div>
            <h2 id={titleId} className={styles.wizardTitle}>Leave Settings</h2>
            <p className={styles.wizardSub}>
              Senior leadership can adjust each person&apos;s holiday and sick leave allowance.
            </p>
          </div>
          <button className={styles.profileCloseBtn} onClick={onClose} aria-label="Close" disabled={Boolean(submittingId)}>
            <I name="xcircle" size={20} />
          </button>
        </div>

        <div className={styles.leaveSettingsBody}>
          <section className={styles.holidayYearPanel}>
            <div className={styles.holidayYearPanelHeader}>
              <div>
                <h4 className={styles.holidayYearPanelTitle}>
                  <I name="calendar" size={14} color="var(--primary)" /> Company holiday year
                </h4>
                <p className={styles.holidayYearPanelHint}>
                  Pick when everyone&apos;s annual leave balance resets. Different companies start on different dates — the UK calendar default is 1 January, dental groups often use 1 April.
                </p>
              </div>
              {yearSavedFlash && (
                <span className={styles.holidayYearSavedFlash}>
                  <I name="checkcircle" size={13} /> Saved
                </span>
              )}
            </div>
            <div className={styles.holidayYearPanelControls}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Month</label>
                <ThemedSelect
                  value={yearMonth}
                  onChange={(value) => setYearMonth(Number(value))}
                  options={HOLIDAY_YEAR_MONTHS}
                  ariaLabel="Holiday year month"
                  disabled={yearSaving}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Day</label>
                <ThemedSelect
                  value={yearDay}
                  onChange={(value) => setYearDay(Number(value))}
                  options={HOLIDAY_YEAR_DAYS}
                  ariaLabel="Holiday year day"
                  disabled={yearSaving}
                />
              </div>
              <button
                type="button"
                className={styles.holidayYearSaveBtn}
                onClick={handleSaveYear}
                disabled={!yearChanged || yearSaving}
                aria-busy={yearSaving}
              >
                {yearSaving ? "Saving..." : "Save year"}
              </button>
            </div>
            <div className={styles.holidayYearPreview}>
              <I name="clock" size={13} color="var(--on-surface-variant)" />
              <span>
                Current holiday year: <strong>{formatHolidayWindow(previewWindow)}</strong>
              </span>
            </div>
            {yearError && <div className={styles.errorBox} role="alert">{yearError}</div>}
          </section>

          <div className={styles.leaveSettingsSummary}>
            <div className={styles.leaveSettingsMetric}>
              <strong>{totals.people}</strong>
              <span>People</span>
            </div>
            <div className={styles.leaveSettingsMetric}>
              <strong>{totals.holiday}</strong>
              <span>Total holiday days</span>
            </div>
            <div className={styles.leaveSettingsMetric}>
              <strong>{totals.sick}</strong>
              <span>Total sick days</span>
            </div>
          </div>

          <div className={styles.leaveSettingsToolbar}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Find person</label>
              <input
                className={styles.input}
                value={query}
                placeholder="Search by name, role, area, or site"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.leaveSettingsRows}>
            {filteredPeople.map((person) => {
              const draft = drafts[person.id] ?? {
                annualLeaveEntitlement: String(person.annualLeaveEntitlement ?? 25),
                sickLeaveEntitlement: String(person.sickLeaveEntitlement ?? 10),
              };
              const annual = Number(draft.annualLeaveEntitlement);
              const sick = Number(draft.sickLeaveEntitlement);
              const annualRemaining = Number.isFinite(annual)
                ? annual - (person.usedLeaveDays ?? 0)
                : person.remainingLeaveDays ?? 0;
              const sickRemaining = Number.isFinite(sick)
                ? sick - (person.usedSickDays ?? 0)
                : person.remainingSickDays ?? 0;
              const changed =
                annual !== Number(person.annualLeaveEntitlement ?? 25) ||
                sick !== Number(person.sickLeaveEntitlement ?? 10);
              const location = person.siteName || person.areaName || person.location || "Group Support";

              return (
                <article key={person.id} className={styles.leaveSettingsRow}>
                  <div className={styles.leaveSettingsPerson}>
                    <Portrait name={person.name} src={person.profileImage} className={styles.leaveSettingsAvatar} />
                    <div>
                      <h3>{person.name}</h3>
                      <p>{person.roleLabel}</p>
                      <span>{location}</span>
                    </div>
                  </div>

                  <div className={styles.leaveSettingsControls}>
                    <div className={styles.leaveEntitlementGroup}>
                      <label className={styles.fieldLabel}>Holiday entitlement</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className={styles.input}
                        value={draft.annualLeaveEntitlement}
                        onChange={(event) =>
                          updateDraft(person.id, { annualLeaveEntitlement: event.target.value })
                        }
                      />
                      <div className={styles.leaveMiniStats}>
                        <span>{person.usedLeaveDays ?? 0} used</span>
                        <strong>{annualRemaining} remaining</strong>
                      </div>
                    </div>

                    <div className={styles.leaveEntitlementGroup}>
                      <label className={styles.fieldLabel}>Sick entitlement</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className={styles.input}
                        value={draft.sickLeaveEntitlement}
                        onChange={(event) =>
                          updateDraft(person.id, { sickLeaveEntitlement: event.target.value })
                        }
                      />
                      <div className={styles.leaveMiniStats}>
                        <span>{person.usedSickDays ?? 0} used</span>
                        <strong>{sickRemaining} remaining</strong>
                      </div>
                    </div>
                  </div>

                  <div className={styles.leaveSettingsSaveCell}>
                    <button
                      type="button"
                      className={styles.leaveSettingsSave}
                      disabled={!changed || Boolean(submittingId)}
                      aria-busy={submittingId === person.id}
                      onClick={() => handleSave(person)}
                    >
                      {submittingId === person.id ? "Saving..." : "Save"}
                    </button>
                    {rowErrors[person.id] && (
                      <div className={styles.leaveSettingsRowError}>{rowErrors[person.id]}</div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.editFooter}>
          <button type="button" className={styles.wizardCancel} onClick={onClose} disabled={Boolean(submittingId)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffProfileModal = ({ person, dashboard, currentUserId, onClose, onEdit, onDelete }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose, { enabled: Boolean(person) });
  if (!person) return null;
  const clinical = isClinicalRole(person.role);
  const canEdit = Boolean(dashboard?.editableRolesByUser?.[person.id]?.length);
  const canDelete = Boolean(dashboard?.deleteableUserIds?.includes(person.id));
  const isMe = person.id === currentUserId;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.profileModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatarWrap}>
            <Portrait name={person.name} src={person.profileImage} className={styles.profileAvatar} />
            <span
              className={`${styles.onlineDot} ${person.isOnline ? "" : styles.onlineDotOffline}`}
              style={{ width: 18, height: 18 }}
            />
          </div>
          <div className={styles.profileHeaderInfo}>
            <h2 id={titleId} className={styles.profileName}>
              {person.name}
              {isMe && <span className={styles.profileYouPill}>YOU</span>}
            </h2>
            <div className={styles.profileRoleRow}>
              <span className={styles.profileRole}>{person.roleLabel}</span>
              {clinical && person.gdcType && <span className={styles.clinicalBadge}>{person.gdcType}</span>}
            </div>
            <div className={styles.profileMetaRow}>
              {person.siteName && (
                <span className={styles.profileMetaItem}>
                  <I name="building" size={13} /> {person.siteName}
                </span>
              )}
              {person.managedSiteLabel && (
                <span className={styles.profileMetaItem}>
                  <I name="building" size={13} /> Manages {person.managedSiteLabel}
                </span>
              )}
              {clinical && person.gdcNumber && (
                <span className={styles.profileMetaItem}>
                  <I name="shield" size={13} /> GDC {person.gdcNumber}
                </span>
              )}
              {person.startDate && (
                <span className={styles.profileMetaItem}>
                  <I name="calendar" size={13} /> Since {formatSinceDate(person.startDate) || yearOf(person.startDate)}
                </span>
              )}
            </div>
            <div className={styles.profileContactPills}>
              {person.email && (
                <span className={styles.contactPill}>
                  <I name="person" size={12} /> {person.email}
                </span>
              )}
              {person.phoneExtension && (
                <span className={styles.contactPill}>
                  <I name="bell" size={12} /> Ext. {person.phoneExtension}
                </span>
              )}
            </div>
          </div>
          <div className={styles.profileActions}>
            {canEdit && (
              <button type="button" className={styles.profileActionBtn} onClick={() => onEdit(person)}>
                <I name="edit" size={13} /> Edit Profile
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className={`${styles.profileActionBtn} ${styles.profileDangerBtn}`}
                onClick={() => onDelete(person)}
                aria-label={`Delete ${person.name}`}
                title={`Delete ${person.name}`}
              >
                <I name="trash" size={14} />
              </button>
            )}
            <button type="button" className={styles.profileCloseBtn} onClick={onClose} aria-label="Close profile">
              <I name="xcircle" size={20} />
            </button>
          </div>
        </div>

        <div className={styles.profileBody}>
          <div>
            {person.bio && (
              <div className={styles.profileSection}>
                <h4 className={styles.profileSectionTitle}>
                  <I name="person" size={12} /> About
                </h4>
                <p className={styles.profileBio}>{person.bio}</p>
              </div>
            )}
            {person.qualifications?.length > 0 && (
              <div className={styles.profileSection}>
                <h4 className={styles.profileSectionTitle}>
                  <I name="shield" size={12} /> Qualifications
                </h4>
                <ul className={styles.profileList}>
                  {person.qualifications.map((qual) => (
                    <li key={qual} className={styles.profileListItem}>
                      <span className={styles.profileListBullet} />
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            {clinical && (
              <div className={styles.profileSection}>
                <h4 className={styles.profileSectionTitle}>
                  <I name="shieldalert" size={12} /> GDC Registration
                </h4>
                <div className={styles.profileKV}>
                  <span className={styles.profileKVLabel}>Number</span>
                  <span className={styles.profileKVValue}>{person.gdcNumber || "—"}</span>
                </div>
                <div className={styles.profileKV}>
                  <span className={styles.profileKVLabel}>Type</span>
                  <span className={styles.profileKVValue}>{person.gdcType || "—"}</span>
                </div>
                <div className={styles.profileKV}>
                  <span className={styles.profileKVLabel}>Renewal</span>
                  <span className={styles.profileKVValue}>{formatRenewalDate(person.gdcRenewal)}</span>
                </div>
              </div>
            )}
            {person.languages?.length > 0 && (
              <div className={styles.profileSection}>
                <h4 className={styles.profileSectionTitle}>
                  <I name="person" size={12} /> Languages
                </h4>
                <div className={styles.languagePillRow}>
                  {person.languages.map((lang) => (
                    <span key={lang} className={styles.languagePill}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.profileSection}>
              <h4 className={styles.profileSectionTitle}>
                <I name="file" size={12} /> Documents
              </h4>
              {clinical && (
                <div className={styles.docRow}>
                  <span>GDC Certificate</span>
                  {person.documents?.gdcCertificate ? (
                    <span className={styles.docStatusOk}>
                      <I name="checkcircle" size={13} /> On file
                    </span>
                  ) : (
                    <span className={styles.docStatusMissing}>Not uploaded</span>
                  )}
                </div>
              )}
              {clinical && (
                <div className={styles.docRow}>
                  <span>Indemnity Insurance</span>
                  {person.documents?.indemnity ? (
                    <span className={styles.docStatusOk}>
                      <I name="checkcircle" size={13} /> On file
                    </span>
                  ) : (
                    <span className={styles.docStatusMissing}>Not uploaded</span>
                  )}
                </div>
              )}
              <div className={styles.docRow}>
                <span>Enhanced DBS</span>
                {person.documents?.dbs ? (
                  <span className={styles.docStatusOk}>
                    <I name="checkcircle" size={13} /> On file
                  </span>
                ) : (
                  <span className={styles.docStatusMissing}>Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsToCard = ({ manager, label = "Will report to" }) =>
  manager ? (
    <div className={styles.reportsToBox}>
      <Portrait name={manager.name} src={manager.profileImage} className={styles.reportsToAvatar} />
      <div className={styles.reportsToCopy}>
        <div className={styles.reportsToLabel}>{label}</div>
        <div className={styles.reportsToName}>{manager.name}</div>
        <div className={styles.reportsToRole}>{manager.roleLabel}</div>
      </div>
      <I name="checkcircle" size={18} color="var(--primary)" />
    </div>
  ) : (
    <div className={styles.reportsToEmpty}>
      <I name="alert" size={13} /> No manager available for this role at this practice yet.
    </div>
  );

const WizardSteps = ({ current, steps }) => (
  <div className={styles.wizardSteps}>
    {steps.map((label, idx) => {
      const num = idx + 1;
      const state = num < current ? "done" : num === current ? "current" : "pending";
      const cls = `${styles.wizardStep} ${state === "current" ? styles.wizardStepCurrent : ""} ${
        state === "done" ? styles.wizardStepDone : ""
      }`;
      return (
        <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className={cls}>
            <span className={styles.wizardStepNum}>
              {state === "done" ? <I name="checkcircle" size={12} /> : num}
            </span>
            {label}
          </span>
          {idx < steps.length - 1 && <span className={styles.wizardConnector} />}
        </span>
      );
    })}
  </div>
);

const AddStaffWizard = ({ mode, manager, dashboard, currentUserId, onClose, onSubmitted }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const fromOrgMap = mode === "fromOrgMap";
  const wizard = dashboard?.staffWizard ?? {
    practices: [],
    rolesByPractice: {},
    managerByPracticeRole: {},
  };

  const initialPracticeId = fromOrgMap
    ? manager?.siteId || manager?.practiceId || wizard.practices[0]?.id || ""
    : wizard.practices[0]?.id || "";

  const orgMapRoleOptions = fromOrgMap ? dashboard?.createableRolesByManager?.[manager?.id] ?? [] : [];
  const initialRole = fromOrgMap
    ? orgMapRoleOptions[0]?.value || ""
    : wizard.rolesByPractice[initialPracticeId]?.[0]?.value || "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    profilePhoto: null,
    fullName: "",
    email: "",
    gender: "prefer-not-to-say",
    dateOfBirth: "",
    practiceId: initialPracticeId,
    startDate: new Date().toISOString().slice(0, 10),
    phoneExtension: "",
    role: initialRole,
    jobTitle: ROLE_LABELS[initialRole] ?? "",
    gdcNumber: "",
    gdcType: defaultGdcTypeForRole(initialRole),
    gdcRenewal: "",
    gdcCertificateUploaded: false,
    indemnityUploaded: false,
    dbsUploaded: false,
    username: "",
    tempPassword: "",
    bio: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stepErrors, setStepErrors] = useState({});
  const [submittedName, setSubmittedName] = useState("");

  const roleOptionsForCurrent = useMemo(() => {
    if (fromOrgMap) return orgMapRoleOptions;
    return wizard.rolesByPractice[form.practiceId] ?? [];
  }, [fromOrgMap, orgMapRoleOptions, wizard.rolesByPractice, form.practiceId]);

  const resolvedManager = useMemo(() => {
    if (fromOrgMap) {
      return manager ? { id: manager.id, name: manager.name, roleLabel: manager.roleLabel } : null;
    }
    return wizard.managerByPracticeRole[form.practiceId]?.[form.role] ?? null;
  }, [fromOrgMap, manager, wizard.managerByPracticeRole, form.practiceId, form.role]);

  const isClinical = isClinicalRole(form.role);

  const updateField = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setStepErrors({});
    setError("");
  };

  const handlePracticeChange = (practiceId) => {
    const roles = wizard.rolesByPractice[practiceId] ?? [];
    const nextRole = roles.find((option) => option.value === form.role)?.value || roles[0]?.value || "";
    setForm((prev) => ({
      ...prev,
      practiceId,
      role: nextRole,
      gdcType: defaultGdcTypeForRole(nextRole),
      jobTitle: nextJobTitleForRoleChange(prev.jobTitle, prev.role, nextRole),
    }));
    setStepErrors({});
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      gdcType: defaultGdcTypeForRole(role),
      jobTitle: nextJobTitleForRoleChange(prev.jobTitle, prev.role, role),
    }));
    setStepErrors({});
  };

  const handleNameChange = (fullName) => {
    setForm((prev) => ({
      ...prev,
      fullName,
      email: prev.email || suggestEmailFromName(fullName),
      username: prev.username || suggestUsernameFromName(fullName),
    }));
    setStepErrors({});
  };

  const validateStep = () => {
    const errors = {};
    if (step === 1) {
      if (!form.fullName.trim()) errors.fullName = "Required";
      if (!form.email.trim()) errors.email = "Required";
      else if (!/^.+@.+\..+$/.test(form.email)) errors.email = "Invalid email";
      if (!form.practiceId) errors.practiceId = "Required";
      if (!form.startDate) errors.startDate = "Required";
    } else if (step === 2) {
      if (!form.role) errors.role = "Required";
      if (!form.jobTitle.trim()) errors.jobTitle = "Required";
      if (isClinical && !form.gdcNumber.trim()) errors.gdcNumber = "Required for clinical roles";
      if (!resolvedManager) errors.role = "No manager available — pick a different role or practice";
    } else if (step === 3) {
      if (!form.username.trim()) errors.username = "Required";
      if (!form.tempPassword.trim()) errors.tempPassword = "Required";
      if (isClinical) {
        const missing = [];
        if (!form.gdcCertificateUploaded) missing.push("GDC Certificate");
        if (!form.indemnityUploaded) missing.push("Indemnity Certificate");
        if (!form.dbsUploaded) missing.push("DBS Certificate");
        if (missing.length) {
          errors.gdcCertificateUploaded = `Required for clinical staff: ${missing.join(", ")}.`;
        }
      }
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep()) return;
    if (!resolvedManager) {
      setError("No valid manager available for this role at this practice.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const input = {
        displayName: form.fullName.trim(),
        role: form.role,
        practiceId: form.practiceId,
        username: form.username.trim(),
        password: form.tempPassword.trim(),
        jobTitle: form.jobTitle.trim(),
        email: form.email.trim(),
        phoneExtension: form.phoneExtension.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        startDate: form.startDate,
        gdcNumber: form.gdcNumber.trim(),
        gdcType: form.gdcType,
        gdcRenewal: form.gdcRenewal,
        bio: form.bio.trim(),
        documents: {
          gdcCertificate: isClinical && form.gdcCertificateUploaded,
          indemnity: form.indemnityUploaded,
          dbs: form.dbsUploaded,
        },
        isTempPassword: true,
      };
      const next = await createDirectReportForManager(currentUserId, resolvedManager.id, input);
      setSubmittedName(form.fullName.trim());
      onSubmitted(next);
    } catch (err) {
      setError(err.message || "Unable to create this staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };

  const stepLabels = ["Personal Details", "Role & Registration", "Documents & Access"];

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.wizardModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {submittedName ? (
          <div className={styles.successScreen}>
            <I name="checkcircle" size={56} color="var(--success)" />
            <h3 id={titleId} className={styles.successTitle}>{submittedName} added</h3>
            <p className={styles.successDesc}>
              Their account credentials have been saved. They will be prompted to set a new password on first sign-in.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        ) : (
          <>
            <div className={styles.wizardHeader}>
              <div>
                <h2 id={titleId} className={styles.wizardTitle}>Add Staff Member</h2>
                <p className={styles.wizardSub}>
                  Completed by an authorised manager · Staff will receive a temporary password
                </p>
              </div>
              <button
                className={styles.profileCloseBtn}
                onClick={onClose}
                aria-label="Close"
                disabled={submitting}
              >
                <I name="xcircle" size={20} />
              </button>
            </div>

            <WizardSteps current={step} steps={stepLabels} />

            <div className={styles.wizardBody}>
              {step === 1 && (
                <>
                  <div className={styles.photoSlot}>
                    <button
                      type="button"
                      className={styles.photoRing}
                      onClick={() => updateField({ profilePhoto: "mock" })}
                      aria-label="Upload profile photo"
                    >
                      <I name="person" size={32} />
                      <span className={styles.photoPlus}>+</span>
                    </button>
                    <span className={styles.photoLabel}>Profile Photo</span>
                    <span className={styles.photoHint}>
                      Upload a clear professional headshot for clinical identification.
                    </span>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Full Name <span className={styles.fieldRequired}>*</span>
                      </label>
                      <input
                        className={`${styles.input} ${stepErrors.fullName ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.fullName)}
                        value={form.fullName}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                      {stepErrors.fullName && <span className={styles.fieldError}>{stepErrors.fullName}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Email Address <span className={styles.fieldRequired}>*</span>
                      </label>
                      <input
                        type="email"
                        className={`${styles.input} ${stepErrors.email ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.email)}
                        value={form.email}
                        onChange={(e) => updateField({ email: e.target.value })}
                      />
                      {stepErrors.email && <span className={styles.fieldError}>{stepErrors.email}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Gender</label>
                      <ThemedSelect
                        value={form.gender}
                        onChange={(value) => updateField({ gender: value })}
                        options={genderOptions}
                        ariaLabel="Gender"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Date of Birth</label>
                      <input
                        type="date"
                        className={styles.input}
                        value={form.dateOfBirth}
                        onChange={(e) => updateField({ dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Practice Location <span className={styles.fieldRequired}>*</span>
                      </label>
                      <ThemedSelect
                        value={form.practiceId}
                        onChange={handlePracticeChange}
                        disabled={fromOrgMap}
                        invalid={Boolean(stepErrors.practiceId)}
                        placeholder="Select practice..."
                        ariaLabel="Practice location"
                        options={
                          fromOrgMap
                            ? [
                                {
                                  value: form.practiceId,
                                  label: manager?.siteName || manager?.siteAreaName || "Manager's scope",
                                },
                              ]
                            : wizard.practices.map((practice) => ({
                                value: practice.id,
                                label: `${practice.name} - ${practice.areaName}`,
                              }))
                        }
                      />
                      {stepErrors.practiceId && <span className={styles.fieldError}>{stepErrors.practiceId}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Start Date <span className={styles.fieldRequired}>*</span>
                      </label>
                      <input
                        type="date"
                        className={`${styles.input} ${stepErrors.startDate ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.startDate)}
                        value={form.startDate}
                        onChange={(e) => updateField({ startDate: e.target.value })}
                      />
                      {stepErrors.startDate && <span className={styles.fieldError}>{stepErrors.startDate}</span>}
                    </div>
                    <div className={`${styles.field} ${styles.formGridFull}`}>
                      <label className={styles.fieldLabel}>Phone Extension</label>
                      <input
                        className={styles.input}
                        value={form.phoneExtension}
                        onChange={(e) => updateField({ phoneExtension: e.target.value })}
                        placeholder="e.g. 105"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      Role Type <span className={styles.fieldRequired}>*</span>
                    </label>
                    <ThemedSelect
                      value={form.role}
                      onChange={handleRoleChange}
                      options={roleOptionsForCurrent}
                      placeholder="Select a role..."
                      invalid={Boolean(stepErrors.role)}
                      ariaLabel="Role type"
                    />
                    {stepErrors.role && <span className={styles.fieldError}>{stepErrors.role}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      Job Title <span className={styles.fieldRequired}>*</span>
                    </label>
                    <input
                      className={`${styles.input} ${stepErrors.jobTitle ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.jobTitle)}
                      value={form.jobTitle}
                      onChange={(e) => updateField({ jobTitle: e.target.value })}
                      placeholder="e.g. Lead Orthodontist"
                    />
                    {stepErrors.jobTitle && <span className={styles.fieldError}>{stepErrors.jobTitle}</span>}
                  </div>
                  {isClinical && (
                    <>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          GDC Number <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                          className={`${styles.input} ${stepErrors.gdcNumber ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.gdcNumber)}
                          value={form.gdcNumber}
                          onChange={(e) => updateField({ gdcNumber: e.target.value })}
                        />
                        {stepErrors.gdcNumber && <span className={styles.fieldError}>{stepErrors.gdcNumber}</span>}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>GDC Registration Type</label>
                        <ThemedSelect
                          value={form.gdcType}
                          onChange={(value) => updateField({ gdcType: value })}
                          options={gdcTypeOptions}
                          ariaLabel="GDC registration type"
                        />
                      </div>
                    </>
                  )}
                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <ReportsToCard manager={resolvedManager} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className={styles.documentsInfoBar}>
                    <I name="shield" size={14} color="var(--primary)" />
                    <span>All documents are stored securely and used for compliance verification only.</span>
                  </div>

                  {isClinical && (
                    <div className={styles.docGroup}>
                      <h4 className={styles.docGroupTitle}>GDC Registration Certificate</h4>
                      <div className={styles.docUploadRow}>
                        <div className={styles.docUploadInfo}>
                          <div className={styles.docUploadName}>
                            GDC Certificate (PDF) <span className={styles.fieldRequired}>*</span>
                          </div>
                          <span
                            className={`${styles.docStatusPill} ${
                              form.gdcCertificateUploaded ? styles.docStatusPillUploaded : ""
                            }`}
                          >
                            {form.gdcCertificateUploaded ? "Uploaded" : "Not uploaded"}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={styles.docUploadBtn}
                          onClick={() => updateField({ gdcCertificateUploaded: !form.gdcCertificateUploaded })}
                        >
                          <I name="upload" size={13} /> {form.gdcCertificateUploaded ? "Replace file" : "Upload file"}
                        </button>
                      </div>
                    </div>
                  )}

                  {isClinical && (
                    <div className={styles.docGroup}>
                      <h4 className={styles.docGroupTitle}>Indemnity Insurance</h4>
                      <div className={styles.docUploadRow}>
                        <div className={styles.docUploadInfo}>
                          <div className={styles.docUploadName}>
                            Indemnity Certificate <span className={styles.fieldRequired}>*</span>
                          </div>
                          <span
                            className={`${styles.docStatusPill} ${
                              form.indemnityUploaded ? styles.docStatusPillUploaded : ""
                            }`}
                          >
                            {form.indemnityUploaded ? "Uploaded" : "Not uploaded"}
                          </span>
                        </div>
                        <button
                          type="button"
                          className={styles.docUploadBtn}
                          onClick={() => updateField({ indemnityUploaded: !form.indemnityUploaded })}
                        >
                          <I name="upload" size={13} /> {form.indemnityUploaded ? "Replace file" : "Upload file"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={styles.docGroup}>
                    <h4 className={styles.docGroupTitle}>DBS Check</h4>
                    <div className={styles.docUploadRow}>
                      <div className={styles.docUploadInfo}>
                        <div className={styles.docUploadName}>
                          Enhanced DBS Certificate (issued within 3 years)
                          {isClinical && <span className={styles.fieldRequired}>*</span>}
                        </div>
                        <span
                          className={`${styles.docStatusPill} ${
                            form.dbsUploaded ? styles.docStatusPillUploaded : ""
                          }`}
                        >
                          {form.dbsUploaded ? "Uploaded" : "Not uploaded"}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.docUploadBtn}
                        onClick={() => updateField({ dbsUploaded: !form.dbsUploaded })}
                      >
                        <I name="upload" size={13} /> {form.dbsUploaded ? "Replace file" : "Upload file"}
                      </button>
                    </div>
                  </div>

                  {stepErrors.gdcCertificateUploaded && (
                    <div className={styles.errorBox} role="alert">{stepErrors.gdcCertificateUploaded}</div>
                  )}

                  <div className={styles.credBox}>
                    <div className={styles.credBoxTitle}>
                      <I name="lock" size={14} color="var(--primary)" /> Account Credentials
                    </div>
                    <p className={styles.credBoxHint}>
                      Practice Manager hands these to the staff member on day one. They will be prompted to set a new
                      password on first sign-in.
                    </p>
                    <div className={styles.credCols}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          Username <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                          className={`${styles.input} ${stepErrors.username ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.username)}
                          value={form.username}
                          onChange={(e) => updateField({ username: e.target.value })}
                        />
                        {stepErrors.username && <span className={styles.fieldError}>{stepErrors.username}</span>}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          Temporary Password <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                          className={`${styles.input} ${stepErrors.tempPassword ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.tempPassword)}
                          value={form.tempPassword}
                          onChange={(e) => updateField({ tempPassword: e.target.value })}
                          placeholder="e.g. Verbilo@Ab12"
                        />
                        {stepErrors.tempPassword && (
                          <span className={styles.fieldError}>{stepErrors.tempPassword}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.generateBtn}
                        onClick={() => updateField({ tempPassword: generateTempPassword() })}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && <div className={styles.errorBox} role="alert">{error}</div>}
            </div>

            <div className={styles.wizardFooter}>
              <button
                type="button"
                className={styles.wizardCancel}
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <div className={styles.wizardFooterActions}>
                {step > 1 && (
                  <button
                    type="button"
                    className={styles.wizardBack}
                    onClick={handleBack}
                    disabled={submitting}
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <BtnPrimary onClick={handleNext} disabled={submitting}>
                    Continue <I name="arrow" size={14} />
                  </BtnPrimary>
                ) : (
                  <BtnPrimary onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
                    {submitting ? "Adding..." : "Add Staff Member"}
                  </BtnPrimary>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AreaWithManagerWizard = ({ dashboard, submitting, error, onClose, onSubmit }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(() => !submitting && onClose?.());
  const areaManagement = dashboard?.areaManagement ?? {};
  const parentCandidates = areaManagement.parentCandidates ?? [];
  const promoteableUsers = areaManagement.promoteableUsers ?? [];

  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [submittedName, setSubmittedName] = useState("");
  const [form, setForm] = useState({
    areaName: "",
    areaDescription: "",
    descriptionAutoSynced: true,
    sites: [""],
    mode: "create", // "create" | "promote"
    promoteUserId: "",
    parentId: areaManagement.defaultParentId ?? "",
    fullName: "",
    email: "",
    gender: "prefer-not-to-say",
    dateOfBirth: "",
    startDate: new Date().toISOString().slice(0, 10),
    phoneExtension: "",
    jobTitle: "",
    bio: "",
    dbsUploaded: false,
    username: "",
    tempPassword: "",
  });

  const updateField = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setStepErrors({});
  };

  // Auto-description copy: "Operating in X.", "Operating across X and Y.",
  // "Operating across A, B, and C." — feels natural for any count of sites.
  const generateAreaDescription = (sites) => {
    const cleaned = sites.map((name) => name.trim()).filter(Boolean);
    if (cleaned.length === 0) return "";
    if (cleaned.length === 1) return `Operating in ${cleaned[0]}.`;
    if (cleaned.length === 2) return `Operating across ${cleaned.join(" and ")}.`;
    const head = cleaned.slice(0, -1).join(", ");
    const last = cleaned[cleaned.length - 1];
    return `Operating across ${head}, and ${last}.`;
  };

  const updateSitesAndDescription = (sites) => {
    setForm((prev) => ({
      ...prev,
      sites,
      areaDescription: prev.descriptionAutoSynced
        ? generateAreaDescription(sites)
        : prev.areaDescription,
    }));
    setStepErrors({});
  };

  const handleSiteChange = (idx, value) => {
    const sites = form.sites.map((entry, i) => (i === idx ? value : entry));
    updateSitesAndDescription(sites);
  };

  const handleAddSite = () => {
    updateSitesAndDescription([...form.sites, ""]);
  };

  const handleRemoveSite = (idx) => {
    if (form.sites.length <= 1) return;
    updateSitesAndDescription(form.sites.filter((_, i) => i !== idx));
  };

  const handleDescriptionChange = (value) => {
    setForm((prev) => ({
      ...prev,
      areaDescription: value,
      // Any manual edit detaches the auto-sync; the user can still re-sync by
      // emptying the field.
      descriptionAutoSynced: value.trim() === "",
    }));
    setStepErrors({});
  };

  const handleNameChange = (fullName) => {
    setForm((prev) => ({
      ...prev,
      fullName,
      email: prev.email || suggestEmailFromName(fullName),
      username: prev.username || suggestUsernameFromName(fullName),
    }));
    setStepErrors({});
  };

  const handleAreaNameChange = (areaName) => {
    setForm((prev) => ({
      ...prev,
      areaName,
      jobTitle: prev.jobTitle || (areaName ? `Area Manager - ${areaName}` : "Area Manager"),
    }));
    setStepErrors({});
  };

  const promotedPerson = useMemo(
    () => promoteableUsers.find((person) => person.id === form.promoteUserId) ?? null,
    [promoteableUsers, form.promoteUserId],
  );

  const selectedParent = useMemo(
    () => parentCandidates.find((person) => person.id === form.parentId) ?? null,
    [parentCandidates, form.parentId],
  );

  const validateStep = () => {
    const errors = {};
    if (step === 1) {
      if (!form.areaName.trim()) errors.areaName = "Required";
      const cleanedSites = form.sites.map((name) => name.trim()).filter(Boolean);
      if (cleanedSites.length === 0) {
        errors.sites = "Add at least one site for this area";
      } else {
        const seen = new Set();
        for (const name of cleanedSites) {
          const key = name.toLowerCase();
          if (seen.has(key)) {
            errors.sites = "Site names must be unique within this area";
            break;
          }
          seen.add(key);
        }
      }
    } else if (step === 2) {
      if (form.mode === "create") {
        if (!form.fullName.trim()) errors.fullName = "Required";
        if (!form.email.trim()) errors.email = "Required";
        else if (!/^.+@.+\..+$/.test(form.email)) errors.email = "Invalid email";
        if (!form.startDate) errors.startDate = "Required";
      } else if (form.mode === "promote") {
        if (!form.promoteUserId) errors.promoteUserId = "Pick someone to promote";
      }
    } else if (step === 3) {
      if (!form.parentId) errors.parentId = "Pick who they report to";
      if (form.mode === "create" && !form.jobTitle.trim()) errors.jobTitle = "Required";
    } else if (step === 4) {
      if (form.mode === "create") {
        if (!form.username.trim()) errors.username = "Required";
        if (!form.tempPassword.trim()) errors.tempPassword = "Required";
      }
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep()) return;

    const managerInput =
      form.mode === "promote"
        ? {
            promoteUserId: form.promoteUserId,
            parentId: form.parentId,
          }
        : {
            displayName: form.fullName.trim(),
            username: form.username.trim(),
            password: form.tempPassword.trim(),
            jobTitle: form.jobTitle.trim(),
            email: form.email.trim(),
            phoneExtension: form.phoneExtension.trim(),
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            startDate: form.startDate,
            bio: form.bio.trim(),
            parentId: form.parentId,
            documents: {
              gdcCertificate: null,
              indemnity: null,
              dbs: form.dbsUploaded,
            },
            isTempPassword: true,
          };

    const result = await onSubmit({
      areaInput: {
        name: form.areaName.trim(),
        description: form.areaDescription.trim(),
        sites: form.sites
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({ name })),
      },
      managerInput,
    });

    if (result?.ok) {
      setSubmittedName(
        form.mode === "promote" ? promotedPerson?.name ?? "The area manager" : form.fullName.trim(),
      );
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };

  const stepLabels = ["Area Details", "Personal Details", "Role & Registration", "Documents & Access"];

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.wizardModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {submittedName ? (
          <div className={styles.successScreen}>
            <I name="checkcircle" size={56} color="var(--success)" />
            <h3 id={titleId} className={styles.successTitle}>{form.areaName.trim()} added</h3>
            <p className={styles.successDesc}>
              {submittedName} is now the Area Manager and is ready to take on sites and staff.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        ) : (
          <>
            <div className={styles.wizardHeader}>
              <div>
                <h2 id={titleId} className={styles.wizardTitle}>Add Area</h2>
                <p className={styles.wizardSub}>
                  Set up the new operating area and the Area Manager who'll run it.
                </p>
              </div>
              <button
                className={styles.profileCloseBtn}
                onClick={onClose}
                aria-label="Close"
                disabled={submitting}
              >
                <I name="xcircle" size={20} />
              </button>
            </div>

            <WizardSteps current={step} steps={stepLabels} />

            <div className={styles.wizardBody}>
              {step === 1 && (
                <div className={styles.formGrid}>
                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <label className={styles.fieldLabel}>
                      Area Name <span className={styles.fieldRequired}>*</span>
                    </label>
                    <input
                      className={`${styles.input} ${stepErrors.areaName ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.areaName)}
                      value={form.areaName}
                      placeholder="e.g. Area 3 South West"
                      onChange={(e) => handleAreaNameChange(e.target.value)}
                    />
                    {stepErrors.areaName && <span className={styles.fieldError}>{stepErrors.areaName}</span>}
                  </div>

                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <label className={styles.fieldLabel}>
                      Sites <span className={styles.fieldRequired}>*</span>
                    </label>
                    <span className={styles.fieldHint}>
                      Add at least one practice location for this area. You can add more later from
                      the Areas &amp; Sites panel.
                    </span>
                    <div className={styles.siteBuilder}>
                      {form.sites.map((siteName, idx) => (
                        <div key={idx} className={styles.siteBuilderRow}>
                          <input
                            className={styles.input}
                            placeholder={idx === 0 ? "e.g. Oxford" : "Another site name"}
                            value={siteName}
                            onChange={(e) => handleSiteChange(idx, e.target.value)}
                          />
                          <button
                            type="button"
                            className={styles.siteBuilderRemove}
                            onClick={() => handleRemoveSite(idx)}
                            disabled={form.sites.length <= 1}
                            aria-label={`Remove site ${idx + 1}`}
                            title="Remove site"
                          >
                            <I name="xcircle" size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.siteBuilderAdd}
                        onClick={handleAddSite}
                      >
                        <I name="plus" size={12} /> Add another site
                      </button>
                    </div>
                    {stepErrors.sites && <span className={styles.fieldError}>{stepErrors.sites}</span>}
                  </div>

                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <label className={styles.fieldLabel}>Description</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={form.areaDescription}
                      placeholder="Auto-fills from the sites above — feel free to edit."
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                    />
                    <span className={styles.fieldHint}>
                      {form.descriptionAutoSynced
                        ? "Auto-synced from the sites above. Type your own to override."
                        : "Clear this field to restore the auto-generated description."}
                    </span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div className={styles.modeToggleRow} role="tablist" aria-label="How to fill the Area Manager seat">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={form.mode === "create"}
                      className={`${styles.modeToggleBtn} ${form.mode === "create" ? styles.modeToggleBtnActive : ""}`}
                      onClick={() => updateField({ mode: "create" })}
                    >
                      <I name="userplus" size={14} /> Add new person
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={form.mode === "promote"}
                      className={`${styles.modeToggleBtn} ${form.mode === "promote" ? styles.modeToggleBtnActive : ""}`}
                      onClick={() => updateField({ mode: "promote" })}
                      disabled={promoteableUsers.length === 0}
                    >
                      <I name="move" size={14} /> Promote existing
                    </button>
                  </div>

                  {form.mode === "create" ? (
                    <>
                      <div className={styles.photoSlot}>
                        <button
                          type="button"
                          className={styles.photoRing}
                          aria-label="Upload profile photo"
                        >
                          <I name="person" size={32} />
                          <span className={styles.photoPlus}>+</span>
                        </button>
                        <span className={styles.photoLabel}>Profile Photo</span>
                        <span className={styles.photoHint}>
                          Upload a clear professional headshot for identification.
                        </span>
                      </div>

                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>
                            Full Name <span className={styles.fieldRequired}>*</span>
                          </label>
                          <input
                            className={`${styles.input} ${stepErrors.fullName ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.fullName)}
                            value={form.fullName}
                            onChange={(e) => handleNameChange(e.target.value)}
                          />
                          {stepErrors.fullName && <span className={styles.fieldError}>{stepErrors.fullName}</span>}
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>
                            Email Address <span className={styles.fieldRequired}>*</span>
                          </label>
                          <input
                            type="email"
                            className={`${styles.input} ${stepErrors.email ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.email)}
                            value={form.email}
                            onChange={(e) => updateField({ email: e.target.value })}
                          />
                          {stepErrors.email && <span className={styles.fieldError}>{stepErrors.email}</span>}
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Gender</label>
                          <ThemedSelect
                            value={form.gender}
                            onChange={(value) => updateField({ gender: value })}
                            options={genderOptions}
                            ariaLabel="Gender"
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Date of Birth</label>
                          <input
                            type="date"
                            className={styles.input}
                            value={form.dateOfBirth}
                            onChange={(e) => updateField({ dateOfBirth: e.target.value })}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>
                            Start Date <span className={styles.fieldRequired}>*</span>
                          </label>
                          <input
                            type="date"
                            className={`${styles.input} ${stepErrors.startDate ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.startDate)}
                            value={form.startDate}
                            onChange={(e) => updateField({ startDate: e.target.value })}
                          />
                          {stepErrors.startDate && <span className={styles.fieldError}>{stepErrors.startDate}</span>}
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Phone Extension</label>
                          <input
                            className={styles.input}
                            value={form.phoneExtension}
                            onChange={(e) => updateField({ phoneExtension: e.target.value })}
                            placeholder="e.g. 305"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={styles.formGrid}>
                      <div className={`${styles.field} ${styles.formGridFull}`}>
                        <label className={styles.fieldLabel}>
                          Promote which person? <span className={styles.fieldRequired}>*</span>
                        </label>
                        <ThemedSelect
                          value={form.promoteUserId}
                          onChange={(value) => updateField({ promoteUserId: value })}
                          options={promoteableUsers.map((person) => {
                            const where = person.siteName || person.areaName;
                            const suffix = where ? ` - ${where}` : "";
                            return {
                              value: person.id,
                              label: `${person.name} - ${person.roleLabel}${suffix}`,
                            };
                          })}
                          placeholder="Select a person to promote..."
                          invalid={Boolean(stepErrors.promoteUserId)}
                          ariaLabel="Person to promote"
                        />
                        {stepErrors.promoteUserId && <span className={styles.fieldError}>{stepErrors.promoteUserId}</span>}
                        <span className={styles.fieldHint}>
                          They keep their account credentials. Their existing direct reports cascade up to whoever they used to report to, so nothing is orphaned.
                        </span>
                      </div>

                      {promotedPerson && (
                        <div className={`${styles.field} ${styles.formGridFull}`}>
                          <div className={styles.reportsToBox}>
                            <Portrait
                              name={promotedPerson.name}
                              src={promotedPerson.profileImage}
                              className={styles.reportsToAvatar}
                            />
                            <div className={styles.reportsToCopy}>
                              <div className={styles.reportsToLabel}>Promoting</div>
                              <div className={styles.reportsToName}>{promotedPerson.name}</div>
                              <div className={styles.reportsToRole}>
                                {promotedPerson.roleLabel}
                                {promotedPerson.siteName ? ` · ${promotedPerson.siteName}` : ""}
                                {promotedPerson.directReportCount > 0
                                  ? ` · ${promotedPerson.directReportCount} direct report${promotedPerson.directReportCount === 1 ? "" : "s"}`
                                  : ""}
                              </div>
                            </div>
                            <I name="arrow" size={18} color="var(--primary)" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Role Type</label>
                    <input className={styles.input} value="Area Manager" disabled />
                    <span className={styles.fieldHint}>
                      {form.mode === "promote"
                        ? "Their role will change to Area Manager on submit."
                        : "Locked — this wizard creates an Area Manager."}
                    </span>
                  </div>
                  {form.mode === "create" ? (
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>
                        Job Title <span className={styles.fieldRequired}>*</span>
                      </label>
                      <input
                        className={`${styles.input} ${stepErrors.jobTitle ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.jobTitle)}
                        value={form.jobTitle}
                        onChange={(e) => updateField({ jobTitle: e.target.value })}
                        placeholder="e.g. Area Manager - South West"
                      />
                      {stepErrors.jobTitle && <span className={styles.fieldError}>{stepErrors.jobTitle}</span>}
                    </div>
                  ) : (
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Promoting</label>
                      <input className={styles.input} value={promotedPerson?.name ?? ""} disabled />
                      <span className={styles.fieldHint}>Their job title becomes &quot;Area Manager&quot;.</span>
                    </div>
                  )}
                  {form.mode === "create" && (
                    <div className={`${styles.field} ${styles.formGridFull}`}>
                      <label className={styles.fieldLabel}>Bio (optional)</label>
                      <textarea
                        className={styles.textarea}
                        rows={3}
                        value={form.bio}
                        placeholder="A short summary that shows on their profile."
                        onChange={(e) => updateField({ bio: e.target.value })}
                      />
                    </div>
                  )}

                  <div className={`${styles.field} ${styles.formGridFull}`}>
                    <label className={styles.fieldLabel}>
                      Reports to <span className={styles.fieldRequired}>*</span>
                    </label>
                    <ThemedSelect
                      value={form.parentId}
                      onChange={(value) => updateField({ parentId: value })}
                      options={parentCandidates
                        .filter((candidate) => candidate.id !== form.promoteUserId)
                        .map((candidate) => ({
                          value: candidate.id,
                          label: `${candidate.name} - ${candidate.roleLabel}`,
                        }))}
                      placeholder="Pick who they report to..."
                      invalid={Boolean(stepErrors.parentId)}
                      ariaLabel="Reports to"
                    />
                    {stepErrors.parentId && <span className={styles.fieldError}>{stepErrors.parentId}</span>}
                    {selectedParent && (
                      <div className={styles.reportsToBox} style={{ marginTop: 10 }}>
                        <Portrait
                          name={selectedParent.name}
                          src={selectedParent.profileImage}
                          className={styles.reportsToAvatar}
                        />
                        <div className={styles.reportsToCopy}>
                          <div className={styles.reportsToLabel}>Will report to</div>
                          <div className={styles.reportsToName}>{selectedParent.name}</div>
                          <div className={styles.reportsToRole}>{selectedParent.roleLabel}</div>
                        </div>
                        <I name="checkcircle" size={18} color="var(--primary)" />
                      </div>
                    )}
                    {!parentCandidates.length && (
                      <div className={styles.reportsToEmpty}>
                        <I name="alert" size={13} /> No leader available to host the area manager. Add a CoS, OD, or Second in Charge first.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && form.mode === "create" && (
                <>
                  <h4 className={styles.wizardSectionTitle}>Documents</h4>
                  <div className={styles.docUploadRow}>
                    <div className={styles.docUploadInfo}>
                      <div className={styles.docUploadName}>Enhanced DBS Certificate</div>
                      <span
                        className={`${styles.docStatusPill} ${
                          form.dbsUploaded ? styles.docStatusPillUploaded : ""
                        }`}
                      >
                        {form.dbsUploaded ? "Uploaded" : "Not uploaded"}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.docUploadBtn}
                      onClick={() => updateField({ dbsUploaded: !form.dbsUploaded })}
                    >
                      <I name="upload" size={13} /> {form.dbsUploaded ? "Replace file" : "Upload file"}
                    </button>
                  </div>

                  <div className={styles.credBox}>
                    <div className={styles.credBoxTitle}>
                      <I name="lock" size={14} color="var(--primary)" /> Account Credentials
                    </div>
                    <p className={styles.credBoxHint}>
                      Hand these to the Area Manager on day one. They'll be prompted to set a new
                      password on first sign-in.
                    </p>
                    <div className={styles.credCols}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          Username <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                          className={`${styles.input} ${stepErrors.username ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.username)}
                          value={form.username}
                          onChange={(e) => updateField({ username: e.target.value })}
                        />
                        {stepErrors.username && <span className={styles.fieldError}>{stepErrors.username}</span>}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                          Temporary Password <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                          className={`${styles.input} ${stepErrors.tempPassword ? styles.inputError : ""}`} aria-invalid={Boolean(stepErrors.tempPassword)}
                          value={form.tempPassword}
                          onChange={(e) => updateField({ tempPassword: e.target.value })}
                          placeholder="e.g. Verbilo@Ab12"
                        />
                        {stepErrors.tempPassword && (
                          <span className={styles.fieldError}>{stepErrors.tempPassword}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.generateBtn}
                        onClick={() => updateField({ tempPassword: generateTempPassword() })}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && form.mode === "promote" && (
                <div className={styles.credBox}>
                  <div className={styles.credBoxTitle}>
                    <I name="checkcircle" size={14} color="var(--success)" /> Account already set up
                  </div>
                  <p className={styles.credBoxHint}>
                    {promotedPerson?.name ?? "This person"} keeps their existing username, password,
                    and uploaded documents. On submit, their role becomes Area Manager and they will
                    report to {selectedParent?.name ?? "the chosen leader"}.
                    {promotedPerson?.directReportCount > 0 && (
                      <>
                        {" "}Their {promotedPerson.directReportCount} existing direct report
                        {promotedPerson.directReportCount === 1 ? "" : "s"} will cascade up to their
                        previous manager so nothing is orphaned.
                      </>
                    )}
                  </p>
                </div>
              )}

              {error && <div className={styles.errorBox} role="alert">{error}</div>}
            </div>

            <div className={styles.wizardFooter}>
              <button
                type="button"
                className={styles.wizardCancel}
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <div className={styles.wizardFooterActions}>
                {step > 1 && (
                  <button
                    type="button"
                    className={styles.wizardBack}
                    onClick={handleBack}
                    disabled={submitting}
                  >
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <BtnPrimary onClick={handleNext} disabled={submitting}>
                    Continue <I name="arrow" size={14} />
                  </BtnPrimary>
                ) : (
                  <BtnPrimary onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
                    {submitting ? "Creating..." : "Create Area + Manager"}
                  </BtnPrimary>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SiteModal = ({ area, submitting, error, onClose, onSubmit }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(() => !submitting && onClose?.());
  const [form, setForm] = useState({ name: "", address: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      address: form.address.trim(),
    });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}>
      <div
        ref={dialogRef}
        className={styles.editModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editHeader}>
          <div>
            <h2 id={titleId} className={styles.wizardTitle}>Add Site</h2>
            <p className={styles.wizardSub}>
              Add a new practice location underneath {area?.name || "this area"}.
            </p>
          </div>
          <button className={styles.profileCloseBtn} onClick={onClose} aria-label="Close" disabled={submitting}>
            <I name="xcircle" size={20} />
          </button>
        </div>
        <div className={styles.editBody}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Site Name <span className={styles.fieldRequired}>*</span></label>
              <input
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`} aria-invalid={Boolean(errors.name)}
                value={form.name}
                placeholder="e.g. Oxford"
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setErrors({});
                }}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Address / Location Note</label>
              <input
                className={styles.input}
                value={form.address}
                placeholder="e.g. Oxford High Street"
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
          {error && <div className={styles.errorBox} role="alert">{error}</div>}
        </div>
        <div className={styles.editFooter}>
          <button type="button" className={styles.wizardCancel} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <BtnPrimary onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
            {submitting ? "Creating..." : "Create Site"}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

const DeleteAreaModal = ({ area, submitting, error, onClose, onConfirm }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(() => !submitting && onClose?.());
  const [typed, setTyped] = useState("");
  const expected = area?.name ?? "";
  const matches = typed.trim() === expected;
  const impact = area?.deletionImpact ?? {
    affectedSiteCount: 0,
    affectedUserCount: 0,
    affectedSiteNames: [],
    affectedUserNames: [],
  };
  const hasDependencies = impact.affectedSiteCount > 0 || impact.affectedUserCount > 0;

  const handleConfirm = () => {
    if (!matches || submitting) return;
    onConfirm(typed.trim());
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <div
        ref={dialogRef}
        className={styles.editModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editHeader}>
          <div>
            <h2 id={titleId} className={styles.wizardTitle} style={{ color: "var(--error)" }}>
              <I name="alert" size={18} /> Delete area
            </h2>
            <p className={styles.wizardSub}>
              {hasDependencies
                ? `${expected} cannot be deleted until its sites and people have been reassigned.`
                : `This permanently removes the empty area ${expected}.`}
            </p>
          </div>
          <button
            className={styles.profileCloseBtn}
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            <I name="xcircle" size={20} />
          </button>
        </div>

        <div className={styles.editBody}>
          <div className={styles.deleteImpactBox}>
            <div className={styles.deleteImpactRow}>
              <I name="building" size={14} color="var(--error)" />
              <strong>{impact.affectedSiteCount}</strong>
              <span>
                {impact.affectedSiteCount === 1 ? "site must" : "sites must"} be reassigned
              </span>
            </div>
            {impact.affectedSiteNames.length > 0 && (
              <div className={styles.deleteImpactNames}>
                {impact.affectedSiteNames.join(", ")}
              </div>
            )}
            <div className={styles.deleteImpactRow}>
              <I name="person" size={14} color="var(--error)" />
              <strong>{impact.affectedUserCount}</strong>
              <span>
                {impact.affectedUserCount === 1 ? "person must" : "people must"} be reassigned
              </span>
            </div>
            {impact.affectedUserNames.length > 0 && (
              <div className={styles.deleteImpactNames}>
                {impact.affectedUserNames.length > 8
                  ? `${impact.affectedUserNames.slice(0, 8).join(", ")}, and ${impact.affectedUserNames.length - 8} more`
                  : impact.affectedUserNames.join(", ")}
              </div>
            )}
            <p className={styles.deleteImpactHint}>
              No site, account, or leave record will be cascade-deleted. Move the dependencies first, then return here.
            </p>
          </div>

          {!hasDependencies && <div className={styles.field} style={{ marginTop: 18 }}>
            <label className={styles.fieldLabel}>
              To confirm, type <strong>{expected}</strong> below.
            </label>
            <input
              className={`${styles.input} ${typed && !matches ? styles.inputError : ""}`} aria-invalid={Boolean(typed && !matches)}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={expected}
              autoFocus
              disabled={submitting}
            />
            {typed && !matches && (
              <span className={styles.fieldError}>The text doesn&apos;t match the area name.</span>
            )}
          </div>}

          {error && <div className={styles.errorBox} role="alert">{error}</div>}
        </div>

        <div className={styles.editFooter}>
          <button
            type="button"
            className={styles.wizardCancel}
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.deleteAreaBtn}
            onClick={handleConfirm}
            disabled={hasDependencies || !matches || submitting}
            aria-busy={submitting}
          >
            {hasDependencies ? "Reassignment required" : submitting ? "Deleting..." : `Delete ${expected}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrganisationSettingsModal = ({ areaManagement, onClose, onDeleteArea }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const areas = areaManagement?.areas ?? [];

  return (
    <div className={styles.overlay} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={styles.editModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editHeader}>
          <div>
            <h2 id={titleId} className={styles.wizardTitle}>Organisation settings</h2>
            <p className={styles.wizardSub}>
              High-impact organisation changes are kept here, away from routine directory actions.
            </p>
          </div>
          <button className={styles.profileCloseBtn} onClick={onClose} aria-label="Close organisation settings">
            <I name="xcircle" size={20} />
          </button>
        </div>
        <div className={styles.editBody}>
          <section className={styles.dangerZone} aria-labelledby={`${titleId}-danger`}>
            <div>
              <h3 id={`${titleId}-danger`}>Area deletion</h3>
              <p>
                Areas can only be deleted when empty. Reassign every site and person first; no dependent record is removed automatically.
              </p>
            </div>
            <div className={styles.dangerZoneRows}>
              {areas.map((area) => (
                <div key={area.id} className={styles.dangerZoneRow}>
                  <div>
                    <strong>{area.name}</strong>
                    <span>
                      {area.deletionImpact?.affectedSiteCount ?? 0} sites · {area.deletionImpact?.affectedUserCount ?? 0} people
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteAreaBtn}
                    onClick={() => onDeleteArea(area)}
                  >
                    Review deletion
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className={styles.editFooter}>
          <button type="button" className={styles.wizardCancel} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const EditStaffModal = ({ person, dashboard, currentUserId, onClose, onSubmitted }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const editableRoles = dashboard?.editableRolesByUser?.[person.id] ?? [];
  const [form, setForm] = useState({
    displayName: person.name || "",
    role: person.role || "",
    jobTitle: person.jobTitle || "",
    email: person.email || "",
    phoneExtension: person.phoneExtension || "",
    gdcNumber: person.gdcNumber || "",
    gdcType: person.gdcType || defaultGdcTypeForRole(person.role),
    gdcRenewal: person.gdcRenewal || "",
    bio: person.bio || "",
    qualificationsText: (person.qualifications || []).join("\n"),
    languagesText: (person.languages || []).join(", "),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const isClinical = isClinicalRole(form.role);

  const updateField = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors({});
    setError("");
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const next = {};
    if (!form.displayName.trim()) next.displayName = "Required";
    if (!form.role) next.role = "Required";
    if (!form.jobTitle.trim()) next.jobTitle = "Required";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const input = {
        displayName: form.displayName.trim(),
        role: form.role,
        jobTitle: form.jobTitle.trim(),
        email: form.email.trim(),
        phoneExtension: form.phoneExtension.trim(),
        gdcNumber: form.gdcNumber.trim(),
        gdcType: form.gdcType,
        gdcRenewal: form.gdcRenewal,
        bio: form.bio.trim(),
        qualifications: form.qualificationsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        languages: form.languagesText
          .split(",")
          .map((lang) => lang.trim())
          .filter(Boolean),
      };
      const dashboardNext = await editUserForManager(currentUserId, person.id, input);
      onSubmitted(dashboardNext);
    } catch (err) {
      setError(err.message || "Unable to update this staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.editModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editHeader}>
          <div>
            <h2 id={titleId} className={styles.wizardTitle}>Edit Profile · {person.name}</h2>
            <p className={styles.wizardSub}>Updates flow through the org map immediately.</p>
          </div>
          <button className={styles.profileCloseBtn} onClick={onClose} aria-label="Close" disabled={submitting}>
            <I name="xcircle" size={20} />
          </button>
        </div>

        <div className={styles.editBody}>
          <div className={styles.editSection}>
            <h4 className={styles.wizardSectionTitle}>Personal Details</h4>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Full Name <span className={styles.fieldRequired}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.displayName ? styles.inputError : ""}`} aria-invalid={Boolean(errors.displayName)}
                  value={form.displayName}
                  onChange={(e) => updateField({ displayName: e.target.value })}
                />
                {errors.displayName && <span className={styles.fieldError}>{errors.displayName}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => updateField({ email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone Extension</label>
                <input
                  className={styles.input}
                  value={form.phoneExtension}
                  onChange={(e) => updateField({ phoneExtension: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.editSection}>
            <h4 className={styles.wizardSectionTitle}>Role & Registration</h4>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Role <span className={styles.fieldRequired}>*</span>
                </label>
                <ThemedSelect
                  value={form.role}
                  onChange={(value) =>
                    updateField({
                      role: value,
                      gdcType: defaultGdcTypeForRole(value),
                      jobTitle: nextJobTitleForRoleChange(form.jobTitle, form.role, value),
                    })
                  }
                  options={editableRoles}
                  invalid={Boolean(errors.role)}
                  ariaLabel="Role"
                />
                {errors.role && <span className={styles.fieldError}>{errors.role}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Job Title <span className={styles.fieldRequired}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.jobTitle ? styles.inputError : ""}`} aria-invalid={Boolean(errors.jobTitle)}
                  value={form.jobTitle}
                  onChange={(e) => updateField({ jobTitle: e.target.value })}
                />
                {errors.jobTitle && <span className={styles.fieldError}>{errors.jobTitle}</span>}
              </div>
              {isClinical && (
                <>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>GDC Number</label>
                    <input
                      className={styles.input}
                      value={form.gdcNumber}
                      onChange={(e) => updateField({ gdcNumber: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>GDC Type</label>
                    <ThemedSelect
                      value={form.gdcType}
                      onChange={(value) => updateField({ gdcType: value })}
                      options={gdcTypeOptions}
                      ariaLabel="GDC type"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>GDC Renewal Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={form.gdcRenewal}
                      onChange={(e) => updateField({ gdcRenewal: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.editSection}>
            <h4 className={styles.wizardSectionTitle}>About</h4>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Bio</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={form.bio}
                onChange={(e) => updateField({ bio: e.target.value })}
              />
            </div>
            <div className={styles.formGrid} style={{ marginTop: 14 }}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Qualifications</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="One per line"
                  value={form.qualificationsText}
                  onChange={(e) => updateField({ qualificationsText: e.target.value })}
                />
                <span className={styles.fieldHint}>One per line</span>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Languages</label>
                <input
                  className={styles.input}
                  placeholder="English, French..."
                  value={form.languagesText}
                  onChange={(e) => updateField({ languagesText: e.target.value })}
                />
                <span className={styles.fieldHint}>Comma-separated</span>
              </div>
            </div>
          </div>

          {error && <div className={styles.errorBox} role="alert">{error}</div>}
        </div>

        <div className={styles.editFooter}>
          <button type="button" className={styles.wizardCancel} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <BtnPrimary onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

export const StaffDirectoryPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPractice, setFilterPractice] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showOrgMap, setShowOrgMap] = useState(false);
  const [showLeaveSettings, setShowLeaveSettings] = useState(false);
  const [orgMapSelectedId, setOrgMapSelectedId] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardManager, setWizardManager] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [siteModalArea, setSiteModalArea] = useState(null);
  const [showOrganisationSettings, setShowOrganisationSettings] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [areaSubmitting, setAreaSubmitting] = useState(false);
  const [siteSubmitting, setSiteSubmitting] = useState(false);
  const [areaDeleteSubmitting, setAreaDeleteSubmitting] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [siteError, setSiteError] = useState("");
  const [areaDeleteError, setAreaDeleteError] = useState("");
  const [actionError, setActionError] = useState("");
  // Per-section expand/collapse state. Practice sections default to collapsed
  // (cleaner page); Group Support is always open. Filtering / searching
  // temporarily force-expands all sections so matches stay visible.
  const [expandedSections, setExpandedSections] = useState(() => new Set());

  const isFilterActive = Boolean(searchTerm.trim() || filterPractice || filterRole);
  const isSectionExpanded = (sectionId) => {
    if (sectionId === "group") return true;
    if (isFilterActive) return true;
    return expandedSections.has(sectionId);
  };
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    getTimeOffDashboard(user.id)
      .then(setDashboard)
      .catch((err) => setActionError(err.message || "Unable to load staff directory."));
  }, [user?.id]);

  const allPeople = useMemo(() => {
    if (!dashboard?.organisationMap?.peopleById) return [];
    return Object.values(dashboard.organisationMap.peopleById);
  }, [dashboard]);

  const founder = useMemo(
    () => allPeople.find((person) => person.role === "companyOwner") ?? null,
    [allPeople],
  );

  const peopleForGrid = useMemo(
    () => allPeople.filter((person) => person.id !== founder?.id),
    [allPeople, founder?.id],
  );

  const practiceOptions = useMemo(() => {
    // Sourced from areaManagement so the list stays scope-aware AND includes
    // newly-created sites that don't have any staff yet — picking such a site
    // shows the empty section header rather than just hiding it from the
    // filter entirely.
    const areaSites =
      dashboard?.areaManagement?.areas?.flatMap((area) =>
        area.sites.map((site) => ({
          value: site.id,
          label: site.name,
          areaName: area.name,
        })),
      ) ?? [];
    if (areaSites.length === 0 && dashboard?.sites) {
      return dashboard.sites.map((site) => ({ value: site.id, label: site.name }));
    }
    return areaSites.sort((a, b) => a.label.localeCompare(b.label));
  }, [dashboard?.areaManagement, dashboard?.sites]);

  const roleOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const person of allPeople) {
      if (seen.has(person.role)) continue;
      seen.add(person.role);
      list.push({ value: person.role, label: person.roleLabel });
    }
    return list.sort((a, b) => a.label.localeCompare(b.label));
  }, [allPeople]);

  const filteredPeople = useMemo(() => {
    const lowered = searchTerm.trim().toLowerCase();
    return peopleForGrid.filter((person) => {
      if (filterPractice && person.siteId !== filterPractice) return false;
      if (filterRole && person.role !== filterRole) return false;
      if (lowered) {
        const haystack = [
          person.name,
          person.roleLabel,
          person.jobTitle,
          person.siteName,
          person.managedSiteLabel,
          person.areaName,
          person.gdcNumber,
          person.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(lowered)) return false;
      }
      return true;
    });
  }, [peopleForGrid, filterPractice, filterRole, searchTerm]);

  const groupedSections = useMemo(() => {
    const sites = dashboard?.sites ?? AREA_SITE_TARGETS;
    const visibleSites = filterPractice
      ? sites.filter((site) => site.id === filterPractice)
      : sites;
    return buildStaffDirectorySections({
      sites: visibleSites,
      people: filteredPeople,
      includeEmptySites: !searchTerm.trim() && !filterRole,
    });
  }, [filteredPeople, dashboard?.sites, filterPractice, filterRole, searchTerm]);

  const openProfile = (person) => setSelectedPerson(person);

  const refreshDashboard = (next) => {
    setDashboard(next);
    if (selectedPerson) {
      const updated = next.organisationMap.peopleById[selectedPerson.id];
      setSelectedPerson(updated ?? null);
    }
  };

  const openAddStaff = (manager) => {
    setWizardManager(manager ?? null);
    setWizardOpen(true);
  };

  const handleOrgMapAdd = (manager) => {
    setSelectedPerson(null);
    openAddStaff(manager);
  };

  const handleOrgMapEdit = (person) => {
    setSelectedPerson(null);
    setEditTarget(person);
  };

  const handleOrgMapMove = async (personId, managerId) => {
    setActionError("");
    const next = await moveUserForManager(user.id, personId, managerId);
    refreshDashboard(next);
    setOrgMapSelectedId(personId);
  };

  const handleOrgMapDelete = async (person, options = {}) => {
    setActionError("");
    const next = await deleteUserForManager(user.id, person.id, options);
    refreshDashboard(next);
    setOrgMapSelectedId(next.organisationMap.roots?.[0]?.id ?? "");
  };

  const handleProfileDelete = (person) => {
    setSelectedPerson(null);
    setDeleteTarget(person);
    setDeleteError("");
  };

  const handleDeleteConfirm = async (options = {}) => {
    if (!deleteTarget || deleteSubmitting) return;
    setDeleteSubmitting(true);
    setDeleteError("");
    try {
      const orgPerson = dashboard.organisationMap.peopleById[deleteTarget.id] ?? deleteTarget;
      await handleOrgMapDelete(orgPerson, options);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this user.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleWizardSubmitted = (next) => {
    refreshDashboard(next);
  };

  const handleEditSubmitted = (next) => {
    refreshDashboard(next);
    setEditTarget(null);
  };

  const handleLeaveSettingsSubmitted = (next) => {
    refreshDashboard(next);
  };

  const handleCreateArea = async ({ areaInput, managerInput }) => {
    if (areaSubmitting) return { ok: false };
    setAreaSubmitting(true);
    setAreaError("");
    try {
      const next = await createAreaWithManagerForCreator(user.id, areaInput, managerInput);
      refreshDashboard(next);
      return { ok: true };
    } catch (err) {
      setAreaError(err.message || "Unable to create this area.");
      return { ok: false };
    } finally {
      setAreaSubmitting(false);
    }
  };

  const handleCreateSite = async (input) => {
    if (!siteModalArea || siteSubmitting) return;
    setSiteSubmitting(true);
    setSiteError("");
    try {
      const next = await createSiteForManager(user.id, siteModalArea.id, input);
      refreshDashboard(next);
      setSiteModalArea(null);
    } catch (err) {
      setSiteError(err.message || "Unable to create this site.");
    } finally {
      setSiteSubmitting(false);
    }
  };

  const handleDeleteArea = async (confirmationText) => {
    if (!areaToDelete || areaDeleteSubmitting) return;
    setAreaDeleteSubmitting(true);
    setAreaDeleteError("");
    try {
      const next = await deleteAreaForManager(user.id, areaToDelete.id, { confirmationText });
      refreshDashboard(next);
      setAreaToDelete(null);
    } catch (err) {
      setAreaDeleteError(err.message || "Unable to delete this area.");
    } finally {
      setAreaDeleteSubmitting(false);
    }
  };

  const deletePersonFull = deleteTarget
    ? dashboard?.organisationMap?.peopleById?.[deleteTarget.id] ?? deleteTarget
    : null;

  return (
    <div>
      <SearchBar
        placeholder="Search staff by name, role, GDC number, or practice..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 className={styles.title}>Staff Directory</h1>
          <p className={styles.lead}>
            Connect with the Verbilo Dental Group team. Click any card for a full profile.
          </p>
        </div>
        <div className={styles.headerActions}>
          {dashboard?.leaveSettings?.canManage && (
            <BtnSecondary onClick={() => setShowLeaveSettings(true)}>
              <I name="settings" size={15} /> Leave Settings
            </BtnSecondary>
          )}
          {dashboard?.areaManagement?.canCreateAreas && (
            <BtnSecondary onClick={() => setShowOrganisationSettings(true)}>
              <I name="settings" size={15} /> Organisation Settings
            </BtnSecondary>
          )}
          <BtnSecondary
            onClick={() => {
              setOrgMapSelectedId(user?.id || "");
              setShowOrgMap(true);
            }}
          >
            <I name="org" size={15} /> View Org Map
          </BtnSecondary>
          {dashboard?.canAddOrganisationMembers && (
            <BtnPrimary onClick={() => openAddStaff(null)}>
              <I name="userplus" size={15} color="var(--on-primary)" /> Add Staff Member
            </BtnPrimary>
          )}
        </div>
      </div>

      <div className={styles.filterRow}>
        <button
          type="button"
          className={`${styles.filterPill} ${!filterPractice && !filterRole ? styles.filterPillActive : ""}`}
          onClick={() => {
            setFilterPractice("");
            setFilterRole("");
          }}
        >
          <I name="person" size={13} /> All Staff
        </button>
        <FilterDropdown
          label="By Practice"
          icon="building"
          value={filterPractice}
          onChange={setFilterPractice}
          valueLabel={practiceOptions.find((option) => option.value === filterPractice)?.label}
          options={practiceOptions}
        />
        <FilterDropdown
          label="By Role"
          icon="briefcase"
          value={filterRole}
          onChange={setFilterRole}
          valueLabel={roleOptions.find((option) => option.value === filterRole)?.label}
          options={roleOptions}
        />
      </div>

      <AreasAndSitesPanel
        areaManagement={dashboard?.areaManagement}
        onAddArea={() => {
          setAreaError("");
          setShowAreaModal(true);
        }}
        onAddSite={(area) => {
          setSiteError("");
          setSiteModalArea(area);
        }}
      />

      {actionError && <div className={styles.errorBox} role="alert">{actionError}</div>}

      {founder && !filterPractice && !filterRole && !searchTerm && (
        <StaffFeaturedCard person={founder} onClick={openProfile} />
      )}

      {groupedSections.length ? (
        groupedSections.map((section) => {
          const actingPm = dashboard?.actingPmBySiteId?.[section.id] ?? null;
          const isGroup = section.id === "group";
          const expanded = isSectionExpanded(section.id);
          const headerInner = (
            <>
              <div className={styles.practiceSectionTitleWrap}>
                <h2 className={styles.practiceSectionTitle}>
                  {!isGroup && (
                    <span
                      className={`${styles.collapseChevron} ${expanded ? styles.collapseChevronOpen : ""}`}
                      aria-hidden="true"
                    >
                      <I name="arrow" size={12} />
                    </span>
                  )}
                  <I name={section.icon} size={16} color="var(--primary)" /> {section.name}
                </h2>
                {section.subtitle && (
                  <div className={styles.practiceSectionSubtitle}>{section.subtitle}</div>
                )}
              </div>
              <div className={styles.practiceSectionMeta}>
                {actingPm && (
                  <span
                    className={styles.actingPmPill}
                    title="No dedicated Practice Manager — covered by the Area Manager."
                  >
                    <I name="shield" size={11} /> Acting PM: {actingPm.name}
                  </span>
                )}
                <span className={styles.practiceSectionCount}>
                  {section.people.length} {section.people.length === 1 ? "person" : "people"}
                </span>
              </div>
            </>
          );

          return (
            <section key={section.id} className={styles.practiceSection}>
              {isGroup ? (
                <div className={styles.practiceSectionHeader}>{headerInner}</div>
              ) : (
                <button
                  type="button"
                  className={`${styles.practiceSectionHeader} ${styles.practiceSectionHeaderToggle}`}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={expanded}
                >
                  {headerInner}
                </button>
              )}
              {expanded &&
                (section.people.length ? (
                  <div className={styles.cardGrid}>
                    {section.people.map((person) => (
                      <StaffCard key={person.id} person={person} onClick={openProfile} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.siteEmptyState}>
                    <I name="building" size={16} color="var(--outline)" />
                    <div>
                      <strong>No staff assigned yet</strong>
                      <span>
                        {actingPm
                          ? `${actingPm.name} is acting as Practice Manager until a dedicated PM is added.`
                          : "Add a practice manager or team members when this site is ready."}
                      </span>
                    </div>
                  </div>
                ))}
            </section>
          );
        })
      ) : (
        <div className={styles.gridEmpty}>
          {dashboard ? "No staff match the current filters." : "Loading..."}
        </div>
      )}

      {selectedPerson && (
        <StaffProfileModal
          person={selectedPerson}
          dashboard={dashboard}
          currentUserId={user?.id}
          onClose={() => setSelectedPerson(null)}
          onEdit={(person) => {
            setSelectedPerson(null);
            setEditTarget(person);
          }}
          onDelete={handleProfileDelete}
        />
      )}

      {editTarget && dashboard && (
        <EditStaffModal
          person={editTarget}
          dashboard={dashboard}
          currentUserId={user?.id}
          onClose={() => setEditTarget(null)}
          onSubmitted={handleEditSubmitted}
        />
      )}

      {showLeaveSettings && dashboard?.leaveSettings?.canManage && (
        <LeaveSettingsModal
          dashboard={dashboard}
          currentUserId={user?.id}
          onClose={() => setShowLeaveSettings(false)}
          onSubmitted={handleLeaveSettingsSubmitted}
        />
      )}

      {deletePersonFull && (
        <DeleteUserModal
          person={deletePersonFull}
          affectedPeople={flattenDescendants(deletePersonFull)}
          submitting={deleteSubmitting}
          error={deleteError}
          onClose={() => {
            if (!deleteSubmitting) setDeleteTarget(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {wizardOpen && dashboard && (
        <AddStaffWizard
          mode={wizardManager ? "fromOrgMap" : "fromDirectory"}
          manager={wizardManager}
          dashboard={dashboard}
          currentUserId={user?.id}
          onClose={() => {
            setWizardOpen(false);
            setWizardManager(null);
          }}
          onSubmitted={(next) => {
            handleWizardSubmitted(next);
          }}
        />
      )}

      {showAreaModal && (
        <AreaWithManagerWizard
          dashboard={dashboard}
          submitting={areaSubmitting}
          error={areaError}
          onClose={() => {
            if (!areaSubmitting) setShowAreaModal(false);
          }}
          onSubmit={handleCreateArea}
        />
      )}

      {siteModalArea && (
        <SiteModal
          area={siteModalArea}
          submitting={siteSubmitting}
          error={siteError}
          onClose={() => {
            if (!siteSubmitting) setSiteModalArea(null);
          }}
          onSubmit={handleCreateSite}
        />
      )}

      {areaToDelete && (
        <DeleteAreaModal
          area={areaToDelete}
          submitting={areaDeleteSubmitting}
          error={areaDeleteError}
          onClose={() => {
            if (!areaDeleteSubmitting) setAreaToDelete(null);
          }}
          onConfirm={handleDeleteArea}
        />
      )}

      {showOrganisationSettings && dashboard?.areaManagement?.canCreateAreas && (
        <OrganisationSettingsModal
          areaManagement={dashboard.areaManagement}
          onClose={() => setShowOrganisationSettings(false)}
          onDeleteArea={(area) => {
            setAreaDeleteError("");
            setShowOrganisationSettings(false);
            setAreaToDelete(area);
          }}
        />
      )}

      {showOrgMap && dashboard?.organisationMap && (
        <OrgMapModal
          map={dashboard.organisationMap}
          selectedId={orgMapSelectedId}
          currentUserId={user?.id}
          createableRolesByManager={dashboard.createableRolesByManager ?? {}}
          editableRolesByUser={dashboard.editableRolesByUser ?? {}}
          moveTargetsByPerson={dashboard.moveTargetsByPerson ?? {}}
          deleteableUserIds={dashboard.deleteableUserIds ?? []}
          onSelect={setOrgMapSelectedId}
          onCreateDirectReport={handleOrgMapAdd}
          onEditPerson={handleOrgMapEdit}
          onMovePerson={handleOrgMapMove}
          onDeletePerson={handleOrgMapDelete}
          onClose={() => setShowOrgMap(false)}
        />
      )}
    </div>
  );
};
