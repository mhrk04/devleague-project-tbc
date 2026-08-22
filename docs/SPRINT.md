# ProbeLoop Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the ProbeLoop Lab 4 submission: a focused operator retention dashboard driven by a deterministic 80-member retention engine, with Amir's case as the drill-down and calculated experiment metrics, within a four-hour feature freeze.

**Architecture:** Keep the Next.js App Router scaffold. The operator and customer pages render from a deterministic synthetic dataset and calculated logic modules, not from hard-coded cohort numbers. URL state carries the simulated outcome. No backend, database, auth, LLM, or store is added.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, and the existing global CSS.

---

## Roles and lanes

The user is both the team lead and the backend and logic-data owner. There is no separate logic teammate.

- **Lead / backend (user):** branches `logic/retention-engine`. Owns the deterministic cohort engine, docs, merge and integration, Vercel deployment, and final submission approval.
- **UI teammate:** branches `ui/operator-dashboard`. Owns the operator dashboard, the customer-facing probe UI, and responsive and accessibility polish.
- **Supporting teammate:** owns manual QA at desktop and mobile widths, demo rehearsal, video recording and editing, and the submission checklist. Reports defects and links to the lead. Does not edit product code or planning docs unless the lead explicitly reassigns a file.

The UI teammate builds the dashboard and customer surfaces against the lead's logic. The lead does not build the UI lane, and the UI teammate does not build the logic lane.

## File ownership matrix

No-overlap rule: a lane edits only its own files. The lead merges and handles docs and deployment.

| Owner | Files |
| --- | --- |
| UI teammate | `src/app/page.tsx`, `src/app/operator/page.tsx`, `src/app/customer/[customerId]/page.tsx`, `src/components/customer/RetentionCheckIn.tsx`, `src/components/operator/AtRiskTable.tsx`, `src/app/globals.css`. Immediate priority is `/operator`, `src/components/operator/AtRiskTable.tsx`, and `src/app/globals.css`. |
| Lead / backend | `src/lib/types.ts`, `src/lib/risk.ts`, `src/lib/signals.ts`, `src/lib/reasons.ts`, `src/lib/interventions.ts`, `src/lib/experiments.ts`, and `src/data/seed.ts`. Also owns docs, merge/integration, Vercel deployment, and final submission approval. |
| Supporting teammate | No product-code ownership. Owns manual QA results, rehearsal, video files, and the submission-link checklist. |

The logic/data lane must not edit app, components, CSS, or docs. The UI lane must not edit `src/lib/**`, `src/data/**`, docs, or package files. Do not build or use `src/lib/store.ts`.

## Start point

The working Amir click-through is already frozen on `main`. After the corrected teammate context is pushed, every lane starts from the latest `origin/main`. Do not branch from the older prototype commit.

Commit messages are plain lower-case with no conventional prefixes.

## Branching (lanes)

UI teammate:
```bash
git fetch origin
git switch -c ui/operator-dashboard origin/main
```

Lead / backend:

```bash
git fetch origin
git switch -c logic/retention-engine origin/main
```

Both lanes work in parallel against the latest corrected `origin/main`.

## Schedule

| Time | Activity |
| --- | --- |
| 0:00-0:10 | Fetch the corrected context from `origin/main` and create the two work branches. |
| 0:10-1:30 | Parallel: UI lane and lead/backend lane. Supporting teammate prepares QA, rehearsal, and video. |
| 1:30 | Merge logic. Verify lint and build. |
| 1:45-2:40 | Integrate UI, finalize docs/deploy. |
| 2:40 | Merge UI and feature freeze. Working software becomes the submission. No new features. |
| 3:00-3:25 | Deployed verification and rehearsal. |
| 3:25-3:50 | Record video. |
| 3:50-4:00 | Submit. |

Feature-freeze gate: after the UI merge at 2:40, no new features are accepted. Only fixes needed to make the deployed golden path work are allowed.

---

## Logic/data lane: `logic/retention-engine`

### Task L1: define domain types

**Files:** `src/lib/types.ts`

Replace the existing marker export with the domain contracts needed by the approved flow:

