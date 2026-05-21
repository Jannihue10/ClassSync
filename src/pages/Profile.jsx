import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Btn, Input, SectionTitle, Divider } from "../components/UI";
import { db, storage } from "../firebase";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { ref as sRef, deleteObject } from "firebase/storage";
import { FACH_COLORS, FACH_ICONS } from "../styles/theme";

export default function Profile({ kurse, klasse, onClose, onKursClick }) {
  const { profile, logout, updateProfile } = useAuth();
  const { t, isDark, toggle } = useTheme();

  const [editNick, setEditNick] = useState(false);
  const [newNick, setNewNick]   = useState(profile?.nickname || "");
  const [saving, setSaving]     = useState(false);

  const saveNick = async () => {
    if (!newNick.trim()) return;
    setSaving(true);
    await updateProfile({ nickname: newNick.trim() });
    setSaving(false); setEditNick(false);
  };

  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));

  const deleteKlasse = async () => {
    if (!window.confirm("Klasse wirklich löschen? Alle Kurse und Materialien werden unwiderruflich gelöscht.")) return;
    const klasseId = profile.klasseId;
    const kurseSnap = await getDocs(collection(db, "klassen", klasseId, "kurse"));
    for (const kursDoc of kurseSnap.docs) {
      for (const sub of ["materialien", "hausaufgaben", "pruefungen", "chat"]) {
        const subSnap = await getDocs(collection(db, "klassen", klasseId, "kurse", kursDoc.id, sub));
        for (const d of subSnap.docs) {
          // Storage-Dateien löschen
          if (sub === "materialien" && d.data().storagePath) {
            try { await deleteObject(sRef(storage, d.data().storagePath)); } catch (e) {}
          }
          await deleteDoc(d.ref);
        }
      }
      await deleteDoc(kursDoc.ref);
    }
    await deleteDoc(doc(db, "klassen", klasseId));
    await updateProfile({ klasseId: null, rolle: "schueler", kurseIds: [] });
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      {/* Top bar */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, padding: "0 48px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
        <Btn variant="ghost" onClick={onClose} style={{ padding: "6px 12px", fontSize: 13 }}>←</Btn>
        <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Profil & Einstellungen</div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Avatar card */}
          <div style={{ background: t.bgCard, borderRadius: 16, padding: 28, border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionTitle>Mein Profil</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: t.accentFg, fontSize: 26, fontWeight: 700, flexShrink: 0 }}>
                {profile?.nickname?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{profile?.nickname}</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginTop: 3 }}>{profile?.email}</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                  {profile?.rolle === "admin" ? "👑 Klassen-Admin" : "Schüler"}
                </div>
              </div>
            </div>

            {editNick ? (
              <div style={{ display: "flex", gap: 8 }}>
                <Input value={newNick} onChange={e => setNewNick(e.target.value)} placeholder="Neuer Nickname" style={{ flex: 1 }} />
                <Btn onClick={saveNick} disabled={saving}>{saving ? "…" : "Speichern"}</Btn>
                <Btn variant="ghost" onClick={() => setEditNick(false)}>✕</Btn>
              </div>
            ) : (
              <Btn variant="ghost" onClick={() => setEditNick(true)} style={{ alignSelf: "flex-start", fontSize: 13 }}>✏️ Nickname ändern</Btn>
            )}
          </div>

          {/* Settings card */}
          <div style={{ background: t.bgCard, borderRadius: 16, padding: 28, border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
            <SectionTitle>Einstellungen</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 15, color: t.text }}>Erscheinungsbild</div>
              <button onClick={toggle}
                style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 20, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.text, transition: "all .2s" }}>
                {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
            <Divider />
            {profile?.rolle === "admin" && <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, color: t.text }}>Klasse löschen</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Löscht alle Kurse, Materialien und Chats</div>
                </div>
                <Btn onClick={deleteKlasse} variant="danger" style={{ fontSize: 13 }}>🗑 Löschen</Btn>
              </div>
              <Divider />
            </>}
            <Btn onClick={logout} variant="danger" style={{ alignSelf: "flex-start", fontSize: 13 }}>Abmelden</Btn>
          </div>
        </div>

        {/* Right column – my courses */}
        <div style={{ background: t.bgCard, borderRadius: 16, padding: 28, border: `1px solid ${t.border}` }}>
          <SectionTitle>Meine Kurse ({meineKurse.length})</SectionTitle>
          {meineKurse.length === 0
            ? <div style={{ fontSize: 14, color: t.textMuted, padding: "20px 0" }}>Noch keinem Kurs beigetreten.</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {meineKurse.map(k => (
                <div key={k.id} onClick={() => { onKursClick(k); onClose(); }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", borderRadius: 12, cursor: "pointer", transition: "background .15s" }}
                  onMouseOver={e => e.currentTarget.style.background = t.bgHover}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: (FACH_COLORS[k.name] || t.accent) + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {FACH_ICONS[k.name] || "📚"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{k.name}</div>
                    {k.lehrer && <div style={{ fontSize: 12, color: t.textMuted }}>{k.lehrer}</div>}
                  </div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>→</div>
                </div>
              ))}
            </div>
          }
          <Divider />
          <div style={{ fontSize: 13, color: t.textMuted, paddingTop: 8, lineHeight: 1.6 }}>
            Um Kurse zu wechseln, besuche einfach einen Kurs auf der Startseite und klicke „Beitreten" oder „Verlassen".
          </div>
        </div>
      </div>
    </div>
  );
}