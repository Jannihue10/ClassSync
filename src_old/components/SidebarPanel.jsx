import { COLORS } from "../data/mockData";

export default function SidebarPanel({ kd, fachNamen, onClose }) {
  const allHAs = fachNamen
    .flatMap(f => (kd.hausaufgaben[f] || []).map(h => ({ ...h, fach: f })))
    .filter(h => !h.done);
  const allPr = kd.pruefungen.filter(p => fachNamen.includes(p.fach));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} />
      <div style={{ width: 360, background: "#1a1d2e", height: "100%", borderLeft: "1px solid #2d3148", display: "flex", flexDirection: "column", overflowY: "auto" }}>

        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #2d3148", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 700, color: "white" }}>Übersicht</div>
          <button onClick={onClose} style={{ background: "#2d3148", border: "none", color: "#94a3b8", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>✕</button>
        </div>

        {/* Open HAs */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #2d3148" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#64748b", marginBottom: 12 }}>
            Offene Hausaufgaben ({allHAs.length})
          </div>
          {allHAs.length === 0
            ? <div style={{ fontSize: 13, color: "#4a5177" }}>Alle erledigt ✅</div>
            : allHAs.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #12151f" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[h.fach] || "#6366f1", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>{h.text}</div>
                  <div style={{ fontSize: 11, color: "#4a5177" }}>{h.fach}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: h.faellig === "Heute" ? "#ef444422" : "#f59e0b22", color: h.faellig === "Heute" ? "#ef4444" : "#f59e0b", whiteSpace: "nowrap" }}>
                  {h.faellig}
                </span>
              </div>
            ))
          }
        </div>

        {/* Prüfungen */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#64748b", marginBottom: 12 }}>
            Bevorstehende Prüfungen
          </div>
          {allPr.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #12151f" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS[p.fach] || "#6366f1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1 }}>{p.tage}</span>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.7)" }}>d</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{p.titel}</div>
                <div style={{ fontSize: 11, color: "#4a5177" }}>{p.fach} · {p.datum}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}