```ts
export type Customer = {
  id: string;
  name: string;
  usual: string;
  visitDates: readonly string[];
  recentWaitMinutes: readonly number[];
  usualUnavailableCount: number;
};

export type Signal = {
  label: string;
  detail: string;
  kind: "behaviour" | "experience" | "availability";
};

export type HypothesisStrength = "strong" | "possible" | "weak";

export type Hypothesis = {
  label: string;
  strength: HypothesisStrength;
  evidence: string;
};

export type ProbePreference = "queue" | "usual" | "new" | "nothing";

export type ServiceAction = {
  preference: ProbePreference;
  action: string;
  confirmation: string;
};

export type ExperimentGroup = "probe" | "holdout";

export type ExperimentAssignment = {
  customerId: string;
  group: ExperimentGroup;
  returned: boolean;
};

export type ExperimentMetrics = {
  treatmentSize: number;
  holdoutSize: number;
  treatmentReturns: number;
  holdoutReturns: number;
  treatmentReturnRate: number;
  holdoutReturnRate: number;
  estimatedIncrementalReturns: number;
};
```

- [ ] Step: replace the existing marker export with these types.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L2: median cadence and lapse eligibility

**Files:** `src/lib/risk.ts`

```ts
export function calculateMedianCadence(visits: readonly string[]): number | null {
  if (visits.length < 2) return null;
  const sorted = [...visits].sort((a, b) => a.localeCompare(b));
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1]).getTime();
    const b = new Date(sorted[i]).getTime();
    intervals.push(Math.round((b - a) / 86400000));
  }
  intervals.sort((a, b) => a - b);
  const mid = Math.floor(intervals.length / 2);
  const median =
    intervals.length % 2 === 0
      ? (intervals[mid - 1] + intervals[mid]) / 2
      : intervals[mid];
  return Math.round(median);
}

export function isVisitLapsed(visits: readonly string[], asOf: string): boolean {
  if (visits.length < 4) return false;
  const median = calculateMedianCadence(visits);
  if (median === null) return false;
  const sorted = [...visits].sort((a, b) => a.localeCompare(b));
  const last = new Date(sorted[sorted.length - 1]).getTime();
  const daysSince = Math.round((new Date(asOf).getTime() - last) / 86400000);
  return daysSince >= 2 * median;
}
```

Expected behaviors:

- Visits are sorted internally before computing intervals.
- Intervals use whole UTC calendar days.
- Fewer than 2 visits returns `null` from `calculateMedianCadence`.
- Fewer than 4 visits returns `false` from `isVisitLapsed`.

- [ ] Step: implement both functions.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L3: derive signals

**Files:** `src/lib/signals.ts`

```ts
import type { Customer, Signal } from "./types";
import { calculateMedianCadence, isVisitLapsed } from "./risk";

export function deriveSignals(customer: Customer, asOf: string): Signal[] {
  const signals: Signal[] = [];
  const median = calculateMedianCadence(customer.visitDates);
  const lapsed = isVisitLapsed(customer.visitDates, asOf);
  if (median !== null && lapsed) {
    signals.push({
      label: "Visit rhythm changed",
      detail: `Usually every ${median} days; now past the expected interval.`,
      kind: "behaviour",
    });
  }
  if (customer.recentWaitMinutes.length > 0) {
    const averageWait = Math.round(
      customer.recentWaitMinutes.reduce((sum, value) => sum + value, 0) /
        customer.recentWaitMinutes.length,
    );
    if (averageWait >= 12) {
      signals.push({
        label: "Longer morning waits",
        detail: `${customer.recentWaitMinutes.length} recent visits averaged ${averageWait} minutes.`,
        kind: "experience",
      });
    }
  }
  if (customer.usualUnavailableCount >= 2) {
    signals.push({
      label: "Usual unavailable",
      detail: `${customer.usual} was unavailable ${customer.usualUnavailableCount} times.`,
      kind: "availability",
    });
  }
  return signals;
}
```

- [ ] Step: implement `deriveSignals`.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L4: derive hypotheses

**Files:** `src/lib/reasons.ts`

