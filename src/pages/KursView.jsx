import { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, getDocs,
  doc, serverTimestamp, arrayUnion, arrayRemove, query, orderBy,
} from "firebase/firestore";
import { ref as sRef, deleteObject } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Btn, Empty, Pill, Modal, ModalHeader, Input } from "../components/UI";
import UploadModal from "../components/UploadModal";
import EditKursModal from "../components/EditKursModal";
import { FACH_COLORS, FACH_ICONS, MAT_TYPEN, MAT_COLORS } from "../styles/theme";

// ── Material Viewer ────────────────────────────────────────────────────────────
function MaterialViewer({ mat, klasseId, kursId, onClose, isAdmin }) {
  const { profile } = useAuth();
  const { t } = useTheme();
  const col = MAT_COLORS[mat.typ] || t.accent;
  const hasLiked = mat.likes?.includes(profile.uid);

  const toggleLike = async () => {
    const r = doc(db, "klassen", klasseId, "kurse", kursId, "materialien", mat.id);
    await updateDoc(r, { likes: hasLiked ? arrayRemove(profile.uid) : arrayUnion(profile.uid) });
  };

  const deleteMat = async () => {
    if (!window.confirm("Material wirklich löschen?")) return;
    if (mat.storagePath) {
      try { await deleteObject(sRef(storage, mat.storagePath)); } catch (e) {}
    }
    await deleteDoc(doc(db, "klassen", klasseId, "kurse", kursId, "materialien", mat.id));
    onClose();
  };

  return (
    <Modal onClose={onClose} width={680}>
      <ModalHeader title={mat.titel} onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill label={mat.typ} color={col} />
          <span style={{ fontSize: 12, color: t.textMuted }}>{mat.autor} · {mat.dateiTyp}</span>
        </div>
        {mat.beschreibung && <div style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6 }}>{mat.beschreibung}</div>}
        <div style={{ background: t.bgSub, borderRadius: 12, minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.border}`, overflow: "hidden" }}>
          {mat.dateiUrl ? (
            mat.dateiTyp === "PDF"
              ? <iframe src={mat.dateiUrl} style={{ width: "100%", height: 400, border: "none" }} title={mat.titel} />
              : <img src={mat.dateiUrl} alt={mat.titel} style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }} />
          ) : (
            <div style={{ textAlign: "center", color: t.textMuted, padding: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
              <div style={{ fontSize: 14 }}>Nur Textbeschreibung – keine Datei angehängt</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn onClick={toggleLike} variant={hasLiked ? "success" : "ghost"} style={{ fontSize: 13 }}>
            ⭐ {mat.likes?.length || 0} {hasLiked ? "Danke gegeben" : "Danke sagen"}
          </Btn>
          {mat.dateiUrl && (
            <a href={mat.dateiUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Btn variant="ghost" style={{ fontSize: 13 }}>⬇ Herunterladen</Btn>
            </a>
          )}
          {(isAdmin || mat.autorId === profile.uid) && (
            <Btn onClick={deleteMat} variant="danger" style={{ fontSize: 13, marginLeft: "auto" }}>🗑 Löschen</Btn>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ── HA Modal ──────────────────────────────────────────────────────────────────
function AddHAModal({ klasseId, kursId, onClose }) {
  const { profile } = useAuth();
  const [text, setText]       = useState("");
  const [faellig, setFaellig] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "klassen", klasseId, "kurse", kursId, "hausaufgaben"), {
      text: text.trim(), faellig, done: false,
      autor: profile.nickname, createdAt: serverTimestamp(),
    });
    setLoading(false); onClose();
  };

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title="Hausaufgabe eintragen" onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Aufgabe" value={text} onChange={e => setText(e.target.value)} placeholder="z. B. S. 87 Aufgaben 3–7" />
        <Input label="Fällig am" type="date" value={faellig} onChange={e => setFaellig(e.target.value)} />
        <Btn onClick={submit} disabled={loading || !text.trim()} full>Eintragen →</Btn>
      </div>
    </Modal>
  );
}

// ── Prüfung Modal ─────────────────────────────────────────────────────────────
function AddPruefungModal({ klasseId, kursId, onClose }) {
  const { profile } = useAuth();
  const [titel, setTitel] = useState("");
  const [datum, setDatum] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!titel.trim() || !datum) return;
    setLoading(true);
    const tage = Math.ceil((new Date(datum) - new Date()) / (1000 * 60 * 60 * 24));
    await addDoc(collection(db, "klassen", klasseId, "kurse", kursId, "pruefungen"), {
      titel: titel.trim(), datum, tage,
      autor: profile.nickname, createdAt: serverTimestamp(),
    });
    setLoading(false); onClose();
  };

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title="Prüfung eintragen" onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Titel" value={titel} onChange={e => setTitel(e.target.value)} placeholder="z. B. Klausur Analysis" />
        <Input label="Datum" type="date" value={datum} onChange={e => setDatum(e.target.value)} />
        <Btn onClick={submit} disabled={loading || !titel.trim() || !datum} full>Eintragen →</Btn>
      </div>
    </Modal>
  );
}

// ── Main KursView ─────────────────────────────────────────────────────────────
export default function KursView({ kurs, klasseId, onBack }) {
  const { profile, updateProfile } = useAuth();
  const { t } = useTheme();

  const [tab, setTab]           = useState("material");
  const [filter, setFilter]     = useState("Alle");
  const [materialien, setMats]  = useState([]);
  const [hausaufgaben, setHAs]  = useState([]);
  const [pruefungen, setPrs]    = useState([]);
  const [chatMsgs, setChat]     = useState([]);
  const [viewerId, setViewerId] = useState(null);
  const viewer = materialien.find(m => m.id === viewerId) || null;
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing]     = useState(false);
  const [addingHA, setAddingHA]   = useState(false);
  const [addingPr, setAddingPr]   = useState(false);
  const [msgIn, setMsgIn]         = useState("");
  const chatRef = useRef(null);

  // Use custom farbe/icon if set, otherwise fall back to defaults
  const col      = kurs.farbe || FACH_COLORS[kurs.name] || t.accent;
  const kursIcon = kurs.icon  || FACH_ICONS[kurs.name]  || "📚";

  const isMember      = profile?.kurseIds?.includes(kurs.id);
  const isKlasseAdmin = profile?.rolle === "admin";
  const isKursAdmin   = kurs.adminId === profile?.uid;
  const canEdit       = isKlasseAdmin || isKursAdmin;

  useEffect(() => {
    const base = `klassen/${klasseId}/kurse/${kurs.id}`;
    const u1 = onSnapshot(query(collection(db, base, "materialien"), orderBy("createdAt", "desc")), s => setMats(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(collection(db, base, "hausaufgaben"), s => setHAs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(collection(db, base, "pruefungen"), s => setPrs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u4 = onSnapshot(query(collection(db, base, "chat"), orderBy("createdAt", "asc")), s => {
      setChat(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 50);
    });
    return () => { u1(); u2(); u3(); u4(); };
  }, [kurs.id, klasseId]);

  const joinKurs = async () => {
    await updateDoc(doc(db, "users", profile.uid), { kurseIds: arrayUnion(kurs.id) });
    await updateProfile({ kurseIds: [...(profile.kurseIds || []), kurs.id] });
  };

  const leaveKurs = async () => {
    if (!window.confirm("Kurs wirklich verlassen?")) return;
    await updateDoc(doc(db, "users", profile.uid), { kurseIds: arrayRemove(kurs.id) });
    await updateProfile({ kurseIds: (profile.kurseIds || []).filter(id => id !== kurs.id) });
    onBack();
  };

  const deleteKurs = async () => {
    if (!window.confirm(`Kurs "${kurs.name}" wirklich löschen?`)) return;
    for (const sub of ["materialien", "hausaufgaben", "pruefungen", "chat"]) {
      const snap = await getDocs(collection(db, "klassen", klasseId, "kurse", kurs.id, sub));
      for (const d of snap.docs) {
        if (sub === "materialien" && d.data().storagePath) {
          try { await deleteObject(sRef(storage, d.data().storagePath)); } catch (e) {}
        }
        await deleteDoc(d.ref);
      }
    }
    await deleteDoc(doc(db, "klassen", klasseId, "kurse", kurs.id));
    onBack();
  };

  const toggleHA = async (ha) => {
    await updateDoc(doc(db, "klassen", klasseId, "kurse", kurs.id, "hausaufgaben", ha.id), { done: !ha.done });
  };

  const sendMsg = async () => {
    if (!msgIn.trim()) return;
    await addDoc(collection(db, "klassen", klasseId, "kurse", kurs.id, "chat"), {
      text: msgIn.trim(), autor: profile.nickname,
      autorId: profile.uid, createdAt: serverTimestamp(),
    });
    setMsgIn("");
  };

  const filteredMats = filter === "Alle" ? materialien : materialien.filter(m => m.typ === filter);

  const TABS = [
    { id: "material",     label: "📁 Materialien",   count: materialien.length },
    { id: "hausaufgaben", label: "📋 Hausaufgaben",   count: hausaufgaben.filter(h => !h.done).length || null },
    { id: "chat",         label: "💬 Chat",           count: null },
    { id: "pruefungen",   label: "📝 Prüfungen",      count: pruefungen.length || null },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {viewer   && <MaterialViewer mat={viewer} klasseId={klasseId} kursId={kurs.id} onClose={() => setViewerId(null)} isAdmin={canEdit} />}
      {uploading && <UploadModal klasseId={klasseId} kursId={kurs.id} kursName={kurs.name} onClose={() => setUploading(false)} onUploaded={() => {}} />}
      {editing   && <EditKursModal kurs={kurs} klasseId={klasseId} onClose={() => setEditing(false)} onSaved={() => setEditing(false)} />}
      {addingHA  && <AddHAModal klasseId={klasseId} kursId={kurs.id} onClose={() => setAddingHA(false)} />}
      {addingPr  && <AddPruefungModal klasseId={klasseId} kursId={kurs.id} onClose={() => setAddingPr(false)} />}

      {/* Header */}
      <div style={{ background: t.bgCard, padding: "16px 28px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <Btn variant="ghost" onClick={onBack} style={{ padding: "6px 12px", fontSize: 13 }}>←</Btn>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {kursIcon}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{kurs.name}</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>
            {kurs.lehrer && `${kurs.lehrer} · `}{kurs.raum && `R. ${kurs.raum} · `}{materialien.length} Materialien
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {isMember ? (
            <>
              <Btn onClick={() => setUploading(true)} style={{ fontSize: 13, padding: "7px 14px" }}>+ Hochladen</Btn>
              <Btn onClick={leaveKurs} variant="ghost" style={{ fontSize: 13, padding: "7px 14px" }}>Verlassen</Btn>
            </>
          ) : (
            <Btn onClick={joinKurs} variant="success" style={{ fontSize: 13, padding: "7px 14px" }}>+ Beitreten</Btn>
          )}
          {canEdit && <>
            <Btn onClick={() => setEditing(true)} variant="ghost" style={{ fontSize: 13, padding: "7px 14px" }}>✏️ Bearbeiten</Btn>
            <Btn onClick={deleteKurs} variant="danger" style={{ fontSize: 13, padding: "7px 14px" }}>🗑</Btn>
          </>}
        </div>
      </div>

      {!isMember && (
        <div style={{ background: t.warning + "18", borderBottom: `1px solid ${t.warning}33`, padding: "10px 28px", fontSize: 13, color: t.warning, fontWeight: 500 }}>
          Du bist diesem Kurs noch nicht beigetreten. Tritt bei um Materialien hochzuladen und am Chat teilzunehmen.
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: t.bgCard, borderBottom: `1px solid ${t.border}`, display: "flex", padding: "0 28px", flexShrink: 0 }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{ padding: "12px 16px", border: "none", borderBottom: `2px solid ${tab === tb.id ? col : "transparent"}`, background: "transparent", fontSize: 13, fontWeight: tab === tb.id ? 600 : 400, color: tab === tb.id ? col : t.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "color .15s" }}>
            {tb.label}
            {tb.count > 0 && <span style={{ background: tab === tb.id ? col + "25" : t.bgSub, color: tab === tb.id ? col : t.textMuted, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20 }}>{tb.count}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: tab === "chat" ? "hidden" : "auto", padding: tab === "chat" ? 0 : 28, display: tab === "chat" ? "flex" : "block", flexDirection: "column" }}>

        {/* ── MATERIALIEN ── */}
        {tab === "material" && <>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["Alle", ...MAT_TYPEN].map(tp => (
              <button key={tp} onClick={() => setFilter(tp)}
                style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${filter === tp ? (MAT_COLORS[tp] || col) : t.border}`, background: filter === tp ? (MAT_COLORS[tp] || col) + "18" : "transparent", color: filter === tp ? (MAT_COLORS[tp] || col) : t.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
                {tp}
              </button>
            ))}
          </div>
          {filteredMats.length === 0
            ? <Empty icon="📭" text="Noch keine Materialien" />
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {filteredMats.map(m => {
                const mc = MAT_COLORS[m.typ] || col;
                const hasLiked = m.likes?.includes(profile.uid);
                return (
                  <div key={m.id} onClick={() => setViewerId(m.id)}
                    style={{ background: t.bgCard, borderRadius: 14, padding: 18, cursor: "pointer", border: `1px solid ${t.border}`, transition: "all .15s", display: "flex", flexDirection: "column", gap: 12 }}
                    onMouseOver={e => { e.currentTarget.style.background = t.bgHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: mc + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {m.dateiTyp === "PDF" ? "📄" : m.dateiTyp === "Bild" ? "🖼" : "📝"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.titel}</div>
                        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{m.autor}</div>
                      </div>
                    </div>
                    {m.beschreibung && <div style={{ fontSize: 12, color: t.textSub, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{m.beschreibung}</div>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ background: mc + "18", color: mc, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{m.typ}</span>
                      <span style={{ fontSize: 12, color: hasLiked ? t.success : t.textMuted, fontWeight: 600 }}>⭐ {m.likes?.length || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </>}

        {/* ── HAUSAUFGABEN ── */}
        {tab === "hausaufgaben" && (
          <div style={{ maxWidth: 580, display: "flex", flexDirection: "column", gap: 10 }}>
            {isMember && <div style={{ marginBottom: 8 }}><Btn onClick={() => setAddingHA(true)} style={{ fontSize: 13 }}>+ HA eintragen</Btn></div>}
            {hausaufgaben.length === 0
              ? <Empty icon="✅" text="Keine Hausaufgaben!" />
              : hausaufgaben.map(h => (
                <div key={h.id} style={{ background: t.bgCard, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${t.border}` }}>
                  <div onClick={() => isMember && toggleHA(h)}
                    style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${h.done ? t.success : t.border}`, background: h.done ? t.success : "transparent", cursor: isMember ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                    {h.done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: h.done ? t.textMuted : t.text, textDecoration: h.done ? "line-through" : "none" }}>{h.text}</div>
                    {h.faellig && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Fällig: {h.faellig}</div>}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 7, background: h.done ? t.success + "20" : t.warning + "20", color: h.done ? t.success : t.warning }}>
                    {h.done ? "Erledigt" : h.faellig || "—"}
                  </span>
                </div>
              ))
            }
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === "chat" && (
          <>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMsgs.length === 0 && <Empty icon="💬" text="Noch keine Nachrichten" />}
              {chatMsgs.map(m => {
                const own = m.autorId === profile.uid;
                return (
                  <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 3, alignSelf: own ? "flex-end" : "flex-start", maxWidth: "60%" }}>
                    {!own && <div style={{ fontSize: 11, color: t.textMuted, paddingLeft: 4 }}>{m.autor}</div>}
                    <div style={{ background: own ? col : t.bgSub, color: own ? "#fff" : t.text, borderRadius: own ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "9px 14px", fontSize: 14, lineHeight: 1.4, border: own ? "none" : `1px solid ${t.border}` }}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 28px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 10, background: t.bgCard, flexShrink: 0 }}>
              <input value={msgIn} onChange={e => setMsgIn(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), isMember && sendMsg())}
                placeholder={isMember ? "Nachricht…" : "Kurs beitreten um zu schreiben"}
                disabled={!isMember}
                style={{ flex: 1, background: t.bgSub, border: `1px solid ${t.border}`, borderRadius: 24, padding: "9px 16px", color: t.text, fontSize: 14, outline: "none" }} />
              <button onClick={sendMsg} disabled={!isMember || !msgIn.trim()}
                style={{ width: 40, height: 40, borderRadius: "50%", background: isMember && msgIn.trim() ? col : t.bgSub, border: "none", color: isMember && msgIn.trim() ? "#fff" : t.textMuted, fontSize: 17, cursor: isMember ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .15s" }}>
                ↑
              </button>
            </div>
          </>
        )}

        {/* ── PRÜFUNGEN ── */}
        {tab === "pruefungen" && (
          <div style={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 10 }}>
            {isMember && <div style={{ marginBottom: 8 }}><Btn onClick={() => setAddingPr(true)} style={{ fontSize: 13 }}>+ Prüfung eintragen</Btn></div>}
            {pruefungen.length === 0
              ? <Empty icon="🎉" text="Keine Prüfungen eingetragen" />
              : pruefungen.map(p => (
                <div key={p.id} style={{ background: t.bgCard, borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, border: `1px solid ${t.border}`, borderLeft: `3px solid ${col}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{p.tage}</span>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.75)" }}>Tage</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{p.titel}</div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>📅 {p.datum}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: "50%", background: p.tage <= 7 ? t.danger : p.tage <= 14 ? t.warning : t.success }} />
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}