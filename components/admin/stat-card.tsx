import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-muted text-muted-foreground",
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: {
    direction: "up" | "down";
    label: string;
  };
}) {
  return (
    <Card className="gap-0 border border-border bg-card p-4 ring-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="size-[18px]" />
        </span>
      </div>
      {trend && (
        <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          {trend.direction === "up" ? (
            <ArrowUpRight className="size-3.5 text-emerald-600" />
          ) : (
            <ArrowDownRight className="size-3.5 text-rose-600" />
          )}
          <span className="font-medium">{trend.label}</span>
        </p>
      )}
    </Card>
  );
}