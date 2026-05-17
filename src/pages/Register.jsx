import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input, Btn } from "../components/UI";

export default function Register({ onSwitch }) {
  const { register } = useAuth();
  const { t } = useTheme();
  const [nickname, setNickname] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!nickname || !email || !password) return setErr("Bitte alle Felder ausfüllen.");
    if (password.length < 6) return setErr("Passwort muss mindestens 6 Zeichen haben.");
    setLoading(true); setErr("");
    try { await register(email, password, nickname); }
    catch (e) {
      if (e.code === "auth/email-already-in-use") setErr("Diese Email ist bereits registriert.");
      else setErr("Fehler beim Registrieren. Bitte nochmal versuchen.");
    } finally { setLoading(false); }
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
            Deine Klasse. Organisiert.
          </div>
          <div style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.7 }}>
            Erstelle einen Account und tritt deiner Klasse bei – kostenlos, ohne Werbung.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
            {["✅ Kostenlos & werbefrei", "🔒 Nur deine Klasse sieht deine Inhalte", "📱 Funktioniert auf allen Geräten", "⚡ Echtzeit-Updates"].map(f => (
              <div key={f} style={{ fontSize: 15, color: t.textSub }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right register panel */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.text, marginBottom: 6 }}>Account erstellen</div>
            <div style={{ fontSize: 15, color: t.textMuted }}>Dauert weniger als eine Minute.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="z. B. Jannik" />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
            <Input label="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="mind. 6 Zeichen" />
            {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
            <Btn onClick={submit} disabled={loading} full style={{ padding: "13px", fontSize: 15, marginTop: 4 }}>
              {loading ? "Wird registriert…" : "Account erstellen →"}
            </Btn>
          </div>
          <div style={{ textAlign: "center", fontSize: 14, color: t.textMuted }}>
            Schon ein Account?{" "}
            <span onClick={onSwitch} style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>Anmelden</span>
          </div>
        </div>
      </div>
    </div>
  );
}