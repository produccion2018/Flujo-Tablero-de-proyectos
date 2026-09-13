export type Priority = "baja" | "media" | "alta";
export type ColumnId = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // yyyy-mm-dd
  assignee: string;
  status: ColumnId;
  createdAt: number;
}

export const COLUMNS: { id: ColumnId; label: string; hint: string }[] = [
  { id: "todo", label: "Por hacer", hint: "Backlog priorizado" },
  { id: "doing", label: "En curso", hint: "Trabajo activo" },
  { id: "done", label: "Hecho", hint: "Entregado" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

export const priorityClasses: Record<Priority, string> = {
  baja: "bg-priority-low/15 text-priority-low border-priority-low/30",
  media: "bg-priority-mid/15 text-priority-mid border-priority-mid/30",
  alta: "bg-priority-high/15 text-priority-high border-priority-high/30",
};

export const priorityBar: Record<Priority, string> = {
  baja: "bg-priority-low",
  media: "bg-priority-mid",
  alta: "bg-priority-high",
};

export const STORAGE_KEY = "kanban.tasks.v1";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function isOverdue(task: Task) {
  if (task.status === "done" || !task.dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

export function formatDue(dueDate: string) {
  if (!dueDate) return "Sin fecha";
  const [y, m, d] = dueDate.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

export const seedTasks: Task[] = [
  {
    id: uid(),
    title: "Rediseñar landing de producto",
    description: "Nueva narrativa, hero y sección de precios.",
    priority: "alta",
    dueDate: daysFromNow(3),
    assignee: "Lucía Ferrer",
    status: "todo",
    createdAt: Date.now() - 90000,
  },
  {
    id: uid(),
    title: "Auditoría de accesibilidad",
    description: "Contraste, foco visible y navegación por teclado.",
    priority: "media",
    dueDate: daysFromNow(9),
    assignee: "Martín Duarte",
    status: "todo",
    createdAt: Date.now() - 80000,
  },
  {
    id: uid(),
    title: "Integrar métricas del tablero",
    description: "Totales, en curso y vencidas en tiempo real.",
    priority: "alta",
    dueDate: daysFromNow(-2),
    assignee: "Sofía Ramos",
    status: "doing",
    createdAt: Date.now() - 70000,
  },
  {
    id: uid(),
    title: "Componentes de formulario",
    description: "Validación e inputs reutilizables del modal.",
    priority: "media",
    dueDate: daysFromNow(5),
    assignee: "Lucía Ferrer",
    status: "doing",
    createdAt: Date.now() - 60000,
  },
  {
    id: uid(),
    title: "Sistema de diseño base",
    description: "Tokens de color, tipografía y sombras.",
    priority: "baja",
    dueDate: daysFromNow(-6),
    assignee: "Sofía Ramos",
    status: "done",
    createdAt: Date.now() - 50000,
  },
  {
    id: uid(),
    title: "Setup del proyecto",
    description: "Estructura de carpetas y convenciones.",
    priority: "baja",
    dueDate: daysFromNow(-10),
    assignee: "Martín Duarte",
    status: "done",
    createdAt: Date.now() - 40000,
  },
];
