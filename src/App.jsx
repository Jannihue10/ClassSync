import { useState } from "react";
import GlobalStyles from "./styles/global";
import { KLASSEN } from "./data/mockData";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Stundenplan from "./pages/Stundenplan";
import KursView from "./pages/KursView";
import SidebarPanel from "./components/SidebarPanel";
import UploadModal from "./components/UploadModal";

export default function App() {
  const [screen, setScreen] = useState("login");   // login | ob | main
  const [demo, setDemo] = useState(null);
  const [sess, setSess] = useState(null);           // { klasse, selIds }
  const [activeFach, setActiveFach] = useState(null);
  const [uploading, setUploading] = useState(null); // fach name or null
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [extraMats, setExtraMats] = useState({});

  const kd = sess ? KLASSEN[sess.klasse] : null;
  const meineKurse = kd ? kd.kurse.filter(k => sess.selIds.includes(k.id)) : [];
  const fachNamen = meineKurse.map(k => k.name);

  // Merge uploaded materials with mock data
  const mergedKd = kd ? {
    ...kd,
    materialien: Object.fromEntries(
      Object.keys(kd.materialien).map(f => [f, [...(kd.materialien[f] || []), ...(extraMats[f] || [])]])
    ),
  } : null;

  const handleUpload = ({ typ, titel, preview, fach, file }) => {
    const newMat = {
      id: Date.now(), typ, titel,
      preview: preview || "Eigenes Material",
      autor: "Du", datum: "Jetzt", likes: 0,
      dateiTyp: file ? (file.name.endsWith(".pdf") ? "PDF" : "Foto") : "Notiz",
      seiten: 1,
    };
    setExtraMats(p => ({ ...p, [fach]: [...(p[fach] || []), newMat] }));
  };

  return (
    <>
      <style>{GlobalStyles}</style>

      {screen === "login" && (
        <Login onLogin={code => {
          if (code && KLASSEN[code]) setDemo(code);
          setScreen("ob");
        }} />
      )}

      {screen === "ob" && (
        <Onboarding demoKlasse={demo} onDone={(klasse, selIds) => {
          setSess({ klasse, selIds });
          setScreen("main");
        }} />
      )}

      {screen === "main" && sess && mergedKd && (
        <div style={{ height: "100vh", background: "#0f1117", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Modals */}
          {uploading !== null && (
            <UploadModal fach={uploading} kurse={meineKurse} onClose={() => setUploading(null)} onUpload={handleUpload} />
          )}
          {sidebarOpen && (
            <SidebarPanel kd={mergedKd} fachNamen={fachNamen} onClose={() => setSidebarOpen(false)} />
          )}

          {/* Top bar */}
          <div style={{ background: "#1a1d2e", padding: "16px 32px", borderBottom: "1px solid #2d3148", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4f46e5,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
              <span style={{ fontFamily: "Sora,sans-serif", fontSize: 18, fontWeight: 700, color: "white" }}>ClassSync</span>
              <span style={{ fontSize: 12, color: "#4a5177", marginLeft: 4 }}>{mergedKd.name}</span>
            </div>
            <div style={{ flex: 1 }} />
            {activeFach === null && (
              <button
                onClick={() => setUploading(meineKurse[0]?.name || null)}
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + Hochladen
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "#2d3148", color: "#94a3b8", border: "none", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ☰ Übersicht
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>J</div>
          </div>

          {/* Main area */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {activeFach === null ? (
              <Stundenplan
                kd={mergedKd}
                meineKurse={meineKurse}
                extraMats={extraMats}
                onOpenFach={setActiveFach}
                onUpload={setUploading}
              />
            ) : (
              <KursView
                fach={activeFach}
                kd={mergedKd}
                meineKurse={meineKurse}
                onBack={() => setActiveFach(null)}
                onUpload={setUploading}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}