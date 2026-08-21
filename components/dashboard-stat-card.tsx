import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function DashboardStatCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: number; note: string }) {
  return (
    <article className="stat-card">
      <span className="stat-icon"><Icon size={21} /></span>
      <div className="stat-label">{label}</div>
      <strong>{formatNumber(value)}</strong>
      <small><ArrowUpRight size={14} /> {note}</small>
    </article>
  );
}
