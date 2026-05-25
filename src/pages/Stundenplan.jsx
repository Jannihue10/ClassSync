import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Empty } from "../components/UI";
import { DAYS, DAY_FULL, FACH_COLORS, FACH_ICONS } from "../styles/theme";

export default function Stundenplan({ kurse, onOpenKurs, onCreateKurs, onOpenKalendar }) {
  const { t } = useTheme();
  const { profile } = useAuth();

  // Current weekday (0=Sun … 6=Sat → map to Mo-Fr)
  const jsDay = new Date().getDay();
  const dayMap = { 1: "Mo", 2: "Di", 3: "Mi", 4: "Do", 5: "Fr" };
  const [day, setDay] = useState(dayMap[jsDay] || "Mo");

  // Filter: only courses the user has joined
  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));

  // Slots for selected day
  const slots = meineKurse
    .flatMap(k => (k.zeiten || []).filter(z => z.day === day).map(z => ({ ...z, kurs: k })))
    .sort((a, b) => a.zeit.localeCompare(b.zeit));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: t.text }}>Stundenplan</div>
        <button onClick={onOpenKalendar} style={{
          background: t.bgSub, border: `1px solid ${t.border}`,
          borderRadius: 8, padding: "7px 14px",
          color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          📅 Kalender
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {DAYS.map(d => (
            <button key={d} onClick={() => setDay(d)}
              style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${day === d ? t.accent : t.border}`, background: day === d ? t.accent : "transparent", color: day === d ? t.accentFg : t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Slots */}
      {meineKurse.length === 0 ? (
        <Empty icon="📚" text="Du bist noch keinem Kurs beigetreten. Tritt einem Kurs bei oder erstelle einen neuen." />
      ) : slots.length === 0 ? (
        <Empty icon="😎" text={`Kein Unterricht ${DAY_FULL[day]}`} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginBottom: 48 }}>
          {slots.map((s, i) => {
            const col = FACH_COLORS[s.kurs.name] || t.accent;
            return (
              <div key={i} onClick={() => onOpenKurs(s.kurs)}
                style={{ background: t.bgCard, borderRadius: 14, padding: 20, cursor: "pointer", border: `1px solid ${t.border}`, borderTop: `3px solid ${col}`, transition: "all .15s", boxShadow: t.shadow }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.shadowMd; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.shadow; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {FACH_ICONS[s.kurs.name] || "📚"}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{s.kurs.name}</div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>{s.zeit}{s.kurs.raum ? ` · R. ${s.kurs.raum}` : ""}</div>
                  </div>
                </div>
                {s.kurs.lehrer && <div style={{ fontSize: 12, color: t.textMuted }}>{s.kurs.lehrer}</div>}
                <div style={{ fontSize: 12, color: col, fontWeight: 600, marginTop: 10 }}>Öffnen →</div>
              </div>
            );
          })}
        </div>
      )}

      {/* All joined courses */}
      <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Alle meine Kurse</div>
      {meineKurse.length === 0
        ? <Empty icon="📖" text="Noch keine Kurse beigetreten." />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 32 }}>
          {meineKurse.map(k => {
            const col = FACH_COLORS[k.name] || t.accent;
            return (
              <div key={k.id} onClick={() => onOpenKurs(k)}
                style={{ background: t.bgCard, borderRadius: 12, padding: 16, cursor: "pointer", border: `1px solid ${t.border}`, transition: "all .15s", display: "flex", flexDirection: "column", gap: 8 }}
                onMouseOver={e => e.currentTarget.style.background = t.bgHover}
                onMouseOut={e => e.currentTarget.style.background = t.bgCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{FACH_ICONS[k.name] || "📚"}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{k.name}</span>
                </div>
                {k.lehrer && <div style={{ fontSize: 12, color: t.textMuted }}>{k.lehrer}</div>}
              </div>
            );
          })}
        </div>
      }

      {/* All available courses to join */}
      <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Alle Kurse der Klasse</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 32 }}>
        {kurse.filter(k => !profile?.kurseIds?.includes(k.id)).map(k => (
          <div key={k.id} onClick={() => onOpenKurs(k)}
            style={{ background: t.bgSub, borderRadius: 12, padding: 16, cursor: "pointer", border: `1px dashed ${t.border}`, display: "flex", flexDirection: "column", gap: 8, opacity: 0.7 }}
            onMouseOver={e => e.currentTarget.style.opacity = "1"}
            onMouseOut={e => e.currentTarget.style.opacity = "0.7"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{FACH_ICONS[k.name] || "📚"}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{k.name}</span>
            </div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Nicht beigetreten</div>
          </div>
        ))}
        <div onClick={onCreateKurs}
          style={{ background: t.bgSub, borderRadius: 12, padding: 16, cursor: "pointer", border: `1px dashed ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: t.textMuted, fontSize: 14, fontWeight: 600 }}
          onMouseOver={e => e.currentTarget.style.color = t.text}
          onMouseOut={e => e.currentTarget.style.color = t.textMuted}>
          + Neuen Kurs erstellen
        </div>
      </div>
    </div>
  );
}