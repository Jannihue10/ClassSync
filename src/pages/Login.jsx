import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input, Btn } from "../components/UI";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const { t } = useTheme();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!email || !password) return setErr("Bitte alle Felder ausfüllen.");
    setLoading(true); setErr("");
    try {
      await login(email, password);
    } catch (e) {
      setErr("Email oder Passwort falsch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: t.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: t.text }}>ClassSync</span>
        </div>

        {/* Form */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Anmelden</div>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
          <Input label="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "Wird angemeldet…" : "Anmelden →"}
          </Btn>
          <div style={{ textAlign: "center", fontSize: 13, color: t.textMuted }}>
            Noch kein Account?{" "}
            <span onClick={onSwitch} style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>Registrieren</span>
          </div>
        </div>
      </div>
    </div>
  );
}