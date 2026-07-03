import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Btn, Input } from "./UI";
import { FACH_COLORS, FACH_ICONS } from "../styles/theme";

export default function KurswahlModal({ alleKurse, onClose, onSave }) {
  const { t } = useTheme();
  const { profile } = useAuth();

  const gueltigeIds = new Set(alleKurse.map(k => k.id));
  const [selected, setSelected] = useState(
    new Set((profile?.kurseIds || []).filter(id => gueltigeIds.has(id)))
  );
  const [search, setSearch]     = useState("");
  const [saving, setSaving]     = useState(false);

  const filtered = alleKurse.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    (k.lehrer || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave([...selected]);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
      <div style={{
        width: "100%", maxWidth: 520,
        background: t.bgCard,
        borderRadius: 20,
        border: `1px solid ${t.border}`,
        display: "flex", flexDirection: "column",
        maxHeight: "80vh",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      }}>

        {/* Header */}
        <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Kurse auswählen</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                {selected.size} von {alleKurse.length} Kursen ausgewählt
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Btn variant="ghost" onClick={() => setSelected(new Set(alleKurse.map(k => k.id)))} style={{ fontSize: 12, padding: "5px 10px" }}>Alle wählen</Btn>
              <Btn variant="ghost" onClick={() => setSelected(new Set())} style={{ fontSize: 12, padding: "5px 10px" }}>Alle abwählen</Btn>
              <Btn variant="ghost" onClick={onClose} style={{ padding: "5px 9px", fontSize: 13 }}>✕</Btn>
            </div>
          </div>

          {/* Suchleiste */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: t.textMuted, pointerEvents: "none" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kurs oder Lehrer suchen…"
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                background: t.bgSub, border: `1px solid ${t.border}`,
                borderRadius: 10, padding: "9px 12px 9px 34px",
                color: t.text, fontSize: 14, outline: "none",
              }}
            />
          </div>
        </div>

        {/* Kursliste */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: t.textMuted, fontSize: 14 }}>
              Keine Kurse gefunden.
            </div>
          ) : (
            filtered.map(k => {
              const isSelected = selected.has(k.id);
              const color = k.farbe || FACH_COLORS[k.name] || t.accent;
              const icon  = k.icon  || FACH_ICONS[k.name]  || "📚";

              return (
                <div
                  key={k.id}
                  onClick={() => toggle(k.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "11px 12px", borderRadius: 12,
                    cursor: "pointer",
                    background: isSelected ? color + "15" : "transparent",
                    border: `1.5px solid ${isSelected ? color + "55" : "transparent"}`,
                    marginBottom: 4,
                    transition: "all .15s",
                  }}
                >
                  {/* Kurs-Icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: color + (isSelected ? "30" : "18"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{k.name}</div>
                    {k.lehrer && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>{k.lehrer}</div>}
                  </div>

                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: isSelected ? color : "transparent",
                    border: `2px solid ${isSelected ? color : t.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .15s",
                  }}>
                    {isSelected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Abbrechen</Btn>
          <Btn onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
            {saving ? "Wird gespeichert…" : `${selected.size} Kurse speichern`}
          </Btn>
        </div>
      </div>
    </div>
  );
}
