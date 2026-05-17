import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Empty } from "../components/UI";
import { DAYS, DAY_FULL, FACH_COLORS, FACH_ICONS } from "../styles/theme";

export default function Stundenplan({ kurse, onOpenKurs, onCreateKurs }) {
  const { t } = useTheme();
  const { profile } = useAuth();

  const jsDay = new Date().getDay();
  const dayMap = { 1: "Mo", 2: "Di", 3: "Mi", 4: "Do", 5: "Fr" };
  const [day, setDay] = useState(dayMap[jsDay] || "Mo");

  const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));
  const andereKurse = kurse.filter(k => !profile?.kurseIds?.includes(k.id));

  const slots = meineKurse
    .flatMap(k => (k.zeiten || []).filter(z => z.day === day).map(z => ({ ...z, kurs: k })))
    .sort((a, b) => a.zeit.localeCompare(b.zeit));

  const KursCard = ({ k, faded = false }) => {
    const col = FACH_COLORS[k.name] || t.accent;
    return (
      <div onClick={() => onOpenKurs(k)}
        style={{ background: faded ? t.bgSub : t.bgCard, borderRadius: 14, padding: "20px 22px", cursor: "pointer", border: `1px solid ${faded ? t.border : t.border}`, borderTop: `3px solid ${faded ? t.border : col}`, transition: "all .15s", display: "flex", flexDirection: "column", gap: 12, opacity: faded ? 0.6 : 1 }}
        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.shadowMd; e.currentTarget.style.opacity = "1"; }}
        onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.opacity = faded ? "0.6" : "1"; }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {FACH_ICONS[k.name] || "📚"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{k.name}</div>
            {k.lehrer && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>{k.lehrer}</div>}
          </div>
        </div>
        {k.raum && <div style={{ fontSize: 12, color: t.textMuted }}>Raum {k.raum}</div>}
        <div style={{ fontSize: 12, color: faded ? t.textMuted : col, fontWeight: 600 }}>
          {faded ? "Nicht beigetreten" : "Öffnen →"}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "40px 56px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <div style={{ flex: 1, fontSize: 28, fontWeight: 700, color: t.text }}>Stundenplan</div>
        <div style={{ display: "flex", gap: 6 }}>
          {DAYS.map(d => (
            <button key={d} onClick={() => setDay(d)}
              style={{ padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${day === d ? t.accent : t.border}`, background: day === d ? t.accent : "transparent", color: day === d ? t.accentFg : t.textSub, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Today's slots */}
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted, marginBottom: 16 }}>
        {DAY_FULL[day]}
      </div>
      {meineKurse.length === 0 ? (
        <Empty icon="📚" text="Du bist noch keinem Kurs beigetreten." />
      ) : slots.length === 0 ? (
        <div style={{ background: t.bgSub, borderRadius: 14, padding: "28px 24px", fontSize: 15, color: t.textMuted, marginBottom: 40, border: `1px solid ${t.border}` }}>
          😎 Kein Unterricht {DAY_FULL[day]}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
          {slots.map((s, i) => {
            const col = FACH_COLORS[s.kurs.name] || t.accent;
            return (
              <div key={i} onClick={() => onOpenKurs(s.kurs)}
                style={{ background: t.bgCard, borderRadius: 14, padding: "22px 24px", cursor: "pointer", border: `1px solid ${t.border}`, borderTop: `3px solid ${col}`, transition: "all .15s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.shadowMd; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {FACH_ICONS[s.kurs.name] || "📚"}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{s.kurs.name}</div>
                    <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>{s.zeit}{s.kurs.raum ? ` · R. ${s.kurs.raum}` : ""}</div>
                  </div>
                </div>
                {s.kurs.lehrer && <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10 }}>{s.kurs.lehrer}</div>}
                <div style={{ fontSize: 13, color: col, fontWeight: 600 }}>Öffnen →</div>
              </div>
            );
          })}
        </div>
      )}

      {/* My courses */}
      {meineKurse.length > 0 && <>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted, marginBottom: 16 }}>
          Meine Kurse ({meineKurse.length})
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 48 }}>
          {meineKurse.map(k => <KursCard key={k.id} k={k} />)}
        </div>
      </>}

      {/* Other courses */}
      {(andereKurse.length > 0 || true) && <>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted, marginBottom: 16 }}>
          Weitere Kurse der Klasse
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {andereKurse.map(k => <KursCard key={k.id} k={k} faded />)}
          <div onClick={onCreateKurs}
            style={{ background: t.bgSub, borderRadius: 14, padding: "20px 22px", cursor: "pointer", border: `1px dashed ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: t.textMuted, fontSize: 15, fontWeight: 600, minHeight: 100, transition: "all .15s" }}
            onMouseOver={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.accent; }}
            onMouseOut={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = t.border; }}>
            + Neuen Kurs erstellen
          </div>
        </div>
      </>}
    </div>
  );
}