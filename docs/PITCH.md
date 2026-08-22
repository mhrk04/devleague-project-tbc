# ProbeLoop Pitch (3-minute narration and demo)

This is the exact narration for the 3-minute submission video. It is about 380 to 440 spoken words with timestamps. Read it with the demo on screen.

## Narration

### 0:00-0:25: Problem

Cafes watch regulars quietly drift away and cannot tell why. Their default response is a blanket discount. That burns margin on people who would have returned anyway while teaching the cafe nothing about what changed. Every absent customer looks identical, and every return gets credited to the promotion. The cafe spends money without understanding its regulars.

### 0:25-0:45: Mechanism

ProbeLoop treats a changed habit as an open question. It compares each opted-in regular with their own normal cadence, surfaces competing evidence-backed explanations, and preserves uncertainty instead of inventing a churn probability. It then runs one neutral service probe and compares the result with a holdout. The cafe learns before it discounts.

### 0:45-1:45: Golden-path demo

The operator dashboard opens with four compact metrics: slipping regulars, active probes, and the probe and holdout return rates. Below sits an at-risk queue of members whose cadence drifted. Amir is first and already selected. Drilling into his case, he normally visits every five days and is now well outside that rhythm. We see three observations: his visit gap grew, his recent morning waits were longer, and his usual drink was unavailable twice. Those facts support two explanations, queue friction and availability, but the case plainly says we cannot yet distinguish them. A blanket discount would reveal nothing. Instead, Amir sees one neutral question: what would make your next coffee run better? He can skip the queue, keep his usual available, try something new, or ask for space. Amir chooses express pickup, which immediately becomes a useful service action. We simulate his next visit and return to the dashboard, now in its recovered state.

### 1:45-2:20: Calculated synthetic learning and caveat

Behind this story is a deterministic synthetic dataset of 80 opted-in members with six months of activity. Metrics are calculated from those records, not typed into the screen. We compare the probe group with a holdout and estimate the additional returns above the natural baseline. The operator receives one recommendation: test an express pickup lane during the morning rush. This is synthetic data, so it demonstrates the method, not commercial impact. Amir's response is preference evidence, not proof of why his routine changed.

### 2:20-2:45: Operational and business value

The value is larger than recovering one coffee sale. ProbeLoop helps the cafe discover systemic friction, spend margin only where it matters, and measure the result instead of guessing. The same detect, question, act, and learn loop can work for any business with identified regulars and a measurable return.

### 2:45-3:00: Close

ProbeLoop is a learning engine for retention, not a discount machine. It preserves uncertainty, tests a useful response, and measures what changed. Learn before you discount.

## Shot and click list

1. Open `/`. Read the thesis.
2. Click through to `/operator` (dashboard overview).
3. Show the compact overview metrics: slipping regulars, active probes, probe and holdout return rates.
4. Show the at-risk member queue. Amir is first and selected.
5. Drill into Amir's selected case: cadence change, observed signals, competing hypotheses, explicit uncertainty.
6. Read why a neutral probe beats blanket discounting.
7. Click "Preview Amir's service probe" to `/customer/amir`.
8. Show the one question and four options.
9. Click "Help me skip the queue" (express pickup).
10. Show the immediate confirmation and service action.
11. Click "Simulate Amir's next visit" to `/operator?preference=queue&outcome=recovered`.
12. Scroll the learned outcome: stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, operational recommendation.
13. Keep the synthetic-data label visible throughout.

## Rehearsal checklist

- The golden path works end to end before recording.
- The cursor moves to the correct control for each step.
- The synthetic-data label is visible in every frame.
- The narration avoids any churn probability or causal claim beyond the cohort comparison.
- Total spoken words stay within 380 to 440.
- The video is recorded within the 3:25-3:50 slot, before the 3:50-4:00 submit window.

## Judge Q&A

### Is the data real?

No. Everything on screen is a deterministic synthetic dataset of 80 opted-in loyalty members. It demonstrates the method and the measurement, not verified commercial impact.

### Does one response prove the reason?

No. One customer response updates the evidence. It is a stated preference, not proof of why the customer disengaged. Proof of cause would need a larger, controlled experiment over time.

### Are customers identified and opted in?

Yes. ProbeLoop only works with identified, opted-in loyalty members who already have transaction history. There is no anonymous tracking.

### Why no AI or machine learning?

Because the core loop does not need it. Deterministic evidence rules and transparent formulas make the reasoning explainable. An LLM would add risk and opacity without proving the loop. If the loop works, intelligence can be added later.

### How does the holdout work?

Eligible customers are assigned deterministically and stably to a probe group or a holdout by customer ID. The holdout gets no probe. Return rate is returned over assigned per group, and estimated incremental returns are treatment returns minus treatment size times the holdout return rate. This isolates what the probe adds beyond natural returns.

### Why should a business care?

It stops spending margin on customers who would return anyway and points the spend at the actual cause. It converts an opaque churn problem into a measurable, explainable decision.

### Can this work beyond cafes?

Yes. The signal, hypothesis, probe, and experiment modules are separable. Any business with identified regulars and a measurable return can run the same loop.

## Submission checklist

- [ ] The repo name is entered in the DevLeague submission form.
- [ ] Verify the deployed URL in the DevLeague submission form by opening it and confirming the golden path works. Do not guess the URL; read it from the form.
- [ ] The 3-minute video is uploaded and its link is verified in the DevLeague submission form.
- [ ] Confirm all three required items (repo, deployed URL, video) are present and correct in the submission form.
