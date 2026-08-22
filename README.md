# devleague-project-tbc

Next.js + TypeScript scaffold for the cafe retention demo. Placeholder only:
no retention logic, no database, no auth, no payments.

## Getting started

```bash
npm install
npm run dev
```

## Routes

| Route                     | Surface                                             |
| ------------------------- | --------------------------------------------------- |
| `/`                       | Project index linking to all surfaces               |
| `/operator`               | Operator retention dashboard                        |
| `/customer/[customerId]`  | Customer check-in and intervention (echoes the route id) |
| `/demo/transaction`       | POS transaction simulator                           |
| `/api/health`             | Health check (JSON)                                 |

## Module ownership

| Module                        | Boundary                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| `src/lib/types.ts`            | Shared domain types                                            |
| `src/lib/risk.ts`             | Visit-lapse detection                                          |
| `src/lib/signals.ts`          | Behaviour and context signals                                  |
| `src/lib/reasons.ts`          | Possible vs customer-confirmed disengagement reasons           |
| `src/lib/interventions.ts`    | Reason-matched intervention policy                             |
| `src/lib/experiments.ts`      | Group assignment and uplift metrics                            |
| `src/lib/store.ts`            | Demo state access                                              |
| `src/data/seed.ts`            | Synthetic cafe dataset                                         |
| `src/components/operator`     | Dashboard components                                           |
| `src/components/customer`     | Check-in and intervention components                           |
| `src/components/shared`       | Reusable UI                                                    |

See `PLAN.md` for the full project plan and team split.
