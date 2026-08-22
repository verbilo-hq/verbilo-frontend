/**
 * Streak library — single personal cadence metric per persona.
 *
 * Streaks are the strongest known retention lever in daily SaaS
 * (Duolingo / Github / Strava all use them). Each persona gets ONE
 * clear streak that maps to the action they do most often in Verbilo:
 *
 *   Dentist           → CPD reflection streak (weekly)
 *   Foundation Dentist → Weekly reflection streak (more frequent)
 *   Hygienist         → CPD reflection streak (weekly)
 *   Nurse             → Daily log streak (consecutive days)
 *   Trainee Nurse     → Induction cadence streak (weekly)
 *   Receptionist      → Mandatory training completion streak (weekly)
 *   Practice Manager  → Weekly compliance attestation streak
 *   Area Manager      → Multi-site review cadence streak (weekly)
 *   Clinical Director → Audit sign-off SLA streak (weekly)
 *
 * Shape: { count, unit, label, description, milestone, milestoneDistance }
 *   count             — current streak length
 *   unit              — "days" | "weeks"
 *   label             — short metric name (shown under the number)
 *   description       — one-line reinforcement message
 *   milestone         — next milestone target ("20 days", "1 year")
 *   milestoneDistance — how far to go (e.g. "2 weeks to milestone")
 */

export const STREAK_DATA = {
  dentist: {
    count: 12, unit: "weeks", label: "CPD reflection streak",
    description: "Consecutive weeks you've logged a reflective CPD entry.",
    milestone: "20 weeks", milestoneDistance: "8 weeks to milestone",
  },
  foundation_dentist: {
    count: 8, unit: "weeks", label: "Weekly reflection streak",
    description: "Consecutive weeks of FD reflections logged on time.",
    milestone: "13 weeks", milestoneDistance: "5 weeks to term milestone",
  },
  hygienist: {
    count: 10, unit: "weeks", label: "CPD reflection streak",
    description: "Consecutive weeks you've logged a DCP reflective CPD entry.",
    milestone: "20 weeks", milestoneDistance: "10 weeks to milestone",
  },
  nurse: {
    count: 18, unit: "days", label: "Daily log streak",
    description: "Consecutive days you've closed every assigned daily log.",
    milestone: "30 days", milestoneDistance: "12 days to milestone",
  },
  trainee_nurse: {
    count: 6, unit: "weeks", label: "Induction cadence streak",
    description: "Consecutive weeks you've ticked at least one induction milestone.",
    milestone: "10 weeks", milestoneDistance: "4 weeks to milestone",
  },
  receptionist: {
    count: 14, unit: "weeks", label: "Training completion streak",
    description: "Consecutive weeks at 100% mandatory-training compliance.",
    milestone: "20 weeks", milestoneDistance: "6 weeks to milestone",
  },
  practice_manager: {
    count: 22, unit: "weeks", label: "Compliance attestation streak",
    description: "Consecutive weeks you've signed off the practice compliance review.",
    milestone: "26 weeks", milestoneDistance: "4 weeks to milestone",
  },
  area_manager: {
    count: 8, unit: "weeks", label: "Multi-site review cadence",
    description: "Consecutive weeks all sites in your region reviewed on time.",
    milestone: "13 weeks", milestoneDistance: "5 weeks to milestone",
  },
  clinical_director: {
    count: 16, unit: "weeks", label: "Audit sign-off SLA streak",
    description: "Consecutive weeks every audit signed within the 5-day SLA.",
    milestone: "20 weeks", milestoneDistance: "4 weeks to milestone",
  },
};

export function getStreak(personaId) {
  return STREAK_DATA[personaId] ?? STREAK_DATA.dentist;
}
