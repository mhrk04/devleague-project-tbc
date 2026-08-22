import type { Metadata } from "next";

type CustomerPageProps = {
  params: Promise<{ customerId: string }>;
};

export const metadata: Metadata = {
  title: "Customer Check-In and Intervention",
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { customerId } = await params;

  return (
    <main>
      <h1>Customer Check-In and Intervention</h1>
      <div className="card">
        <p>
          Placeholder for the customer check-in and intervention page. Owned by
          the customer and demo loop team.
        </p>
        <p>
          Currently echoing the route identifier:{" "}
          <span className="badge">{customerId}</span>
        </p>
      </div>
    </main>
  );
}
