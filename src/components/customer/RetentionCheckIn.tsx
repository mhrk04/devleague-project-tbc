"use client";

import Link from "next/link";
import { useState } from "react";
import { prototypeStory } from "@/data/seed";

type ProbeOption = (typeof prototypeStory.probe.options)[number];

export function RetentionCheckIn() {
  const [selected, setSelected] = useState<ProbeOption | null>(null);

  if (selected) {
    return (
      <section className="customer-confirmation" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true">
          OK
        </span>
        <p className="eyebrow">All set</p>
        <h2>{selected.confirmation}</h2>
        <p>
          This response is treated as a preference, not proof of why your
          routine changed.
        </p>
        {selected.id === "queue" ? (
          <Link
            className="button primary"
            href="/operator?preference=queue&outcome=recovered"
          >
            Simulate {prototypeStory.customer.name}&apos;s next visit
          </Link>
        ) : (
          <button
            className="button secondary"
            type="button"
            onClick={() => setSelected(null)}
          >
            Choose another option
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="customer-probe" aria-labelledby="probe-question">
      <p className="eyebrow">One quick check-in</p>
      <h1 id="probe-question">{prototypeStory.probe.question}</h1>
      <div className="probe-options">
        {prototypeStory.probe.options.map((option) => (
          <button
            key={option.id}
            className="probe-option"
            type="button"
            onClick={() => setSelected(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
