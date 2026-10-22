import clsx from "clsx";
import type { ReactNode } from "react";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

const SEV_TEXT: Record<Severity, string> = {
  critical: "text-sev-critical", high: "text-sev-high", medium: "text-sev-medium", low: "text-sev-low", info: "text-sev-info",
};
const SEV_RAIL: Record<Severity, string> = {
  critical: "bg-sev-critical", high: "bg-sev-high", medium: "bg-sev-medium", low: "bg-sev-low", info: "bg-sev-info",
};

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-card border border-line bg-surface", className)}>
      {title && (
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

/** Severity is always shown as text plus a rail, never color alone. */
export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={clsx("text-xs font-medium capitalize", SEV_TEXT[severity])}>{severity}</span>;
}

export function SeverityRail({ severity }: { severity: Severity }) {
  return <span aria-hidden className={clsx("w-1 self-stretch rounded-full", SEV_RAIL[severity])} />;
}

export function DemoTag({ children = "Simulated data" }: { children?: ReactNode }) {
  return <span className="rounded-chip border border-line bg-raised px-1.5 py-0.5 text-[11px] text-muted">{children}</span>;
}

export function Kpi({ label, value, delta, goodWhenDown }: { label: string; value: string; delta: number; goodWhenDown?: boolean }) {
  const improving = goodWhenDown ? delta < 0 : delta > 0;
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-medium tabular-nums">{value}</p>
      <p className={clsx("mt-1 text-xs", delta === 0 ? "text-muted" : improving ? "text-ok" : "text-sev-high")}>
        {delta > 0 ? "+" : ""}{delta}% vs previous 24 h
      </p>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted">{hint}</p>
    </div>
  );
}
