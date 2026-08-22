# ProbeLoop Product Requirements (PRD)

This is the canonical product and design source for the ProbeLoop Lab 4 submission. It defines the product thesis, the golden path, functional requirements, transparent rules, UI design rules, failure states, privacy and honesty boundaries, and acceptance criteria.

The implementation plan lives in `docs/SPRINT.md`. The narrated demo lives in `docs/PITCH.md`.

## Product thesis

ProbeLoop helps cafes learn why opted-in regulars may be disengaging before wasting margin on discounts.

Closing line: **Learn before you discount.**

A cafe sends one promotion to everyone. That wastes margin on customers who would have returned anyway and assumes every disengaged regular wants a discount. ProbeLoop instead treats a changed habit as an open question. It shows the operator competing, evidence-backed explanations, preserves explicit uncertainty, runs one neutral service probe with the customer, and measures the result against a holdout so the cafe learns before it spends.

## Problem

Cafe operators cannot tell which regulars are quietly drifting away and why. They react with blanket discounts that cut into margin without telling them anything about the cause. Every absent customer is treated as the same problem, and every returned customer is credited to the promotion even when they would have come back on their own.

The result is margin burned on customers who did not need a discount and no signal about what actually changed.

## User

- **Operator:** the cafe owner or manager who reads one customer case file, decides whether to probe or discount, and later sees what the cafe learned from a cohort.
- **Customer:** an identified, opted-in loyalty member whose routine changed. They answer one neutral question and immediately get a useful service action.

Only identified, opted-in loyalty members are in scope. ProbeLoop never tracks anonymous customers.

## Lab 4 mapping

| Question | Answer |
| --- | --- |
| Who is disengaging? | Identified loyalty members whose visit cadence moved outside their own normal interval. |
| Why might they be disengaging? | Competing qualitative hypotheses, each tied to exact observed evidence, with explicit uncertainty. |
| What action can the cafe take? | Run one low-cost neutral service probe instead of a blanket discount. |
| What is the measurable impact? | Cohort return rate, treatment-versus-holdout return rate, and estimated incremental returns. |

## Goals

- Show an operator one regular customer's case as a single scroll: cadence change, observed signals, competing hypotheses, explicit uncertainty, and why a neutral probe beats a blanket discount.
- Let the customer answer one neutral question and immediately receive a useful service action.
- After a simulated return, show a calculated treatment-versus-holdout result and estimated incremental returns.
- Demonstrate the method with a deterministic synthetic cohort of 80 opted-in members.
- Stay honest: synthetic cohort data demonstrates the method, not commercial evidence; one response updates evidence, not proof.

## Non-goals

- No database, auth, or production messaging.
- No POS replacement, campaign builder, or LLM.
- No ML model or generic dashboard.
- No chart wall, sidebar, stock imagery, glassmorphism, gradients, or new product surfaces.
- No anonymous tracking.
- No commercial evidence claims from synthetic data.

## Golden path

`/` -> `/operator` -> `/customer/amir` -> choose express pickup -> `/operator?preference=queue&outcome=recovered`

## Routes and behavior

Visible routes: `/`, `/operator`, `/customer/amir`, `/api/health`.

| Route | Behavior |
| --- | --- |
| `/` | Entry point. States the thesis and links to the operator case. |
| `/operator` | Single-scroll customer case file for Amir. Shows cadence change, observed signals, competing hypotheses, explicit uncertainty, and why a neutral probe beats discounting. |
| `/operator?preference=queue&outcome=recovered` | Adds the learned outcome after simulation: stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, and an operational recommendation. |
| `/customer/amir` | One neutral question with four options. Selecting one immediately provides a useful service action. |
| `/api/health` | Health check returning JSON. |

`/demo/transaction` remains in the codebase from the original scaffold but is not part of the pitch. The final submission does not surface a POS surface.

## Functional requirements

### Data

- A deterministic synthetic dataset of 80 opted-in loyalty members and six months of activity.
- Each member has a personal visit cadence computed as the median interval between visits.
- A member is eligible when they have at least 4 visits and days since last visit is at least 2x their median interval.
- Synthetic post-period outcomes are generated and stored in the dataset.
- The dataset must preserve the existing `prototypeStory` export until integration, then expose the 80-member cohort.

### Detection

- `calculateMedianCadence(visits: readonly string[]): number | null` returns the median interval in whole days, or `null` when there are fewer than 2 visits.
- `isVisitLapsed(visits: readonly string[], asOf: string): boolean` returns `false` for fewer than 4 visits, `false` when the member is not at least 2x their median interval late, and `true` otherwise.
- Visit dates are sorted internally. Intervals are measured in whole UTC calendar days.

### Evidence and hypotheses

