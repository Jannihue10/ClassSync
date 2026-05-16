import { useState } from "react";
import { TYPEN, TYP_COLORS, COLORS, ICONS } from "../data/mockData";

export default function UploadModal({ fach, kurse, onClose, onUpload }) {
  const [typ, setTyp] = useState("Mitschrift");
  const [titel, setTitel] = useState("");
  const [preview, setPreview] = useState("");
  const [selFach, setSelFach] = useState(fach || kurse[0]?.name || "");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  const submit = () => {
    if (!titel.trim()) return;
    onUpload({ typ, titel, preview, fach: selFach, file });
    onClose();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1a1d2e", borderRadius: 24, padding: 36, width: 520, display: "flex", flexDirection: "column", gap: 20, border: "1px solid #2d3148" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>Material hochladen</div>
          <button onClick={onClose} style={{ background: "#2d3148", border: "none", color: "#94a3b8", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>✕</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          onClick={() => document.getElementById("fu").click()}
          style={{ border: `2px dashed ${dragging ? "#6366f1" : "#2d3148"}`, borderRadius: 16, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragging ? "#1e2040" : "#12151f", transition: "all .2s" }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : "📎"}</div>
          <div style={{ color: file ? "#10b981" : "#64748b", fontSize: 14, fontWeight: 500 }}>
            {file ? file.name : "PDF, Foto oder Notiz hier ablegen – oder klicken"}
          </div>
          <input id="fu" type="file" accept=".pdf,image/*,.txt" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
        </div>

        {/* Fach */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fach</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {kurse.map(k => (
              <button key={k.name} onClick={() => setSelFach(k.name)}
                style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", borderColor: selFach === k.name ? (COLORS[k.name] || "#6366f1") : "#2d3148", background: selFach === k.name ? (COLORS[k.name] || "#6366f1") + "22" : "transparent", color: selFach === k.name ? (COLORS[k.name] || "#6366f1") : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {ICONS[k.name]} {k.name}
              </button>
            ))}
          </div>
        </div>

        {/* Typ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Typ</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TYPEN.slice(1).map(t => (
              <button key={t} onClick={() => setTyp(t)}
                style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid", borderColor: typ === t ? (TYP_COLORS[t] || "#6366f1") : "#2d3148", background: typ === t ? (TYP_COLORS[t] || "#6366f1") + "22" : "transparent", color: typ === t ? (TYP_COLORS[t] || "#6366f1") : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <input value={titel} onChange={e => setTitel(e.target.value)} placeholder="Titel des Materials…"
          style={{ background: "#12151f", border: "1.5px solid #2d3148", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 15, outline: "none" }} />

        <textarea value={preview} onChange={e => setPreview(e.target.value)} placeholder="Kurze Beschreibung (optional)…" rows={2}
          style={{ background: "#12151f", border: "1.5px solid #2d3148", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", resize: "none" }} />

        <button onClick={submit} disabled={!titel.trim()}
          style={{ background: titel.trim() ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#2d3148", color: titel.trim() ? "white" : "#64748b", border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 600, cursor: titel.trim() ? "pointer" : "default", transition: "all .2s" }}>
          Hochladen →
        </button>
      </div>
    </div>
  );
}