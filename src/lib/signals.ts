/**
 * Behaviour and context signals.
 *
 * Derives observed signals from a customer's records, such as a changed visit
 * rhythm, longer waits, and an unavailable usual item. These feed the
 * qualitative retention reasoning.
 *
 * Ownership: data and experiment logic team.
 */

import type { Customer, Signal } from "./types";
import { calculateMedianCadence, isVisitLapsed } from "./risk";

export function deriveSignals(customer: Customer, asOf: string): Signal[] {
  const signals: Signal[] = [];
  const median = calculateMedianCadence(customer.visitDates);
  const lapsed = isVisitLapsed(customer.visitDates, asOf);
  if (median !== null && lapsed) {
    signals.push({
      label: "Visit rhythm changed",
      detail: `Usually every ${median} days; now past the expected interval.`,
      kind: "behaviour",
    });
  }
  if (customer.recentWaitMinutes.length > 0) {
    const averageWait = Math.round(
      customer.recentWaitMinutes.reduce((sum, value) => sum + value, 0) /
        customer.recentWaitMinutes.length,
    );
    if (averageWait >= 12) {
      signals.push({
        label: "Longer morning waits",
        detail: `${customer.recentWaitMinutes.length} recent visits averaged ${averageWait} minutes.`,
        kind: "experience",
      });
    }
  }
  if (customer.usualUnavailableCount >= 2) {
    signals.push({
      label: "Usual unavailable",
      detail: `${customer.usual} was unavailable ${customer.usualUnavailableCount} times.`,
      kind: "availability",
    });
  }
  return signals;
}
