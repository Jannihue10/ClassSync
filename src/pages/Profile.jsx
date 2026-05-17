import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Btn, Input, SectionTitle, Divider } from "../components/UI";
import { FACH_COLORS, FACH_ICONS } from "../styles/theme";

export default function Profile({ kurse, onClose, onKursClick }) {
  const { profile, logout, updateProfile } = useAuth();
  const { t, isDark, toggle } = useTheme();

  const [editNick, setEditNick]   = useState(false);
  const [newNick, setNewNick]     = useState(profile?.nickname || "");
  const [saving, setSaving]       = useState(false);

  const saveNick = async () => {
    if (!newNick.trim()) return;
    setSaving(true);
    await updateProfile({ nickname: newNick.trim() });
    setSaving(false); setEditNick(false);
  };

  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));

  return (
    <div style={{ minHeight: "100vh", background: t.bg, padding: "40px 24px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn variant="ghost" onClick={onClose} style={{ padding: "6px 12px", fontSize: 13 }}>←</Btn>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>Profil</div>
        </div>

        {/* Avatar + name */}
        <div style={{ background: t.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: t.accentFg, fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
              {profile?.nickname?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{profile?.nickname}</div>
              <div style={{ fontSize: 13, color: t.textMuted }}>{profile?.email}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{profile?.rolle === "admin" ? "Klassen-Admin" : "Schüler"}</div>
            </div>
          </div>

          {editNick ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Input value={newNick} onChange={e => setNewNick(e.target.value)} placeholder="Neuer Nickname" style={{ flex: 1 }} />
              <Btn onClick={saveNick} disabled={saving}>{saving ? "…" : "Speichern"}</Btn>
              <Btn variant="ghost" onClick={() => setEditNick(false)}>Abbrechen</Btn>
            </div>
          ) : (
            <Btn variant="ghost" onClick={() => setEditNick(true)} style={{ alignSelf: "flex-start", fontSize: 13 }}>✏️ Nickname ändern</Btn>
          )}
        </div>

        {/* My courses */}
        <div style={{ background: t.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${t.border}` }}>
          <SectionTitle>Meine Kurse ({meineKurse.length})</SectionTitle>
          {meineKurse.length === 0
            ? <div style={{ fontSize: 13, color: t.textMuted }}>Noch keinem Kurs beigetreten.</div>
            : meineKurse.map(k => (
              <div key={k.id} onClick={() => { onKursClick(k); onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.borderSub}`, cursor: "pointer" }}
                onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: (FACH_COLORS[k.name] || t.accent) + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {FACH_ICONS[k.name] || "📚"}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.text }}>{k.name}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{k.lehrer}</div>
              </div>
            ))
          }
          <div style={{ marginTop: 12, fontSize: 13, color: t.textMuted }}>
            Um Kurse zu wechseln, besuche einfach einen Kurs auf der Startseite und klicke „Beitreten" oder „Verlassen".
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: t.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionTitle>Einstellungen</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, color: t.text }}>Dark Mode</div>
            <button onClick={toggle} style={{ background: isDark ? t.accent : t.bgSub, border: `1px solid ${t.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: isDark ? t.accentFg : t.text, transition: "all .2s" }}>
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <Divider />
          <Btn onClick={logout} variant="danger" style={{ alignSelf: "flex-start", fontSize: 13 }}>Abmelden</Btn>
        </div>
      </div>
    </div>
  );
}