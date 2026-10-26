import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme() as {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
  };
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {!isDark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
