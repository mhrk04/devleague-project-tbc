# ProbeLoop

A cafe retention experiment that learns before it discounts. ProbeLoop helps cafes learn why opted-in regulars may be disengaging before wasting margin on discounts.

Closing line: **Learn before you discount.**

## Status

A working synthetic Amir case-file click-through exists. All data on screen is synthetic and clearly labelled. The target submission surface is an operator retention dashboard on `/operator`, with Amir's existing case reused as the selected customer drill-down. The dashboard and deterministic 80-member cohort engine are the next builds described in `docs/SPRINT.md`; neither exists yet.

This commit is the local prototype freeze. Submission links (deployed URL and video) are verified at deployment and submission time, not invented here.

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
| `/customer/amir` | One-question service probe |
| `/api/health` | Health check (JSON) |

The golden path is `/` -> `/operator` (dashboard overview, Amir selected) -> `/customer/amir` -> express pickup -> `/operator?preference=queue&outcome=recovered` (learned dashboard state).

`/demo/transaction` remains from the original scaffold but is not part of the pitch.

## Current prototype

- `src/data/seed.ts`: the immutable synthetic Amir story.
- `src/app/*`: current Amir case file, customer, home, demo, and health routes.
- `src/components/operator/AtRiskTable.tsx`: empty UI ownership boundary for the at-risk member queue.
- `src/components/customer/RetentionCheckIn.tsx`: the one-question service probe.

## Next build

- `src/lib/types.ts`: domain contracts.
- `src/lib/risk.ts`: median cadence and lapse eligibility.
- `src/lib/signals.ts`: observed signal derivation.
- `src/lib/reasons.ts`: qualitative evidence-backed hypotheses.
- `src/lib/interventions.ts`: customer choice to immediate service action.
- `src/lib/experiments.ts`: stable assignment and calculated cohort metrics.
- `src/data/seed.ts`: retain `prototypeStory` and add the deterministic 80-member cohort.

## Documentation

- `docs/PRD.md`: product requirements and design source.
- `docs/SPRINT.md`: implementation plan and lane handoff.
- `docs/UI-HANDOFF.md`: exact handoff for the UI owner building the operator dashboard.
- `docs/PITCH.md`: 3-minute narration and submission checklist.
- `PLAN.md`: short plan index.

## Honesty boundary

All data is synthetic and demonstrates the method, not verified commercial impact. ProbeLoop works only with identified, opted-in loyalty members. One customer response is evidence, not proof of cause. No churn probability is shown.
