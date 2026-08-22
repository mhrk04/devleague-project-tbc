# ProbeLoop personalized reward probe design

## Goal

Build the smallest credible version of the ProbeLoop Lab 4 submission as a complete personalized retention system. The system detects an opted-in regular whose cadence slips, sends a personalized comeback hook built from that member's purchase history, and when the member opens it runs one neutral one-tap probe before any reward activates. Every answer unlocks the same reward, so no response is privileged. The selected response also triggers an immediate relevant service action. A simulated POS redemption closes the loop, and the cafe measures the complete treatment package against a no-contact holdout.

One-liner: ProbeLoop turns personalized comeback offers into customer insight, then measures which experiences actually bring regulars back.

Tagline: Every comeback should teach you something.

## Product thesis

Cafes currently respond to a drifting regular with a blanket discount. That wastes margin on people who would have returned anyway, assumes every disengaged regular wants a discount, and teaches the cafe nothing about why the habit changed. ProbeLoop treats a changed habit as an open question. It personalizes the first outreach so the offer feels like the cafe knows the member, runs one neutral one-tap probe before any reward activates, gives the same reward to every answer so the probe stays honest, and measures the complete treatment package against a no-contact holdout so the cafe learns what actually brings regulars back.

The treatment is the complete package: the personalized hook, the one-tap probe, the reward, and the service action. The MVP does not claim that the probe or the coupon individually caused a return. Only the whole treatment is measured against the holdout.

## Scope

### The complete retention loop

```text
detect a changed cadence for an opted-in regular
  -> send a personalized comeback hook built from purchase history
  -> member opens the hook
  -> show one neutral one-tap probe before any reward activates
  -> any answer, including "Nothing right now", unlocks the same reward
  -> the selected response also triggers an immediate relevant service action
  -> simulate a POS redemption and return
  -> show what the cafe learned for the cohort
```

### Operator route

`/operator` is the single focused retention dashboard. It shows:

- Compact overview metrics: slipping-member count, active probes, and probe-versus-holdout return rates.
- An at-risk member queue from the deterministic 80-member cohort.
- The selected Amir case file as a drill-down: cadence change, observed signals, competing hypotheses, explicit uncertainty, and why a neutral probe beats a blanket discount.
- A call to action that leads to Amir's personalized comeback hook and probe.

`/operator?preference=queue&outcome=recovered` additionally shows the learned state:

- The stated preference.
- The simulated return via a POS redemption.
- The calculated treatment-versus-holdout return rates and estimated incremental returns.
- One operational recommendation.

Unexpected query values fall back to the initial operator state.

### Customer and offer route

`/customer/amir` is the offer-first flow:

- The member first sees the personalized comeback hook built from purchase history, for example "Amir, enjoy RM5 off your usual iced flat white."
- Tapping into the hook reveals one neutral one-tap question before any reward activates: "What would make your next coffee run better?"
- The options are: skip the queue, keep the usual available, try something new, and nothing right now.
- Any answer, including "Nothing right now", unlocks the same RM5 reward for the usual item. No option is privileged.
- The selected response also triggers an immediate relevant service action: express pickup, holding the usual item, a new-item suggestion, or respectful space.
- The response is preference evidence, never proof of cause.
- The reward is then presented as activated. A simulated POS redemption closes the loop and returns to the recovered dashboard.

Any unsupported customer ID renders a recovery message with a link back to `/operator`.

### Home route

`/` states the thesis and links to the operator dashboard. It does not present a separate marketing page.

### Excluded surfaces

`/demo/transaction` remains from the existing scaffold but is not part of the pitch. The final submission does not surface a POS surface. A simulated redemption is used instead of a fake POS form.

## Architecture and component boundaries

Keep the existing Next.js App Router scaffold. The operator and customer pages render from the deterministic synthetic dataset and the calculated logic modules, not from hard-coded cohort numbers.

- `src/lib/types.ts` owns the domain contracts, including the favorite-order and personalized-reward contracts.
- `src/lib/risk.ts` owns median cadence and lapse eligibility.
- `src/lib/signals.ts` owns observed signal derivation.
- `src/lib/reasons.ts` owns competing qualitative hypotheses.
- `src/lib/interventions.ts` owns the mapping from a customer response to an immediate service action.
- `src/lib/experiments.ts` owns stable experiment assignment and calculated cohort metrics.
- `src/data/seed.ts` owns the deterministic 80-member cohort and the personalized reward data.
- `src/app/operator/page.tsx` renders the operator dashboard in its initial and recovered states.
- `src/app/customer/[customerId]/page.tsx` renders the offer-first customer flow.
- `src/components/customer/RetentionCheckIn.tsx` is the client component owning the probe answer and activation states.
- `src/components/operator/AtRiskTable.tsx` is the at-risk member queue.
- Existing global CSS provides the responsive visual system.

