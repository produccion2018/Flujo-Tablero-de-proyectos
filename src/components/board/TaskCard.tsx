import { CalendarDays, MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatDue,
  initials,
  isOverdue,
  priorityBar,
  priorityClasses,
  type Task,
} from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  justDropped: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
  justDropped,
}: TaskCardProps) {
  const overdue = isOverdue(task);

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab overflow-hidden rounded-xl border border-border bg-card p-4",
        "shadow-card transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card-hover",
        "active:cursor-grabbing",
        isDragging && "rotate-1 opacity-40",
        justDropped && "animate-drop-in",
      )}
    >
      <span
        className={cn("absolute inset-y-0 left-0 w-1", priorityBar[task.priority])}
        aria-hidden
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <h3 className="min-w-0 pl-2 text-sm font-semibold leading-snug text-card-foreground">
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Acciones de la tarea"
            className="shrink-0 rounded-md p-1 text-muted-foreground opacity-60 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => onEdit(task)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDelete(task)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="mt-1.5 pl-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-2">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            priorityClasses[task.priority],
          )}
        >
          {task.priority}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
            overdue && "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {overdue ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <CalendarDays className="h-3 w-3" />
          )}
          {formatDue(task.dueDate)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-3 pl-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-avatar text-[11px] font-bold text-avatar-foreground">
          {initials(task.assignee)}
        </span>
        <span className="truncate text-xs font-medium text-muted-foreground">
          {task.assignee}
        </span>
      </div>
    </article>
  );
}
