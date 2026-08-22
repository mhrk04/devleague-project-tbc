# ProbeLoop UI Handoff

Short exact handoff for the UI teammate building the operator dashboard. Read this first, then `docs/PRD.md` and `docs/SPRINT.md` for product and plan detail.

## Goal

Build the ProbeLoop operator retention dashboard on `/operator`. The dashboard is the core product surface, not an extra. Amir's case file is the selected customer drill-down inside the dashboard, not the whole dashboard. Keep the customer-facing probe UI on `/customer/amir` and the entry point on `/`.

## Branch

Start from the latest `origin/main` after the corrected teammate context is pushed.

```bash
git fetch origin
git switch -c ui/operator-dashboard origin/main
```

## Allowed files

You may edit only these files. Do not touch `src/lib/**`, `src/data/**`, docs, or package files. The lead owns the logic and data.

- `src/app/page.tsx`
- `src/app/operator/page.tsx`
- `src/app/customer/[customerId]/page.tsx`
- `src/components/operator/AtRiskTable.tsx`
- `src/components/customer/RetentionCheckIn.tsx`
- `src/app/globals.css`

## Dashboard sections on `/operator`

Build all of these on the one `/operator` page. No new route.

1. Header: ProbeLoop operator retention dashboard, with a synthetic-data disclosure.
2. Compact overview: slipping regulars, active probes, probe return rate, holdout return rate.
3. At-risk member queue: customer, changed pattern, strongest signal or hypothesis, intervention status. Amir appears first and selected.
4. Selected Amir drill-down: existing cadence, observed facts, competing hypotheses, explicit uncertainty, probe rationale, and a call to action to `/customer/amir`.
5. Recovered state: stated preference, simulated return, treatment-versus-holdout comparison, estimated incremental returns, operational recommendation.
6. Same page, no new route. `/operator` remains the dashboard.

## Existing reusable context

- `src/components/operator/AtRiskTable.tsx` is an empty ownership boundary. Implement the at-risk queue there.
- `src/data/seed.ts` exports `prototypeStory` with Amir's cadence, signals, hypotheses, probe options, and result. Use it until the lead merges the calculated cohort.
- The current `src/app/operator/page.tsx` already renders Amir's signals, hypotheses, probe rationale, and recovered result. Fold these into the drill-down section of the dashboard.

## Interaction state

`/operator` reads search params:

- Default (no params): initial dashboard, Amir selected.
- `customer=amir`: Amir selected in the at-risk queue and drill-down.
- `preference=queue&outcome=recovered`: learned dashboard state after the simulated return.

Golden path: `/` -> `/operator` (dashboard overview, Amir selected) -> `/customer/amir` -> express pickup -> `/operator?preference=queue&outcome=recovered` (learned dashboard state).

## Visual rules

- Mobile-first, readable at 375px and 1280px.
- Semantic controls and visible focus. Text carries meaning beyond color.
- Use `aria-live` for the customer confirmation.
- No animation, no gradients, no glassmorphism, no sidebar, no chart library.
- Keep the synthetic-data label visible in the initial and recovered states.

## Definition of done

- `/operator` renders the dashboard with all sections above and Amir selected.
- The at-risk queue lists at least Amir with changed pattern, strongest signal, and intervention status.
- The Amir drill-down shows cadence, observed facts, competing hypotheses, explicit uncertainty, probe rationale, and a call to action to `/customer/amir`.
- The recovered state shows preference, return, treatment-versus-holdout comparison, incremental returns, and the operational recommendation.
- The customer page shows one neutral question and an immediate service action.
- `npm run lint` and `npm run build` pass.

## Commit and push

```bash
git add src/app src/components/customer/RetentionCheckIn.tsx src/components/operator/AtRiskTable.tsx
git commit -m "build the operator retention dashboard"
git push -u origin ui/operator-dashboard
```

The lead merges `logic/retention-engine` first, then this branch. Coordinate with the lead before pushing if the logic merge is already in progress.
