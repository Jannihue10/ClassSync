import { createContext, useContext, useState, useEffect } from "react";
import { LIGHT, DARK } from "../styles/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("cs-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const t = isDark ? DARK : LIGHT;

  useEffect(() => {
    localStorage.setItem("cs-theme", isDark ? "dark" : "light");
    document.body.style.background = t.bg;
    document.body.style.color = t.text;
  }, [isDark, t]);

  const toggle = () => setIsDark(p => !p);

  return (
    <ThemeContext.Provider value={{ t, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);