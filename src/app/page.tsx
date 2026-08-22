import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <p className="eyebrow">Synthetic demo</p>
      <h1>ProbeLoop</h1>
      <p className="lead">
        A cafe retention experiment that learns before it discounts.
      </p>
      <p>
        Follow one complete loop: detect a changed habit, hold the uncertainty,
        ask one useful question, act on the answer, and see what the cafe
        learned.
      </p>
      <Link className="button primary" href="/operator">
        Open Amir&apos;s case
      </Link>
    </main>
  );
}
