/**
 * Service probe actions.
 *
 * Maps one customer response to an immediate, useful service action so the
 * customer gets help right away and the cafe gathers evidence. No form, login,
 * or navigation chrome.
 *
 * Ownership: data and experiment logic team.
 */

import type { ProbePreference, ServiceAction } from "./types";

const ACTIONS: Record<ProbePreference, ServiceAction> = {
  queue: {
    preference: "queue",
    action: "Enable express pickup for the next visit.",
    confirmation: "Express pickup is ready for your next visit.",
  },
  usual: {
    preference: "usual",
    action: "Hold the customer's usual item.",
    confirmation: "We will hold an iced flat white for your next visit.",
  },
  new: {
    preference: "new",
    action: "Recommend one new drink based on the usual.",
    confirmation: "We picked one new drink based on your usual.",
  },
  nothing: {
    preference: "nothing",
    action: "Respect the choice and give space.",
    confirmation: "Understood. We will give you some space.",
  },
};

export function serviceActionFor(preference: ProbePreference): ServiceAction {
  return ACTIONS[preference];
}