```ts
import type { Hypothesis, Signal } from "./types";

export function deriveHypotheses(signals: readonly Signal[]): Hypothesis[] {
  const hypotheses: Hypothesis[] = [];
  const experience = signals.find((signal) => signal.kind === "experience");
  if (experience) {
    hypotheses.push({
      label: "Queue friction",
      strength: "strong",
      evidence: experience.detail,
    });
  }
  const availability = signals.find((signal) => signal.kind === "availability");
  if (availability) {
    hypotheses.push({
      label: "Usual-item availability",
      strength: "possible",
      evidence: availability.detail,
    });
  }
  return hypotheses;
}
```

Labels are only `strong`, `possible`, or `weak`, each tied to exact evidence. Never a churn probability.

- [ ] Step: implement `deriveHypotheses`.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L5: map preference to service action

**Files:** `src/lib/interventions.ts`

```ts
const ACTIONS: Record<ProbePreference, ServiceAction> = {
  queue: {
    preference: "queue",
    action: "Enable express pickup for the next visit.",
    confirmation: "Express pickup is ready for your next visit.",
  },
  usual: {
    preference: "usual",
    action: "Hold the customer's usual item.",
    confirmation: "We will hold an iced flat white for your next visit.",
  },
  new: {
    preference: "new",
    action: "Recommend one new drink based on the usual.",
    confirmation: "We picked one new drink based on your usual.",
  },
  nothing: {
    preference: "nothing",
    action: "Respect the choice and give space.",
    confirmation: "Understood. We will give you some space.",
  },
};

export function serviceActionFor(preference: ProbePreference): ServiceAction {
  return ACTIONS[preference];
}
```

- [ ] Step: implement `serviceActionFor`.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L6: stable assignment and calculated metrics

**Files:** `src/lib/experiments.ts`

```ts
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function assignExperimentGroup(customerId: string): ExperimentGroup {
  return hashId(customerId) % 2 === 0 ? "probe" : "holdout";
}

export function calculateExperimentMetrics(
  assignments: readonly ExperimentAssignment[],
): ExperimentMetrics {
  const treatment = assignments.filter((a) => a.group === "probe");
  const holdout = assignments.filter((a) => a.group === "holdout");
  const treatmentSize = treatment.length;
  const holdoutSize = holdout.length;

  // The lead/backend owner supplies post-period returned flags for each assignment.
  const treatmentReturns = treatment.filter((a) => a.returned).length;
  const holdoutReturns = holdout.filter((a) => a.returned).length;

  const treatmentReturnRate =
    treatmentSize === 0 ? 0 : treatmentReturns / treatmentSize;
  const holdoutReturnRate = holdoutSize === 0 ? 0 : holdoutReturns / holdoutSize;

  const estimatedIncrementalReturns =
    treatmentReturns - treatmentSize * holdoutReturnRate;

  return {
    treatmentSize,
    holdoutSize,
    treatmentReturns,
    holdoutReturns,
    treatmentReturnRate,
    holdoutReturnRate,
    estimatedIncrementalReturns,
  };
}
```

Notes:

- Assignment is deterministic and stable by customer ID.
- Empty groups return zero rates and zero incremental returns, never NaN.
- Estimated incremental returns = treatment returns - (treatment size x holdout return rate).

- [ ] Step: implement `assignExperimentGroup` and `calculateExperimentMetrics`.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L7: deterministic 80-member dataset

**Files:** `src/data/seed.ts`

Retain the existing `prototypeStory` export until integration. Add a deterministic 80-member cohort:

- 80 opted-in loyalty members with six months of activity.
- Each member has a stable customer ID, name, usual item, and visit dates.
- Post-period outcome flags are generated deterministically and stored.
- The cohort keeps Amir as the visible story customer.

Generate visit dates deterministically so the same run always produces the same cohort. Do not add a randomness dependency.

- [ ] Step: add the 80-member cohort export.
- [ ] Step: confirm `prototypeStory` still exports.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L8: commit the lane

No dependency-free tests. Validation for this lane is lint and build only.

- [ ] Step: run `npm run lint && npm run build`; expect exit 0.
- [ ] Step: commit and push the lane:
  ```bash
  git add src/lib src/data/seed.ts
  git commit -m "build deterministic retention engine"
  git push -u origin logic/retention-engine
  ```

### Logic/data merge

When the logic/data lane is done (around 1:30), the lead merges it into `main` and verifies:

