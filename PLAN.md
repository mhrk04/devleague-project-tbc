# DevLeague Lab 4 Project Plan

## Working concept

**A reason-aware retention system that detects when a cafe regular's habit changes, identifies what may improve their experience, delivers a relevant intervention, and measures whether it creates incremental value.**

Short tagline: **Bring regulars back without discounting everyone.**

Core business line:

> We do not maximize coupon redemption. We maximize customers recovered per ringgit of incentive.

## Lab 4 alignment

The solution answers the brief's three main questions:

1. **Who is disengaging?**
   Detect identified loyalty members whose visit cadence, spending, basket, feedback, or experience signals have changed.
2. **Why might they be disengaging?**
   Surface evidence-backed possible reasons and optional customer-stated preferences instead of showing only a churn score.
3. **What can the cafe do?**
   Select a reason-matched intervention, test it against a holdout group, and measure incremental returns and net revenue.

## Problem

Cafe operators often send the same promotion to every customer. This wastes margin on customers who would have returned anyway and assumes every disengaged customer wants a discount.

The product focuses on identified, opted-in loyalty members with transaction history. It detects a **visit lapse relative to each customer's own normal pattern**, rather than claiming that every absent customer has churned.

The system should distinguish observed evidence from interpretation:

- **Observed signal:** Amir normally visits every 5 days but has not visited for 12 days.
- **Possible reason:** convenience friction, based on declining morning visits and longer recorded wait times.
- **Stated preference:** Amir selected "faster pickup" in an optional one-tap check-in.
- **Intervention:** offer a preorder shortcut rather than an unrelated discount.

## Product scope

Build one Next.js application with two visible product surfaces and one demo adapter.

### 1. Operator retention console

- Show loyalty members whose engagement patterns are changing.
- Explain which signals caused each customer to be flagged.
- Separate possible reasons from customer-stated preferences.
- Show favourite items, typical spend, visit cadence, and recent friction signals.
- Recommend or assign a reason-matched intervention.
- Track intervention cost against a campaign retention budget.
- Assign eligible customers to holdout and intervention groups.
- Report return rate, incremental returns, intervention cost, incremental revenue, and net value.

### 2. Customer check-in and intervention page

- Open from a unique customer link or QR code.
- Optionally ask one neutral, indirect preference question.
- Show a useful intervention when one is assigned.
- Support coupons, loyalty perks, convenience improvements, service recovery, or no offer.
- No full ordering flow, payments, login, or native application.

### 3. POS transaction simulator

- Stand in for a real POS webhook during the demo.
- Record a new customer transaction and optional intervention redemption.
- Update experiment outcomes and dashboard metrics immediately.
- Remain demo plumbing, not a product surface in the pitch.

## Core workflow

```text
Historical loyalty and experience signals
        -> detect an unusual engagement change
        -> surface evidence-backed possible reasons
        -> optionally collect one indirect customer preference
        -> choose a reason-matched intervention
        -> assign holdout and intervention groups
        -> deliver the intervention
        -> receive new POS transactions
        -> compare intervention results with holdout
        -> calculate incremental returns and net revenue
```

## Signals and possible reasons

The first version can use synthetic versions of these signals:

- Visit frequency declining relative to personal cadence
- Days since last visit
- Average spend shrinking
- Basket shifting toward cheaper items
- Favourite item repeatedly unavailable
- Long wait-time events
- Refund or service-recovery events
- Poor feedback
- Previous coupons ignored or redeemed

Possible reason categories:

- Price or value pressure
- Convenience or waiting-time friction
- Favourite-item availability
- Menu fatigue
- Poor service experience
- Schedule or routine change
- Loyalty recognition
- No clear problem

Possible reasons must be shown with their supporting signals. The product must not claim it knows a customer's motive with certainty.

## Optional indirect questions

Indirect customer questions are **optional for the MVP**. Passive signals must still support the full workflow if the team decides not to build the prompt.

If included, use one neutral one-tap question:

> What would make your next coffee run better?

Suggested answers:

