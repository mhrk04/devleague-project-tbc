# ProbeLoop

A cafe retention experiment that turns personalized comeback offers into customer insight, then measures which experiences actually bring regulars back.

Tagline: **Every comeback should teach you something.**

## Status

The deterministic retention engine is merged on `main`: median cadence, lapse eligibility, observed signals, competing hypotheses, stable experiment assignment, and the synthetic 80-member cohort. All data on screen is synthetic and clearly labelled. The target submission surface is an operator retention dashboard on `/operator` with an offer-first personalized customer flow on `/customer/amir`. The dashboard and the reward-hook UI are the next builds described in `docs/SPRINT.md`; neither exists yet.

Submission links (deployed URL and video) are verified at deployment and submission time, not invented here.

## Getting started

```bash
npm install
npm run dev
```

## Current visible routes

| Route | Surface |
| --- | --- |
| `/` | Entry point with the thesis |
| `/operator` | Current Amir case file; target operator dashboard is defined in `docs/UI-HANDOFF.md` |
| `/customer/amir` | One-question service probe; target offer-first personalized flow is defined in `docs/UI-HANDOFF.md` |
| `/api/health` | Health check (JSON) |

The golden path is `/` -> `/operator` (dashboard overview, Amir selected) -> `/customer/amir` -> personalized hook -> one neutral question -> any answer unlocks the reward -> service action -> simulated redemption -> `/operator?preference=queue&outcome=recovered` (learned dashboard state).

`/demo/transaction` remains from the original scaffold but is not part of the pitch.

## Current prototype

- `src/data/seed.ts`: the synthetic Amir story and the deterministic 80-member cohort.
- `src/app/*`: current Amir case file, customer, home, demo, and health routes.
- `src/components/operator/AtRiskTable.tsx`: empty UI ownership boundary for the at-risk member queue.
- `src/components/customer/RetentionCheckIn.tsx`: the one-question service probe.
- `src/lib/*`: the deterministic retention engine (types, risk, signals, reasons, interventions, experiments).

## Next build

- `src/app/operator/page.tsx`: the operator retention dashboard with overview metrics, at-risk queue, and Amir drill-down.
- `src/app/customer/[customerId]/page.tsx`: the offer-first personalized customer flow.
- `src/components/customer/RetentionCheckIn.tsx`: the personalized hook, one neutral probe, reward activation states, and service action.
- `src/components/operator/AtRiskTable.tsx`: the at-risk member queue.
- Minimal lead-owned additions to `src/lib/types.ts` and `src/data/seed.ts` for the favorite-order and personalized-reward contracts and data.

## Documentation

- `docs/superpowers/specs/2026-08-22-personalized-reward-probe-design.md`: approved design spec.
- `docs/PRD.md`: product requirements and design source.
- `docs/SPRINT.md`: implementation plan and lane handoff.
- `docs/UI-HANDOFF.md`: exact handoff for the UI owner building the operator dashboard and offer-first customer flow.
- `docs/PITCH.md`: 3-minute narration and submission checklist.
- `PLAN.md`: short plan index.

## Honesty boundary

All data is synthetic and demonstrates the method, not verified commercial impact. ProbeLoop works only with identified, opted-in loyalty members. The treatment is the complete package of personalized hook, one-tap probe, reward, and service action, measured against a no-contact holdout. One customer response is preference evidence, not proof of cause. No churn probability is shown.
