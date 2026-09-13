import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES } from "@/lib/tasks";

interface FilterBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  priority: string;
  onPriorityChange: (v: string) => void;
  assignee: string;
  onAssigneeChange: (v: string) => void;
  assignees: string[];
}

export function FilterBar({
  query,
  onQueryChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  assignees,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por título o descripción…"
          className="pl-9"
          aria-label="Buscar tareas"
        />
      </div>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="sm:w-[150px]" aria-label="Filtrar por prioridad">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toda prioridad</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={assignee} onValueChange={onAssigneeChange}>
        <SelectTrigger className="sm:w-[180px]" aria-label="Filtrar por persona">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo el equipo</SelectItem>
          {assignees.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
