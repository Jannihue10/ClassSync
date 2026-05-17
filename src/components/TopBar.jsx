import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Btn } from "./UI";

export default function TopBar({ klasseName, onUpload, onOverview, onProfile }) {
  const { t, isDark, toggle } = useTheme();
  const { profile } = useAuth();

  return (
    <div style={{
      background: t.bgCard,
      borderBottom: `1px solid ${t.border}`,
      padding: "0 32px",
      height: 56,
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, background: t.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📚</div>
        <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>ClassSync</span>
        {klasseName && <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 2 }}>· {klasseName}</span>}
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <Btn onClick={onUpload} style={{ fontSize: 13, padding: "7px 14px" }}>+ Hochladen</Btn>
      <Btn onClick={onOverview} variant="ghost" style={{ fontSize: 13, padding: "7px 14px" }}>☰ Übersicht</Btn>

      {/* Theme toggle */}
      <button onClick={toggle} style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 15, color: t.textSub }}>
        {isDark ? "☀️" : "🌙"}
      </button>

      {/* Avatar */}
      <div onClick={onProfile}
        style={{ width: 32, height: 32, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: t.accentFg, fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
        {profile?.nickname?.[0]?.toUpperCase() || "?"}
      </div>
    </div>
  );
}