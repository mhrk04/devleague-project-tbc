/**
 * Visit-lapse detection.
 *
 * Detects a visit lapse relative to each customer's own normal cadence rather
 * than claiming every absent customer has churned. Intervals are whole UTC
 * calendar days.
 *
 * Ownership: data and experiment logic team.
 */

export function calculateMedianCadence(visits: readonly string[]): number | null {
  if (visits.length < 2) return null;
  const sorted = [...visits].sort((a, b) => a.localeCompare(b));
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1]).getTime();
    const b = new Date(sorted[i]).getTime();
    intervals.push(Math.round((b - a) / 86400000));
  }
  intervals.sort((a, b) => a - b);
  const mid = Math.floor(intervals.length / 2);
  const median =
    intervals.length % 2 === 0
      ? (intervals[mid - 1] + intervals[mid]) / 2
      : intervals[mid];
  return Math.round(median);
}

export function isVisitLapsed(visits: readonly string[], asOf: string): boolean {
  if (visits.length < 4) return false;
  const median = calculateMedianCadence(visits);
  if (median === null) return false;
  const sorted = [...visits].sort((a, b) => a.localeCompare(b));
  const last = new Date(sorted[sorted.length - 1]).getTime();
  const daysSince = Math.round((new Date(asOf).getTime() - last) / 86400000);
  return daysSince >= 2 * median;
}

export function daysSinceVisit(visits: readonly string[], asOf: string): number {
  if (visits.length === 0) return 0;
  const sorted = [...visits].sort((a, b) => a.localeCompare(b));
  const last = new Date(sorted[sorted.length - 1]).getTime();
  return Math.round((new Date(asOf).getTime() - last) / 86400000);
}
