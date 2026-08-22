# ProbeLoop Plan Index

This file is a short current-context index. The canonical planning and product documents are in `docs/`:

- `docs/PRD.md`: product requirements and design source.
- `docs/SPRINT.md`: exact implementation plan and lane handoff.
- `docs/UI-HANDOFF.md`: exact handoff for the UI owner building the operator dashboard.
- `docs/PITCH.md`: 3-minute narration, demo shot list, and submission checklist.

## Current status

The current source is still the working Amir case-file click-through. The corrected docs restore the missing operator dashboard scope for the UI teammate: compact overview metrics, an at-risk member queue, Amir's reusable case as the selected drill-down, and a recovered state. No dashboard source has been added on `main` yet.

Next: integrate the deterministic retention engine, deploy, and record the video. Metrics will be calculated from the synthetic cohort, not hard-coded.

A four-hour feature freeze applies for the submission. After the UI merge, working software becomes the submission and no new features are accepted.

## Historical prototype spec and plan

The original throwaway-prototype design and plan are preserved and no longer canonical:

- `docs/superpowers/specs/2026-08-22-probeloop-prototype-design.md`
- `docs/superpowers/plans/2026-08-22-probeloop-prototype.md`

## Honesty boundary

All data on screen is synthetic. It demonstrates the method, not verified commercial impact. One customer response is evidence, not proof. No churn probability is shown anywhere.
