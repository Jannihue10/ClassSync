import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Modal, ModalHeader, Input, Btn } from "./UI";
import { DAYS, FACH_COLORS, FACH_ICONS } from "../styles/theme";

const KNOWN_FAECHER = Object.keys(FACH_ICONS);

export default function CreateKursModal({ klasseId, onClose, onCreated }) {
  const { profile, updateProfile } = useAuth();
  const { t } = useTheme();

  const [name, setName]       = useState("");
  const [lehrer, setLehrer]   = useState("");
  const [raum, setRaum]       = useState("");
  const [zeiten, setZeiten]   = useState([]);
  const [selDay, setSelDay]   = useState("Mo");
  const [zeit, setZeit]       = useState("08:00");
  const [zeitEnde, setZeitEnde] = useState("09:30");
  const [farbe, setFarbe]     = useState("#6366f1");
  const [icon, setIcon]       = useState("📚");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const selectVorlage = (fach) => {
    setName(fach);
    if (FACH_COLORS[fach]) setFarbe(FACH_COLORS[fach]);
    if (FACH_ICONS[fach]) setIcon(FACH_ICONS[fach]);
  };

  const addZeit = () => {
    if (zeiten.find(z => z.day === selDay)) {
      setZeiten(p => p.map(z => z.day === selDay ? { ...z, zeit, zeitEnde } : z));
    } else {
      setZeiten(p => [...p, { day: selDay, zeit, zeitEnde }]);
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
        farbe,
        icon,
        adminId:   profile.uid,
        adminNick: profile.nickname,
        createdAt: Date.now(),
      });
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

  const COMMON_ICONS = ["📚","📐","📖","🌿","🇬🇧","⚗️","🏛️","⚡","🇫🇷","⚽","🎨","💻","🎵","🌍","📈","🗳️","✝️","📜","🇪🇸","🔬","🎭","📊"];

  return (
    <Modal onClose={onClose} width={560}>
      <ModalHeader title="Neuen Kurs erstellen" onClose={onClose} />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Vorlagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Vorlage wählen</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {KNOWN_FAECHER.map(f => (
              <button key={f} onClick={() => selectVorlage(f)}
                style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${name === f ? (FACH_COLORS[f] || farbe) : t.border}`, background: name === f ? (FACH_COLORS[f] || farbe) + "20" : "transparent", color: name === f ? (FACH_COLORS[f] || farbe) : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {FACH_ICONS[f]} {f}
              </button>
            ))}
          </div>
        </div>

        <Input label="Kursname" value={name} onChange={e => setName(e.target.value)} placeholder="z. B. Mathematik" />
        <Input label="Lehrer (optional)" value={lehrer} onChange={e => setLehrer(e.target.value)} placeholder="z. B. Hr. Hoffmann" />
        <Input label="Raum (optional)" value={raum} onChange={e => setRaum(e.target.value)} placeholder="z. B. 204" />

        {/* Farbe & Icon */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Farbe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="color" value={farbe} onChange={e => setFarbe(e.target.value)}
                style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${t.border}`, cursor: "pointer", padding: 2, background: t.bgSub }} />
              <div style={{ width: 32, height: 32, borderRadius: 8, background: farbe }} />
              <span style={{ fontSize: 13, color: t.textMuted }}>{farbe}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Icon</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {COMMON_ICONS.map(em => (
                <button key={em} onClick={() => setIcon(em)}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${icon === em ? farbe : t.border}`, background: icon === em ? farbe + "20" : "transparent", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: t.bgSub, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${t.border}` }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: farbe + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{name || "Kursname"}</div>
            {lehrer && <div style={{ fontSize: 12, color: t.textMuted }}>{lehrer}</div>}
          </div>
          <div style={{ marginLeft: "auto", width: 12, height: 12, borderRadius: "50%", background: farbe }} />
        </div>

        {/* Zeiten */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Unterrichtszeiten</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setSelDay(d)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${selDay === d ? farbe : t.border}`, background: selDay === d ? farbe + "20" : "transparent", color: selDay === d ? farbe : t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {d}
                </button>
              ))}
            </div>
            <input type="time" value={zeit} onChange={e => setZeit(e.target.value)}
              style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", color: t.text, fontSize: 14, outline: "none" }} />
            <span style={{ fontSize: 12, color: t.textMuted }}>–</span>
            <input type="time" value={zeitEnde} onChange={e => setZeitEnde(e.target.value)}
              style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 10px", color: t.text, fontSize: 14, outline: "none" }} />
            <Btn onClick={addZeit} variant="ghost" style={{ padding: "7px 14px", fontSize: 13 }}>+ Hinzufügen</Btn>
          </div>
          {zeiten.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {zeiten.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)).map(z => (
                <div key={z.day} style={{ display: "flex", alignItems: "center", gap: 6, background: farbe + "20", borderRadius: 8, padding: "5px 10px" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: farbe }}>{z.day} {z.zeit}{z.zeitEnde ? `–${z.zeitEnde}` : ""}</span>
                  <button onClick={() => removeZeit(z.day)} style={{ background: "none", border: "none", color: farbe, cursor: "pointer", fontSize: 12, padding: 0 }}>✕</button>
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