// Shared, reusable UI primitives used across the app.
import { useTheme } from "../context/ThemeContext";

export function Card({ children, style = {}, onClick }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseOver={() => onClick && setHov(true)}
      onMouseOut={() => onClick && setHov(false)}
      style={{
        background: hov ? t.bgHover : t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        transition: "background .15s, transform .15s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import { useState } from "react";

export function Btn({ children, onClick, variant = "primary", style = {}, disabled = false, full = false }) {
  const { t } = useTheme();
  const base = {
    border: "none", borderRadius: 10, padding: "10px 18px",
    fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1, transition: "opacity .15s",
    width: full ? "100%" : "auto", display: "inline-flex",
    alignItems: "center", justifyContent: "center", gap: 6,
  };
  const variants = {
    primary:  { background: t.accent, color: t.accentFg },
    ghost:    { background: t.bgSub, color: t.textSub, border: `1px solid ${t.border}` },
    danger:   { background: t.danger + "18", color: t.danger, border: `1px solid ${t.danger}33` },
    success:  { background: t.success + "18", color: t.success, border: `1px solid ${t.success}33` },
  };
  return (
    <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function Input({ label, type = "text", value, onChange, placeholder, error, style = {} }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          background: t.bgSub, border: `1.5px solid ${error ? t.danger : t.border}`,
          borderRadius: 10, padding: "11px 14px", fontSize: 14,
          color: t.text, outline: "none", transition: "border-color .15s", ...style,
        }}
      />
      {error && <span style={{ fontSize: 12, color: t.danger }}>{error}</span>}
    </div>
  );
}

export function Modal({ children, onClose, width = 480 }) {
  const { t } = useTheme();
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: t.bgCard, borderRadius: 18, padding: 32, width: "100%", maxWidth: width, border: `1px solid ${t.border}`, boxShadow: t.shadowMd, maxHeight: "90vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, onClose }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{title}</div>
      <Btn variant="ghost" onClick={onClose} style={{ padding: "6px 10px", fontSize: 13 }}>✕</Btn>
    </div>
  );
}

export function Pill({ label, color }) {
  return (
    <span style={{ background: color + "20", color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function Divider() {
  const { t } = useTheme();
  return <div style={{ height: 1, background: t.border, margin: "8px 0" }} />;
}

export function SectionTitle({ children }) {
  const { t } = useTheme();
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted, marginBottom: 12 }}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 24, height: 24, border: "2px solid #ccc", borderTopColor: "#555", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Empty({ icon, text }) {
  const { t } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: t.textMuted, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{ fontSize: 14 }}>{text}</span>
    </div>
  );
}

export function Tag({ label, bg, fg }) {
  return (
    <span style={{ background: bg, color: fg, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
      {label}
    </span>
  );
}