The UI teammate owns the app, component, and CSS files. The lead and backend owner owns the logic and data files. There is no API call, database, shared client store, authentication, model, LLM, or persistence. URL state carries the simulated outcome.

## Data flow

```text
deterministic 80-member cohort
  -> operator reads overview metrics, the at-risk queue, and Amir's drill-down
  -> customer page reads Amir's personalized hook, reward, and probe options
  -> member taps the hook, answers one neutral question, and unlocks the reward
  -> selected answer triggers an immediate service action
  -> simulated POS redemption adds outcome=recovered to the operator URL
  -> operator renders the learned treatment-versus-holdout result
```

No state needs to survive refreshes or move between browsers.

## Reward and probe rules

- The reward is personalized to the member's usual item and is the same for every answer.
- The personalized reward is advertised in the comeback hook, but activates only after the member answers the neutral one-tap probe.
- Any answer, including "Nothing right now", unlocks the same reward. No answer is privileged.
- The selected answer maps to an immediate service action: express pickup, hold the usual item, a new-item suggestion, or respectful space.
- A simulated POS redemption marks the return and closes the loop.
- The probe response is preference evidence, never proof of cause.

## Measurement claims

- The treatment is the complete package: personalized hook, one-tap probe, reward, and service action.
- The holdout receives no contact at all.
- Return rate is returned over assigned per group.
- Estimated incremental returns are treatment returns minus treatment size times the holdout return rate.
- The MVP claims only the whole treatment effect versus the no-contact holdout. It never claims the probe or the coupon individually caused a return.
- A hook-only arm is explicitly out of scope for the MVP.

## Error and failure states

- Fewer than four visits or insufficient history: not eligible, no lapse claim.
- No supported explanation: show the facts and explicit uncertainty, do not invent a hypothesis.
- Customer declines or picks "Nothing right now": the same reward unlocks and the service action respects the choice.
- No response: the case remains open with uncertainty intact.
- Unknown customer or query: a recovery message and fallback to the initial operator state.
- Empty experiment group: zero rates and zero incremental returns, never NaN.
- Deployment failure: use the local fallback video in the submission as described in the pitch.

## Privacy and honesty

- Identified, opted-in loyalty members only. No anonymous tracking.
- All data is a clearly labelled synthetic demo.
- Data minimization: ProbeLoop uses only what the cafe already records for opted-in members.
- One response is preference evidence, not proof of cause.
- Holdout estimates describe a cohort-level incremental effect, not proof for any individual.
- Synthetic cohort data demonstrates the method, not verified commercial impact.
- No churn probability and no causal claims beyond the cohort comparison.

## Accessibility

- Mobile-first and readable at 375px and 1280px.
- Semantic controls and visible focus.
- Text carries meaning beyond color.
- Use `aria-live` for the customer confirmation and reward activation.
- No animation, no gradients, no glassmorphism, no sidebar, no chart library.

## Verification

The smallest credible checks are:

1. `npm run lint`
2. `npm run build`
3. `git diff --check`
4. Manually click `/` -> `/operator` -> `/customer/amir` -> answer one neutral question -> reward activation and service action -> simulated POS redemption -> `/operator?preference=queue&outcome=recovered`
5. Confirm any answer, including "Nothing right now", unlocks the same reward.
6. Check the operator and customer routes at desktop and narrow mobile widths.

## Acceptance criteria

- The golden path works end to end from `/` to `/operator?preference=queue&outcome=recovered`.
- `/operator` shows compact overview metrics, an at-risk member queue, and Amir's selected drill-down.
- The personalized hook references Amir's usual item and reward.
- The one neutral one-tap probe appears before any reward activates.
- Any answer unlocks the same reward, and the selected answer triggers an immediate service action.
- A simulated POS redemption closes the loop and returns to the recovered dashboard.
- The learned outcome shows the stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, and an operational recommendation.
- Metrics are calculated from the deterministic 80-member cohort, not hard-coded.
- No churn probability appears anywhere.
- The synthetic-data caveat is visible in the initial and recovered states.
- Lint and build pass.

## Explicit cuts

Anything not required to prove the golden path is cut: a generic KPI wall, chart wall, unrelated analytics, auth, POS replacement, campaign builder, LLM, ML model, sidebar, animations, stock imagery, real messaging, and a hook-only experiment arm. The submission is one focused operator retention dashboard with a deterministic cohort engine behind it, Amir's case as the drill-down, and an offer-first personalized customer flow.
