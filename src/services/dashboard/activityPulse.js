/**
 * MyActivityPulse library — "your week / quarter so far" per persona.
 *
 * Strict Verbilo-native rule: every metric must come from a Verbilo
 * data source (CPD Hub, Audit & Evidence, Protocols, Operational Logs,
 * Supervision Hub, HR Hub, Governance packs, Document Library). No
 * PMS-driven metrics (UDAs, treatment plans, NPS, no-show rates).
 *
 * Fixture for now — production swap = per-persona aggregation
 * provider that reads live counts from the underlying modules.
 *
 * Stat shape: { id, label, value, sub, trend, tone }
 *   id    — stable per persona
 *   label — short metric name
 *   value — primary display number / string
 *   sub   — small helper text (e.g. "vs group avg 89%")
 *   trend — 'up' | 'down' | 'flat' (drives the indicator)
 *   tone  — 'good' | 'info' | 'warning' | 'danger' (colour accent)
 */

export const ACTIVITY_PULSE = {
  dentist: [
    { id: "d-p1", label: "CPD hours this quarter",      value: "8.5 / 15",  sub: "Verifiable",            trend: "up",   tone: "info"    },
    { id: "d-p2", label: "Protocols acknowledged",       value: "94%",       sub: "vs group avg 89%",      trend: "up",   tone: "good"    },
    { id: "d-p3", label: "SOPs read this month",          value: "4",         sub: "Across 2 packs",         trend: "flat", tone: "info"    },
    { id: "d-p4", label: "Last audit participated in",    value: "15 Apr",    sub: "Antibiotic Stewardship", trend: "flat", tone: "info"    },
  ],

  foundation_dentist: [
    { id: "fd-p1", label: "DOPS logged",                  value: "3 / 5",    sub: "Direct Obs of Skills",   trend: "up",   tone: "info"    },
    { id: "fd-p2", label: "MSF responses received",        value: "1 / 3",    sub: "Multi-Source Feedback",  trend: "flat", tone: "warning" },
    { id: "fd-p3", label: "PDP goals progress",            value: "50%",      sub: "2 active goals",         trend: "up",   tone: "good"    },
    { id: "fd-p4", label: "Supervision meetings",          value: "4 / 4",    sub: "Attendance this term",   trend: "flat", tone: "good"    },
    { id: "fd-p5", label: "Induction items remaining",     value: "4 / 11",   sub: "Complete by 30 Sept",    trend: "down", tone: "warning" },
  ],

  hygienist: [
    { id: "h-p1", label: "CPD hours this cycle",           value: "6 / 15",   sub: "DCP requirement",        trend: "up",   tone: "info"    },
    { id: "h-p2", label: "Hygiene-specific SOPs read",     value: "3",        sub: "This month",             trend: "up",   tone: "good"    },
    { id: "h-p3", label: "IPC training compliance",        value: "Current",  sub: "Expires 12 Aug",         trend: "flat", tone: "good"    },
    { id: "h-p4", label: "Last audit contributed to",      value: "20 Apr",   sub: "Perio Audit Q1",         trend: "flat", tone: "info"    },
  ],

  nurse: [
    { id: "n-p1", label: "Logs completed this week",       value: "11 / 12",  sub: "1 outstanding",          trend: "up",   tone: "good"    },
    { id: "n-p2", label: "CPD hours this cycle",            value: "4 / 15",   sub: "DCP requirement",        trend: "up",   tone: "info"    },
    { id: "n-p3", label: "IPC self-assessment",             value: "Current",  sub: "Last filed 10 May",      trend: "flat", tone: "good"    },
    { id: "n-p4", label: "Sterilisation cycles logged",     value: "28",       sub: "This week",              trend: "up",   tone: "info"    },
  ],

  trainee_nurse: [
    { id: "tn-p1", label: "Induction items completed",     value: "7 / 11",   sub: "On pace for 30 Sept",    trend: "up",   tone: "good"    },
    { id: "tn-p2", label: "Competencies signed off",        value: "2",        sub: "This month",             trend: "up",   tone: "good"    },
    { id: "tn-p3", label: "RoE decon cycles logged",        value: "42 / 50",  sub: "Module 4 portfolio",     trend: "up",   tone: "info"    },
    { id: "tn-p4", label: "DOPS sign-offs",                 value: "1",        sub: "Aspiration technique",   trend: "flat", tone: "info"    },
  ],

  receptionist: [
    { id: "r-p1", label: "SOPs read this month",            value: "3",        sub: "Reception pack",         trend: "up",   tone: "info"    },
    { id: "r-p2", label: "Mandatory training compliance",   value: "Current",  sub: "1 expiring in 21d",      trend: "flat", tone: "warning" },
    { id: "r-p3", label: "Complaints logged this period",   value: "1",        sub: "Open · 3d to acknowledge", trend: "flat", tone: "warning" },
    { id: "r-p4", label: "Suggestions submitted",            value: "2",        sub: "Anonymous · this quarter", trend: "up",  tone: "good"    },
  ],

  practice_manager: [
    { id: "pm-p1", label: "Practice compliance score",     value: "94%",      sub: "vs target 95%",          trend: "up",   tone: "good"    },
    { id: "pm-p2", label: "Staff acknowledgement rate",     value: "87%",      sub: "4 outstanding on CORE-01", trend: "flat", tone: "warning" },
    { id: "pm-p3", label: "Open complaints / SEAs",         value: "0",        sub: "All closed within SLA",  trend: "flat", tone: "good"    },
    { id: "pm-p4", label: "Audit completion this month",    value: "8 / 10",   sub: "2 due by Friday",        trend: "up",   tone: "info"    },
  ],

  area_manager: [
    { id: "am-p1", label: "Group compliance score",         value: "92%",      sub: "Group target 90%",       trend: "up",   tone: "good"    },
    { id: "am-p2", label: "Sites needing attention",        value: "2 of 6",   sub: "London, Manchester",     trend: "down", tone: "warning" },
    { id: "am-p3", label: "Group audit completion",         value: "47 / 52",  sub: "This quarter",           trend: "up",   tone: "good"    },
    { id: "am-p4", label: "Avg days to close incidents",    value: "4.2",      sub: "SLA: 5 working days",    trend: "down", tone: "good"    },
  ],

  clinical_director: [
    { id: "cd-p1", label: "Antibiotic stewardship",         value: "97%",      sub: "vs national 92%",        trend: "up",   tone: "good"    },
    { id: "cd-p2", label: "Radiograph quality score",       value: "92%",      sub: "Group QA Q1",            trend: "up",   tone: "good"    },
    { id: "cd-p3", label: "Open SEAs",                       value: "1",        sub: "Active · 48h to investigate", trend: "flat", tone: "warning" },
    { id: "cd-p4", label: "Cohort sign-off pace",            value: "5d avg",   sub: "PDP review SLA",         trend: "flat", tone: "info"    },
  ],
};

export function getActivityPulse(personaId) {
  return ACTIVITY_PULSE[personaId] ?? ACTIVITY_PULSE.dentist;
}
