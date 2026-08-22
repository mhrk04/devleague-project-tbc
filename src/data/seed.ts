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
