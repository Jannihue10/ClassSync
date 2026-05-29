import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FACH_COLORS, FACH_ICONS } from "../styles/theme";

const MONAT_NAMES = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const DAY_LABELS  = ["Mo","Di","Mi","Do","Fr","Sa","So"];

// "08:00" → minutes from midnight
function parseTime(str) {
  if (!str) return null;
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// Datum parsen – unterstützt "YYYY-MM-DD" (date input) und "DD.MM.YYYY" (legacy)
function parseDatum(datum) {
  if (!datum) return null;
  if (datum.includes("-")) {
    const [y, m, d] = datum.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const parts = datum.split(".");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  return new Date(y, m - 1, d);
}

// Monday of the week containing `date`
function getMondayOfWeek(date) {
  const d = new Date(date);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ISO week number
function getKW(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export default function KalenderView({ klasse, kurse, onClose }) {
  const { t } = useTheme();
  const { profile } = useAuth();

  const [view, setView]           = useState("woche");
  const [pruefungen, setPruefungen] = useState([]);

  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(today));
  const [monat, setMonat]         = useState(today.getMonth());
  const [jahr, setJahr]           = useState(today.getFullYear());

  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));

  // Load Prüfungen live
  useEffect(() => {
    if (!klasse?.id || meineKurse.length === 0) return;
    const unsubs = [];
    meineKurse.forEach(k => {
      const u = onSnapshot(
        collection(db, "klassen", klasse.id, "kurse", k.id, "pruefungen"),
        snap => {
          const prs = snap.docs.map(d => ({
            id: d.id, ...d.data(),
            fach:  k.name,
            farbe: k.farbe || FACH_COLORS[k.name] || "#6366f1",
            kursId: k.id,
          }));
          setPruefungen(prev => [...prev.filter(p => p.kursId !== k.id), ...prs]);
        }
      );
      unsubs.push(u);
    });
    return () => unsubs.forEach(u => u());
  }, [klasse?.id, meineKurse.length]);

  // ── WOCHENANSICHT ──────────────────────────────────────────────
  const DAY_START  = 8 * 60;  // 08:00 fest
  const PX_PER_MIN = 1.9;

  const prevWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); };
  const nextWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); };

  const renderWoche = () => {
    const days = ["Mo","Di","Mi","Do","Fr"].map((label, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return { label, date };
    });

    const friday = new Date(weekStart);
    friday.setDate(weekStart.getDate() + 4);

    // Dynamische Endzeit: späteste zeitEnde aller Kurse, mind. 14:00
    const allSlots = meineKurse.flatMap(k => k.zeiten || []);
    const latestMin = allSlots.reduce((max, z) => {
      const m = parseTime(z.zeitEnde);
      return m && m > max ? m : max;
    }, 14 * 60);
    const DAY_END     = latestMin + 30; // 30 min Puffer
    const totalHeight = (DAY_END - DAY_START) * PX_PER_MIN;
    const hourMarkers = [];
    for (let h = 8; h * 60 <= DAY_END; h++) hourMarkers.push(h);

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "24px 32px 0" }}>

        {/* Navigation – bleibt sichtbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexShrink: 0 }}>
          <NavBtn onClick={prevWeek} t={t}>← Vorherige</NavBtn>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>
            KW {getKW(weekStart)} · {weekStart.getDate()}. {MONAT_NAMES[weekStart.getMonth()]} – {friday.getDate()}. {MONAT_NAMES[friday.getMonth()]} {friday.getFullYear()}
          </div>
          <NavBtn onClick={nextWeek} t={t}>Nächste →</NavBtn>
        </div>

        {/* Tages-Header + scrollbares Raster */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tages-Header – bleibt sichtbar */}
          <div style={{ display: "flex", flexShrink: 0, paddingRight: 8, paddingBottom: 5 }}>
            <div style={{ width: 44, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {days.map(({ label, date }) => {
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div key={label} style={{
                    textAlign: "center", padding: "8px 4px",
                    borderRadius: 10,
                    background: isToday ? t.accent : "transparent",
                    color: isToday ? t.accentFg : t.textSub,
                    height: 44, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.7 }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{date.getDate()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrollbares Raster */}
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
            <div style={{ display: "flex", gap: 0, minWidth: 0, paddingTop: 8 }}>

              {/* Zeitachse */}
              <div style={{ width: 44, flexShrink: 0, position: "relative" }}>
                <div style={{ position: "relative", height: totalHeight }}>
                  {hourMarkers.map(h => (
                    <div key={h} style={{
                      position: "absolute",
                      top: (h * 60 - DAY_START) * PX_PER_MIN - 7,
                      right: 8,
                      fontSize: 10,
                      color: t.textMuted,
                      fontWeight: 500,
                    }}>
                      {h}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag-Spalten */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                {days.map(({ label, date }) => {
                  const isToday = date.toDateString() === today.toDateString();
                  const slots = meineKurse.flatMap(k =>
                    (k.zeiten || []).filter(z => z.day === label).map(z => ({ ...z, kurs: k }))
                  );

                  return (
                    <div key={label}>
                      {/* Zeit-Spalte */}
                      <div style={{
                        position: "relative", height: totalHeight,
                        background: t.bgSub, borderRadius: 10,
                        border: `1px solid ${isToday ? t.accent + "44" : t.border}`,
                        overflow: "hidden",
                      }}>
                        {/* Stundenlinien */}
                        {hourMarkers.map(h => (
                          <div key={h} style={{
                            position: "absolute",
                            top: (h * 60 - DAY_START) * PX_PER_MIN,
                            left: 0, right: 0,
                            borderTop: `1px solid ${t.border}`,
                            opacity: 0.6,
                          }} />
                        ))}

                        {/* Kursblöcke */}
                        {slots.map((s, i) => {
                          const startMin = parseTime(s.zeit);
                          const endMin   = s.zeitEnde ? parseTime(s.zeitEnde) : (startMin ? startMin + 45 : null);
                          if (startMin === null) return null;
                          const top    = (startMin - DAY_START) * PX_PER_MIN;
                          const height = Math.max((endMin - startMin) * PX_PER_MIN, 28);
                          const color  = s.kurs.farbe || FACH_COLORS[s.kurs.name] || "#6366f1";
                          const icon   = s.kurs.icon  || FACH_ICONS[s.kurs.name]  || "📚";

                          return (
                            <div key={i} style={{
                              position: "absolute",
                              top: top + 1, left: 3, right: 3,
                              height: height - 2,
                              background: color,
                              borderRadius: 6,
                              padding: "5px 7px",
                              overflow: "hidden",
                              cursor: "default",
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                                {icon} {s.kurs.name}
                              </div>
                              {height > 36 && (
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 1 }}>
                                  {s.zeit}{s.zeitEnde ? `–${s.zeitEnde}` : ""}
                                  {s.kurs.raum ? ` · R.${s.kurs.raum}` : ""}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── MONATSANSICHT ──────────────────────────────────────────────
  const prevMonat = () => { if (monat === 0) { setMonat(11); setJahr(j => j - 1); } else setMonat(m => m - 1); };
  const nextMonat = () => { if (monat === 11) { setMonat(0); setJahr(j => j + 1); } else setMonat(m => m + 1); };

  const renderMonat = () => {
    const firstDay = new Date(jahr, monat, 1);
    const lastDay  = new Date(jahr, monat + 1, 0);

    // Monday-based offset
    let firstDow = firstDay.getDay() - 1;
    if (firstDow < 0) firstDow = 6;

    const days = [];
    for (let i = 0; i < firstDow; i++) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - (firstDow - i));
      days.push({ date: d, currentMonth: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(jahr, monat, d), currentMonth: true });
    }
    const rem = 7 - (days.length % 7);
    if (rem < 7) {
      for (let i = 1; i <= rem; i++) {
        days.push({ date: new Date(jahr, monat + 1, i), currentMonth: false });
      }
    }

    // Index Prüfungen by date string
    const prByDate = {};
    console.log("pruefungen:", pruefungen); // DEBUG
    pruefungen.forEach(p => {
      const d = parseDatum(p.datum);
      if (!d) return;
      const key = d.toDateString();
      if (!prByDate[key]) prByDate[key] = [];
      prByDate[key].push(p);
    });

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 40px" }}>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <NavBtn onClick={prevMonat} t={t}>← Vorheriger</NavBtn>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>{MONAT_NAMES[monat]} {jahr}</div>
          <NavBtn onClick={nextMonat} t={t}>Nächster →</NavBtn>
        </div>

        {/* Weekday headers */}
        <div style={{ display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", marginBottom: 4 }}>
          <div />
          {DAY_LABELS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: t.textMuted, padding: "6px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar rows */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", borderBottom: wi < weeks.length - 1 ? `1px solid ${t.border}` : "none" }}>
              {/* KW */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10, fontSize: 10, color: t.textMuted, fontWeight: 600, borderRight: `1px solid ${t.border}`, background: t.bgSub }}>
                {getKW(week[0].date)}
              </div>

              {/* Day cells */}
              {week.map(({ date, currentMonth }, di) => {
                const isToday   = date.toDateString() === today.toDateString();
                const dayPrs    = prByDate[date.toDateString()] || [];
                const isWeekend = di >= 5;

                return (
                  <div key={di} style={{
                    minHeight: 90,
                    padding: "8px 6px",
                    borderLeft: di > 0 ? `1px solid ${t.border}` : "none",
                    background: isToday ? t.accent + "0d" : isWeekend ? t.bgSub + "80" : "transparent",
                  }}>
                    {/* Day number */}
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: isToday ? t.accent : "transparent",
                      color: isToday ? t.accentFg : currentMonth ? t.text : t.textMuted,
                      fontSize: 13, fontWeight: isToday ? 700 : 400,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 4,
                    }}>
                      {date.getDate()}
                    </div>

                    {/* Prüfungen */}
                    {dayPrs.map((p, i) => (
                      <div key={i} title={`${p.fach}: ${p.titel}`} style={{
                        background: (p.farbe || "#6366f1") + "22",
                        borderLeft: `3px solid ${p.farbe || "#6366f1"}`,
                        borderRadius: 4,
                        padding: "3px 6px",
                        marginBottom: 3,
                        fontSize: 11,
                        color: t.text,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "default",
                      }}>
                        {p.fach} · {p.titel}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        {pruefungen.length > 0 && (
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[...new Map(pruefungen.map(p => [p.kursId, p])).values()].map(p => (
              <div key={p.kursId} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: t.textSub }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: p.farbe || "#6366f1" }} />
                {p.fach}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", background: t.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        padding: "0 32px", height: 60, flexShrink: 0,
        borderBottom: `1px solid ${t.border}`,
        background: t.bgCard,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <button onClick={onClose} style={{
          background: t.bgSub, border: `1px solid ${t.border}`,
          borderRadius: 8, padding: "7px 14px",
          color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          ← Zurück
        </button>

        <div style={{ fontSize: 17, fontWeight: 700, color: t.text, flex: 1 }}>Kalender</div>

        {/* Woche / Monat toggle */}
        <div style={{ display: "flex", background: t.bgSub, borderRadius: 10, padding: 3, border: `1px solid ${t.border}` }}>
          {[["woche","Woche"], ["monat","Monat"]].map(([val, label]) => (
            <button key={val} onClick={() => setView(val)} style={{
              padding: "6px 20px", borderRadius: 8, border: "none",
              background: view === val ? t.bgCard : "transparent",
              color: view === val ? t.text : t.textMuted,
              fontSize: 13, fontWeight: view === val ? 600 : 400,
              cursor: "pointer",
              boxShadow: view === val ? t.shadow : "none",
              transition: "all .15s",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Heute */}
        <button onClick={() => { setWeekStart(getMondayOfWeek(today)); setMonat(today.getMonth()); setJahr(today.getFullYear()); }} style={{
          background: t.bgSub, border: `1px solid ${t.border}`,
          borderRadius: 8, padding: "7px 14px",
          color: t.textSub, fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>
          Heute
        </button>
      </div>

      {view === "woche" ? renderWoche() : renderMonat()}
    </div>
  );
}

// Kleine Hilfskomponente für die Nav-Buttons
function NavBtn({ onClick, children, t }) {
  return (
    <button onClick={onClick} style={{
      background: t.bgSub, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: "7px 14px",
      color: t.textSub, fontSize: 13, cursor: "pointer",
    }}>
      {children}
    </button>
  );
}
