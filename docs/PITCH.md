# ProbeLoop Pitch (3-minute narration and demo)

This is the exact narration for the 3-minute submission video. It is about 380 to 440 spoken words with timestamps. Read it with the demo on screen.

## Narration

### 0:00-0:20: Problem

Cafes watch regulars quietly drift away and cannot tell why. Their default response is a blanket discount. That burns margin on people who would have returned anyway while teaching the cafe nothing about what changed. Every absent customer looks identical, and every return gets credited to the promotion.

### 0:20-0:40: Mechanism

ProbeLoop treats a changed habit as an open question. It compares each opted-in regular with their own normal cadence, surfaces competing evidence-backed explanations, and preserves uncertainty instead of inventing a churn probability. It then sends a personalized comeback hook and measures the result against a holdout.

### 0:40-1:40: Golden-path demo

The operator dashboard opens with four compact metrics: slipping regulars, active probes, and the probe and holdout return rates. Below sits an at-risk queue of members whose cadence drifted. Amir is first and already selected. He normally visits every five days and is now well outside that rhythm. We see that his visit gap grew, his morning waits were longer, and his usual drink was unavailable twice. Those facts support two explanations, but the case plainly says we cannot yet distinguish them.

Amir receives a personalized hook built from his purchase history: enjoy RM5 off your usual iced flat white. He taps to open it. Before any reward activates, he sees one neutral question: what would make your next coffee run better? He can skip the queue, keep his usual available, try something new, or say nothing right now. Every answer unlocks the same RM5 reward, so no choice is privileged. Amir picks express pickup, which immediately becomes a service action. We simulate his redemption and return to the dashboard in its recovered state.

### 1:40-2:15: Calculated synthetic learning and caveat

Behind this story is a deterministic synthetic dataset of 80 opted-in members with six months of activity. Metrics are calculated from those records, not typed into the screen. We compare the complete treatment package with a no-contact holdout and estimate the additional returns above the natural baseline. The operator receives one recommendation: test an express pickup lane during the morning rush. This is synthetic data, so it demonstrates the method, not commercial impact. Amir's answer is preference evidence, not proof of why his routine changed.

### 2:15-2:40: Operational and business value

The value is larger than recovering one coffee sale. ProbeLoop helps the cafe discover systemic friction, spend margin only where it matters, and measure the result instead of guessing. The same detect, question, act, and learn loop can work for any business with identified regulars and a measurable return.

### 2:40-3:00: Close

ProbeLoop is a learning engine for retention, not a discount machine. It personalizes the first reach, keeps the probe neutral, and measures what actually brings regulars back. Every comeback should teach you something.

## Shot and click list

1. Open `/`. Read the thesis.
2. Click through to `/operator` (dashboard overview).
3. Show the compact overview metrics: slipping regulars, active probes, probe and holdout return rates.
4. Show the at-risk member queue. Amir is first and selected.
5. Drill into Amir's selected case: cadence change, observed signals, competing hypotheses, explicit uncertainty.
6. Read why a neutral probe beats blanket discounting.
7. Click "Preview Amir's service probe" to `/customer/amir`.
8. Show the personalized hook: "Amir, enjoy RM5 off your usual iced flat white."
9. Tap the hook to open the one neutral question.
10. Show the one question and four options.
11. Click "Help me skip the queue" (express pickup).
12. Show that any answer unlocks the same reward, and the immediate service action.
13. Click "Simulate Amir's next visit" to `/operator?preference=queue&outcome=recovered`.
14. Scroll the learned outcome: stated preference, return, calculated treatment-versus-holdout result, estimated incremental returns, operational recommendation.
15. Keep the synthetic-data label visible throughout.

## Rehearsal checklist

- The golden path works end to end before recording.
- The cursor moves to the correct control for each step.
- The synthetic-data label is visible in every frame.
- The narration avoids any churn probability or causal claim beyond the cohort comparison.
- The narration avoids claiming the probe or the reward alone caused recovery.
- Total spoken words stay within 380 to 440.
- The video is recorded within the 3:25-3:50 slot, before the 3:50-4:00 submit window.

## Judge Q&A

### Is the data real?

No. Everything on screen is a deterministic synthetic dataset of 80 opted-in loyalty members. It demonstrates the method and the measurement, not verified commercial impact.

### Does one response prove the reason?

No. One customer response updates the evidence. It is a stated preference, not proof of why the customer disengaged. Proof of cause would need a larger, controlled experiment over time.

### Does the probe or the reward alone cause the return?

No. The treatment is the complete package: the personalized hook, the one-tap probe, the reward, and the service action. The MVP measures only the whole package against a no-contact holdout and never claims that any single part caused a return.

### Why does every answer unlock the same reward?

So the probe stays neutral. If only some answers unlocked a reward, the member would be guided toward the answer the cafe wanted. Because every answer unlocks the same reward, the response is honest preference evidence.

### Are customers identified and opted in?

Yes. ProbeLoop only works with identified, opted-in loyalty members who already have transaction history. There is no anonymous tracking.

### Why no AI or machine learning?

Because the core loop does not need it. Deterministic evidence rules and transparent formulas make the reasoning explainable. An LLM would add risk and opacity without proving the loop. If the loop works, intelligence can be added later.

### How does the holdout work?

Eligible customers are assigned deterministically and stably to a probe group or a holdout by customer ID. The holdout gets no contact. Return rate is returned over assigned per group, and estimated incremental returns are treatment returns minus treatment size times the holdout return rate. This isolates what the treatment adds beyond natural returns.

### Why should a business care?

It stops spending margin on customers who would return anyway and points the spend at the actual cause. It converts an opaque churn problem into a measurable, explainable decision.

### Can this work beyond cafes?

Yes. The signal, hypothesis, probe, and experiment modules are separable. Any business with identified regulars and a measurable return can run the same loop.

## Submission checklist

- [ ] The repo name is entered in the DevLeague submission form.
- [ ] Verify the deployed URL in the DevLeague submission form by opening it and confirming the golden path works. Do not guess the URL; read it from the form.
- [ ] The 3-minute video is uploaded and its link is verified in the DevLeague submission form.
- [ ] Confirm all three required items (repo, deployed URL, video) are present and correct in the submission form.
