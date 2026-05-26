import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Btn, SectionTitle } from "./UI";
import { FACH_COLORS } from "../styles/theme";

function calcTage(datum) {
  if (!datum) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(datum);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export default function OverviewPanel({ klasse, kurse, onClose }) {
  const { t } = useTheme();
  const { profile } = useAuth();

  const [allHAs, setAllHAs] = useState([]);
  const [allPrs, setAllPrs] = useState([]);

  // Only load subcollections for kurse the user is a member of
  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));

  useEffect(() => {
    if (!klasse || meineKurse.length === 0) return;

    const unsubs = [];

    meineKurse.forEach(k => {
      // Hausaufgaben
      const u1 = onSnapshot(
        collection(db, "klassen", klasse.id, "kurse", k.id, "hausaufgaben"),
        snap => {
          const has = snap.docs.map(d => ({ id: d.id, ...d.data(), fach: k.name })).filter(h => !h.doneBy?.includes(profile.uid));
          setAllHAs(prev => {
            const others = prev.filter(h => h.kursId !== k.id);
            return [...others, ...has.map(h => ({ ...h, kursId: k.id }))];
          });
        }
      );
      // Prüfungen
      const u2 = onSnapshot(
        collection(db, "klassen", klasse.id, "kurse", k.id, "pruefungen"),
        snap => {
          const prs = snap.docs.map(d => ({ id: d.id, ...d.data(), fach: k.name }));
          setAllPrs(prev => {
            const others = prev.filter(p => p.kursId !== k.id);
            return [...others, ...prs.map(p => ({ ...p, kursId: k.id }))];
          });
        }
      );
      unsubs.push(u1, u2);
    });

    return () => unsubs.forEach(u => u());
  }, [klasse?.id, meineKurse.length]);

  const sortedPrs = [...allPrs].sort((a, b) => (calcTage(a.datum) ?? 999) - (calcTage(b.datum) ?? 999));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.3)" }} />
      <div style={{ width: 340, background: t.bgCard, height: "100%", borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Übersicht</div>
          <Btn variant="ghost" onClick={onClose} style={{ padding: "5px 9px", fontSize: 13 }}>✕</Btn>
        </div>

        {/* Klasse info */}
        {klasse && (
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
            <SectionTitle>Deine Klasse</SectionTitle>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{klasse.name}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, fontFamily: "monospace", letterSpacing: 2 }}>Code: {klasse.code}</div>
          </div>
        )}

        {/* Hausaufgaben */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
          <SectionTitle>Offene Hausaufgaben ({allHAs.length})</SectionTitle>
          {allHAs.length === 0
            ? <div style={{ fontSize: 13, color: t.textMuted }}>Alle erledigt ✅</div>
            : allHAs.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${t.borderSub}` }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: FACH_COLORS[h.fach] || t.accent, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.text}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{h.fach}</div>
                </div>
                {h.faellig && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: t.warning + "20", color: t.warning, whiteSpace: "nowrap" }}>
                    {h.faellig}
                  </span>
                )}
              </div>
            ))
          }
        </div>

        {/* Prüfungen */}
        <div style={{ padding: "16px 24px" }}>
          <SectionTitle>Prüfungen ({sortedPrs.length})</SectionTitle>
          {sortedPrs.length === 0
            ? <div style={{ fontSize: 13, color: t.textMuted }}>Keine eingetragen</div>
            : sortedPrs.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.borderSub}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: FACH_COLORS[p.fach] || t.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{calcTage(p.datum) ?? "?"}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.titel}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{p.fach} · {p.datum}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}