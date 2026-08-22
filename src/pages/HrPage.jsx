import { useState, useEffect, useId, useMemo, useRef } from "react";
import { I } from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { ThemedSelect } from "../components/ui/ThemedSelect";
import {
  listPolicies,
  addPolicy,
  listMandatoryTraining,
  listNotices,
  listHrQuickLinks,
} from "../services/hr.service";
import {
  ABSENCE_TYPES,
  calculateWorkingDays,
  decideTimeOffRequestForApprover,
  findCalendarClashes,
  getTimeOffDashboard,
  submitTimeOffRequest,
  validateTimeOffRequest,
} from "../services/timeOff.service";
import {
  didPanPastClickTolerance,
  nextPanPosition,
} from "../utils/orgMapPan";
import { useModalA11y } from "../hooks/useModalA11y";
import styles from "./HrPage.module.css";

const trainingStatus = {
  done: { label: () => "Complete", bg: "rgba(37,111,42,0.12)", color: "#256f2a" },
  due: { label: (due) => `Due ${due}`, bg: "rgba(147,75,0,0.12)", color: "#934b00" },
  overdue: { label: (due) => `Overdue ${due}`, bg: "rgba(229,57,53,0.12)", color: "var(--error)" },
};

const statusConfig = {
  Pending: { className: styles.statusPending, label: "Pending" },
  Approved: { className: styles.statusApproved, label: "Approved" },
  Rejected: { className: styles.statusRejected, label: "Rejected" },
};

const formatDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const parseIsoDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const startOfMonth = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const addMonths = (date, amount) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));

const daysForMonth = (monthDate) => {
  const days = new Date(
    Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), index + 1));
    return {
      date,
      day: index + 1,
      weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(date),
      isWeekend: [0, 6].includes(date.getUTCDay()),
    };
  });
};

const eventOverlapsMonth = (event, monthDate) => {
  const start = parseIsoDate(event.startDate);
  const end = parseIsoDate(event.endDate);
  if (!start || !end) return false;
  const monthStart = startOfMonth(monthDate);
  const monthEnd = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0));
  return end >= monthStart && start <= monthEnd;
};

const eventLayoutForMonth = (event, monthDate) => {
  if (!eventOverlapsMonth(event, monthDate)) return null;

  const start = parseIsoDate(event.startDate);
  const end = parseIsoDate(event.endDate);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0));
  const visibleStart = start < monthStart ? monthStart : start;
  const visibleEnd = end > monthEnd ? monthEnd : end;

  return {
    startDay: visibleStart.getUTCDate(),
    endDay: visibleEnd.getUTCDate(),
  };
};

const calendarInitialMonth = (events = []) => {
  const current = startOfMonth(new Date());
  if (!events.length || events.some((event) => eventOverlapsMonth(event, current))) return current;

  const future = events
    .map((event) => parseIsoDate(event.startDate))
    .filter((date) => date && date >= current)
    .sort((a, b) => a - b)[0];
  if (future) return startOfMonth(future);

  const first = events
    .map((event) => parseIsoDate(event.startDate))
    .filter(Boolean)
    .sort((a, b) => a - b)[0];
  return first ? startOfMonth(first) : current;
};

const formatMonthLabel = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const isSicknessAbsence = (absenceType = "") => absenceType.startsWith("Sickness");

const isBalanceWarningType = (absenceType) =>
  absenceType === "Holiday" || absenceType === "Holiday unpaid" || isSicknessAbsence(absenceType);

const allowsNegativeBalance = (absenceType) => {
  const value = (absenceType ?? "").toLowerCase();
  return value.includes("unpaid") || value.includes("sickness");
};

const balanceForAbsence = (person = {}, absenceType) =>
  isSicknessAbsence(absenceType)
    ? {
        label: "Sick allowance",
        entitlement: person.sickLeaveEntitlement ?? 10,
        used: person.usedSickDays ?? 0,
        remaining: person.remainingSickDays ?? person.sickLeaveEntitlement ?? 10,
      }
    : {
        label: "Holiday balance",
        entitlement: person.annualLeaveEntitlement ?? 25,
        used: person.usedLeaveDays ?? 0,
        remaining: person.remainingLeaveDays ?? person.annualLeaveEntitlement ?? 25,
      };

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.Pending;
  return <span className={`${styles.statusBadge} ${cfg.className}`}>{cfg.label}</span>;
};

const EmptyState = ({ children }) => (
  <div className={styles.emptyState}>{children}</div>
);

const BalanceMetric = ({ label, value, tone }) => (
  <div className={`${styles.balanceMetric} ${tone ? styles[tone] : ""}`}>
    <div className={styles.balanceMetricValue}>{value}</div>
    <div className={styles.balanceMetricLabel}>{label}</div>
  </div>
);

