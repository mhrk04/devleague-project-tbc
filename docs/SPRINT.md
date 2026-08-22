# ProbeLoop Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the ProbeLoop Lab 4 submission as a complete personalized retention system: a focused operator retention dashboard driven by a deterministic 80-member retention engine, with Amir's case as the drill-down, an offer-first personalized customer flow, and calculated experiment metrics, within the four-hour feature freeze.

**Architecture:** Keep the Next.js App Router scaffold. The operator and customer pages render from a deterministic synthetic dataset and calculated logic modules, not from hard-coded cohort numbers. URL state carries the simulated outcome. No backend, database, auth, LLM, or store is added.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, and the existing global CSS.

---

## Roles and lanes

The user is both the team lead and the backend and logic-data owner. There is no separate logic teammate.

- **Lead / backend (user):** branches `logic/reward-probe`. Owns the deterministic cohort engine, the minimal reward and favorite-order backend additions, docs, merge and integration, Vercel deployment, and final submission approval.
- **UI teammate:** branches `ui/operator-dashboard`. Owns the operator dashboard, the offer-first customer-facing probe UI, and responsive and accessibility polish.
- **Supporting teammate:** owns manual QA at desktop and mobile widths, demo rehearsal, video recording and editing, and the submission checklist. Reports defects and links to the lead. Does not edit product code or planning docs unless the lead explicitly reassigns a file.

The UI teammate builds the dashboard and customer surfaces against the lead's logic. The lead does not build the UI lane, and the UI teammate does not build the logic lane.

## File ownership matrix

No-overlap rule: a lane edits only its own files. The lead merges and handles docs and deployment.

| Owner | Files |
| --- | --- |
| UI teammate | `src/app/page.tsx`, `src/app/operator/page.tsx`, `src/app/customer/[customerId]/page.tsx`, `src/components/customer/RetentionCheckIn.tsx`, `src/components/operator/AtRiskTable.tsx`, `src/app/globals.css`. Immediate priority is `/operator`, `src/components/operator/AtRiskTable.tsx`, and `src/app/globals.css`. The UI teammate also implements the offer-first customer flow and its activation states in these allowed files. |
| Lead / backend | `src/lib/types.ts`, `src/lib/risk.ts`, `src/lib/signals.ts`, `src/lib/reasons.ts`, `src/lib/interventions.ts`, `src/lib/experiments.ts`, and `src/data/seed.ts`. Also owns docs, merge/integration, Vercel deployment, and final submission approval. |
| Supporting teammate | No product-code ownership. Owns manual QA results, rehearsal, video files, and the submission-link checklist. |

The logic/data lane must not edit app, components, CSS, or docs. The UI lane must not edit `src/lib/**`, `src/data/**`, docs, or package files. Do not build or use `src/lib/store.ts`.

## Start point

