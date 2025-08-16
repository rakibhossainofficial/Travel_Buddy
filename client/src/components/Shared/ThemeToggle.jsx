// components/Shared/ThemeToggle.jsx
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label={`Switch to ${
          theme === "light" ? "dark mode" : "light mode"
        }`}
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </Button>
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={theme === "light" ? "bg-muted" : ""}
        aria-label="Switch to light mode"
      >
        <Sun size={18} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "bg-muted" : ""}
        aria-label="Switch to dark mode"
      >
        <Moon size={18} />
      </Button> */}
    </div>
  );
}