```bash
git switch main
git fetch origin
git merge --no-ff origin/logic/retention-engine
npm run lint
npm run build
```

Expect lint and build to pass. The `prototypeStory` export remains so the current click-through still works during integration.

---

## UI lane: `ui/operator-dashboard`

Build the operator retention dashboard on `/operator`. The current `src/app/operator/page.tsx` contains the reusable Amir case. `src/components/operator/AtRiskTable.tsx` is only an empty ownership boundary and must be implemented as the queue. The lead/backend owner supplies calculated cohort exports; the UI does not hard-code final cohort metrics.

### Task U1: operator dashboard

**Files:** `src/app/operator/page.tsx`, `src/components/operator/AtRiskTable.tsx`, `src/app/globals.css`

Build `/operator` as a focused retention dashboard. No new route.

- Show compact overview metrics: slipping-member count, active probes, and probe-versus-holdout return rates.
- Show a five-row at-risk member queue using `src/components/operator/AtRiskTable.tsx`.
- Selecting Amir opens his existing case file as a drill-down with cadence change, observed signals as a flat left-ruled list, hypotheses visually separate, explicit uncertainty as the hero, and why a neutral probe beats discounting.
- Read `preference` and `outcome` from search params. Support `/operator?preference=queue&outcome=recovered`.
- In the recovered state, show the stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, and the operational recommendation.
- Keep the synthetic-data label visible in both states.

- [ ] Step: implement the operator dashboard using the existing case file and `AtRiskTable`.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task U2: customer check-in

**Files:** `src/components/customer/RetentionCheckIn.tsx`, `src/app/customer/[customerId]/page.tsx`

- Show one neutral question with four options: skip queue, keep usual available, try something new, nothing right now.
- Selecting an option immediately provides a useful service action via `serviceActionFor`.
- Choosing the queue option links to `/operator?preference=queue&outcome=recovered`.
- `/customer/unknown` shows a recovery message and link back to `/operator`.
- Use `aria-live` for confirmation.

- [ ] Step: implement the customer check-in.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task U3: entry and visual polish

**Files:** `src/app/page.tsx`, `src/app/globals.css`

- `/` states the thesis and links to the operator dashboard.
- Keep the responsive visual system: semantic controls, visible focus, text beyond color, `aria-live`, readable at 375px and 1280px, no animation.

- [ ] Step: implement the entry route and CSS.
- [ ] Step: run `npm run lint && npm run build`; expect exit 0.
- [ ] Step: commit and push the lane:
  ```bash
  git add src/app src/components/customer/RetentionCheckIn.tsx src/components/operator/AtRiskTable.tsx
  git commit -m "build the operator retention dashboard"
  git push -u origin ui/operator-dashboard
  ```

### UI merge

After the logic merge, the lead integrates the UI (around 1:45-2:40). The UI consumes calculated outputs from the merged logic. At 2:40 the lead merges the UI and freezes features:

```bash
git switch main
git fetch origin
git merge --no-ff origin/ui/operator-dashboard
npm run lint
npm run build
```

Working software becomes the submission. No new features after this gate.

---

## Deployment and submission

Deploy via Vercel using the connected GitHub repository, or `npx vercel --prod` only if the CLI is already authenticated. Do not add dependencies for deployment.

The lead deploys and fixes integration issues. The supporting teammate verifies the deployed golden path and health endpoint, rehearses and records the video, and checks every submission link. The lead approves and submits the final package.

## Verification checklist

- `npm run lint`
- `npm run build`
- `git diff --check`
- Golden-path manual check.
- Manual checks at 375px and 1280px.
- Deployed check matches local check.
- Exact golden path: `/` -> `/operator` (dashboard overview, Amir selected) -> `/customer/amir` -> express pickup -> `/operator?preference=queue&outcome=recovered` (learned dashboard state).
- `/customer/unknown` shows the recovery fallback.
- Unknown query falls back to the initial operator state.
- `/api/health` returns JSON.

## Merge order

1. Branch from the latest corrected `origin/main` context.
2. Merge `logic/retention-engine` first; verify lint and build.
3. Integrate UI; finalize docs and deploy.
4. Merge `ui/operator-dashboard` and freeze features.
