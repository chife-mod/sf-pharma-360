import { Dashboard } from "@/components/v2/dashboard";

/* DOLs list — full dashboard. Composes Toolbar + Filter sidebar
 * + Influencer card grid + active-chip row + empty state. Header
 * and aurora bg live in the parent layout (app/dols/layout.tsx).
 */
export default function DolsPage() {
  return <Dashboard />;
}
