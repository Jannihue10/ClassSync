import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Modal, ModalHeader, Input, Btn } from "./UI";
import { MAT_TYPEN, MAT_COLORS, FACH_COLORS, FACH_ICONS } from "../styles/theme";

const MAX_MB = 10;

export default function UploadModal({ klasseId, kursId, kursName, kurse = [], onClose, onUploaded }) {
  const { profile } = useAuth();
  const { t } = useTheme();

  const [selKurs, setSelKurs]   = useState(kursId || kurse[0]?.id || "");
  const kursNameSel = kurse.find(k => k.id === selKurs)?.name || kursName || "";

  const [typ, setTyp]           = useState(MAT_TYPEN[0]);
  const [titel, setTitel]       = useState("");
  const [beschr, setBeschr]     = useState("");
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr]           = useState("");

  const handleFile = (f) => {
    if (f.size > MAX_MB * 1024 * 1024) { setErr(`Datei zu groß (max. ${MAX_MB} MB).`); return; }
    setFile(f); setErr("");
  };

  const submit = async () => {
    if (!titel.trim()) return setErr("Bitte einen Titel eingeben.");
    const targetKursId = selKurs || kursId;
    if (!targetKursId) return setErr("Bitte einen Kurs auswählen.");
    setLoading(true); setErr("");

    try {
      let dateiUrl = null;
      let dateiTyp = "Notiz";
      let storagePath = null;

      if (file) {
        setProgress("Datei wird hochgeladen…");
        storagePath = `klassen/${klasseId}/kurse/${targetKursId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        dateiUrl = await getDownloadURL(storageRef);
        dateiTyp = file.type.includes("pdf") ? "PDF" : "Bild";
      }

      setProgress("Wird gespeichert…");
      await addDoc(collection(db, "klassen", klasseId, "kurse", targetKursId, "materialien"), {
        typ, titel: titel.trim(),
        beschreibung: beschr.trim(),
        dateiUrl,
        storagePath: storagePath,
        dateiTyp,
        autor:    profile.nickname,
        autorId:  profile.uid,
        likes:    [],
        createdAt: serverTimestamp(),
      });

      onUploaded?.();
      onClose();
    } catch (e) {
      console.error(e);
      setErr("Fehler beim Hochladen. Bitte nochmal versuchen.");
    } finally {
      setLoading(false); setProgress("");
    }
  };

  const col = MAT_COLORS[typ] || t.accent;

  return (
    <Modal onClose={onClose} width={520}>
      <ModalHeader title="Material hochladen" onClose={onClose} />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Kurs picker (only shown if multiple kurse passed) */}
        {kurse.length > 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Kurs</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {kurse.map(k => (
                <button key={k.id} onClick={() => setSelKurs(k.id)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${selKurs === k.id ? (FACH_COLORS[k.name] || t.accent) : t.border}`, background: selKurs === k.id ? (FACH_COLORS[k.name] || t.accent) + "20" : "transparent", color: selKurs === k.id ? (FACH_COLORS[k.name] || t.accent) : t.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {FACH_ICONS[k.name]} {k.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Typ</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MAT_TYPEN.map(tp => (
              <button key={tp} onClick={() => setTyp(tp)}
                style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${typ === tp ? (MAT_COLORS[tp] || t.accent) : t.border}`, background: typ === tp ? (MAT_COLORS[tp] || t.accent) + "20" : "transparent", color: typ === tp ? (MAT_COLORS[tp] || t.accent) : t.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {tp}
              </button>
            ))}
          </div>
        </div>

        <Input label="Titel" value={titel} onChange={e => setTitel(e.target.value)} placeholder="z. B. Mitschrift vom 14.05." />
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Beschreibung (optional)</label>
          <textarea value={beschr} onChange={e => setBeschr(e.target.value)} rows={2} placeholder="Kurze Beschreibung…"
            style={{ background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 14, outline: "none", resize: "none" }} />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => document.getElementById("cs-file-input").click()}
          style={{ border: `2px dashed ${dragging ? col : t.border}`, borderRadius: 12, padding: "24px 16px", textAlign: "center", cursor: "pointer", background: dragging ? col + "10" : t.bgSub, transition: "all .2s" }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>{file ? "✅" : "📎"}</div>
          <div style={{ fontSize: 13, color: file ? t.success : t.textMuted, fontWeight: 500 }}>
            {file ? file.name : `PDF oder Bild ablegen (max. ${MAX_MB} MB) – oder klicken`}
          </div>
          <input id="cs-file-input" type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>

        {err && <div style={{ fontSize: 13, color: t.danger }}>{err}</div>}
        {progress && <div style={{ fontSize: 13, color: t.textMuted }}>{progress}</div>}

        <Btn onClick={submit} disabled={loading || !titel.trim()} full>
          {loading ? progress || "Wird hochgeladen…" : "Hochladen →"}
        </Btn>
      </div>
    </Modal>
  );
}