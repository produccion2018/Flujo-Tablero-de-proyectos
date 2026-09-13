import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY, seedTasks, uid, type ColumnId, type Task } from "@/lib/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const createTask = useCallback((data: Omit<Task, "id" | "createdAt">) => {
    setTasks((prev) => [{ ...data, id: uid(), createdAt: Date.now() }, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, data: Omit<Task, "id" | "createdAt">) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: ColumnId) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  return { tasks, loaded, createTask, updateTask, deleteTask, moveTask };
}