- `deriveSignals(customer: Customer, asOf: string): Signal[]` derives observed signals from records (for example, changed visit rhythm, longer waits, unavailable usual item).
- `deriveHypotheses(signals: readonly Signal[]): Hypothesis[]` returns competing qualitative hypotheses.
- Hypothesis labels are only `strong`, `possible`, or `weak`, each tied to exact supporting evidence.
- Never show a churn probability. ProbeLoop does not guess cause.

### Service probes

- `serviceActionFor(preference: ProbePreference): ServiceAction` maps one customer response to an immediate service action.
- Four options: skip queue, keep usual available, try something new, nothing right now.
- Selection immediately provides a useful service action. No form, login, or navigation chrome.

### Experiments

- `assignExperimentGroup(customerId: string): "probe" | "holdout"` is deterministic and stable by customer ID.
- `calculateExperimentMetrics(assignments: readonly ExperimentAssignment[]): ExperimentMetrics` computes cohort metrics from records.
- Empty groups return zero rates and zero incremental returns, never NaN.

### Learned outcome

- Return rate = returned / assigned, computed per group.
- Estimated incremental returns = treatment returns minus (treatment size x holdout return rate).
- The operator sees the stated preference, the return, the calculated result, and the operational recommendation.
- One customer response updates evidence; it does not prove cause.

## Transparent rules and formulas

- Median cadence: sort visit dates, take the median of consecutive-day intervals.
- Eligibility: at least 4 visits and days since last visit >= 2 x median interval.
- Hypothesis strength: deterministic rule from observed signals.
- Return rate: returned / assigned.
- Estimated incremental returns: treatment returns - (treatment size x holdout return rate).
- Assignment: stable by customer ID, so refreshes and re-renders do not move a member between groups.

## Data contracts

At a useful level:

- `Customer`: id, name, usual item, visit dates.
- `Signal`: label, detail, kind (behaviour, experience, availability).
- `Hypothesis`: label, strength (`strong` | `possible` | `weak`), evidence.
- `ProbePreference`: `"queue" | "usual" | "new" | "nothing"`.
- `ServiceAction`: description of the immediate action.
- `ExperimentAssignment`: customerId, group (`probe` | `holdout`).
- `ExperimentMetrics`: treatment size, holdout size, treatment returns, holdout returns, treatment return rate, holdout return rate, estimated incremental returns.

## UI design rules

### Operator

- Single-scroll customer case file, not a dashboard of charts.
- Facts appear as a flat left-ruled list.
- Hypotheses are visually separate from observed facts.
- Explicit uncertainty is the hero: the operator sees what is not known.
- After simulation, the operator sees the stated preference, return, calculated result, estimated incremental returns, and one operational recommendation.

### Customer

- Mobile-first.
- One neutral question with four large options.
- Selection immediately provides a useful service action.
- No form, login, or navigation chrome.

### Shared

- Semantic controls, visible focus, text beyond color, and `aria-live` for confirmation.
- Readable at 375px and 1280px.
- No animation.

## Failure states

| Condition | Behavior |
| --- | --- |
| Fewer than 4 visits / insufficient history | Not eligible. No lapse claim is made. |
| No supported explanation | Show the facts and explicit uncertainty; do not invent a hypothesis. |
| Customer declines or picks nothing right now | Provide a useful action (respect the choice, give space). |
| No response | The case remains open with uncertainty intact. |
| Unknown customer / query | `/customer/unknown` shows a recovery message and link back to `/operator`. Unknown query values fall back to the initial operator state. |
| Empty experiment group | Zero rates and zero incremental returns, never NaN. |
| Deployment failure | Use the local fallback video in the submission as described in `docs/PITCH.md`. |

## Privacy and honesty

- Identified, opted-in loyalty members only. No anonymous tracking.
- All data is a clearly labelled synthetic demo.
- Data minimization: ProbeLoop uses only what the cafe already records for opted-in members.
- One response is evidence, not proof. A single customer response updates the evidence; it does not prove why the customer disengaged.
- Holdout estimates describe a cohort-level incremental effect, not proof for any individual.
- Synthetic cohort data demonstrates the method, not verified commercial impact.
- No churn probability and no causal claims beyond the cohort comparison.

## Acceptance criteria

- The golden path works end to end from `/` to `/operator?preference=queue&outcome=recovered`.
- Amir's case file shows cadence change, observed signals, competing hypotheses, explicit uncertainty, and the probe-versus-discount rationale.
- The customer sees one neutral question and receives an immediate useful action.
- The learned outcome shows the stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, and an operational recommendation.
- Metrics are calculated from the deterministic 80-member cohort, not hard-coded.
- No churn probability appears anywhere.
- The synthetic-data caveat is visible in initial and recovered states.
- Lint and build pass. Node test passes when the venue has Node 22.6 or newer.

## Ruthless cuts

Anything not required to prove the golden path is cut: charts, auth, POS replacement, campaign builder, LLM, ML model, sidebar, animations, stock imagery, and any new product surface. The submission is one working case file with a deterministic cohort engine behind it.
