# DevLeague Lab 4 Project Plan

## Working concept

**A retention system that finds slipping cafe regulars, tests personalized offers against a holdout group, and measures the incremental revenue created.**

Short tagline: **Bring regulars back without discounting everyone.**

## Problem

Cafe operators often send the same promotion to every customer. This wastes margin on customers who would have returned anyway, while providing no reliable way to know whether a coupon caused a return.

The project focuses on identified loyalty members with transaction history. It detects a **visit lapse relative to each customer's normal pattern**, rather than claiming that every absent customer has churned.

## Product scope

Build one web application with three connected surfaces:

1. **Operator dashboard**
   - Show customers whose visit habits are slipping.
   - Explain why each customer was flagged.
   - Show favourite items, typical spend, and recent visits.
   - Recommend or assign a personalized intervention.
   - Launch an experiment with a holdout group.
   - Report return rate, coupon cost, incremental revenue, and net value.

2. **Customer coupon page**
   - Open from a unique link or QR code.
   - Show the customer's personalized offer.
   - Allow the customer to activate or present the coupon.
   - No full ordering flow, payments, login, or native app.

3. **POS transaction simulator**
   - Stand in for a real POS integration during the demo.
   - Record a new customer transaction and optional coupon redemption.
   - Update experiment outcomes and dashboard metrics immediately.

## Core workflow

```text
Historical loyalty transactions
        -> detect customers with unusual visit lapses
        -> create an eligible experiment cohort
        -> assign holdout and intervention groups
        -> deliver personalized coupon pages
        -> receive new POS transactions
        -> compare treatment return rate with holdout
        -> calculate incremental returns and net revenue
```

## Why the holdout matters

A coupon redemption alone does not prove that the coupon brought the customer back. Similar eligible customers who receive no intervention provide a baseline.

The dashboard should distinguish:

- **Returned customers:** customers who visited after becoming eligible.
- **Incremental returns:** estimated additional returns above the holdout baseline.
- **Redeemed revenue:** revenue attached to coupon redemptions.
- **Incremental revenue:** estimated revenue above what the holdout suggests would have happened naturally.
- **Incremental net revenue:** incremental revenue minus redeemed coupon cost.

## MVP screens

### Operator overview

- Number of slipping regulars
- Active experiment status
- Holdout versus intervention return rates
- Incremental returns
- Incremental revenue
- Coupon cost
- Incremental net revenue

### At-risk customers

- Customer name
- Normal visit cadence
- Days since last visit
- Favourite item
- Typical spend
- Visit-lapse reason
- Proposed intervention
- Experiment assignment

### Customer detail

- Visit history
- Purchase preferences
- Current lapse explanation
- Assigned offer or holdout status
- Post-intervention outcome

### Customer coupon

- Personalized message
- Coupon reward and conditions
- Expiry
- QR or redemption code
- Activation or redemption state

### Transaction simulator

- Select customer
- Select purchased items
- Enter order value
- Redeem an active coupon
- Submit the transaction

### Experiment results

- Cohort size
- Group allocation
- Return rate by group
- Incremental returns
- Revenue generated
- Coupon cost
- Incremental net revenue

## Proposed data model

- **Customer:** identity, join date, loyalty status, normal visit cadence, value segment.
- **Product:** name, selling price, estimated cost, category.
- **Transaction:** customer, date, purchased products, total value.
- **Offer:** reward, conditions, expiry, estimated cost.
- **Experiment:** eligible cohort, groups, start date, end date, status.
- **Assignment:** customer, experiment group, assigned offer.
- **Outcome:** coupon viewed, activated, redeemed, customer returned, order value.

## Proposed project scaffold

```text
app/
  operator/                 operator dashboard
  customer/[customerId]/    customer coupon page
  demo/transaction/         POS transaction simulator
  api/                      demo actions and shared state
components/
  operator/                 dashboard components
  customer/                 coupon components
  shared/                   reusable UI
lib/
  risk.ts                   visit-lapse detection
  offers.ts                 personalized offer policy
  experiments.ts            group assignment and uplift metrics
  store.ts                  demo data access
data/
  seed.ts                   synthetic cafe dataset
tests/
  retention.test.ts         risk, assignment, and metric checks
```

This is a proposed structure only. No application scaffold has been created yet.

## Synthetic demo data

Use a clearly labelled synthetic dataset containing:

- One cafe
- Approximately 80 to 120 loyalty members
- Six months of transactions
- Different visit cadences and spending patterns
- Product prices and estimated costs
- A prepared post-intervention period for reproducible results

The demo must state that the data is synthetic. The simulator demonstrates the workflow and measurement method, not verified real-world commercial impact.

## Suggested team split

### Member 1: data and experiment logic

- Generate the synthetic dataset.
- Calculate personal visit cadence and lapse status.
- Assign experiment groups.
- Calculate incremental return and revenue metrics.

### Member 2: operator experience

- Build the overview dashboard.
- Build the at-risk customer list and customer detail view.
- Build experiment setup and results views.

### Member 3: customer and demo loop

- Build the customer coupon page.
- Build the transaction simulator.
- Connect redemption and return events to dashboard updates.
- Own demo flow and visual polish.

## Demo sequence

1. Open the operator dashboard and show normal cafe performance.
2. Show customers whose current visit gap is unusual for their personal cadence.
3. Open one customer and explain the lapse signal and purchase preferences.
4. Launch or inspect an experiment containing a holdout and intervention group.
5. Open a personalized customer coupon page.
6. Use the POS simulator to record a return transaction and coupon redemption.
7. Return to the dashboard and show the updated outcome.
8. Compare treatment return rate with holdout.
9. End on incremental net revenue, not coupon redemption count.

## Explicitly out of scope

- Full POS replacement
- Full customer ordering application
- Real payment processing
- Native mobile application
- Authentication and multi-tenant permissions
- Production messaging or SMS integration
- Production database infrastructure
- Broad anonymous-customer tracking
- Claims that synthetic results prove real-world impact
- Complex machine-learning training unless the core loop is already complete

## Decisions for team discussion

The current default is a two-group experiment: holdout versus personalized coupon. The team can add a reminder-only group if the core loop is complete.

The current default is deterministic personalization using visit lapse, favourite products, usual spend, customer value, and product cost. A model or LLM is optional and should not block the working product.

The current default is a lightweight customer coupon page rather than a full ordering app.

## Definition of done

- A loyalty member can be identified as unusually late relative to their own cadence.
- The operator can understand why the member was flagged.
- Eligible customers can be assigned to holdout and intervention groups.
- An intervention customer can receive a personalized coupon page.
- A simulated POS transaction can record a return and redemption.
- Dashboard metrics update from the transaction.
- Results compare intervention performance against holdout.
- Incremental net revenue subtracts coupon cost.
- The full demo works from initial detection to measured outcome without manual data edits.
