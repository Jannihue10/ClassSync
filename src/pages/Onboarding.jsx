import { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input, Btn } from "../components/UI";
import KurswahlModal from "../components/KurswahlModal";
import {
  collection, addDoc, getDocs, query, where,
  doc, updateDoc, arrayUnion,
} from "firebase/firestore";
import { DAYS, DAY_FULL, FACH_COLORS, FACH_ICONS } from "../styles/theme";

// Generate a random 5-char code
const genCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

export default function Onboarding() {
  const { profile, updateProfile } = useAuth();
  const { t } = useTheme();
  const [mode, setMode]         = useState(null); // "create" | "join"
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");

  const [pendingKlasseId, setPendingKlasseId] = useState(null);
  const [pendingKurse, setPendingKurse]       = useState([]);
  const [showKurswahl, setShowKurswahl]       = useState(false);

  // Create class
  const [className, setClassName] = useState("");

  // Join class
  const [code, setCode] = useState("");

  const createKlasse = async () => {
    if (!className.trim()) return setErr("Bitte einen Namen eingeben.");
    setLoading(true); setErr("");
    try {
      const newCode = genCode();
      const ref = await addDoc(collection(db, "klassen"), {
        name:      className.trim(),
        code:      newCode,
        adminIds:  [profile.uid],
        createdAt: Date.now(),
      });
      await updateProfile({ klasseId: ref.id, kurseIds: [] });
    } catch (e) {
      setErr("Fehler beim Erstellen.");
    } finally {
      setLoading(false);
    }
  };

  const joinKlasse = async () => {
    if (!code.trim()) return setErr("Bitte einen Code eingeben.");
    setLoading(true); setErr("");
    try {
      const q = query(collection(db, "klassen"), where("code", "==", code.toUpperCase().trim()));
      const snap = await getDocs(q);
      if (snap.empty) { setErr("Ungültiger Code."); setLoading(false); return; }
      const klasseId = snap.docs[0].id;

      // Kurse der Klasse laden
      const kurseSnap = await getDocs(collection(db, "klassen", klasseId, "kurse"));
      const kurse = kurseSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      setPendingKlasseId(klasseId);
      setPendingKurse(kurse);
      setShowKurswahl(true);
    } catch (e) {
      setErr("Fehler beim Beitreten.");
    } finally {
      setLoading(false);
    }
  };

  const finishJoin = async (kurseIds) => {
    await updateProfile({ klasseId: pendingKlasseId, kurseIds });
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {showKurswahl && (
        <KurswahlModal
          alleKurse={pendingKurse}
          onClose={() => setShowKurswahl(false)}
          onSave={finishJoin}
        />
      )}
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: t.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: t.text }}>ClassSync</span>
        </div>

        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Willkommen, {profile?.nickname}!</div>
            <div style={{ fontSize: 14, color: t.textMuted, marginTop: 4 }}>Erstelle eine neue Klasse oder tritt einer bei.</div>
          </div>

          {!mode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Btn onClick={() => setMode("create")} full>Neue Klasse erstellen</Btn>
              <Btn onClick={() => setMode("join")} variant="ghost" full>Klasse beitreten</Btn>
            </div>
          )}

          {mode === "create" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Klassenname" value={className} onChange={e => setClassName(e.target.value)} placeholder="z. B. Q12A" />
              {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => { setMode(null); setErr(""); }} variant="ghost">Zurück</Btn>
                <Btn onClick={createKlasse} disabled={loading} full>{loading ? "Wird erstellt…" : "Erstellen →"}</Btn>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input
                label="Zugangscode"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="z. B. X7K2P"
                style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 20, fontWeight: 700, textAlign: "center" }}
              />
              {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => { setMode(null); setErr(""); }} variant="ghost">Zurück</Btn>
                <Btn onClick={joinKlasse} disabled={loading} full>{loading ? "Wird beigetreten…" : "Beitreten →"}</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}