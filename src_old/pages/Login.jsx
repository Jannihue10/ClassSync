import { KLASSEN } from "../data/mockData";

export default function Login({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#0f1117 0%,#1a1d2e 50%,#0f1117 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ display: "flex", gap: 60, alignItems: "center", maxWidth: 860, width: "100%" }}>

        {/* Brand */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#4f46e5,#8b5cf6)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📚</div>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 48, fontWeight: 700, color: "white", lineHeight: 1.1 }}>ClassSync</div>
          <div style={{ fontSize: 18, color: "#64748b", lineHeight: 1.6 }}>Unterrichtsmaterial teilen.<br />Einfach. Schnell. Für deine Klasse.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {["📁 Mitschriften & Lösungen teilen", "⭐ Material bewerten & danken", "📣 Fehlende Inhalte anfragen", "🗓 Stundenplan als Einstiegspunkt"].map(f => (
              <div key={f} style={{ fontSize: 14, color: "#4a5177" }}>{f}</div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ width: 360, background: "#1a1d2e", borderRadius: 24, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18, border: "1px solid #2d3148" }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>Anmelden</div>
          {[["E-Mail", "email", "jannik@schule.de"], ["Passwort", "password", "••••••••"]].map(([l, t, ph]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</label>
              <input type={t} defaultValue={ph} style={{ background: "#12151f", border: "1px solid #2d3148", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "white", outline: "none" }} />
            </div>
          ))}
          <button onClick={() => onLogin()} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
            Anmelden →
          </button>
          <div style={{ textAlign: "center", fontSize: 12, color: "#4a5177" }}>Demo direkt starten:</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.keys(KLASSEN).map(c => (
              <button key={c} onClick={() => onLogin(c)} style={{ flex: 1, background: "#12151f", border: "1px solid #2d3148", borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700, color: "#6366f1", cursor: "pointer", letterSpacing: 1 }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}