- Faster pickup
- Better value
- My usual always available
- Something new to try
- A loyalty reward
- Nothing right now

The answer is stored as a **stated preference**, not a confirmed churn reason. It can strengthen or challenge the system's existing interpretation.

## Intervention policy

Coupons remain one intervention type, not the entire solution.

| Possible need | Intervention example |
| --- | --- |
| Convenience | Preorder shortcut or faster pickup option |
| Price pressure | Value bundle or minimum-spend voucher |
| Favourite unavailable | Back-in-stock alert or free substitute |
| Menu fatigue | Personalized new-item sampler |
| Poor service | Manager acknowledgement and service recovery |
| Loyalty recognition | Bonus stamps or favourite add-on |
| No clear problem | No discount or a simple reminder |

The policy should prefer the lowest-cost relevant intervention. It must not claim to know the mathematically optimal intervention until enough experiment data exists.

## Why the holdout matters

A redemption does not prove that an intervention brought the customer back. Similar eligible customers who receive no intervention provide a baseline.

The dashboard should distinguish:

- **Returned customers:** customers who visited after becoming eligible.
- **Incremental returns:** estimated additional returns above the holdout baseline.
- **Redeemed revenue:** revenue attached to intervention redemptions.
- **Incremental revenue:** estimated revenue above what the holdout suggests would have happened naturally.
- **Incremental net revenue:** incremental revenue minus redeemed intervention cost.
- **Customers recovered per RM1:** incremental returns divided by intervention cost.

## MVP screens

### Operator overview

- Number of slipping regulars
- Retention budget and intervention spend
- Active experiment status
- Holdout versus intervention return rates
- Incremental returns
- Incremental revenue
- Intervention cost
- Incremental net revenue

### At-risk customers

- Customer name
- Normal visit cadence
- Days since last visit
- Key behaviour and experience signals
- Possible reason with evidence
- Optional stated preference
- Proposed intervention
- Experiment assignment

### Customer detail

- Visit and purchase history
- Engagement changes
- Supporting signals
- Possible versus customer-stated reason
- Assigned intervention or holdout status
- Post-intervention outcome

### Customer check-in and intervention

- Optional one-tap preference prompt
- Personalized message
- Intervention value and conditions
- Expiry where applicable
- QR or redemption code where applicable
- Activation or redemption state

### Transaction simulator

- Select customer
- Select purchased items
- Enter order value
- Redeem an active intervention where applicable
- Submit the transaction

### Experiment results

- Cohort size
- Group allocation
- Return rate by group
- Incremental returns
- Revenue generated
- Intervention cost
- Incremental net revenue
- Customers recovered per RM1

## Current data model direction

- **Customer:** identity, loyalty status, normal visit cadence, value segment, preferences.
- **Product:** name, selling price, estimated cost, category, availability.
- **Transaction:** customer, date, purchased products, total value.
- **Signal:** observed behaviour, transaction, feedback, or experience change.
- **DisengagementReason:** possible reason, supporting signals, and confidence label.
- **Feedback:** optional customer-stated preference from an indirect prompt.
- **Intervention:** action type, value, conditions, expiry, and estimated cost.
- **Experiment:** eligible cohort, groups, start date, end date, and status.
- **Assignment:** customer, experiment group, and assigned intervention.
- **Outcome:** intervention viewed, activated, redeemed, customer returned, and order value.

## Current project scaffold

The placeholder scaffold exists on `main`:

```text
src/app/
  operator/                    operator retention console
  customer/[customerId]/       customer check-in and intervention
  demo/transaction/            POS transaction simulator
  api/health/                  health endpoint
src/components/
  operator/                    dashboard ownership boundary
  customer/                    customer experience boundary
  shared/                      shared UI boundary
src/lib/
  types.ts                     shared domain types
  signals.ts                   behaviour and context signals
  risk.ts                      visit-lapse detection
  reasons.ts                   possible and stated reasons
  interventions.ts             reason-matched intervention policy
  experiments.ts               group assignment and impact metrics
  store.ts                     demo state access
src/data/
  seed.ts                      synthetic cafe dataset
```

