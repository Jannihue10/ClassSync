import { useState } from "react";
import { COLORS, ICONS, TYPEN, TYP_COLORS } from "../data/mockData";
import MatCard from "../components/MatCard";
import MaterialViewer from "../components/MaterialViewer";
import RequestModal from "../components/RequestModal";

export default function KursView({ fach, kd, meineKurse, onBack, onUpload }) {
  const [tab, setTab] = useState("material");
  const [filter, setFilter] = useState("Alle");
  const [mats, setMats] = useState(kd.materialien[fach] || []);
  const [has, setHas] = useState(kd.hausaufgaben[fach] || []);
  const [viewer, setViewer] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [msgs, setMsgs] = useState([
    { id: 1, autor: "Lisa M.", text: "Hat jemand die Lösung für Aufgabe 5?", zeit: "14:32" },
    { id: 2, autor: "Max B.", text: "Ich lade gleich meine Mitschrift hoch!", zeit: "14:35" },
    { id: 3, autor: "Anna K.", text: "Danke Lisa!! 🙏", zeit: "14:42" },
  ]);
  const [msgIn, setMsgIn] = useState("");

  const col = COLORS[fach] || "#6366f1";
  const pr = kd.pruefungen.filter(p => p.fach === fach);
  const filtered = filter === "Alle" ? mats : mats.filter(m => m.typ === filter);

  const handleLike = id => setMats(p => p.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
  const sendMsg = () => {
    if (!msgIn.trim()) return;
    setMsgs(p => [...p, { id: p.length + 1, autor: "Du", text: msgIn, zeit: "Jetzt", eigene: true }]);
    setMsgIn("");
  };

  const TABS = [
    { id: "material", label: "📁 Materialien", count: mats.length },
    { id: "hausaufgaben", label: "📋 Hausaufgaben", count: has.filter(h => !h.done).length || null },
    { id: "chat", label: "💬 Chat" },
    { id: "pruefungen", label: "📝 Prüfungen", count: pr.length || null },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {viewer && (
        <MaterialViewer
          mat={viewer} onClose={() => setViewer(null)}
          onLike={id => { handleLike(id); setViewer(v => ({ ...v, likes: v.likes + 1 })); }}
        />
      )}
      {requesting && (
        <RequestModal
          fach={fach} onClose={() => setRequesting(false)}
          onSend={t => setRequests(p => [...p, { id: p.length + 1, text: t }])}
        />
      )}

      {/* Header */}
      <div style={{ background: "#1a1d2e", padding: "20px 28px", borderBottom: "1px solid #2d3148", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "#2d3148", border: "none", borderRadius: 10, padding: "8px 14px", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>←</button>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: col + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{ICONS[fach]}</div>
        <div>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: 22, fontWeight: 700, color: "white" }}>{fach}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{meineKurse.find(k => k.name === fach)?.lehrer} · {mats.length} Materialien</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={() => setRequesting(true)} style={{ background: "#2d3148", color: "#94a3b8", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            📣 Anfragen
          </button>
          <button onClick={() => onUpload(fach)} style={{ background: col, color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Hochladen
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#1a1d2e", borderBottom: "1px solid #2d3148", display: "flex", padding: "0 28px", flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "13px 18px", border: "none", borderBottom: `2px solid ${tab === t.id ? col : "transparent"}`, background: "transparent", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? col : "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "color .2s" }}>
            {t.label}
            {t.count > 0 && (
              <span style={{ background: tab === t.id ? col + "33" : "#2d3148", color: tab === t.id ? col : "#64748b", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: tab === "chat" ? 0 : 28 }}>

        {tab === "material" && <>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {TYPEN.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding: "7px 16px", borderRadius: 20, border: "1.5px solid", borderColor: filter === t ? (TYP_COLORS[t] || col) : "#2d3148", background: filter === t ? (TYP_COLORS[t] || col) + "22" : "transparent", color: filter === t ? (TYP_COLORS[t] || col) : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
                {t}
              </button>
            ))}
          </div>
          {requests.length > 0 && (
            <div style={{ background: "#4f46e522", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, border: "1px solid #4f46e544" }}>
              <span style={{ fontSize: 18 }}>📣</span>
              <div style={{ flex: 1, fontSize: 13, color: "#a5b4fc" }}>Offene Anfragen: {requests.map(r => `"${r.text}"`).join(" · ")}</div>
            </div>
          )}
          {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a5177", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ fontSize: 40 }}>📭</span>Noch keine Materialien in dieser Kategorie</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {filtered.map(m => <MatCard key={m.id} m={m} onOpen={setViewer} onLike={handleLike} />)}
            </div>
          }
        </>}

        {tab === "hausaufgaben" && (
          <div style={{ maxWidth: 580, display: "flex", flexDirection: "column", gap: 10 }}>
            {has.length === 0
              ? <div style={{ textAlign: "center", padding: 60, color: "#4a5177", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ fontSize: 40 }}>✅</span>Keine Hausaufgaben!</div>
              : has.map(h => (
                <div key={h.id} style={{ background: "#1a1d2e", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #2d3148" }}>
                  <div onClick={() => setHas(p => p.map(x => x.id === h.id ? { ...x, done: !x.done } : x))}
                    style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${h.done ? "#10b981" : "#3d4166"}`, background: h.done ? "#10b981" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                    {h.done && <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: h.done ? "#4a5177" : "white", textDecoration: h.done ? "line-through" : "none" }}>{h.text}</div>
                    <div style={{ fontSize: 11, color: "#4a5177", marginTop: 3 }}>Fällig: {h.faellig}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, background: h.done ? "#10b98122" : h.faellig === "Heute" ? "#ef444422" : "#f59e0b22", color: h.done ? "#10b981" : h.faellig === "Heute" ? "#ef4444" : "#f59e0b" }}>
                    {h.done ? "Erledigt" : h.faellig === "Heute" ? "Heute!" : h.faellig}
                  </span>
                </div>
              ))
            }
          </div>
        )}

        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
              {msgs.map(m => (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 4, alignSelf: m.eigene ? "flex-end" : "flex-start", maxWidth: "55%" }}>
                  {!m.eigene && <div style={{ fontSize: 11, color: "#64748b", paddingLeft: 4 }}>{m.autor}</div>}
                  <div style={{ background: m.eigene ? col : "#2d3148", color: "white", borderRadius: m.eigene ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 16px", fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: "#4a5177", paddingLeft: 4 }}>{m.zeit}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 28px", borderTop: "1px solid #2d3148", display: "flex", gap: 10, background: "#1a1d2e" }}>
              <input value={msgIn} onChange={e => setMsgIn(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Nachricht…"
                style={{ flex: 1, background: "#12151f", border: "1px solid #2d3148", borderRadius: 24, padding: "10px 18px", color: "white", fontSize: 14, outline: "none" }} />
              <button onClick={sendMsg} style={{ width: 42, height: 42, borderRadius: "50%", background: col, border: "none", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>↑</button>
            </div>
          </div>
        )}

        {tab === "pruefungen" && (
          <div style={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 12 }}>
            {pr.length === 0
              ? <div style={{ textAlign: "center", padding: 60, color: "#4a5177", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span style={{ fontSize: 40 }}>🎉</span>Keine Prüfungen eingetragen</div>
              : pr.map(p => (
                <div key={p.id} style={{ background: "#1a1d2e", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, border: "1px solid #2d3148", borderLeft: `4px solid ${col}` }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1 }}>{p.tage}</span>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>Tage</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "Sora,sans-serif", fontSize: 16, fontWeight: 700, color: "white" }}>{p.titel}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>📅 {p.datum}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: "50%", background: p.tage <= 7 ? "#ef4444" : p.tage <= 14 ? "#f59e0b" : "#10b981" }} />
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}