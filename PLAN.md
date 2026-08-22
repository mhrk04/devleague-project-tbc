# ProbeLoop Plan Index

This file is a short current-context index. The canonical planning and product documents are in `docs/`:

- `docs/PRD.md`: product requirements and design source.
- `docs/SPRINT.md`: exact implementation plan and teammate handoff.
- `docs/PITCH.md`: 3-minute narration, demo shot list, and submission checklist.

## Current status

A working synthetic Amir click-through exists. The visible story imports `prototypeStory` from `src/data/seed.ts` and covers the detect, question, act, and learn loop on the operator and customer routes.

The next phase is a deterministic 80-member retention engine behind the case file, plus case-file polish. Metrics will be calculated from the synthetic cohort, not hard-coded.

A four-hour feature freeze applies for the submission. After the UI merge, working software becomes the submission and no new features are accepted.

## Historical prototype spec and plan

The original throwaway-prototype design and plan are preserved and no longer canonical:

- `docs/superpowers/specs/2026-08-22-probeloop-prototype-design.md`
- `docs/superpowers/plans/2026-08-22-probeloop-prototype.md`

## Honesty boundary

All data on screen is synthetic. It demonstrates the method, not verified commercial impact. One customer response is evidence, not proof. No churn probability is shown anywhere.
