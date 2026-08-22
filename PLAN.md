# ProbeLoop Plan Index

This file is a short current-context index. The canonical product and design documents are in `docs/`:

- `docs/PRD.md`: product requirements and design source.
- `docs/SPRINT.md`: exact implementation plan and lane handoff.
- `docs/UI-HANDOFF.md`: exact handoff for the UI owner building the operator dashboard and offer-first customer flow.
- `docs/PITCH.md`: 3-minute narration, demo shot list, and submission checklist.
- `docs/superpowers/specs/2026-08-22-personalized-reward-probe-design.md`: the approved design spec.

## Current status

The deterministic retention engine (median cadence, lapse eligibility, signals, hypotheses, experiment assignment, and the 80-member cohort) is merged on `main`. The operator dashboard and the offer-first personalized customer flow are not yet built. No dashboard or reward-hook source has been added on `main` yet.

Next: build the offer-first customer flow and the operator dashboard, deploy, and record the video. Metrics will be calculated from the synthetic cohort, not hard-coded.

A four-hour feature freeze applies for the submission. After the UI merge, working software becomes the submission and no new features are accepted.

## Historical prototype spec and plan

The original throwaway-prototype design and plan are preserved and no longer canonical:

- `docs/superpowers/specs/2026-08-22-probeloop-prototype-design.md`
- `docs/superpowers/plans/2026-08-22-probeloop-prototype.md`

## Honesty boundary

All data on screen is synthetic. It demonstrates the method, not verified commercial impact. The treatment is the complete package of personalized hook, one-tap probe, reward, and service action, measured against a no-contact holdout. One customer response is preference evidence, not proof of cause. No churn probability is shown anywhere.
