import { createFileRoute } from "@tanstack/react-router";
import { Board } from "@/components/board/Board";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flujo — Tablero Kanban de gestión de proyectos" },
      {
        name: "description",
        content:
          "Tablero Kanban con arrastrar y soltar, prioridades, fechas límite, métricas y modo oscuro. Demo de portfolio.",
      },
      { property: "og:title", content: "Flujo — Tablero Kanban de gestión de proyectos" },
      {
        property: "og:description",
        content:
          "Organizá tareas por columnas, filtrá por prioridad o persona y seguí las métricas del equipo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Board />;
}