The deterministic retention engine is already merged onto `main`. The operator dashboard and the offer-first customer flow are the remaining builds. Every lane starts from the latest `origin/main`. Do not branch from an older commit or hardcode a SHA; always branch from the current `origin/main`.

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
git switch -c logic/reward-probe origin/main
```

Both lanes work in parallel against the latest `origin/main`.

## Schedule

| Time | Activity |
| --- | --- |
| 0:00-0:10 | Fetch the latest `origin/main` and create the two work branches. |
| 0:10-1:30 | Parallel: UI lane and lead/backend lane. Supporting teammate prepares QA, rehearsal, and video. |
| 1:30 | Merge logic. Verify lint and build. |
| 1:45-2:40 | Integrate UI, finalize docs/deploy. |
| 2:40 | Merge UI and feature freeze. Working software becomes the submission. No new features. |
| 3:00-3:25 | Deployed verification and rehearsal. |
| 3:25-3:50 | Record video. |
| 3:50-4:00 | Submit. |

Feature-freeze gate: after the UI merge at 2:40, no new features are accepted. Only fixes needed to make the deployed golden path work are allowed.

---

## Logic/data lane: `logic/reward-probe`

The deterministic retention engine is already on `main`. This lane only makes the minimal backend additions for the favorite-order and personalized-reward contracts and data. The lead owns these additions.

### Task L1: favorite-order and reward contracts

**Files:** `src/lib/types.ts`

Add the minimal domain contracts needed by the reward flow, on top of the existing engine types:

- `FavoriteOrder`: the member's usual item and reward reference derived from purchase history.
- `PersonalizedReward`: the offer message and reward value tied to the favorite order.

Keep the existing `Customer`, `Signal`, `Hypothesis`, `ProbePreference`, `ServiceAction`, `ExperimentAssignment`, and `ExperimentMetrics` contracts unchanged.

- [ ] Step: add the favorite-order and personalized-reward types.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L2: reward data in the dataset

**Files:** `src/data/seed.ts`

Add the minimal personalized-reward data for the visible story customer so the offer-first flow renders:

- Amir's favorite order references his usual iced flat white.
- The personalized reward message reads like "Amir, enjoy RM5 off your usual iced flat white."
- The reward value is tied to the favorite order and is identical for every answer.

Retain the existing 80-member cohort and the `prototypeStory` export until integration.

- [ ] Step: add the personalized-reward data.
- [ ] Step: confirm the 80-member cohort and `prototypeStory` still export.
- [ ] Step: run `npm run lint`; expect exit 0.

### Task L3: commit the lane

No dependency-free tests. Validation for this lane is lint and build only.

- [ ] Step: run `npm run lint && npm run build`; expect exit 0.
- [ ] Step: commit and push the lane:
  ```bash
  git add src/lib/types.ts src/data/seed.ts
  git commit -m "add personalized reward probe data"
  git push -u origin logic/reward-probe
  ```

### Logic/data merge

When the logic/data lane is done (around 1:30), the lead merges it into `main` and verifies:

```bash
git switch main
git fetch origin
git merge --no-ff origin/logic/reward-probe
npm run lint
npm run build
```

Expect lint and build to pass.

---

## UI lane: `ui/operator-dashboard`

Build the operator retention dashboard on `/operator` and the offer-first customer flow on `/customer/amir`. The lead/backend owner supplies calculated cohort exports and the reward data; the UI does not hard-code final cohort metrics.

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

### Task U2: offer-first customer flow and activation states

**Files:** `src/components/customer/RetentionCheckIn.tsx`, `src/app/customer/[customerId]/page.tsx`

- Show the personalized comeback hook first, referencing the member's usual item and reward.
- Tapping into the hook reveals one neutral question before any reward activates: "What would make your next coffee run better?"
- Show four options: skip queue, keep usual available, try something new, nothing right now.
- Any answer, including "Nothing right now", unlocks the same reward. No option is privileged.
- The selected answer immediately provides a useful service action via `serviceActionFor`.
- The reward activation is announced with `aria-live`.
- Choosing the queue option links to `/operator?preference=queue&outcome=recovered`.
- `/customer/unknown` shows a recovery message and link back to `/operator`.

- [ ] Step: implement the offer-first customer flow and its activation states.
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
  git commit -m "build the operator retention dashboard and reward flow"
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
- Exact golden path: `/` -> `/operator` (dashboard overview, Amir selected) -> `/customer/amir` -> personalized hook -> one neutral question -> any answer unlocks the reward -> service action -> simulated redemption -> `/operator?preference=queue&outcome=recovered` (learned dashboard state).
- Confirm any answer, including "Nothing right now", unlocks the same reward.
- `/customer/unknown` shows the recovery fallback.
- Unknown query falls back to the initial operator state.
- `/api/health` returns JSON.

## Merge order

1. Branch from the latest `origin/main`, never a hardcoded SHA.
2. Merge `logic/reward-probe` first; verify lint and build.
3. Integrate UI; finalize docs and deploy.
4. Merge `ui/operator-dashboard` and freeze features.
