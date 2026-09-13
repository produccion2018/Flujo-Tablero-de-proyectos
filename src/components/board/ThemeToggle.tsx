import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label="Cambiar entre modo claro y oscuro"
      className="relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-surface px-1 transition-colors hover:border-accent/50"
    >
      <span
        className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground shadow-card transition-transform duration-300"
        style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
    </button>
  );
}
