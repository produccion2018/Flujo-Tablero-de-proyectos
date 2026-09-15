# Kanban Flow

Quiero un tablero de gestión de proyectos tipo Trello, para mostrar como demo de portfolio (sin backend real, todo el diseño y funcionalidad debe verse profesional y completo).

STACK: React + Vite + TypeScript + Tailwind CSS. Componentes bien organizados y legibles (un componente por responsabilidad: Board, Column, TaskCard, TaskModal, StatsBar, etc.), con nombres de archivo y carpetas claros.

FUNCIONALIDAD PRINCIPAL:

- Tablero Kanban con 3 columnas: "Por hacer", "En curso", "Hecho".

- Las tarjetas de tareas se pueden arrastrar (drag & drop) entre columnas.

- Cada tarjeta de tarea muestra: título, descripción corta, prioridad (baja/media/alta con color distintivo), fecha límite, y persona asignada (nombre + avatar con inicial).

- Botón "Agregar tarea" (arriba del tablero o en cada columna) que abre un modal/formulario para crear una tarea nueva con todos esos campos.

- Cada tarjeta tiene botones o un menú para "Editar" (reabre el mismo formulario con los datos cargados) y "Eliminar" (con confirmación antes de borrar).

- Todos los cambios (crear, editar, eliminar, mover de columna) deben persistir en localStorage, para que no se pierdan al recargar la página.

DASHBOARD / MÉTRICAS:

- Arriba del tablero, una fila de "stat cards" con métricas calculadas en base a las tareas reales: total de tareas, tareas completadas, tareas en curso, y tareas vencidas (fecha límite pasada y no completadas).

DISEÑO:

- Diseño moderno, prolijo y visualmente atractivo (no genérico ni de plantilla básica), con buen uso de espaciado, tipografía y jerarquía visual.

- Efecto hover en las tarjetas: alguna transición sutil (elevación con sombra, ligero escalado o cambio de borde) al pasar el mouse.

- Soporte completo de modo claro y modo oscuro, con un botón/switch visible para cambiar entre ambos. El modo debe guardarse también en localStorage para que persista.

- Buen contraste y legibilidad en ambos modos, sin textos que se pierdan sobre el fondo.

- Responsive: que se vea bien también en pantallas de celular (las columnas pueden apilarse o scrollear horizontalmente).

EXTRAS (si da el tiempo):

- Buscador o filtro rápido de tareas por texto, prioridad o persona asignada.

- Contador de tareas por columna, visible en el header de cada columna.

- Animación suave al soltar una tarjeta en su nueva columna.

No conectar ningún backend real ni base de datos externa: todo el estado vive en React + localStorage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0f327d4c-e60f-4ede-b9a2-5f1ec4f20b5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
