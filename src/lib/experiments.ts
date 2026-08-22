/**
 * Experiment assignment, cohort metrics, and operator overview.
 *
 * Assigns eligible members to stable probe/holdout groups by customer ID and
 * computes incremental returns against a holdout baseline. Empty groups return
 * zero rates and zero incremental returns, never NaN.
 *
 * Ownership: data and experiment logic team.
 */

import type {
  AtRiskRow,
  CohortOverview,
  Customer,
  ExperimentAssignment,
  ExperimentGroup,
  ExperimentMetrics,
} from "./types";
import { calculateMedianCadence, daysSinceVisit, isVisitLapsed } from "./risk";
import { deriveSignals } from "./signals";

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function assignExperimentGroup(customerId: string): ExperimentGroup {
  return hashId(customerId) % 2 === 0 ? "probe" : "holdout";
}

export function calculateExperimentMetrics(
  assignments: readonly ExperimentAssignment[],
): ExperimentMetrics {
  const treatment = assignments.filter((a) => a.group === "probe");
  const holdout = assignments.filter((a) => a.group === "holdout");
  const treatmentSize = treatment.length;
  const holdoutSize = holdout.length;

  const treatmentReturns = treatment.filter((a) => a.returned).length;
  const holdoutReturns = holdout.filter((a) => a.returned).length;

  const treatmentReturnRate =
    treatmentSize === 0 ? 0 : treatmentReturns / treatmentSize;
  const holdoutReturnRate = holdoutSize === 0 ? 0 : holdoutReturns / holdoutSize;

  const estimatedIncrementalReturns =
    treatmentReturns - treatmentSize * holdoutReturnRate;

  return {
    treatmentSize,
    holdoutSize,
    treatmentReturns,
    holdoutReturns,
    treatmentReturnRate,
    holdoutReturnRate,
    estimatedIncrementalReturns,
  };
}

/** Members currently outside their normal rhythm, most-lapsed first. */
export function getAtRiskRows(
  customers: readonly Customer[],
  assignments: readonly ExperimentAssignment[],
  asOf: string,
): AtRiskRow[] {
  return customers
    .filter((customer) => isVisitLapsed(customer.visitDates, asOf))
    .map((customer) => {
      const assignment = assignments.find(
        (a) => a.customerId === customer.id,
      );
      return {
        customer,
        medianCadence: calculateMedianCadence(customer.visitDates),
        daysSinceVisit: daysSinceVisit(customer.visitDates, asOf),
        signals: deriveSignals(customer, asOf),
        group: assignment?.group ?? "holdout",
      };
    })
    .sort((a, b) => b.daysSinceVisit - a.daysSinceVisit);
}

/** Compact headline metrics for the operator overview. */
export function calculateOverview(
  customers: readonly Customer[],
  assignments: readonly ExperimentAssignment[],
  asOf: string,
): CohortOverview {
  const metrics = calculateExperimentMetrics(assignments);
  const slippingMemberCount = customers.filter((customer) =>
    isVisitLapsed(customer.visitDates, asOf),
  ).length;
  // Only currently lapsed/at-risk members assigned to a probe count as active.
  const activeProbes = customers.filter(
    (customer) =>
      isVisitLapsed(customer.visitDates, asOf) &&
      assignments.find((a) => a.customerId === customer.id)?.group === "probe",
  ).length;

  return {
    slippingMemberCount,
    activeProbes,
    probeReturnRate: metrics.treatmentReturnRate,
    holdoutReturnRate: metrics.holdoutReturnRate,
    estimatedIncrementalReturns: metrics.estimatedIncrementalReturns,
  };
}
