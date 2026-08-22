import Link from "next/link";
import { prototypeStory } from "@/data/seed";

type OperatorPageProps = {
  searchParams: Promise<{ outcome?: string }>;
};

export default async function OperatorPage({ searchParams }: OperatorPageProps) {
  const { outcome } = await searchParams;
  const recovered = outcome === "recovered";
  const { customer, signals, hypotheses, result } = prototypeStory;

  return (
    <main className="operator-shell">
      <div className="demo-label" role="status">
        Synthetic demo
      </div>

      <header className="operator-header">
        <p className="eyebrow">Operator investigation</p>
        <h1>{customer.name} is {customer.daysLate} days outside his usual rhythm.</h1>
        <p className="lead">
          He normally visits every {customer.normalCadenceDays} days and it has
          been {customer.daysSinceVisit} days since his last visit. We do not
          know why yet.
        </p>
      </header>

      <section className="investigation" aria-labelledby="signals-title">
        <h2 id="signals-title">Observed signals</h2>
        <div className="evidence-grid">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.label}>
              <span className="signal-kind">{signal.kind}</span>
              <h3>{signal.label}</h3>
              <p>{signal.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="investigation" aria-labelledby="hypotheses-title">
        <h2 id="hypotheses-title">Possible explanations</h2>
        <p className="uncertainty">
          We cannot yet distinguish queue friction from availability.
        </p>
        <div className="evidence-grid">
          {hypotheses.map((hypothesis) => (
            <article className="hypothesis-card" key={hypothesis.label}>
              <span className={`strength strength-${hypothesis.strength}`}>
                {hypothesis.strength}
              </span>
              <h3>{hypothesis.label}</h3>
              <p>{hypothesis.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="investigation" aria-labelledby="probe-title">
        <h2 id="probe-title">Why probe instead of discounting</h2>
        <p>
          A blanket discount buys goodwill but tells us nothing about what
          actually changed for {customer.name}. A single low-cost service probe
          helps him now while it gathers evidence to separate the competing
          explanations.
        </p>
        <p>
          The one-tap check-in is treated as a preference, not proof of why he
          changed his routine.
        </p>
      </section>

      {recovered && (
        <section className="result-panel" aria-labelledby="result-title">
          <p className="eyebrow">Illustrative outcome</p>
          <h2 id="result-title">{customer.name} returned using express pickup.</h2>
          <p>
            This comparison is synthetic, not real experiment evidence. One
            individual response updates the evidence; it does not prove why
            {" "}
            {customer.name}&apos;s routine changed.
          </p>
          <div className="metric-pair">
            <div className="metric">
              <strong>{result.treatmentReturnRate}%</strong>
              <span>probe group</span>
            </div>
            <div className="metric">
              <strong>{result.holdoutReturnRate}%</strong>
              <span>holdout</span>
            </div>
          </div>
          <p className="recommendation">{result.recommendation}</p>
        </section>
      )}

      <div className="operator-actions">
        <Link className="button primary" href="/customer/amir">
          Preview {customer.name}&apos;s service probe
        </Link>
      </div>
    </main>
  );
}
