import { useState } from "react";

export default function RequestModal({ fach, onClose, onSend }) {
  const [text, setText] = useState("");

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#1a1d2e", borderRadius: 24, padding: 32, width: 440, display: "flex", flexDirection: "column", gap: 18, border: "1px solid #2d3148" }}>
        <div style={{ fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>Material anfragen</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Deine Klasse wird benachrichtigt und kann direkt antworten.</div>
        <textarea
          value={text} onChange={e => setText(e.target.value)} rows={3}
          placeholder={`z. B. "Hat jemand die ${fach}-Mitschrift von Montag?"`}
          style={{ background: "#12151f", border: "1.5px solid #2d3148", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", resize: "none" }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#2d3148", color: "#94a3b8", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Abbrechen
          </button>
          <button
            onClick={() => { if (text.trim()) { onSend(text); onClose(); } }}
            disabled={!text.trim()}
            style={{ flex: 2, background: text.trim() ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#2d3148", color: text.trim() ? "white" : "#64748b", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: text.trim() ? "pointer" : "default" }}
          >
            Anfrage senden 📣
          </button>
        </div>
      </div>
    </div>
  );
}