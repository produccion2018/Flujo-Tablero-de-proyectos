import { useEffect, useMemo, useRef, useState } from "react";
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

  /* ───────── Recorrido automático (?tour=1, lo usa el portfolio) ─────────
     Mueve tarjetas entre columnas, filtra por prioridad y cambia el tema.
     Si el usuario hace clic o scroll se pausa y retoma tras unos segundos. */
  const [touring, setTouring] = useState(false);
  const tourState = useRef({ tasks, moved: [] as { id: string; from: ColumnId }[] });
  tourState.current.tasks = tasks;
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("tour")) return;
    setTouring(true);
    const flash = (id: string) => {
      setDroppedId(id);
      window.setTimeout(() => setDroppedId(null), 600);
    };
    const move = (from: ColumnId, to: ColumnId) => {
      const t = tourState.current.tasks.find((x) => x.status === from);
      if (!t) return;
      tourState.current.moved.push({ id: t.id, from });
      moveTask(t.id, to);
      flash(t.id);
    };
    const restore = () => {
      tourState.current.moved.reverse().forEach(({ id, from }) => moveTask(id, from));
      tourState.current.moved = [];
    };
    const steps = [
      () => move("todo", "doing"),
      () => move("doing", "done"),
      () => setPriority("alta"),
      () => setPriority("all"),
      () => toggle(),
      () => move("todo", "doing"),
      () => toggle(),
      () => restore(),
    ];
    let i = 0;
    let paused = false;
    let idle = 0;
    const onUser = () => {
      paused = true;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => (paused = false), 9000);
    };
    const evs = ["wheel", "touchstart", "mousedown", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, onUser, { passive: true }));
    const id = window.setInterval(() => {
      if (paused) return;
      steps[i % steps.length]?.();
      i++;
    }, 2600);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(idle);
      evs.forEach((e) => window.removeEventListener(e, onUser));
      restore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {touring && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-accent/40 bg-card/90 px-4 py-2 text-xs text-muted-foreground shadow-card backdrop-blur">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent align-middle" />
          Recorrido automático · tocá para explorar
        </div>
      )}
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
