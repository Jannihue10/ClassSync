import { TYP_COLORS } from "../data/mockData";

export default function MaterialViewer({ mat, onClose, onLike }) {
  const col = TYP_COLORS[mat.typ] || "#6366f1";

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1a1d2e", borderRadius: 24, width: 680, maxHeight: "80vh", display: "flex", flexDirection: "column", border: "1px solid #2d3148", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #2d3148", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            {mat.dateiTyp === "PDF" ? "📄" : mat.dateiTyp === "Foto" ? "📸" : "📝"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>{mat.titel}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{mat.autor} · {mat.datum} · {mat.seiten} {mat.seiten === 1 ? "Seite" : "Seiten"}</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ background: col + "22", color: col, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{mat.typ}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#2d3148", border: "none", color: "#94a3b8", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>✕</button>
        </div>

        {/* Preview area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ background: "#12151f", borderRadius: 16, padding: 32, minHeight: 300, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center", border: "1px solid #2d3148" }}>
            <div style={{ fontSize: 56 }}>{mat.dateiTyp === "PDF" ? "📄" : mat.dateiTyp === "Foto" ? "📸" : "📝"}</div>
            <div style={{ fontSize: 15, color: "#94a3b8", textAlign: "center", maxWidth: 360, lineHeight: 1.6 }}>{mat.preview}</div>
            <div style={{ fontSize: 12, color: "#4a5177", marginTop: 8 }}>Vorschau · {mat.seiten} {mat.seiten === 1 ? "Seite" : "Seiten"} · {mat.dateiTyp}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #2d3148", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => onLike(mat.id)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#12151f", border: "1px solid #2d3148", borderRadius: 12, padding: "10px 18px", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            ⭐ {mat.likes} Danksagungen
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#12151f", border: "1px solid #2d3148", borderRadius: 12, padding: "10px 18px", color: "#64748b", fontSize: 14, cursor: "pointer" }}>
            💬 Kommentieren
          </button>
          <button style={{ marginLeft: "auto", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            ⬇ Herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}