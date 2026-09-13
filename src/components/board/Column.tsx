import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { ColumnId, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface ColumnProps {
  id: ColumnId;
  label: string;
  hint: string;
  tasks: Task[];
  draggingId: string | null;
  droppedId: string | null;
  onDropTask: (columnId: ColumnId) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onAdd: (columnId: ColumnId) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const accent: Record<ColumnId, string> = {
  todo: "bg-priority-mid",
  doing: "bg-accent",
  done: "bg-priority-low",
};

export function Column({
  id,
  label,
  hint,
  tasks,
  draggingId,
  droppedId,
  onDropTask,
  onDragStart,
  onDragEnd,
  onAdd,
  onEdit,
  onDelete,
}: ColumnProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDropTask(id);
      }}
      className={cn(
        "flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-surface p-3 transition-colors duration-200 sm:w-auto",
        isOver && "border-accent/60 bg-surface-raised",
      )}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-1 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", accent[id])} aria-hidden />
          <div className="min-w-0">
            <h2 className="truncate font-display text-sm font-bold uppercase tracking-wider text-foreground">
              {label}
            </h2>
            <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
            {tasks.length}
          </span>
          <button
            onClick={() => onAdd(id)}
            aria-label={`Agregar tarea en ${label}`}
            className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-h-[120px] flex-1 flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingId === task.id}
            justDropped={droppedId === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
            Arrastrá una tarjeta acá
          </div>
        )}
      </div>
    </section>
  );
}
