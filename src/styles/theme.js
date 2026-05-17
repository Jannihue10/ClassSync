// All design tokens in one place.
// To change the look of the entire app, edit here only.

export const LIGHT = {
  bg:        "#ffffff",
  bgSub:     "#f5f5f5",
  bgCard:    "#ffffff",
  bgHover:   "#f0f0f0",
  border:    "#e5e5e5",
  borderSub: "#efefef",
  text:      "#111111",
  textSub:   "#555555",
  textMuted: "#999999",
  accent:    "#111111",
  accentFg:  "#ffffff",
  danger:    "#e53e3e",
  success:   "#38a169",
  warning:   "#d97706",
  shadow:    "0 1px 4px rgba(0,0,0,0.08)",
  shadowMd:  "0 4px 16px rgba(0,0,0,0.10)",
};

export const DARK = {
  bg:        "#1c1c1e",
  bgSub:     "#2c2c2e",
  bgCard:    "#252527",
  bgHover:   "#323234",
  border:    "#3a3a3c",
  borderSub: "#2c2c2e",
  text:      "#f0f0f0",
  textSub:   "#adadad",
  textMuted: "#6e6e73",
  accent:    "#f0f0f0",
  accentFg:  "#1c1c1e",
  danger:    "#fc8181",
  success:   "#68d391",
  warning:   "#f6ad55",
  shadow:    "0 1px 4px rgba(0,0,0,0.3)",
  shadowMd:  "0 4px 16px rgba(0,0,0,0.4)",
};

export const FACH_COLORS = {
  Mathematik:  "#6366f1",
  Deutsch:     "#f59e0b",
  Biologie:    "#10b981",
  Englisch:    "#3b82f6",
  Chemie:      "#ef4444",
  Geschichte:  "#8b5cf6",
  Physik:      "#06b6d4",
  Französisch: "#ec4899",
  Sport:       "#f97316",
  Kunst:       "#14b8a6",
};

export const FACH_ICONS = {
  Mathematik:  "📐",
  Deutsch:     "📖",
  Biologie:    "🌿",
  Englisch:    "🇬🇧",
  Chemie:      "⚗️",
  Geschichte:  "🏛️",
  Physik:      "⚡",
  Französisch: "🇫🇷",
  Sport:       "⚽",
  Kunst:       "🎨",
};

export const MAT_TYPEN = ["Mitschrift", "Aufgabenblatt", "HA-Lösung", "Lernzettel"];

export const MAT_COLORS = {
  "Mitschrift":    "#6366f1",
  "Aufgabenblatt": "#8b5cf6",
  "HA-Lösung":     "#10b981",
  "Lernzettel":    "#f59e0b",
};

export const DAYS = ["Mo", "Di", "Mi", "Do", "Fr"];
export const DAY_FULL = {
  Mo: "Montag", Di: "Dienstag", Mi: "Mittwoch",
  Do: "Donnerstag", Fr: "Freitag",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  input, textarea, button, select { font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { border-radius: 4px; background: #ccc; }
  ::-webkit-scrollbar-track { background: transparent; }
`;