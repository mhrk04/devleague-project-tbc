/**
 * Deterministic synthetic cohort for ProbeLoop.
 *
 * 80 opted-in loyalty members with six months of activity. All data is
 * synthetic and illustrative; it demonstrates the method, not verified
 * commercial impact. Post-period outcome flags are generated deterministically
 * so the same run always produces the same cohort.
 *
 * The existing prototype story is preserved for the current click-through.
 *
 * Ownership: data and experiment logic team.
 */

import { assignExperimentGroup } from "@/lib/experiments";
import type { Customer, ExperimentAssignment } from "@/lib/types";

/** Fixed reference date for lapse and overview calculations. */
export const asOfDate = "2026-08-21";

const DAY_MS = 86400000;

const FIRST_NAMES = [
  "Amir", "Lena", "Mara", "Sofia", "Diego", "Noah", "Yuki", "Omar",
  "Priya", "Elena", "Tom", "Ravi", "Zoe", "Ilan", "Nora", "Kai",
  "Mia", "Leo", "Ana", "Ben", "Ivy", "Sam", "Ruth", "Max",
  "Tara", "Finn", "June", "Owen", "Dana", "Ari", "Lila", "Cole",
  "Erin", "Gus", "Rita", "Jo", "Eve", "Hank", "Sue", "Pete",
];

const DRINKS = [
  "Iced flat white",
  "Flat white",
  "Cappuccino",
  "Latte",
  "Cold brew",
  "Iced latte",
  "Americano",
  "Mocha",
  "Matcha latte",
  "Chai latte",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Builds visit dates for a synthetic member deterministically. */
function buildVisitDates(
  id: string,
  cadence: number,
  visitCount: number,
  daysSinceLast: number,
): string[] {
  const hash = hashString(id);
  const asOf = new Date(asOfDate + "T00:00:00Z");
  const last = new Date(asOf.getTime() - daysSinceLast * DAY_MS);
  const dates: string[] = [];
  let cursor = last;
  for (let k = 0; k < visitCount; k++) {
    dates.push(toIso(cursor));
    const jitter = ((hash + k * 5) % 5) - 2; // -2..2 days
    cursor = new Date(cursor.getTime() - (cadence + jitter) * DAY_MS);
  }
  return dates;
}

/** Amir as the visible story customer, matching the prototype story. */
const AMIR_CUSTOMER: Customer = {
  id: "amir",
  name: "Amir",
  usual: "Iced flat white",
  visitDates: [
    "2026-08-08",
    "2026-08-03",
    "2026-07-29",
    "2026-07-24",
    "2026-07-19",
    "2026-07-14",
    "2026-07-09",
  ],
  recentWaitMinutes: [12, 15, 15],
  usualUnavailableCount: 2,
};

/** Builds one synthetic member by index (0..79). */
function buildCustomer(index: number): Customer {
  if (index === 0) return AMIR_CUSTOMER;

  const id = `member-${String(index).padStart(3, "0")}`;
  const hash = hashString(id);
  const name = FIRST_NAMES[(index - 1) % FIRST_NAMES.length];
  const usual = DRINKS[hash % DRINKS.length];
  const cadence = 3 + (hash % 7); // 3..9 days
  const visitCount = 7 + (hash % 5); // 7..11 visits
  const daysSinceLast = cadence + ((hash >>> 3) % 5); // cadence..cadence+4
  const waitLength = 2 + (hash % 3); // 2..4
  const recentWaitMinutes = Array.from(
    { length: waitLength },
    (_, k) => 6 + ((hash + k * 7) % 14), // 6..19 minutes
  );

  return {
    id,
    name,
    usual,
    visitDates: buildVisitDates(id, cadence, visitCount, daysSinceLast),
    recentWaitMinutes,
    usualUnavailableCount: hash % 4, // 0..3
  };
}

/** 80 opted-in loyalty members with six months of activity. */
export const cohortCustomers: readonly Customer[] = Array.from(
  { length: 80 },
  (_, index) => buildCustomer(index),
);

/** Stable probe/holdout assignments with deterministic post-period outcomes. */
export const experimentAssignments: readonly ExperimentAssignment[] =
  cohortCustomers.map((customer) => {
    const group = assignExperimentGroup(customer.id);
    const hash = hashString(customer.id);
    const returned = hash % 10 < (group === "probe" ? 4 : 2);
    return { customerId: customer.id, group, returned };
  });

/**
 * One shared immutable ProbeLoop prototype story.
 *
 * All customers, events, and outcomes are synthetic and illustrative. They
 * demonstrate the detect -> question -> act -> learn loop only; none of this
 * is real customer data or real experiment evidence.
 */
export const prototypeStory = {
  customer: {
    id: "amir",
    name: "Amir",
    initials: "AM",
    normalCadenceDays: 5,
    daysSinceVisit: 13,
    daysLate: 8,
    usual: "Iced flat white",
  },
  signals: [
    {
      label: "Visit rhythm changed",
      detail: "Usually every 5 days; now 13 days since the last visit.",
      kind: "behaviour",
    },
    {
      label: "Longer morning waits",
      detail: "His last 3 morning visits averaged 14 minutes.",
      kind: "experience",
    },
    {
      label: "Usual unavailable twice",
      detail: "Iced flat white was unavailable on 2 recent visits.",
      kind: "availability",
    },
  ],
  hypotheses: [
    {
      label: "Queue friction",
      strength: "strong",
      evidence: "3 longer-than-usual morning waits",
    },
    {
      label: "Usual-item availability",
      strength: "possible",
      evidence: "2 recent stock misses",
    },
  ],
  probe: {
    question: "What would make your next coffee run better?",
    options: [
      {
        id: "queue",
        label: "Help me skip the queue",
        confirmation: "Express pickup is ready for your next visit.",
      },
      {
        id: "usual",
        label: "Keep my usual available",
        confirmation: "We will hold an iced flat white for your next visit.",
      },
      {
        id: "new",
        label: "Show me something new",
        confirmation: "We picked one new drink based on your usual.",
      },
      {
        id: "nothing",
        label: "Nothing right now",
        confirmation: "Understood. We will give you some space.",
      },
    ],
  },
  result: {
    treatmentReturnRate: 22,
    holdoutReturnRate: 13,
    incrementalReturns: 9,
    recommendation: "Test an express pickup lane during the morning rush.",
  },
} as const;
