import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input, Btn } from "../components/UI";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const { t } = useTheme();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);

  const [resetMode, setResetMode]       = useState(false);
  const [resetEmail, setResetEmail]     = useState("");
  const [resetMsg, setResetMsg]         = useState("");
  const [resetErr, setResetErr]         = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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

  const sendReset = async () => {
    if (!resetEmail.trim()) return setResetErr("Bitte Email eingeben.");
    setResetLoading(true); setResetErr(""); setResetMsg("");
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetMsg("Email gesendet! Prüfe dein Postfach.");
    } catch (e) {
      setResetErr("Email nicht gefunden oder ungültig.");
    } finally {
      setResetLoading(false);
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

        {/* Login Form */}
        {!resetMode ? (
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Anmelden</div>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
            <Input label="Passwort" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && submit()} />
            {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
            <Btn onClick={submit} disabled={loading} full>
              {loading ? "Wird angemeldet…" : "Anmelden →"}
            </Btn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: t.textMuted, paddingTop: 4 }}>
              <span>
                Noch kein Account?{" "}
                <span onClick={onSwitch} style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>Registrieren</span>
              </span>
              <div style={{ width: 1, height: 14, background: t.border }} />
              <span onClick={() => { setResetMode(true); setResetEmail(email); }}
                style={{ color: t.text, fontWeight: 500, cursor: "pointer" }}>
                Passwort vergessen?
              </span>
            </div>
          </div>

        ) : (
          /* Reset Form */
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Passwort zurücksetzen</div>
            <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.5 }}>
              Wir schicken dir einen Link per Email mit dem du ein neues Passwort setzen kannst.
            </div>
            <Input label="Email" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="deine@email.de" />
            {resetErr && <div style={{ fontSize: 13, color: t.danger }}>{resetErr}</div>}
            {resetMsg && <div style={{ fontSize: 13, color: t.success, fontWeight: 500 }}>✅ {resetMsg}</div>}
            <Btn onClick={sendReset} disabled={resetLoading || !!resetMsg} full>
              {resetLoading ? "Wird gesendet…" : "Link senden →"}
            </Btn>
            <div style={{ textAlign: "center", fontSize: 13, color: t.textMuted }}>
              <span onClick={() => { setResetMode(false); setResetMsg(""); setResetErr(""); }}
                style={{ color: t.text, fontWeight: 600, cursor: "pointer" }}>
                ← Zurück zum Login
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
