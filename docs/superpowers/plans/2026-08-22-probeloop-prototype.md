# ProbeLoop Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one polished, synthetic click-through that makes ProbeLoop's detect, question, act, and learn loop visible.

**Architecture:** Keep the current Next.js App Router scaffold and use one immutable story from `src/data/seed.ts`. The operator page reads a query parameter for the recovered demo state; the customer page uses one client component for the one-tap answer. No backend, persistence, model, or test framework is added.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, existing global CSS

---

## file map

- `src/data/seed.ts`: one shared synthetic Amir story, probe options, and illustrative cohort outcome.
- `src/app/operator/page.tsx`: initial investigation and recovered experiment result.
- `src/app/customer/[customerId]/page.tsx`: supported-customer routing and recovery fallback.
- `src/components/customer/RetentionCheckIn.tsx`: one-tap customer interaction and confirmation.
- `src/app/page.tsx`: short entry point into the operator story.
- `src/app/layout.tsx`: ProbeLoop metadata.
- `src/app/globals.css`: responsive visual system for the two product surfaces.

The approved prototype exception uses lint, production build, and a manual click-through instead of adding test infrastructure.

### Task 1: shared synthetic story

**Files:**
- Modify: `src/data/seed.ts`

- [ ] **Step 1: replace the marker with one immutable story**

Define one `prototypeStory` object with this stable shape:

```ts
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
```

- [ ] **Step 2: verify TypeScript and lint accept the data**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

### Task 2: operator investigation and learned outcome

**Files:**
- Modify: `src/app/operator/page.tsx`

- [ ] **Step 1: render the initial operator state**

Import `Link` and `prototypeStory`. Accept Next.js 16 async search parameters:

```ts
type OperatorPageProps = {
  searchParams: Promise<{ outcome?: string }>;
};

export default async function OperatorPage({ searchParams }: OperatorPageProps) {
  const { outcome } = await searchParams;
  const recovered = outcome === "recovered";
  const { customer, signals, hypotheses, result } = prototypeStory;

  // Render the same investigation in both states, then conditionally render
  // the illustrative result when recovered is true.
}
```

The rendered initial state must include:

- A visible `Synthetic demo` label.
- The headline `Amir is 8 days outside his usual rhythm.`
- Three observed signal cards.
- Two possible-explanation cards labelled `strong` and `possible`.
- The sentence `We cannot yet distinguish queue friction from availability.`
- The reason no discount is recommended.
- A primary link to `/customer/amir` labelled `Preview Amir's service probe`.

- [ ] **Step 2: render the recovered query state**

When `recovered` is true, add an outcome section using the shared result:

```tsx
{recovered && (
  <section className="result-panel" aria-labelledby="result-title">
    <p className="eyebrow">Illustrative outcome</p>
    <h2 id="result-title">Amir returned using express pickup.</h2>
    <div className="metric-pair">
      <div><strong>{result.treatmentReturnRate}%</strong><span>probe group</span></div>
      <div><strong>{result.holdoutReturnRate}%</strong><span>holdout</span></div>
    </div>
    <p>{result.recommendation}</p>
  </section>
)}
```

Keep the result explicitly labelled illustrative. Do not claim statistical significance.

- [ ] **Step 3: run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

### Task 3: one-tap customer probe

**Files:**
- Modify: `src/components/customer/RetentionCheckIn.tsx`
- Modify: `src/app/customer/[customerId]/page.tsx`

- [ ] **Step 1: implement the client interaction**

Use local React state only:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { prototypeStory } from "@/data/seed";

type ProbeOption = (typeof prototypeStory.probe.options)[number];

export function RetentionCheckIn() {
  const [selected, setSelected] = useState<ProbeOption | null>(null);

  if (selected) {
    return (
      <section className="customer-confirmation" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true">✓</span>
        <p className="eyebrow">All set</p>
        <h2>{selected.confirmation}</h2>
        <p>This response is treated as a preference, not proof of why you stopped visiting.</p>
        {selected.id === "queue" ? (
          <Link className="button primary" href="/operator?outcome=recovered">
            Simulate Amir's next visit
          </Link>
        ) : (
          <button className="button secondary" type="button" onClick={() => setSelected(null)}>
            Choose another option
          </button>
        )}
      </section>
    );
  }

  return (
    <section aria-labelledby="probe-question">
      <p className="eyebrow">One quick check-in</p>
      <h1 id="probe-question">{prototypeStory.probe.question}</h1>
      <div className="probe-options">
        {prototypeStory.probe.options.map(option => (
          <button key={option.id} type="button" onClick={() => setSelected(option)}>
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: route supported and unsupported customers**

In the customer page, await `params`, compare `customerId` with `prototypeStory.customer.id`, and render:

```tsx
if (customerId !== prototypeStory.customer.id) {
  return (
    <main className="customer-shell">
      <section className="customer-card">
        <p className="eyebrow">Prototype customer not found</p>
        <h1>This click-through currently follows Amir only.</h1>
        <Link className="button primary" href="/operator">Return to the operator case</Link>
      </section>
    </main>
  );
}

return (
  <main className="customer-shell">
    <section className="customer-card">
      <div className="customer-brand">ProbeLoop <span>Synthetic demo</span></div>
      <p>Hi {prototypeStory.customer.name}. We noticed your routine changed.</p>
      <RetentionCheckIn />
    </section>
  </main>
);
```

- [ ] **Step 3: run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

### Task 4: visual system and entry route

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: update metadata and entry copy**

Set metadata to:

```ts
export const metadata: Metadata = {
  title: "ProbeLoop",
  description: "A synthetic cafe retention experiment that learns before it discounts.",
};
```

The home page should contain only the product name, one-sentence thesis, a synthetic-data label, and one primary link to `/operator`.

- [ ] **Step 2: implement the responsive visual system**

Use CSS only. Preserve semantic HTML and cover these exact states:

```css
:root {
  --ink: #172019;
  --muted: #647067;
  --paper: #f4f1e9;
  --surface: #fffdf7;
  --line: #d9ddd5;
  --leaf: #285f3f;
  --leaf-soft: #dceadf;
  --amber: #a65f16;
  --amber-soft: #f7e7cd;
}

@media (max-width: 680px) {
  .operator-grid,
  .evidence-grid,
  .metric-pair {
    grid-template-columns: 1fr;
  }

  .customer-card {
    border-radius: 0;
    min-height: 100dvh;
  }
}
```

Add visible `:focus-visible` treatment, 44px minimum button height, responsive one-column layouts, restrained card borders, and a distinct customer surface. Avoid chart libraries, animations, gradients, and stock imagery.

- [ ] **Step 3: verify the production build**

Run: `npm run lint && npm run build`

Expected: both commands exit 0; generated routes include `/`, `/operator`, and `/customer/[customerId]`.

- [ ] **Step 4: manually verify the click-through**

Run: `npm run dev`

Check:

1. `/operator` shows signals, competing explanations, and uncertainty.
2. `/customer/amir` provides four keyboard-focusable choices.
3. Choosing express pickup reveals a confirmation.
4. The simulation link opens `/operator?outcome=recovered`.
5. The recovered state stays explicitly synthetic and recommends an operational experiment.
6. `/customer/unknown` provides a recovery link.
7. Operator and customer views remain readable at 375px and desktop widths.

Do not commit or push unless the user requests it.
