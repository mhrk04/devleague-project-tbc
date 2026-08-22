/**
 * Shared domain types for the ProbeLoop cafe retention demo.
 *
 * These are the contracts shared across the deterministic retention engine
 * and the operator/customer surfaces. All data is synthetic and illustrative.
 *
 * Ownership: data and experiment logic team.
 */

export type Customer = {
  id: string;
  name: string;
  usual: string;
  visitDates: readonly string[];
  recentWaitMinutes: readonly number[];
  usualUnavailableCount: number;
};

export type Signal = {
  label: string;
  detail: string;
  kind: "behaviour" | "experience" | "availability";
};

export type HypothesisStrength = "strong" | "possible" | "weak";

export type Hypothesis = {
  label: string;
  strength: HypothesisStrength;
  evidence: string;
};

export type ProbePreference = "queue" | "usual" | "new" | "nothing";

export type ServiceAction = {
  preference: ProbePreference;
  action: string;
  confirmation: string;
};

export type ExperimentGroup = "probe" | "holdout";

export type ExperimentAssignment = {
  customerId: string;
  group: ExperimentGroup;
  returned: boolean;
};

export type ExperimentMetrics = {
  treatmentSize: number;
  holdoutSize: number;
  treatmentReturns: number;
  holdoutReturns: number;
  treatmentReturnRate: number;
  holdoutReturnRate: number;
  estimatedIncrementalReturns: number;
};

/** A single member currently outside their own normal visit rhythm. */
export type AtRiskRow = {
  customer: Customer;
  medianCadence: number | null;
  daysSinceVisit: number;
  signals: readonly Signal[];
  group: ExperimentGroup;
};

/** Compact headline metrics for the operator overview. */
export type CohortOverview = {
  slippingMemberCount: number;
  activeProbes: number;
  probeReturnRate: number;
  holdoutReturnRate: number;
  estimatedIncrementalReturns: number;
};
