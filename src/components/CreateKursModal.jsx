import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Modal, ModalHeader, Input, Btn } from "./UI";
import { DAYS, DAY_FULL, FACH_COLORS, FACH_ICONS } from "../styles/theme";

const KNOWN_FAECHER = Object.keys(FACH_ICONS);

export default function CreateKursModal({ klasseId, onClose, onCreated }) {
  const { profile, updateProfile } = useAuth();
  const { t } = useTheme();

  const [name, setName]     = useState("");
  const [lehrer, setLehrer] = useState("");
  const [raum, setRaum]     = useState("");
  const [zeiten, setZeiten] = useState([]); // [{day, zeit}]
  const [selDay, setSelDay] = useState("Mo");
  const [zeit, setZeit]     = useState("08:00");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const addZeit = () => {
    if (zeiten.find(z => z.day === selDay)) {
      setZeiten(p => p.map(z => z.day === selDay ? { ...z, zeit } : z));
    } else {
      setZeiten(p => [...p, { day: selDay, zeit }]);
    }
  };

  const removeZeit = (day) => setZeiten(p => p.filter(z => z.day !== day));

  const submit = async () => {
    if (!name.trim()) return setErr("Bitte einen Namen eingeben.");
    if (zeiten.length === 0) return setErr("Bitte mindestens einen Unterrichtstag hinzufügen.");
    setLoading(true); setErr("");
    try {
      const kursRef = await addDoc(collection(db, "klassen", klasseId, "kurse"), {
        name:      name.trim(),
        lehrer:    lehrer.trim(),
        raum:      raum.trim(),
        zeiten,
        adminId:   profile.uid,
        adminNick: profile.nickname,
        createdAt: Date.now(),
      });
      // Add kurs to user's kurseIds
      await updateDoc(doc(db, "users", profile.uid), {
        kurseIds: arrayUnion(kursRef.id),
      });
      await updateProfile({ kurseIds: [...(profile.kurseIds || []), kursRef.id] });
      onCreated();
      onClose();
    } catch (e) {
      setErr("Fehler beim Erstellen.");
    } finally {
      setLoading(false);
    }
  };

  const col = FACH_COLORS[name] || t.accent;

  return (
    <Modal onClose={onClose} width={520}>
      <ModalHeader title="Neuen Kurs erstellen" onClose={onClose} />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Fach name – show quick-picks if known */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input label="Fach / Kursname" value={name} onChange={e => setName(e.target.value)} placeholder="z. B. Mathematik" />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {KNOWN_FAECHER.map(f => (
              <button key={f} onClick={() => setName(f)}
                style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${name === f ? (FACH_COLORS[f] || t.accent) : t.border}`, background: name === f ? (FACH_COLORS[f] || t.accent) + "20" : "transparent", color: name === f ? (FACH_COLORS[f] || t.accent) : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {FACH_ICONS[f]} {f}
              </button>
            ))}
          </div>
        </div>

        <Input label="Lehrer (optional)" value={lehrer} onChange={e => setLehrer(e.target.value)} placeholder="z. B. Hr. Hoffmann" />
        <Input label="Raum (optional)" value={raum} onChange={e => setRaum(e.target.value)} placeholder="z. B. 204" />

        {/* Zeiten */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Unterrichtszeiten</div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setSelDay(d)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${selDay === d ? col : t.border}`, background: selDay === d ? col + "20" : "transparent", color: selDay === d ? col : t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {d}
                </button>
              ))}
            </div>
            <input type="time" value={zeit} onChange={e => setZeit(e.target.value)}
              style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", color: t.text, fontSize: 14, outline: "none" }} />
            <Btn onClick={addZeit} variant="ghost" style={{ padding: "7px 14px", fontSize: 13 }}>+ Hinzufügen</Btn>
          </div>

          {zeiten.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {zeiten.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)).map(z => (
                <div key={z.day} style={{ display: "flex", alignItems: "center", gap: 6, background: col + "20", borderRadius: 8, padding: "5px 10px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: col }}>{z.day} {z.zeit}</span>
                  <button onClick={() => removeZeit(z.day)} style={{ background: "none", border: "none", color: col, cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}

        <Btn onClick={submit} disabled={loading} full>
          {loading ? "Wird erstellt…" : "Kurs erstellen →"}
        </Btn>
      </div>
    </Modal>
  );
}