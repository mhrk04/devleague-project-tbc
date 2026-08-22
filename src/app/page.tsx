import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Cafe Retention Demo</h1>
      <p>
        Placeholder index for the cafe retention project. This scaffold exists
        only to mark ownership boundaries for the team; no retention logic is
        implemented yet.
      </p>

      <h2>Surfaces</h2>
      <ul className="links">
        <li>
          <Link href="/operator">Operator dashboard</Link>
        </li>
        <li>
          <Link href="/customer/example-customer">
            Customer check-in and intervention (example customer)
          </Link>
        </li>
        <li>
          <Link href="/demo/transaction">POS transaction simulator</Link>
        </li>
        <li>
          <Link href="/api/health">Health check (JSON)</Link>
        </li>
      </ul>
    </main>
  );
}
