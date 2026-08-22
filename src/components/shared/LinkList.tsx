import type { ReactNode } from "react";

/**
 * Placeholder shared UI component.
 *
 * Ownership: shared (any team may extend).
 */
export function LinkList({ children }: { children: ReactNode }) {
  return <ul className="links">{children}</ul>;
}
