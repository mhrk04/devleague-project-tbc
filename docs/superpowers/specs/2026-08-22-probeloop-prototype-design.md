# probeloop prototype design

## goal

Build the smallest clickable version of the Lab 4 concept so the team can see and discuss the product before implementing real retention logic.

The prototype demonstrates one complete story:

```text
detect a changed habit
  -> preserve uncertainty about why
  -> ask one useful diagnostic question
  -> provide the selected service improvement
  -> simulate a return
  -> show what the cafe learned
```

All customers, events, experiment results, and business outcomes are synthetic and visibly labelled as illustrative.

## product thesis

ProbeLoop does not confidently guess why a regular stopped visiting. It shows competing explanations, chooses a low-cost service probe that can help while gathering evidence, and compares resulting behaviour with a holdout.

The prototype uses one cafe member, Amir:

- Amir normally visits every five days and is now eight days late.
- Recent signals support both queue friction and favourite-item availability as possible explanations.
- The system recommends a neutral one-tap probe instead of a blanket discount.
- Amir chooses express pickup and later returns.
- An illustrative cohort result suggests testing a permanent peak-hour pickup lane.

An individual response updates the evidence. It does not prove why Amir disengaged. Causal language is limited to the synthetic cohort comparison.

## scope

### operator route

`/operator` shows:

- Amir's changed visit pattern.
- Three observed signals.
- Two competing explanations with their supporting evidence.
- A clear statement of what the system does not know.
- Why a diagnostic service probe was selected.
- A link to preview Amir's customer experience.

`/operator?outcome=recovered` additionally shows:

- Amir's simulated return.
- A small intervention-versus-holdout comparison.
- The resulting operational recommendation.

Unexpected `outcome` values render the normal operator state.

### customer route

`/customer/amir` asks:

> What would make your next coffee run better?

The options are:

- Help me skip the queue.
- Keep my usual available.
- Show me something new.
- Nothing right now.

Selecting an option immediately replaces the question with a matching confirmation. The express-pickup confirmation includes a link that simulates Amir's next visit and returns to `/operator?outcome=recovered`.

Any unsupported customer ID renders a friendly prototype-only message with a link back to `/operator`.

### home route

`/` briefly introduces the click-through and links to Amir's operator case. It does not present a separate marketing page.

### excluded routes

`/demo/transaction` remains available from the existing scaffold but is not part of this first click-through. The prototype uses a direct simulation link instead of implementing a fake POS form.

## architecture

Keep the existing Next.js App Router scaffold.

- `src/data/seed.ts` owns one shared immutable prototype story.
- `src/app/operator/page.tsx` renders the initial and recovered operator states from that story.
- `src/app/customer/[customerId]/page.tsx` validates the supported customer and renders the customer experience.
- `src/components/customer/RetentionCheckIn.tsx` is the only client component. It owns the selected answer and confirmation state.
- Existing global CSS provides the responsive visual system.

There is no API call, database, shared client store, authentication, model, LLM, or persistence. URL state is enough for the one simulated outcome.

## visual direction

The operator view should feel like a focused investigation, not a generic analytics dashboard:

- Lead with Amir's story and the unresolved question.
- Separate observed facts from possible explanations visually.
- Use restrained status colours and readable evidence cards.
- Make uncertainty explicit rather than decorating it with fake probability percentages.
- End with one operational recommendation, not a wall of metrics.

The customer view should be mobile-first:

- One short question.
- Four large tap targets.
- Immediate confirmation after selection.
- No form, login, navigation chrome, or promotional clutter.

Both routes must remain readable on narrow mobile screens and normal desktop widths. Interactive controls need visible focus states and semantic button/link elements.

## data flow

```text
shared synthetic story
  -> operator reads signals and competing explanations
  -> customer page reads probe options
  -> local button selection shows immediate service action
  -> simulation link adds outcome=recovered to operator URL
  -> operator renders the illustrative learned result
```

No state needs to survive refreshes or move between browsers.

## error handling

- Unsupported customer IDs render a recovery link rather than throwing.
- Unknown outcome query values fall back to the initial operator state.
- The synthetic-data label remains visible in both initial and recovered states.
- No network dependency exists, so there is no loading or retry state.

## verification

This is a throwaway visualization, so no test framework or production test suite will be added. The smallest credible checks are:

1. `npm run lint`
2. `npm run build`
3. Manually click `/operator` -> `/customer/amir` -> express pickup -> `/operator?outcome=recovered`
4. Check the operator and customer routes at desktop and narrow mobile widths

## completion criteria

- The operator can see what changed in Amir's behaviour.
- Observed signals and possible explanations are visually distinct.
- The product clearly admits that it does not yet know why Amir disengaged.
- The customer can select a useful service improvement in one tap.
- The click-through returns to an illustrative recovered state.
- The final state recommends an operational experiment rather than a larger discount.
- Synthetic outcomes are never presented as real evidence.
- Lint and production build pass.