The files are placeholders. Business logic and visual design have not been implemented.

## Synthetic demo data

Use a clearly labelled synthetic dataset containing:

- One cafe
- Approximately 80 to 120 identified loyalty members
- Six months of transactions
- Different personal visit cadences and spending patterns
- Product prices and estimated costs
- Availability, wait-time, refund, and feedback events for selected customers
- A prepared post-intervention period for reproducible experiment results

The demo must state that the data is synthetic. It demonstrates the workflow and measurement method, not verified real-world commercial impact.

## Suggested team split

### Member 1: signals, experiments, and data

- Generate the synthetic dataset.
- Calculate personal cadence and visit-lapse status.
- Derive evidence-backed possible reasons.
- Assign experiment groups.
- Calculate incremental return and revenue metrics.

### Member 2: operator experience

- Build the operator overview.
- Build the at-risk customer list and customer detail view.
- Show signals, reasons, intervention costs, and experiment results clearly.

### Member 3: customer and demo loop

- Build the customer check-in and intervention page.
- Build the POS transaction simulator.
- Connect return and redemption events to dashboard outcomes.
- Own the end-to-end demo flow and visual polish.

## Recommended build order

1. Agree on shared domain types and one golden customer story.
2. Create the synthetic transaction and signal dataset.
3. Implement visit-lapse detection and reason evidence.
4. Render one customer in the operator console.
5. Connect one reason-matched intervention to the customer page.
6. Record a return through the transaction simulator.
7. Update operator outcomes from the new transaction.
8. Add holdout assignment and impact metrics.
9. Expand to the full cohort and polish the demo.

The first milestone is one complete **detect -> understand -> intervene -> return -> measure** loop, not a finished dashboard.

## Demo sequence

1. Open the operator console and show identified loyalty members.
2. Show Amir's normal cadence and the signals indicating disengagement.
3. Explain a possible reason without claiming certainty.
4. If implemented, let Amir answer one indirect preference question.
5. Show how the answer changes or confirms the proposed intervention.
6. Launch or inspect an experiment containing a holdout and intervention group.
7. Open Amir's customer intervention page.
8. Use the POS simulator to record a return transaction.
9. Compare intervention return rate with holdout.
10. End on incremental net revenue and customers recovered per RM1, not redemption count.

## Explicitly out of scope

- Full POS replacement
- Full customer ordering application
- Real payment processing
- Native mobile application
- Authentication and multi-tenant permissions
- Production messaging or SMS integration
- Production database infrastructure
- Anonymous customer tracking
- Requiring customers to complete a survey
- Claiming inferred reasons are facts
- Claiming synthetic results prove real-world impact
- Complex machine-learning training before the core loop works

## Current defaults and open team decisions

- **Experiment groups:** default to holdout versus reason-matched intervention. Add a reminder-only group only if the core loop is complete.
- **Reason logic:** default to deterministic evidence rules. AI or an LLM is optional and must not block the product.
- **Intervention logic:** default to a transparent reason-to-action policy using customer value and intervention cost.
- **Indirect prompt:** optional. The full product must work without it.
- **Customer experience:** use a lightweight check-in and intervention page, not a full ordering app.
- **Business scope:** demo one cafe, but keep signal, reason, intervention, and experiment modules separable so the approach can later adapt to other retention contexts.

## Definition of done

- A loyalty member can be identified as unusually late relative to their own cadence.
- The operator can see the signals that caused the flag.
- The system can show an evidence-backed possible reason without presenting it as fact.
- An optional indirect response can be stored as a stated preference.
- The system can choose or enable a reason-matched intervention.
- Eligible customers can be assigned to holdout and intervention groups.
- An intervention customer can receive a customer-facing experience.
- A simulated POS transaction can record a return and optional redemption.
- Dashboard metrics update from the new transaction.
- Results compare intervention performance against holdout.
- Incremental net revenue subtracts intervention cost.
- The full demo works from detection to measured outcome without manual data edits.
