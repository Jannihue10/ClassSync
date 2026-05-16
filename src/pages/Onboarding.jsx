import { useState } from "react";
import { KLASSEN, COLORS, ICONS } from "../data/mockData";

export default function Onboarding({ demoKlasse, onDone }) {
  const [step, setStep] = useState(demoKlasse ? 1 : 0);
  const [code, setCode] = useState(demoKlasse || "");
  const [err, setErr] = useState("");
  const [klasse, setKlasse] = useState(demoKlasse || null);
  const [sel, setSel] = useState([]);
  const kd = klasse ? KLASSEN[klasse] : null;

  const check = () => {
    const u = code.toUpperCase().trim();
    if (KLASSEN[u]) { setKlasse(u); setErr(""); setStep(1); }
    else setErr("Ungültiger Code.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 520, background: "#1a1d2e", borderRadius: 24, padding: "40px 36px", border: "1px solid #2d3148", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 4, borderRadius: 2, background: i === step ? "#6366f1" : i < step ? "#4338ca" : "#2d3148", flex: i === step ? 3 : 1, transition: "all .3s" }} />
          ))}
        </div>

        {step === 0 && <>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 26, fontWeight: 700, color: "white" }}>Klasse beitreten</div>
          <input
            value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Zugangscode z. B. Q12A" maxLength={6}
            style={{ background: "#12151f", border: `1.5px solid ${err ? "#ef4444" : "#2d3148"}`, borderRadius: 12, padding: "16px 20px", fontSize: 24, fontFamily: "Sora,sans-serif", fontWeight: 700, letterSpacing: 6, textAlign: "center", color: "white", outline: "none" }}
          />
          {err && <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>⚠️ {err}</div>}
          <button onClick={check} disabled={!code} style={{ background: code ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#2d3148", color: code ? "white" : "#64748b", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: code ? "pointer" : "default" }}>
            Bestätigen →
          </button>
        </>}

        {step === 1 && kd && <>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 26, fontWeight: 700, color: "white" }}>
            Kurse wählen <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b", marginLeft: 8 }}>{kd.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
            {kd.kurse.map(k => (
              <div key={k.id} onClick={() => setSel(p => p.includes(k.id) ? p.filter(x => x !== k.id) : [...p, k.id])}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${sel.includes(k.id) ? (COLORS[k.name] || "#6366f1") : "#2d3148"}`, background: sel.includes(k.id) ? (COLORS[k.name] || "#6366f1") + "15" : "#12151f", cursor: "pointer", transition: "all .2s" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[k.name] || "#6366f1", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "white" }}>{ICONS[k.name]} {k.name}</span>
                <span style={{ fontSize: 12, color: "#4a5177" }}>{k.lehrer}</span>
                {sel.includes(k.id) && <span style={{ color: COLORS[k.name] || "#6366f1", fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={sel.length === 0}
            style={{ background: sel.length ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#2d3148", color: sel.length ? "white" : "#64748b", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: sel.length ? "pointer" : "default" }}>
            Weiter →
          </button>
        </>}

        {step === 2 && kd && <>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: "Sora,sans-serif", fontSize: 26, fontWeight: 700, color: "white" }}>Bereit!</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{kd.name} · {sel.length} Kurse</div>
          </div>
          <div style={{ background: "#12151f", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {kd.kurse.filter(k => sel.includes(k.id)).map(k => (
              <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[k.name] || "#6366f1", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#e2e8f0", flex: 1 }}>{ICONS[k.name]} {k.name}</span>
                <span style={{ fontSize: 11, color: "#4a5177" }}>{k.lehrer}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onDone(klasse, sel)}
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Los geht's →
          </button>
        </>}
      </div>
    </div>
  );
}