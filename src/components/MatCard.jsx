import { useState } from "react";
import { TYP_COLORS } from "../data/mockData";

export default function MatCard({ m, onOpen, onLike }) {
  const [hov, setHov] = useState(false);
  const col = TYP_COLORS[m.typ] || "#6366f1";

  return (
    <div
      onClick={() => onOpen(m)}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        background: hov ? "#1e2040" : "#1a1d2e",
        borderRadius: 18, padding: 20, cursor: "pointer",
        transition: "all .2s",
        border: `1px solid ${hov ? "#3d4166" : "#2d3148"}`,
        display: "flex", flexDirection: "column", gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {m.dateiTyp === "PDF" ? "📄" : m.dateiTyp === "Foto" ? "📸" : "📝"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.titel}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{m.autor} · {m.datum}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {m.preview}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ background: col + "22", color: col, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{m.typ}</span>
        <button
          onClick={e => { e.stopPropagation(); onLike(m.id); }}
          style={{ background: "transparent", border: "none", color: "#64748b", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
        >
          ⭐ {m.likes}
        </button>
      </div>
    </div>
  );
}