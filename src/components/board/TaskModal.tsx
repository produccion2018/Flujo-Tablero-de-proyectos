import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLUMNS, PRIORITIES, type ColumnId, type Priority, type Task } from "@/lib/tasks";

export type TaskDraft = Omit<Task, "id" | "createdAt">;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  defaultStatus: ColumnId;
  onSubmit: (draft: TaskDraft) => void;
}

const emptyDraft = (status: ColumnId): TaskDraft => ({
  title: "",
  description: "",
  priority: "media",
  dueDate: new Date().toISOString().slice(0, 10),
  assignee: "",
  status,
});

export function TaskModal({
  open,
  onOpenChange,
  task,
  defaultStatus,
  onSubmit,
}: TaskModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft(defaultStatus));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setDraft(
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            assignee: task.assignee,
            status: task.status,
          }
        : emptyDraft(defaultStatus),
    );
  }, [open, task, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.assignee.trim()) {
      setError("El título y la persona asignada son obligatorios.");
      return;
    }
    onSubmit({ ...draft, title: draft.title.trim(), assignee: draft.assignee.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {task ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription>
            Completá los datos de la tarea. Todo se guarda en este navegador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Ej. Preparar demo para el cliente"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción corta</Label>
            <Textarea
              id="description"
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Un par de líneas de contexto"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Prioridad</Label>
              <Select
                value={draft.priority}
                onValueChange={(v) => setDraft({ ...draft, priority: v as Priority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={draft.dueDate}
                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignee">Persona asignada</Label>
              <Input
                id="assignee"
                value={draft.assignee}
                onChange={(e) => setDraft({ ...draft, assignee: e.target.value })}
                placeholder="Ej. Sofía Ramos"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Columna</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as ColumnId })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{task ? "Guardar cambios" : "Crear tarea"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
