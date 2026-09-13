import { AlertTriangle, CheckCircle2, LayoutList, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isOverdue, type Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  tasks: Task[];
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tone)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-2xl font-bold leading-tight text-card-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const doing = tasks.filter((t) => t.status === "doing").length;
  const overdue = tasks.filter(isOverdue).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat icon={LayoutList} label="Total" value={total} tone="bg-accent/15 text-accent" />
      <Stat
        icon={CheckCircle2}
        label="Completadas"
        value={done}
        tone="bg-priority-low/15 text-priority-low"
      />
      <Stat
        icon={Timer}
        label="En curso"
        value={doing}
        tone="bg-priority-mid/15 text-priority-mid"
      />
      <Stat
        icon={AlertTriangle}
        label="Vencidas"
        value={overdue}
        tone="bg-destructive/15 text-destructive"
      />
    </div>
  );
}
