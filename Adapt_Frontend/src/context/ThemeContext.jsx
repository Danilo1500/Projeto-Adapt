import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "adapt-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // `theme` was used by the standalone home-page toggle before all controls
    // shared this provider. Read it once as a migration fallback.
    const saved = localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Update the document immediately when the user selects a theme. The effect
  // above keeps initialization and storage in sync; applying here avoids a
  // frame where routed pages (including the job views) retain the old theme.
  const changeTheme = useCallback((nextTheme) => {
    const normalizedTheme = nextTheme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", normalizedTheme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
    setTheme(normalizedTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme: changeTheme }), [theme, changeTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
