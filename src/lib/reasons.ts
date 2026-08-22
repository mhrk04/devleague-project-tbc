/**
 * Qualitative disengagement hypotheses.
 *
 * Maps observed signals to competing explanations, each tied to exact evidence
 * and labelled only strong, possible, or weak. ProbeLoop never shows a churn
 * probability and never guesses cause.
 *
 * Ownership: data and experiment logic team.
 */

import type { Hypothesis, Signal } from "./types";

export function deriveHypotheses(signals: readonly Signal[]): Hypothesis[] {
  const hypotheses: Hypothesis[] = [];
  const experience = signals.find((signal) => signal.kind === "experience");
  if (experience) {
    hypotheses.push({
      label: "Queue friction",
      strength: "strong",
      evidence: experience.detail,
    });
  }
  const availability = signals.find((signal) => signal.kind === "availability");
  if (availability) {
    hypotheses.push({
      label: "Usual-item availability",
      strength: "possible",
      evidence: availability.detail,
    });
  }
  return hypotheses;
}
