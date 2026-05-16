import { useState } from "react";
import { COLORS, ICONS, DAYS, DAY_LABELS } from "../data/mockData";

export default function Stundenplan({ kd, meineKurse, extraMats, onOpenFach, onUpload }) {
  const [day, setDay] = useState("Mi");
  const fachNamen = meineKurse.map(k => k.name);
  const todaySlots = (kd.stundenplan[day] || []).filter(s => fachNamen.includes(s.fach));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ fontFamily: "Sora,sans-serif", fontSize: 26, fontWeight: 700, color: "white", flex: 1 }}>Stundenplan</div>
        <div style={{ display: "flex", gap: 6 }}>
          {DAYS.map(d => (
            <button key={d} onClick={() => setDay(d)}
              style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid", borderColor: day === d ? "#6366f1" : "#2d3148", background: day === d ? "#6366f1" : "transparent", color: day === d ? "white" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
              <div>{d}</div>
              <div style={{ fontSize: 10, opacity: .7 }}>{DAY_LABELS[d].slice(0, 2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's courses */}
      {todaySlots.length === 0
        ? <div style={{ textAlign: "center", padding: "80px 20px", color: "#4a5177", fontSize: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 48 }}>😎</span>Kein Unterricht {DAY_LABELS[day]}
        </div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 48 }}>
          {todaySlots.map((s, i) => {
            const col = COLORS[s.fach] || "#6366f1";
            const matCount = ((kd.materialien[s.fach] || []).length + (extraMats[s.fach] || []).length);
            const openHAs = (kd.hausaufgaben[s.fach] || []).filter(h => !h.done).length;
            return (
              <div key={i} onClick={() => onOpenFach(s.fach)}
                style={{ background: "#1a1d2e", borderRadius: 20, padding: 24, cursor: "pointer", border: "1px solid #2d3148", borderTop: `4px solid ${col}`, transition: "all .2s", display: "flex", flexDirection: "column", gap: 16 }}
                onMouseOver={e => { e.currentTarget.style.background = "#1e2040"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#1a1d2e"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{ICONS[s.fach]}</div>
                  <div>
                    <div style={{ fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 700, color: "white" }}>{s.fach}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.zeit} · Raum {s.raum}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ background: "#2d3148", color: "#94a3b8", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8 }}>📁 {matCount} Materialien</span>
                  {openHAs > 0 && <span style={{ background: "#f59e0b22", color: "#f59e0b", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8 }}>📋 {openHAs} offen</span>}
                </div>
                <div style={{ fontSize: 12, color: col, fontWeight: 600 }}>Öffnen →</div>
              </div>
            );
          })}
        </div>
      }

      {/* All courses */}
      <div style={{ fontFamily: "Sora,sans-serif", fontSize: 20, fontWeight: 700, color: "white", marginBottom: 20 }}>Alle Kurse</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {meineKurse.map(k => {
          const col = COLORS[k.name] || "#6366f1";
          const mc = (kd.materialien[k.name] || []).length + (extraMats[k.name] || []).length;
          const oh = (kd.hausaufgaben[k.name] || []).filter(h => !h.done).length;
          return (
            <div key={k.id} onClick={() => onOpenFach(k.name)}
              style={{ background: "#1a1d2e", borderRadius: 16, padding: 18, cursor: "pointer", border: "1px solid #2d3148", transition: "all .2s", display: "flex", flexDirection: "column", gap: 10 }}
              onMouseOver={e => { e.currentTarget.style.background = "#1e2040"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#1a1d2e"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ICONS[k.name]}</div>
                <div style={{ fontFamily: "Sora,sans-serif", fontSize: 15, fontWeight: 700, color: "white" }}>{k.name}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ background: "#2d3148", color: "#64748b", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>📁 {mc}</span>
                {oh > 0 && <span style={{ background: "#f59e0b22", color: "#f59e0b", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>📋 {oh} HA</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}