const RequestSummaryLine = ({ label, value }) => (
  <div className={styles.requestSummaryLine}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const initialsFor = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const PersonAvatar = ({ person, className, as: Tag = "div" }) =>
  person?.profileImage ? (
    <img
      src={person.profileImage}
      alt={person.name}
      className={`${className} ${styles.orgAvatarImage}`}
      draggable={false}
    />
  ) : (
    <Tag className={className}>{initialsFor(person?.name)}</Tag>
  );

const RequestHistoryCard = ({ request, showPerson = false }) => (
  <div className={styles.historyCard}>
    <div className={styles.historyTop}>
      <div>
        {showPerson && <div className={styles.requestPerson}>{request.requester.name}</div>}
        <div className={styles.historyTitle}>{request.absenceType}</div>
        <div className={styles.historyMeta}>
          {formatDate(request.startDate)} to {formatDate(request.endDate)} - {request.requestedDays} day
          {request.requestedDays !== 1 ? "s" : ""}
        </div>
      </div>
      <StatusBadge status={request.status} />
    </div>
    {request.comment && <p className={styles.requestComment}>{request.comment}</p>}
    <div className={styles.historyDecision}>
      {request.selfManaged
        ? "Self-managed - no approver required"
        : request.status === "Pending"
          ? `Submitted ${formatDateTime(request.createdAt)}`
          : `${request.status} ${formatDateTime(request.decidedAt)}${request.approver ? ` by ${request.approver.name}` : ""}`}
    </div>
    {request.decisionComment && !request.selfManaged && (
      <div className={styles.decisionComment}>{request.decisionComment}</div>
    )}
  </div>
);

const SnapshotEventLine = ({ event }) => (
  <div className={styles.snapshotEventLine}>
    <PersonAvatar person={event.person} className={styles.snapshotAvatar} />
    <div>
      <strong>{event.person?.name ?? "—"}</strong>
      <span>
        {event.absenceType} - {formatDate(event.startDate)}
        {event.startDate !== event.endDate ? ` to ${formatDate(event.endDate)}` : ""}
      </span>
    </div>
  </div>
);

const SnapshotCard = ({ title, count, events, emptyText }) => (
  <div className={styles.teamSnapshotCard}>
    <div className={styles.teamSnapshotHeader}>
      <span>{title}</span>
      <strong>{count}</strong>
    </div>
    <div className={styles.teamSnapshotList}>
      {events.length ? (
        events.slice(0, 3).map((event) => <SnapshotEventLine key={event.id} event={event} />)
      ) : (
        <div className={styles.teamSnapshotEmpty}>{emptyText}</div>
      )}
      {events.length > 3 && (
        <div className={styles.teamSnapshotMore}>+ {events.length - 3} more</div>
      )}
    </div>
  </div>
);

const TeamAbsenceSnapshot = ({ calendar }) => {
  const summary = calendar?.summary;
  if (!summary) return null;

  return (
    <div className={styles.teamSnapshotGrid}>
      <SnapshotCard
        title="Off today"
        count={summary.offToday.length}
        events={summary.offToday}
        emptyText="No one off today."
      />
      <SnapshotCard
        title="This week"
        count={summary.offThisWeek.length}
        events={summary.offThisWeek}
        emptyText="No approved leave this week."
      />
      <SnapshotCard
        title="Next 14 days"
        count={summary.upcoming.length}
        events={summary.upcoming}
        emptyText="No upcoming approved leave."
      />
    </div>
  );
};

const PendingApprovalCard = ({ request, onDecision, busy }) => {
  const requestBalance = balanceForAbsence(request.requester, request.absenceType);
  const wouldGoNegative = requestBalance.remaining - request.requestedDays < 0;
  const approvalBlocked = wouldGoNegative && !allowsNegativeBalance(request.absenceType);

  return (
    <div className={styles.approvalCard}>
      <div className={styles.approvalMain}>
        <div>
          <div className={styles.requestPerson}>{request.requester.name}</div>
          <h4 className={styles.approvalTitle}>{request.absenceType}</h4>
          <div className={styles.historyMeta}>
            {formatDate(request.startDate)} to {formatDate(request.endDate)} - {request.requestedDays} day
            {request.requestedDays !== 1 ? "s" : ""}
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className={styles.approvalBalanceGrid}>
        <RequestSummaryLine label={requestBalance.label} value={`${requestBalance.entitlement} days`} />
        <RequestSummaryLine label="Used days" value={`${requestBalance.used} days`} />
        <RequestSummaryLine label="Remaining" value={`${requestBalance.remaining} days`} />
      </div>

      {request.comment && <p className={styles.requestComment}>{request.comment}</p>}
      {approvalBlocked && (
        <div className={styles.warningBox}>
          Approving this would push {request.requester.name}'s {requestBalance.label.toLowerCase()} below zero.
        </div>
      )}

      <div className={styles.approvalActions}>
        <button
          type="button"
          className={styles.rejectBtn}
          onClick={() => onDecision(request.id, "Rejected")}
          disabled={busy}
        >
          <I name="xcircle" size={15} /> Reject
        </button>
        <button
          type="button"
          className={styles.approveBtn}
          onClick={() => onDecision(request.id, "Approved")}
          disabled={busy || approvalBlocked}
        >
          <I name="checkcircle" size={15} /> Approve
        </button>
      </div>
    </div>
  );
};

const LeaveModal = ({ balance, calendar, requesterId, onClose, onSubmit }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const [form, setForm] = useState({
    absenceType: "",
    startDate: "",
    endDate: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const days = calculateWorkingDays(form.startDate, form.endDate);
  const selectedBalance = balanceForAbsence(balance, form.absenceType);
  const exceedsBalance = isBalanceWarningType(form.absenceType) && days > selectedBalance.remaining;
  const projectedBalance = selectedBalance.remaining - days;
  const clashWarnings = findCalendarClashes(calendar, form, requesterId);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const validation = validateTimeOffRequest(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Unable to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.leaveModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {submitted ? (
          <div className={styles.leaveSuccess}>
            <I name="checkcircle" size={52} color="var(--success)" />
            <h3 className={styles.leaveSuccessTitle}>Request Submitted</h3>
            <p className={styles.leaveSuccessDesc}>
              Your {form.absenceType.toLowerCase()} request for{" "}
              <strong>{days} working day{days !== 1 ? "s" : ""}</strong> has been saved.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        ) : (
          <>
            <div className={styles.leaveModalHeader}>
              <div>
                <h2 id={titleId} className={styles.leaveModalTitle}>Request Time Off</h2>
                <p className={styles.leaveModalSub}>
                  Requests follow your current reporting line for approval.
                </p>
              </div>
              <button className={styles.leaveCloseBtn} onClick={onClose} aria-label="Close">
                <I name="xcircle" size={22} />
              </button>
            </div>

            <div className={styles.leaveModalBody}>
              <div className={styles.leaveField}>
                <label className={styles.leaveFieldLabel}>
                  Absence Type
                  {errors.absenceType && <span className={styles.leaveErrText}> - {errors.absenceType}</span>}
                </label>
                <ThemedSelect
                  value={form.absenceType}
                  onChange={(value) => updateField("absenceType", value)}
                  placeholder="Select absence type"
                  invalid={Boolean(errors.absenceType)}
                  ariaLabel="Absence type"
                  options={ABSENCE_TYPES.map((type) => ({ value: type, label: type }))}
                />
              </div>

              <div className={styles.leaveDateRow}>
                <div className={styles.leaveField}>
                  <label className={styles.leaveFieldLabel}>
                    Start Date
                    {errors.startDate && <span className={styles.leaveErrText}> - {errors.startDate}</span>}
                  </label>
                  <input
                    type="date"
                    className={`${styles.leaveInput} ${errors.startDate ? styles.leaveInputErr : ""}`}
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>
                <div className={styles.leaveField}>
                  <label className={styles.leaveFieldLabel}>
                    End Date
                    {errors.endDate && <span className={styles.leaveErrText}> - {errors.endDate}</span>}
                  </label>
                  <input
                    type="date"
                    className={`${styles.leaveInput} ${errors.endDate ? styles.leaveInputErr : ""}`}
                    value={form.endDate}
                    min={form.startDate || undefined}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
              </div>

              {errors.requestedDays && (
                <div className={styles.errorBox} role="alert">{errors.requestedDays}</div>
              )}

              <div className={styles.leaveField}>
                <label className={styles.leaveFieldLabel}>
                  Comment / Reason <span className={styles.leaveOptional}>(optional)</span>
                </label>
                <textarea
                  className={styles.leaveTextarea}
                  rows={3}
                  placeholder="Add any context for your approver..."
                  value={form.comment}
                  onChange={(e) => updateField("comment", e.target.value)}
                />
              </div>

              <div className={styles.requestSummaryBox}>
                <div className={styles.requestSummaryHeader}>
                  <I name="calendar" size={15} color="var(--primary)" />
                  <span>Request Summary</span>
                </div>
                <RequestSummaryLine label="Requested days" value={`${days} day${days !== 1 ? "s" : ""}`} />
                <RequestSummaryLine label={`Current ${selectedBalance.label.toLowerCase()}`} value={`${selectedBalance.remaining} days`} />
                <RequestSummaryLine
                  label="Projected remaining"
                  value={days > 0 ? `${projectedBalance} days` : "-"}
                />
              </div>

              {exceedsBalance && (
                <div className={styles.warningBox}>
                  This request exceeds the current remaining balance. Your approver will see this before deciding.
                </div>
              )}
              {clashWarnings.length > 0 && (
                <div className={styles.clashWarningBox}>
                  <strong>Potential team clash</strong>
                  <span>
                    {clashWarnings.length} colleague{clashWarnings.length !== 1 ? "s are" : " is"} already away
                    during these dates.
                  </span>
                  <div className={styles.clashWarningList}>
                    {clashWarnings.slice(0, 3).map((event) => (
                      <div key={event.id} className={styles.clashWarningItem}>
                        <span>{event.person.name}</span>
                        <em>
                          {event.absenceType} - {formatDate(event.startDate)}
                          {event.startDate !== event.endDate ? ` to ${formatDate(event.endDate)}` : ""}
                        </em>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {submitError && <div className={styles.errorBox} role="alert">{submitError}</div>}
            </div>

            <div className={styles.leaveModalFooter}>
              <button className={styles.leaveCancelBtn} onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <BtnPrimary onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
                {submitting ? "Submitting..." : "Submit Request"}
              </BtnPrimary>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CalendarMetric = ({ label, value }) => (
  <div className={styles.calendarMetric}>
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const CalendarEventChip = ({ event, layout, index }) => (
  <div
    className={`${styles.calendarEvent} ${
      event.status === "Approved" ? styles.calendarEventApproved : styles.calendarEventPending
    }`}
    style={{
      gridColumn: `${layout.startDay + 1} / ${layout.endDay + 2}`,
      gridRow: 1,
      marginTop: `${8 + index * 27}px`,
    }}
    title={`${event.person?.name ?? "Unknown"}: ${event.absenceType}, ${formatDate(event.startDate)} to ${formatDate(event.endDate)}`}
  >
    <span>{event.absenceType}</span>
    <em>{event.requestedDays} day{event.requestedDays !== 1 ? "s" : ""}</em>
  </div>
);

const TeamCalendarModal = ({ calendar, onClose }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(onClose);
  const [monthDate, setMonthDate] = useState(() => calendarInitialMonth(calendar?.events ?? []));
  const [statusFilter, setStatusFilter] = useState("all");
  const [absenceTypeFilter, setAbsenceTypeFilter] = useState("all");
  const monthDays = daysForMonth(monthDate);
  const absenceTypeOptions = Array.from(
    new Set((calendar?.events ?? []).map((event) => event.absenceType)),
  ).sort();
  const filteredEvents = (calendar?.events ?? [])
    .filter((event) => statusFilter === "all" || event.status === statusFilter)
    .filter((event) => absenceTypeFilter === "all" || event.absenceType === absenceTypeFilter);
  const monthEvents = filteredEvents.filter((event) => eventOverlapsMonth(event, monthDate));
  const approvedCount = monthEvents.filter((event) => event.status === "Approved").length;
  const pendingCount = monthEvents.filter((event) => event.status === "Pending").length;
  const eventsByPerson = monthEvents.reduce((map, event) => {
    const existing = map.get(event.userId) ?? [];
    existing.push(event);
    map.set(event.userId, existing);
    return map;
  }, new Map());

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`${styles.overlay} ${styles.orgOverlay}`} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.calendarModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.leaveModalHeader}>
          <div>
            <h2 id={titleId} className={styles.leaveModalTitle}>Team Calendar</h2>
            <p className={styles.leaveModalSub}>
              {calendar?.scopeLabel ?? "Your team"} - {calendar?.scopeDescription ?? "Holiday planner"}
            </p>
          </div>
          <div className={styles.calendarHeaderActions}>
            <button
              type="button"
              className={styles.orgResetBtn}
              onClick={() => setMonthDate((value) => addMonths(value, -1))}
            >
              Previous
            </button>
            <button
              type="button"
              className={styles.orgResetBtn}
              onClick={() => setMonthDate(startOfMonth(new Date()))}
            >
              Today
            </button>
            <button
              type="button"
              className={styles.orgResetBtn}
              onClick={() => setMonthDate((value) => addMonths(value, 1))}
            >
              Next
            </button>
            <button className={styles.leaveCloseBtn} onClick={onClose} aria-label="Close">
              <I name="xcircle" size={22} />
            </button>
          </div>
        </div>

        <div className={styles.calendarToolbar}>
          <div>
            <div className={styles.calendarEyebrow}>Calendar month</div>
            <h3 className={styles.calendarMonthTitle}>{formatMonthLabel(monthDate)}</h3>
          </div>
          <div className={styles.calendarMetrics}>
            <CalendarMetric label="Visible people" value={calendar?.peopleCount ?? 0} />
            <CalendarMetric label="Approved" value={approvedCount} />
            <CalendarMetric label="Pending" value={pendingCount} />
          </div>
          <div className={styles.calendarFilters}>
            <label className={styles.calendarFilter}>
              <span>Status</span>
              <ThemedSelect
                value={statusFilter}
                onChange={setStatusFilter}
                variant="pill"
                ariaLabel="Calendar status filter"
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "Approved", label: "Approved" },
                  { value: "Pending", label: "Pending" },
                ]}
              />
            </label>
            <label className={styles.calendarFilter}>
              <span>Type</span>
              <ThemedSelect
                value={absenceTypeFilter}
                onChange={setAbsenceTypeFilter}
                variant="pill"
                ariaLabel="Calendar absence type filter"
                options={[
                  { value: "all", label: "All absence types" },
                  ...absenceTypeOptions.map((type) => ({ value: type, label: type })),
                ]}
              />
            </label>
          </div>
          <div className={styles.calendarLegend}>
            <span><i className={styles.calendarLegendApproved} /> Approved</span>
            <span><i className={styles.calendarLegendPending} /> Pending</span>
          </div>
        </div>

        <div className={styles.calendarPlannerScroller}>
          <div
            className={styles.calendarPlanner}
            style={{ gridTemplateColumns: `220px repeat(${monthDays.length}, minmax(32px, 1fr))` }}
          >
            <div className={`${styles.calendarHeaderCell} ${styles.calendarPersonHeader}`}>Person</div>
            {monthDays.map((day) => (
              <div
                key={day.day}
                className={`${styles.calendarHeaderCell} ${
                  day.isWeekend ? styles.calendarWeekendCell : ""
                }`}
              >
                <strong>{day.day}</strong>
                <span>{day.weekday}</span>
              </div>
            ))}

            {(calendar?.people ?? []).map((person) => {
              const personEvents = (eventsByPerson.get(person.id) ?? [])
                .map((event) => ({ event, layout: eventLayoutForMonth(event, monthDate) }))
                .filter((item) => item.layout);
              const rowHeight = Math.max(68, 44 + personEvents.length * 28);

              return (
                <div
                  key={person.id}
                  className={styles.calendarPlannerRow}
                  style={{
                    gridTemplateColumns: `220px repeat(${monthDays.length}, minmax(32px, 1fr))`,
                    minHeight: rowHeight,
                  }}
                >
                  <div className={styles.calendarPersonCell}>
                    <PersonAvatar person={person} className={styles.calendarAvatar} />
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.roleLabel}</span>
                      <em>{person.siteName || person.areaName || "Group"}</em>
                    </div>
                  </div>
                  {monthDays.map((day) => (
                    <div
                      key={day.day}
                      className={`${styles.calendarDayCell} ${
                        day.isWeekend ? styles.calendarWeekendCell : ""
                      }`}
                    />
                  ))}
                  {personEvents.map(({ event, layout }, index) => (
                    <CalendarEventChip
                      key={event.id}
                      event={event}
                      layout={layout}
                      index={index}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          {monthEvents.length === 0 && (
            <div className={styles.calendarEmptyOverlay}>
              No approved or visible pending leave in {formatMonthLabel(monthDate)}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const flattenOrgDescendants = (person) =>
  (person?.children ?? []).flatMap((child) => [child, ...flattenOrgDescendants(child)]);

export const DeleteUserModal = ({ person, affectedPeople, submitting, error, onClose, onConfirm }) => {
  const titleId = useId();
  const dialogRef = useModalA11y(() => !submitting && onClose?.());
  const [cascadeAcknowledged, setCascadeAcknowledged] = useState(false);
  const isCascadeDelete = affectedPeople.length > 0;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };
  const handleConfirm = () => {
    if (isCascadeDelete && !cascadeAcknowledged) {
      setCascadeAcknowledged(true);
      return;
    }

    onConfirm({ cascade: isCascadeDelete });
  };

  return (
    <div className={`${styles.overlay} ${styles.confirmOverlay}`} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.leaveModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.leaveModalHeader}>
          <div>
            <h2 id={titleId} className={styles.leaveModalTitle}>Delete User</h2>
            <p className={styles.leaveModalSub}>This removes them from the local mock org data.</p>
          </div>
          <button
            className={styles.leaveCloseBtn}
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            <I name="xcircle" size={22} />
          </button>
        </div>

        <div className={styles.leaveModalBody}>
          <div className={styles.deleteSummaryBox}>
            <PersonAvatar person={person} className={styles.orgDetailAvatar} />
            <div>
              <strong>{person.name}</strong>
              <span>{person.roleLabel}</span>
            </div>
          </div>
          {isCascadeDelete ? (
            <>
              <div className={styles.warningBox}>
                Deleting {person.name} will also delete {affectedPeople.length} person
                {affectedPeople.length !== 1 ? "s" : ""} underneath them from this local POC.
              </div>
              <div className={styles.deleteCascadeBox}>
                <span>Also removed</span>
                <div className={styles.deleteCascadeList}>
                  {affectedPeople.map((user) => (
                    <div key={user.id} className={styles.deleteCascadeItem}>
                      <strong>{user.name}</strong>
                      <em>{user.roleLabel}</em>
                    </div>
                  ))}
                </div>
              </div>
              {cascadeAcknowledged && (
                <div className={styles.errorBox} role="alert">
                  Final confirmation: this will delete {person.name} and everyone listed above.
                </div>
              )}
            </>
          ) : (
            <div className={styles.warningBox}>
              This removes {person.name} and their local time off records from this POC.
            </div>
          )}
          {error && <div className={styles.errorBox} role="alert">{error}</div>}
        </div>

        <div className={styles.leaveModalFooter}>
          <button className={styles.leaveCancelBtn} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.deleteConfirmBtn}
            onClick={handleConfirm}
            disabled={submitting}
            aria-busy={submitting}
          >
            <I name="trash" size={15} />{" "}
            {submitting
              ? "Deleting..."
              : isCascadeDelete && !cascadeAcknowledged
                ? "Continue"
                : `Delete ${isCascadeDelete ? affectedPeople.length + 1 : 1} User${isCascadeDelete ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MoveBranchModal = ({
  person,
  newManager,
  affectedPeople,
  submitting,
  error,
  onClose,
  onConfirm,
}) => {
  const titleId = useId();
  const dialogRef = useModalA11y(() => !submitting && onClose?.());
  const totalPeople = affectedPeople.length + 1;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };

  return (
    <div className={`${styles.overlay} ${styles.confirmOverlay}`} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.leaveModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.leaveModalHeader}>
          <div>
            <h2 id={titleId} className={styles.leaveModalTitle}>Move Branch</h2>
            <p className={styles.leaveModalSub}>Confirm this organisation change.</p>
          </div>
          <button
            className={styles.leaveCloseBtn}
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            <I name="xcircle" size={22} />
          </button>
        </div>

        <div className={styles.leaveModalBody}>
          <div className={styles.deleteSummaryBox}>
            <PersonAvatar person={person} className={styles.orgDetailAvatar} />
            <div>
              <strong>{person.name}</strong>
              <span>{person.roleLabel}</span>
            </div>
          </div>
          <div className={styles.warningBox}>
            Move {person.name} and {affectedPeople.length} person
            {affectedPeople.length !== 1 ? "s" : ""} underneath them to report to {newManager.name}.
          </div>
          <div className={styles.deleteCascadeBox}>
            <span>Branch moving with {person.name}</span>
            <div className={styles.deleteCascadeList}>
              {affectedPeople.map((user) => (
                <div key={user.id} className={styles.deleteCascadeItem}>
                  <strong>{user.name}</strong>
                  <em>{user.roleLabel}</em>
                </div>
              ))}
            </div>
          </div>
          {error && <div className={styles.errorBox} role="alert">{error}</div>}
        </div>

        <div className={styles.leaveModalFooter}>
          <button className={styles.leaveCancelBtn} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.approveBtn}
            onClick={onConfirm}
            disabled={submitting}
            aria-busy={submitting}
          >
            <I name="move" size={15} /> {submitting ? "Moving..." : `Move ${totalPeople} User${totalPeople !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrgMapNode = ({
  node,
  selectedId,
  currentUserId,
  editMode,
  createableRolesByManager,
  moveTargetsByPerson,
  draggedPersonId,
  dropTargetId,
  onSelect,
  onCreateDirectReport,
  onPersonDragStart,
  onPersonDragMove,
  onPersonDragEnd,
  shouldSuppressClick,
}) => {
  const canCreateDirectReport = (createableRolesByManager?.[node.id] ?? []).length > 0;
  // Per-node "+" buttons handle adding now — no Add Mode toggle required.
  const canAddDirectReport = canCreateDirectReport;
  const canMove = editMode && (moveTargetsByPerson?.[node.id] ?? []).length > 0;
  const canDrop =
    editMode &&
    draggedPersonId &&
    (moveTargetsByPerson?.[draggedPersonId] ?? []).includes(node.id);
  const isDragging = draggedPersonId === node.id;
  const isDropTarget = dropTargetId === node.id;
  const isDragMuted = editMode && Boolean(draggedPersonId) && !isDragging && !canDrop;

  return (
  <div className={styles.orgNodeWrap}>
    <div className={styles.orgNodeCard}>
      <button
        type="button"
        draggable={false}
        data-org-person-id={node.id}
        className={`${styles.orgNodeBtn} ${selectedId === node.id ? styles.orgNodeSelected : ""} ${
          canMove ? styles.orgNodeMovable : ""
        } ${canMove ? styles.orgNodeWiggle : ""} ${
          canAddDirectReport ? styles.orgNodeAddReady : ""
        } ${
          canDrop ? styles.orgNodeDropCandidate : ""
        } ${isDropTarget ? styles.orgNodeDropTarget : ""} ${
          isDragging ? styles.orgNodeDragging : ""
        } ${isDragMuted ? styles.orgNodeDragMuted : ""
        }`}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (canMove) {
            e.preventDefault();
            onPersonDragStart(node.id, e);
          }
        }}
        onPointerMove={(e) => onPersonDragMove(e)}
        onPointerUp={(e) => onPersonDragEnd(e)}
        onPointerCancel={(e) => onPersonDragEnd(e)}
        onClick={(e) => {
          if (shouldSuppressClick?.()) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onSelect(node.id);
        }}
        aria-label={`${node.name}, ${node.roleLabel}`}
      >
        <PersonAvatar person={node} className={styles.orgAvatar} as="span" />
        <span className={styles.orgNodeCopy}>
          <span className={styles.orgNodeName}>
            {node.name}
            {node.id === currentUserId && <span className={styles.youPill}>You</span>}
          </span>
          <span className={styles.orgNodeRole}>{node.roleLabel}</span>
          {node.managedSiteLabel && (
            <span className={styles.orgNodeManagedSites}>{node.managedSiteLabel}</span>
          )}
          <span className={styles.orgNodeReports}>
            {node.directReportCount} direct report{node.directReportCount !== 1 ? "s" : ""}
          </span>
        </span>
        {canMove && (
          <span className={styles.orgMoveHint}>
            <I name="move" size={13} />
          </span>
        )}
        {canDrop && (
          <span className={styles.orgDropHint}>
            <I name="plus" size={11} /> Drop here
          </span>
        )}
      </button>
      {canAddDirectReport && (
        <button
          type="button"
          className={styles.orgNodeAddBubble}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node.id);
            onCreateDirectReport(node);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Add a direct report under ${node.name}`}
          title={`Add a direct report under ${node.name}`}
        >
          <I name="userplus" size={12} />
        </button>
      )}
    </div>

    {node.children.length > 0 && (
      <div
        className={`${styles.orgChildren} ${
          node.children.length > 1 ? styles.orgChildrenBranching : ""
        }`}
      >
        {node.children.map((child) => (
          <OrgMapNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            currentUserId={currentUserId}
            editMode={editMode}
            createableRolesByManager={createableRolesByManager}
            moveTargetsByPerson={moveTargetsByPerson}
            draggedPersonId={draggedPersonId}
            dropTargetId={dropTargetId}
            onSelect={onSelect}
            onCreateDirectReport={onCreateDirectReport}
            onPersonDragStart={onPersonDragStart}
            onPersonDragMove={onPersonDragMove}
            onPersonDragEnd={onPersonDragEnd}
            shouldSuppressClick={shouldSuppressClick}
          />
        ))}
      </div>
    )}
  </div>
  );
};

const OrgDetailLine = ({ label, value }) => (
  <div className={styles.orgDetailLine}>
    <span>{label}</span>
    <strong>{value || "-"}</strong>
  </div>
);

/* ─── Teams-style focus view ─────────────────────────────────────────────
 * Renders ONLY the focused person's neighbourhood: their management chain
 * above (collapsible when deep), the person centred, and their direct
 * reports below. Clicking anyone re-centres on them — so a 200-person org
 * never renders more than chain + one level of reports at a time. */
const OrgFocusChainCard = ({ person, isYou, onFocus }) => (
  <button
    type="button"
    className={styles.orgFocusChainCard}
    onClick={() => onFocus(person.id)}
    aria-label={`Focus on ${person.name}, ${person.roleLabel}`}
  >
    <PersonAvatar person={person} className={styles.orgFocusChainAvatar} as="span" />
    <span className={styles.orgFocusChainCopy}>
      <span className={styles.orgFocusChainName}>
        {person.name}
        {isYou && <span className={styles.youPill}>You</span>}
      </span>
      <span className={styles.orgFocusChainRole}>{person.roleLabel}</span>
    </span>
    <I name="chevrondown" size={13} color="var(--on-surface-variant)" />
  </button>
);

const OrgFocusView = ({ map, focusId, currentUserId, selectedId, onFocus }) => {
  const [chainExpanded, setChainExpanded] = useState(false);
  const [query, setQuery] = useState("");

  /* Nodes only carry children — derive parent links once per map build. */
  const parentById = useMemo(() => {
    const parents = {};
    const walk = (node) => {
      (node.children ?? []).forEach((child) => {
        parents[child.id] = node;
        walk(child);
      });
    };
    (map?.roots ?? []).forEach(walk);
    return parents;
  }, [map]);

  const focus = map?.peopleById?.[focusId] ?? map?.roots?.[0] ?? null;

  const chain = useMemo(() => {
    const out = [];
    let parent = focus ? parentById[focus.id] : null;
    while (parent) {
      out.unshift(parent);
      parent = parentById[parent.id];
    }
    return out;
  }, [parentById, focus]);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? Object.values(map?.peopleById ?? {})
        .filter((p) => `${p.name} ${p.roleLabel} ${p.jobTitle ?? ""}`.toLowerCase().includes(trimmed))
        .slice(0, 8)
    : [];

  const pick = (id) => {
    onFocus(id);
    setQuery("");
    setChainExpanded(false);
  };

  if (!focus) {
    return <div className={styles.orgFocusWrap}>No people to display.</div>;
  }

  /* Deep chains collapse to root + immediate manager with an expander. */
  const collapseChain = chain.length > 2 && !chainExpanded;
  const visibleChain = collapseChain ? [chain[0]] : chain;
  const hiddenCount = chain.length - 2;
  const isYou = (id) => id === currentUserId;

  return (
    <div className={styles.orgFocusWrap}>
      <div className={styles.orgFocusToolbar}>
        <div className={styles.orgFocusSearchWrap}>
          <I name="search" size={14} color="var(--on-surface-variant)" />
          <input
            className={styles.orgFocusSearchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a person…"
            aria-label="Search people to focus"
          />
          {results.length > 0 && (
            <div className={styles.orgFocusResults}>
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.orgFocusResultBtn}
                  onClick={() => pick(p.id)}
                >
                  <PersonAvatar person={p} className={styles.orgFocusChainAvatar} as="span" />
                  <span className={styles.orgFocusChainCopy}>
                    <span className={styles.orgFocusChainName}>{p.name}</span>
                    <span className={styles.orgFocusChainRole}>{p.roleLabel}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {currentUserId && map?.peopleById?.[currentUserId] && focus.id !== currentUserId && (
          <button
            type="button"
            className={styles.orgFocusMeBtn}
            onClick={() => pick(currentUserId)}
          >
            <I name="person" size={13} /> Focus on me
          </button>
        )}
      </div>

      <div className={styles.orgFocusColumn}>
        {visibleChain.map((person) => (
          <div key={person.id} className={styles.orgFocusChainStep}>
            <OrgFocusChainCard person={person} isYou={isYou(person.id)} onFocus={pick} />
            <span className={styles.orgFocusConnector} aria-hidden="true" />
          </div>
        ))}

        {collapseChain && (
          <div className={styles.orgFocusChainStep}>
            <button
              type="button"
              className={styles.orgFocusMoreBtn}
              onClick={() => setChainExpanded(true)}
            >
              Show {hiddenCount} more level{hiddenCount === 1 ? "" : "s"}
            </button>
            <span className={styles.orgFocusConnector} aria-hidden="true" />
          </div>
        )}

        {collapseChain && (
          <div className={styles.orgFocusChainStep}>
            <OrgFocusChainCard
              person={chain[chain.length - 1]}
              isYou={isYou(chain[chain.length - 1].id)}
              onFocus={pick}
            />
            <span className={styles.orgFocusConnector} aria-hidden="true" />
          </div>
        )}

        {chain.length > 0 && chainExpanded && (
          <div className={styles.orgFocusChainStep}>
            <button
              type="button"
              className={styles.orgFocusMoreBtn}
              onClick={() => setChainExpanded(false)}
            >
              Collapse managers
            </button>
            <span className={styles.orgFocusConnector} aria-hidden="true" />
          </div>
        )}

        <div
          className={`${styles.orgFocusCard} ${
            selectedId === focus.id ? styles.orgFocusCardSelected : ""
          }`}
        >
          <PersonAvatar person={focus} className={styles.orgFocusAvatar} as="span" />
          <div className={styles.orgFocusCopy}>
            <div className={styles.orgFocusName}>
              {focus.name}
              {isYou(focus.id) && <span className={styles.youPill}>You</span>}
            </div>
            <div className={styles.orgFocusRole}>{focus.roleLabel}</div>
            {focus.location && <div className={styles.orgFocusMeta}>{focus.location}</div>}
            <div className={styles.orgFocusMeta}>
              {focus.directReportCount ?? focus.children?.length ?? 0} direct report
              {(focus.directReportCount ?? focus.children?.length ?? 0) === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {(focus.children ?? []).length > 0 ? (
          <>
            <span className={styles.orgFocusConnector} aria-hidden="true" />
            <div className={styles.orgFocusReports}>
              {focus.children.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  className={styles.orgFocusReportCard}
                  onClick={() => pick(report.id)}
                  aria-label={`Focus on ${report.name}, ${report.roleLabel}`}
                >
                  <PersonAvatar person={report} className={styles.orgFocusChainAvatar} as="span" />
                  <span className={styles.orgFocusChainCopy}>
                    <span className={styles.orgFocusChainName}>
                      {report.name}
                      {isYou(report.id) && <span className={styles.youPill}>You</span>}
                    </span>
                    <span className={styles.orgFocusChainRole}>{report.roleLabel}</span>
                  </span>
                  {(report.children ?? []).length > 0 && (
                    <span className={styles.orgFocusReportCount}>
                      {report.children.length}
                      <I name="chevrondown" size={11} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.orgFocusEmpty}>No direct reports</div>
        )}
      </div>
    </div>
  );
};

export const OrgMapModal = ({
  map,
  selectedId,
  currentUserId,
  createableRolesByManager,
  editableRolesByUser,
  moveTargetsByPerson,
  deleteableUserIds,
  onSelect,
  onCreateDirectReport,
  onEditPerson,
  onMovePerson,
  onDeletePerson,
  onClose,
  readOnly = false,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  /* Teams-style focus view is the default — it only renders the focused
   * person's management chain + direct reports, so big orgs stay compact.
   * "Full tree" keeps the original pannable canvas (needed for Move Mode). */
  const [viewMode, setViewMode] = useState("focus");
  const [focusId, setFocusId] = useState(() => {
    const people = map?.peopleById ?? {};
    if (selectedId && people[selectedId]) return selectedId;
    if (currentUserId && people[currentUserId]) return currentUserId;
    return map?.roots?.[0]?.id ?? "";
  });
  // If the focused person disappears (deleted / re-org), fall back safely.
  useEffect(() => {
    if (!map?.peopleById?.[focusId]) {
      setFocusId(map?.roots?.[0]?.id ?? "");
    }
  }, [map, focusId]);
  const [draggedPersonId, setDraggedPersonId] = useState("");
  const [dropTargetId, setDropTargetId] = useState("");
  const [actionError, setActionError] = useState("");
  const [moveTarget, setMoveTarget] = useState(null);
  const [moveSubmitting, setMoveSubmitting] = useState(false);
  const [moveError, setMoveError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const dragRef = useRef(null);
  const personDragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const selected =
    map?.peopleById?.[selectedId] ?? map?.roots?.[0] ?? null;
  const selectedCanCreate = !readOnly && Boolean(selected && createableRolesByManager?.[selected.id]?.length);
  const selectedCanEdit = !readOnly && Boolean(selected && editableRolesByUser?.[selected.id]?.length);
  const selectedCanDelete = !readOnly && Boolean(selected && deleteableUserIds?.includes(selected.id));
  const canUseMoveMode = !readOnly && Object.keys(moveTargetsByPerson ?? {}).length > 0;

  const clearMoveState = () => {
    setDraggedPersonId("");
    setDropTargetId("");
    setMoveTarget(null);
    setMoveError("");
  };

  const toggleMoveMode = () => {
    // Drag-to-move lives on the full-tree canvas — jump there when arming it.
    setViewMode("tree");
    setEditMode((value) => !value);
    setActionError("");
    clearMoveState();
  };

  const handleFocusPerson = (personId) => {
    setFocusId(personId);
    onSelect(personId);
    setActionError("");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePersonSelect = (personId) => {
    onSelect(personId);
    setIsDetailsOpen(true);
    setActionError("");
  };

  const handleCanvasPointerDown = (e) => {
    if (e.button !== 0) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startPointer: { x: e.clientX, y: e.clientY },
      originPan: pan,
      moved: false,
    };
    suppressClickRef.current = false;
    setIsPanning(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleCanvasPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const currentPointer = { x: e.clientX, y: e.clientY };
    if (
      didPanPastClickTolerance({
        startPointer: drag.startPointer,
        currentPointer,
      })
    ) {
      drag.moved = true;
      suppressClickRef.current = true;
      setPan(nextPanPosition({
        startPointer: drag.startPointer,
        currentPointer,
        originPan: drag.originPan,
      }));
    }
  };

  const endCanvasPan = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const moved = drag.moved;
    dragRef.current = null;
    setIsPanning(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (moved) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    } else {
      suppressClickRef.current = false;
    }
  };

  const getDropTargetFromPoint = (personId, clientX, clientY) => {
    const element = document
      .elementFromPoint(clientX, clientY)
      ?.closest("[data-org-person-id]");
    const targetId = element?.dataset?.orgPersonId ?? "";
    return (moveTargetsByPerson?.[personId] ?? []).includes(targetId) ? targetId : "";
  };

  const handlePersonDragStart = (personId, e) => {
    personDragRef.current = {
      personId,
      pointerId: e.pointerId,
      startPointer: { x: e.clientX, y: e.clientY },
      moved: false,
    };
    suppressClickRef.current = true;
    setDraggedPersonId(personId);
    setDropTargetId("");
    setActionError("");
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePersonDragMove = (e) => {
    const drag = personDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const currentPointer = { x: e.clientX, y: e.clientY };
    if (
      didPanPastClickTolerance({
        startPointer: drag.startPointer,
        currentPointer,
      })
    ) {
      drag.moved = true;
      setDropTargetId(getDropTargetFromPoint(drag.personId, e.clientX, e.clientY));
    }
  };

  const handlePersonDragEnd = async (e) => {
    const drag = personDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    personDragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    const targetId = drag.moved
      ? getDropTargetFromPoint(drag.personId, e.clientX, e.clientY)
      : "";
    setDropTargetId("");

    if (!drag.moved) {
      handlePersonSelect(drag.personId);
      setDraggedPersonId("");
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      return;
    }

    if (targetId) {
      await handleDropOnNode(drag.personId, targetId);
    } else {
      setDraggedPersonId("");
    }

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handleDropOnNode = async (personId, managerId) => {
    if (!personId || !managerId || personId === managerId) return;

    setActionError("");
    setDropTargetId("");
    const person = map?.peopleById?.[personId];
    const manager = map?.peopleById?.[managerId];
    const descendants = flattenOrgDescendants(person);
    if (person && manager && descendants.length > 0) {
      setMoveTarget({ person, manager, affectedPeople: descendants });
      setMoveError("");
      setDraggedPersonId("");
      return;
    }

    try {
      await onMovePerson(personId, managerId);
      onSelect(personId);
    } catch (err) {
      setActionError(err.message || "Unable to move this person.");
    } finally {
      setDraggedPersonId("");
    }
  };

  const handleMoveConfirm = async () => {
    if (!moveTarget || moveSubmitting) return;

    setMoveError("");
    setMoveSubmitting(true);
    try {
      await onMovePerson(moveTarget.person.id, moveTarget.manager.id);
      onSelect(moveTarget.person.id);
      setMoveTarget(null);
    } catch (err) {
      setMoveError(err.message || "Unable to move this branch.");
    } finally {
      setMoveSubmitting(false);
    }
  };

  const handleCreateDirectReport = (manager) => {
    setActionError("");
    onCreateDirectReport(manager);
  };

  const handleDeleteConfirm = async (options = {}) => {
    if (!deleteTarget || deleteSubmitting) return;

    setDeleteError("");
    setDeleteSubmitting(true);
    try {
      await onDeletePerson(deleteTarget, options);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this user.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className={`${styles.overlay} ${styles.orgOverlay}`} onClick={handleOverlayClick}>
      <div className={styles.orgModal}>
        <div className={styles.leaveModalHeader}>
          <div>
            <h2 className={styles.leaveModalTitle}>Organisation Map</h2>
            <p className={styles.leaveModalSub}>{map?.totalPeople ?? 0} people across the group</p>
          </div>
          <div className={styles.orgHeaderActions}>
            {/* Focus (Teams-style) vs the full pannable tree. */}
            <div className={styles.orgViewToggle} role="group" aria-label="Org chart view">
              <button
                type="button"
                className={`${styles.orgViewToggleBtn} ${viewMode === "focus" ? styles.orgViewToggleActive : ""}`}
                onClick={() => setViewMode("focus")}
              >
                <I name="person" size={13} /> Focus
              </button>
              <button
                type="button"
                className={`${styles.orgViewToggleBtn} ${viewMode === "tree" ? styles.orgViewToggleActive : ""}`}
                onClick={() => setViewMode("tree")}
              >
                <I name="layers" size={13} /> Full tree
              </button>
            </div>
            {canUseMoveMode && (
              <button
                type="button"
                className={`${styles.orgResetBtn} ${editMode ? styles.orgEditBtnActive : ""}`}
                onClick={toggleMoveMode}
              >
                <I name="move" size={14} /> {editMode ? "Moving" : "Move Mode"}
              </button>
            )}
            {viewMode === "tree" && (
              <button
                type="button"
                className={styles.orgResetBtn}
                onClick={() => setPan({ x: 0, y: 0 })}
              >
                <I name="reset" size={14} /> Reset View
              </button>
            )}
            <button className={styles.leaveCloseBtn} onClick={onClose} aria-label="Close">
              <I name="xcircle" size={22} />
            </button>
          </div>
        </div>

        <div
          className={`${styles.orgModalBody} ${
            isDetailsOpen ? "" : styles.orgModalBodyDetailsClosed
          }`}
        >
          {viewMode === "focus" ? (
            <OrgFocusView
              map={map}
              focusId={focusId}
              currentUserId={currentUserId}
              selectedId={selected?.id}
              onFocus={handleFocusPerson}
            />
          ) : (
          <div
            className={`${styles.orgCanvas} ${isPanning ? styles.orgCanvasPanning : ""}`}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={endCanvasPan}
            onPointerCancel={endCanvasPan}
          >
            <div
              className={`${styles.orgTree} ${isPanning ? styles.orgTreePanning : ""} ${
                editMode ? styles.orgTreeEditing : ""
              }`}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
            >
              {map?.roots?.map((root) => (
                <OrgMapNode
                  key={root.id}
                  node={root}
                  selectedId={selected?.id}
                  currentUserId={currentUserId}
                  editMode={editMode}
                  createableRolesByManager={createableRolesByManager}
                  moveTargetsByPerson={moveTargetsByPerson}
                  draggedPersonId={draggedPersonId}
                  dropTargetId={dropTargetId}
                  onSelect={handlePersonSelect}
                  onCreateDirectReport={handleCreateDirectReport}
                  onPersonDragStart={handlePersonDragStart}
                  onPersonDragMove={handlePersonDragMove}
                  onPersonDragEnd={handlePersonDragEnd}
                  shouldSuppressClick={() => suppressClickRef.current}
                />
              ))}
            </div>
          </div>
          )}

          {isDetailsOpen && (
          <aside className={styles.orgDetailsPanel}>
            {selected ? (
              <>
                <div className={styles.orgDetailTop}>
                  <PersonAvatar person={selected} className={styles.orgDetailAvatar} />
                  <button
                    type="button"
                    className={styles.orgDetailCloseBtn}
                    onClick={() => setIsDetailsOpen(false)}
                    aria-label="Close person details"
                  >
                    <I name="xcircle" size={19} />
                  </button>
                </div>
                <h3 className={styles.orgDetailName}>{selected.name}</h3>
                <div className={styles.orgDetailRole}>{selected.roleLabel}</div>
                {(selectedCanCreate || selectedCanEdit || selectedCanDelete || canUseMoveMode) && (
                  <div className={styles.orgDetailActions}>
                    {selectedCanCreate && (
                      <button
                        type="button"
                        className={styles.orgDetailActionBtn}
                        onClick={() => onCreateDirectReport(selected)}
                      >
                        <I name="userplus" size={14} /> Add report
                      </button>
                    )}
                    {selectedCanEdit && (
                      <button
                        type="button"
                        className={styles.orgDetailActionBtn}
                        onClick={() => onEditPerson(selected)}
                      >
                        <I name="edit" size={14} /> Edit User
                      </button>
                    )}
                    {canUseMoveMode && (
                      <button
                        type="button"
                        className={`${styles.orgDetailActionBtn} ${
                          editMode ? styles.orgDetailActionActive : ""
                        }`}
                        onClick={toggleMoveMode}
                      >
                        <I name="move" size={14} /> {editMode ? "Moving" : "Move"}
                      </button>
                    )}
                    {selectedCanDelete && (
                      <button
                        type="button"
                        className={`${styles.orgDetailActionBtn} ${styles.orgDetailDangerBtn}`}
                        onClick={() => {
                          setDeleteTarget(selected);
                          setDeleteError("");
                        }}
                      >
                        <I name="trash" size={14} /> Delete
                      </button>
                    )}
                  </div>
                )}
                {actionError && <div className={styles.errorBox} role="alert">{actionError}</div>}
                <div className={styles.orgDetailGrid}>
                  <OrgDetailLine label="Reports to" value={selected.managerName || "Top level"} />
                  <OrgDetailLine label="Location" value={selected.location} />
                  <OrgDetailLine label="Area" value={selected.areaName || selected.areaId || "Global"} />
                  {selected.managedSiteLabel && (
                    <OrgDetailLine label="Managed sites" value={selected.managedSiteLabel} />
                  )}
                  <OrgDetailLine label="Practice" value={selected.siteName || selected.practiceId || "Group"} />
                  <OrgDetailLine label="Username" value={selected.username} />
                  <OrgDetailLine label="Direct reports" value={selected.directReportCount} />
                </div>
              </>
            ) : (
              <EmptyState>No people found.</EmptyState>
            )}
          </aside>
          )}
        </div>
        {moveTarget && (
          <MoveBranchModal
            person={moveTarget.person}
            newManager={moveTarget.manager}
            affectedPeople={moveTarget.affectedPeople}
            submitting={moveSubmitting}
            error={moveError}
            onClose={() => {
              if (!moveSubmitting) setMoveTarget(null);
            }}
            onConfirm={handleMoveConfirm}
          />
        )}
        {deleteTarget && (
          <DeleteUserModal
            person={deleteTarget}
            affectedPeople={flattenOrgDescendants(deleteTarget)}
            submitting={deleteSubmitting}
            error={deleteError}
            onClose={() => {
              if (!deleteSubmitting) setDeleteTarget(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
};

export const HrPage = () => {
  const { user } = useAuth();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showOrgMap, setShowOrgMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedOrgPersonId, setSelectedOrgPersonId] = useState("");
  const [policies, setPolicies] = useState([]);
  const [mandatoryTraining, setMandatoryTraining] = useState([]);
  const [notices, setNotices] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [timeOffDashboard, setTimeOffDashboard] = useState(null);
  const [timeOffError, setTimeOffError] = useState("");
  const [decisioningId, setDecisioningId] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const profile = user?.hrProfile ?? {
    jobTitle: "HR Hub Employee",
    joinDate: "April 8th, 2024",
    contract: "Full-Time (Permanent)",
    location: "Group Support",
    annualLeaveBalance: 25,
  };
  const balance = timeOffDashboard?.currentUser ?? {
    annualLeaveEntitlement: profile.annualLeaveBalance,
    usedLeaveDays: 0,
    remainingLeaveDays: profile.annualLeaveBalance,
    sickLeaveEntitlement: 10,
    usedSickDays: 0,
    remainingSickDays: 10,
  };
  const organisationMap = timeOffDashboard?.organisationMap ?? null;

  useEffect(() => {
    listPolicies().then(setPolicies);
    listMandatoryTraining().then(setMandatoryTraining);
    listNotices().then(setNotices);
    listHrQuickLinks().then(setQuickLinks);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getTimeOffDashboard(user.id)
      .then(setTimeOffDashboard)
      .catch((err) => setTimeOffError(err.message || "Unable to load time off data."));
  }, [user?.id]);

  const handleUpload = async (e) => {
    const file = e.target.value ? e.target.files[0] : null;
    if (!file) return;
    const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const now = new Date();
    const updated = `Updated ${now.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
    const created = await addPolicy({ name, updated });
    setPolicies((prev) => [created, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    e.target.value = "";
  };

  const handleLeaveSubmit = async (req) => {
    const next = await submitTimeOffRequest(user.id, req);
    setTimeOffDashboard(next);
  };

  const handleDecision = async (requestId, decision) => {
    setTimeOffError("");
    setDecisioningId(`${requestId}-${decision}`);
    try {
      const next = await decideTimeOffRequestForApprover(user.id, requestId, decision);
      setTimeOffDashboard(next);
    } catch (err) {
      setTimeOffError(err.message || "Unable to update request.");
    } finally {
      setDecisioningId("");
    }
  };

  const openOrgMap = () => {
    setSelectedOrgPersonId(organisationMap?.roots?.[0]?.id ?? user.id);
    setShowOrgMap(true);
  };

  return (
  <div>
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>HR Hub</h1>
        <p className={styles.lead}>
          Your central sanctuary for career management, employment records, and practice wellness.
        </p>
      </div>
      <BtnPrimary style={{ flexShrink: 0 }} onClick={() => setShowLeaveModal(true)}>
        <I name="plus" size={16} color="var(--on-primary)" /> Request Time Off
      </BtnPrimary>
    </div>

    <div className={styles.bentoTop}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="briefcase" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Employment Summary</span>
        </div>
        <h3 className={styles.cardTitle}>{profile.jobTitle}</h3>
        <div className={styles.factRow}>
          <I name="calendar" size={16} color="var(--outline)" />
          <div>
            <div className={styles.factLabel}>Join Date</div>
            <div className={styles.factValue}>{profile.joinDate}</div>
          </div>
        </div>
        <div className={styles.factGrid}>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Contract</div>
            <div className={styles.factTileValue}>{profile.contract}</div>
          </div>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Location</div>
            <div className={styles.factTileValue}>{profile.location}</div>
          </div>
        </div>
      </Card>

      <Card hover={false} className={styles.leaveCard} style={{ padding: 28 }}>
        <div className={styles.leaveBg}>
          <I name="umbrella" size={160} color="white" />
        </div>
        <div className={styles.leaveCount}>{balance.remainingLeaveDays}</div>
        <div className={styles.leaveTag}>Days Left</div>
        <div className={styles.leaveSub}>Annual Leave Balance</div>
        <div className={styles.leavePending}>
          <I name="clock" size={12} />
          {balance.usedLeaveDays} used of {balance.annualLeaveEntitlement}
        </div>
      </Card>

      <Card hover={false} className={styles.policyCard}>
        <div className={styles.policyHeader}>
          <div className={styles.policyHeading}>
            <I name="shield" size={16} color="var(--primary)" />
            <span className={styles.eyebrowText}>HR Policy Library</span>
          </div>
          <div className={styles.policyActions}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <button
              className={`${styles.uploadBtn} ${uploadSuccess ? styles.uploadBtnSuccess : ""}`}
              onClick={() => fileInputRef.current?.click()}
              title="Upload policy document"
            >
              <I name={uploadSuccess ? "checkcircle" : "upload"} size={13} color={uploadSuccess ? "var(--success)" : "var(--primary)"} />
              <span>{uploadSuccess ? "Uploaded!" : "Upload"}</span>
            </button>
          </div>
        </div>
        <div className={styles.policyList}>
          {policies.map((p) => (
            <div key={p.name} className={styles.policyRow}>
              <div>
                <div className={styles.policyName}>{p.name}</div>
                <div className={styles.policyUpdated}>{p.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className={styles.timeOffPanel}>
      <div className={styles.timeOffHeader}>
        <div>
          <div className={styles.smallEyebrow}>
            <I name="umbrella" size={16} color="var(--primary)" />
            <span className={styles.eyebrowText}>Time Off</span>
          </div>
          <h2 className={styles.timeOffTitle}>Leave, approvals, and history</h2>
        </div>
        <div className={styles.timeOffHeaderActions}>
          <BtnSecondary onClick={() => setShowCalendar(true)}>
            <I name="calendar" size={15} /> View Team Calendar
          </BtnSecondary>
          <BtnSecondary onClick={openOrgMap}>
            <I name="org" size={15} /> View Org Map
          </BtnSecondary>
          <BtnSecondary onClick={() => setShowLeaveModal(true)}>
            <I name="plus" size={15} /> Request Time Off
          </BtnSecondary>
        </div>
      </div>

      {timeOffError && <div className={styles.errorBox} role="alert">{timeOffError}</div>}

      {timeOffDashboard?.holidayYearWindow && (
        <div className={styles.holidayYearStrip}>
          <I name="calendar" size={13} color="var(--on-surface-variant)" />
          <span>
            Holiday year:{" "}
            <strong>
              {(() => {
                const fmt = new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const start = new Date(`${timeOffDashboard.holidayYearWindow.start}T00:00:00Z`);
                const end = new Date(`${timeOffDashboard.holidayYearWindow.end}T00:00:00Z`);
                return `${fmt.format(start)} – ${fmt.format(end)}`;
              })()}
            </strong>
          </span>
        </div>
      )}

      <div className={styles.balanceGrid}>
        <BalanceMetric label="Holiday entitlement" value={balance.annualLeaveEntitlement} />
        <BalanceMetric label="Holiday used" value={balance.usedLeaveDays} tone="balanceUsed" />
        <BalanceMetric label="Holiday remaining" value={balance.remainingLeaveDays} tone="balanceRemaining" />
        <BalanceMetric label="Sick entitlement" value={balance.sickLeaveEntitlement ?? 10} />
        <BalanceMetric label="Sick used" value={balance.usedSickDays ?? 0} tone="balanceUsed" />
        <BalanceMetric label="Sick remaining" value={balance.remainingSickDays ?? 10} tone="balanceRemaining" />
      </div>

      <TeamAbsenceSnapshot calendar={timeOffDashboard?.teamCalendar} />

      <div className={styles.timeOffColumns}>
        <Card hover={false} style={{ padding: 24 }}>
          <div className={styles.panelTitleRow}>
            <h3 className={styles.sectionTitle}>Your Requests</h3>
            <span className={styles.countPill}>{timeOffDashboard?.myRequests.length ?? 0}</span>
          </div>
          <div className={styles.historyList}>
            {timeOffDashboard?.myRequests.length ? (
              timeOffDashboard.myRequests.map((request) => (
                <RequestHistoryCard key={request.id} request={request} />
              ))
            ) : (
              <EmptyState>No requests yet.</EmptyState>
            )}
          </div>
        </Card>

        <Card hover={false} style={{ padding: 24 }}>
          <div className={styles.panelTitleRow}>
            <h3 className={styles.sectionTitle}>Pending Approvals</h3>
            <span className={styles.countPill}>{timeOffDashboard?.pendingApprovals.length ?? 0}</span>
          </div>
          <div className={styles.approvalList}>
            {timeOffDashboard?.pendingApprovals.length ? (
              timeOffDashboard.pendingApprovals.map((request) => (
                <PendingApprovalCard
                  key={request.id}
                  request={request}
                  onDecision={handleDecision}
                  busy={decisioningId.startsWith(request.id)}
                />
              ))
            ) : (
              <EmptyState>No pending approvals.</EmptyState>
            )}
          </div>
        </Card>
      </div>

    </div>

    <div className={styles.bentoMid}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="shieldalert" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Mandatory Training</span>
        </div>
        <h3 className={styles.sectionTitle}>Compliance Status</h3>
        <div className={styles.trainingList}>
          {mandatoryTraining.map((t) => {
            const cfg = trainingStatus[t.status];
            return (
              <div key={t.name} className={styles.trainingRow}>
                <span className={styles.trainingName}>{t.name}</span>
                <span className={styles.trainingPill} style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.label(t.due)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="bell" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Team Notices</span>
        </div>
        <h3 className={styles.sectionTitle}>HR Announcements</h3>
        <div className={styles.noticeList}>
          {notices.map((n) => (
            <div key={n.title} className={styles.noticeRow}>
              <div className={styles.noticeTopRow}>
                <span className={styles.noticeTag}>{n.tag}</span>
                <span className={styles.noticeDate}>{n.date}</span>
              </div>
              <div className={styles.noticeTitle}>{n.title}</div>
              <div className={styles.noticeDesc}>{n.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className={styles.quickLinksGrid}>
      {quickLinks.map((q) => (
        <Card key={q.title} hover={false} style={{ padding: 28 }}>
          <div className={styles.quickIconWrap} style={{ background: `color-mix(in srgb, ${q.tint} 10%, transparent)` }}>
            <I name={q.icon} size={22} color={q.tint} />
          </div>
          <h4 className={styles.quickTitle}>{q.title}</h4>
          <p className={styles.quickDesc}>{q.desc}</p>
        </Card>
      ))}
    </div>

    <div className={styles.footer}>
      <span className={styles.footerCopy}>© 2026 Verbilo Dental Group Ltd.</span>
      <div className={styles.footerLinks}>
        {["Privacy Policy", "Terms of Employment", "Support Hub"].map((l) => (
          <span key={l} className={styles.footerLink} title="Destination not configured">
            {l}
          </span>
        ))}
      </div>
    </div>

    {showLeaveModal && (
      <LeaveModal
        balance={balance}
        calendar={timeOffDashboard?.teamCalendar}
        requesterId={user.id}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleLeaveSubmit}
      />
    )}

    {showCalendar && timeOffDashboard?.teamCalendar && (
      <TeamCalendarModal
        calendar={timeOffDashboard.teamCalendar}
        onClose={() => setShowCalendar(false)}
      />
    )}

    {showOrgMap && organisationMap && (
      <OrgMapModal
        map={organisationMap}
        selectedId={selectedOrgPersonId}
        currentUserId={user.id}
        createableRolesByManager={{}}
        editableRolesByUser={{}}
        moveTargetsByPerson={{}}
        deleteableUserIds={[]}
        onSelect={setSelectedOrgPersonId}
        onCreateDirectReport={() => {}}
        onEditPerson={() => {}}
        onMovePerson={async () => {}}
        onDeletePerson={async () => {}}
        onClose={() => setShowOrgMap(false)}
        readOnly
      />
    )}
  </div>
  );
};
