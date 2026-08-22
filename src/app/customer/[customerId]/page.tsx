import type { Metadata } from "next";
import Link from "next/link";
import { prototypeStory } from "@/data/seed";
import { RetentionCheckIn } from "@/components/customer/RetentionCheckIn";

type CustomerPageProps = {
  params: Promise<{ customerId: string }>;
};

export const metadata: Metadata = {
  title: "ProbeLoop | Customer check-in",
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { customerId } = await params;

  if (customerId !== prototypeStory.customer.id) {
    return (
      <main className="customer-shell">
        <section className="customer-card">
          <p className="eyebrow">Prototype customer not found</p>
          <h1>This click-through currently follows {prototypeStory.customer.name} only.</h1>
          <p>
            The route <code>/customer/{customerId}</code> is not part of this
            demo. You can return to the operator case below.
          </p>
          <Link className="button primary" href="/operator">
            Return to the operator case
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="customer-shell">
      <section className="customer-card">
        <div className="customer-brand">
          ProbeLoop <span className="demo-label">Synthetic demo</span>
        </div>
        <p className="customer-greeting">
          Hi {prototypeStory.customer.name}. We noticed your routine changed.
        </p>
        <RetentionCheckIn />
      </section>
    </main>
  );
}
