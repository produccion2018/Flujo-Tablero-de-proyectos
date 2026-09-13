import { useMemo, useState } from "react";
import { Plus, Trello } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "./Column";
import { StatsBar } from "./StatsBar";
import { FilterBar } from "./FilterBar";
import { ThemeToggle } from "./ThemeToggle";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { TaskModal, type TaskDraft } from "./TaskModal";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { COLUMNS, type ColumnId, type Task } from "@/lib/tasks";

export function Board() {
  const { tasks, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const { theme, toggle } = useTheme();

  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [assignee, setAssignee] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ColumnId>("todo");
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const [dragging, setDragging] = useState<Task | null>(null);
  const [droppedId, setDroppedId] = useState<string | null>(null);

  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee))).sort(),
    [tasks],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q);
      const matchesPriority = priority === "all" || t.priority === priority;
      const matchesAssignee = assignee === "all" || t.assignee === assignee;
      return matchesText && matchesPriority && matchesAssignee;
    });
  }, [tasks, query, priority, assignee]);

  const openCreate = (status: ColumnId) => {
    setEditing(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const handleSubmit = (draft: TaskDraft) => {
    if (editing) updateTask(editing.id, draft);
    else createTask(draft);
  };

  const handleDrop = (columnId: ColumnId) => {
    if (!dragging) return;
    if (dragging.status !== columnId) {
      moveTask(dragging.id, columnId);
      setDroppedId(dragging.id);
      window.setTimeout(() => setDroppedId(null), 400);
    }
    setDragging(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-card">
              <Trello className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Flujo — Tablero de proyectos
              </h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                Demo de portfolio · datos guardados en tu navegador
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggle} />
            <Button onClick={() => openCreate("todo")} className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar tarea</span>
            </Button>
          </div>
        </header>

        <div className="mt-6 space-y-4">
          <StatsBar tasks={tasks} />
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            priority={priority}
            onPriorityChange={setPriority}
            assignee={assignee}
            onAssigneeChange={setAssignee}
            assignees={assignees}
          />
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                label={col.label}
                hint={col.hint}
                tasks={filtered.filter((t) => t.status === col.id)}
                draggingId={dragging?.id ?? null}
                droppedId={droppedId}
                onDropTask={handleDrop}
                onDragStart={setDragging}
                onDragEnd={() => setDragging(null)}
                onAdd={openCreate}
                onEdit={openEdit}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editing}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />

      <DeleteTaskDialog
        task={pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteTask(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
