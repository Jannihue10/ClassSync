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
    try {
      await register(email, password, nickname);
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setErr("Diese Email ist bereits registriert.");
      else setErr("Fehler beim Registrieren. Bitte nochmal versuchen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 32 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: t.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: t.text }}>ClassSync</span>
        </div>

        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Account erstellen</div>
          <Input label="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="z. B. Jannik" />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
          <Input label="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="mind. 6 Zeichen" />
          {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "Wird registriert…" : "Account erstellen →"}
          </Btn>
          <div style={{ textAlign: "center", fontSize: 13, color: t.textMuted }}>
            Schon ein Account?{" "}
            <span onClick={onSwitch} style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>Anmelden</span>
          </div>
        </div>
      </div>
    </div>
  );
}