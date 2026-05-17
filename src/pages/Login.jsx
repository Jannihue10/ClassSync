import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input, Btn } from "../components/UI";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const { t } = useTheme();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return setErr("Bitte alle Felder ausfüllen.");
    setLoading(true); setErr("");
    try { await login(email, password); }
    catch { setErr("Email oder Passwort falsch."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex" }}>
      {/* Left branding panel */}
      <div style={{ flex: 1, background: t.bgSub, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", gap: 32 }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <div style={{ width: 52, height: 52, background: t.accent, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📚</div>
            <span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>ClassSync</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 16 }}>
            Unterrichtsmaterial teilen. Einfach.
          </div>
          <div style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.7 }}>
            Teile Mitschriften, Lösungen und Lernzettel mit deiner Klasse – organisiert nach Fach und Stundenplan.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
            {["📁 Mitschriften & HA-Lösungen teilen", "⭐ Material bewerten & danken", "🗓 Stundenplan als Einstiegspunkt", "💬 Echtzeit-Chat pro Kurs"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: t.textSub }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 6 }}>Willkommen zurück</div>
            <div style={{ fontSize: 15, color: t.textMuted }}>Meld dich an um weiterzumachen.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
            <Input label="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
            <Btn onClick={submit} disabled={loading} full style={{ padding: "13px", fontSize: 15, marginTop: 4 }}>
              {loading ? "Wird angemeldet…" : "Anmelden →"}
            </Btn>
          </div>
          <div style={{ textAlign: "center", fontSize: 14, color: t.textMuted }}>
            Noch kein Account?{" "}
            <span onClick={onSwitch} style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>Registrieren</span>
          </div>
        </div>
      </div>
    </div>
  );
}