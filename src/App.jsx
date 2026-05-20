import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { db } from "./firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { GLOBAL_CSS } from "./styles/theme";
import { Spinner } from "./components/UI";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Onboarding   from "./pages/Onboarding";
import Stundenplan  from "./pages/Stundenplan";
import KursView     from "./pages/KursView";
import Profile      from "./pages/Profile";
import TopBar       from "./components/TopBar";
import OverviewPanel   from "./components/OverviewPanel";
import CreateKursModal from "./components/CreateKursModal";
import UploadModal     from "./components/UploadModal";

export default function App() {
  const { user, profile, loading } = useAuth();
  const { t } = useTheme();

  const [authMode, setAuthMode]     = useState("login");   // login | register
  const [klasse, setKlasse]         = useState(null);
  const [kurse, setKurse]           = useState([]);
  const [activeKurs, setActiveKurs] = useState(null);
  const [showProfile, setShowProfile]   = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showUpload, setShowUpload]     = useState(false);
  const [showCreateKurs, setShowCreateKurs] = useState(false);

  // Load klasse + kurse from Firestore when profile is ready
  useEffect(() => {
    if (!profile?.klasseId) return;

    // Load klasse doc
    const unsubKlasse = onSnapshot(
      doc(db, "klassen", profile.klasseId),
      snap => {
        if (snap.exists()) {
          setKlasse({ id: snap.id, ...snap.data() });
        } else {
          // Klasse wurde gelöscht – lokal sofort zurücksetzen
          setKlasse(null);
          setKurse([]);
          setActiveKurs(null);
          updateProfile({ klasseId: null, rolle: "schueler", kurseIds: [] });
        }
      }
    );

    // Load kurse
    const unsubKurse = onSnapshot(
      collection(db, "klassen", profile.klasseId, "kurse"),
      snap => setKurse(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => { unsubKlasse(); unsubKurse(); };
  }, [profile?.klasseId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner />
    </div>
  );

  // Not logged in
  if (!user) return authMode === "login"
    ? <Login onSwitch={() => setAuthMode("register")} />
    : <Register onSwitch={() => setAuthMode("login")} />;

  // Logged in but no class yet – or class was deleted
  if (!profile?.klasseId || (klasse === null && profile?.klasseId)) return <Onboarding />;

  // Profile page
  if (showProfile) return (
    <Profile kurse={kurse} onClose={() => setShowProfile(false)} onKursClick={k => { setActiveKurs(k); setShowProfile(false); }} />
  );

  // Main app
  return (
    <div style={{ height: "100vh", background: t.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {showOverview && (
        <OverviewPanel klasse={klasse} kurse={kurse} onClose={() => setShowOverview(false)} />
      )}
      {showUpload && profile?.klasseId && (
        <UploadModal
          klasseId={profile.klasseId}
          kurse={kurse.filter(k => profile?.kurseIds?.includes(k.id))}
          onClose={() => setShowUpload(false)}
          onUploaded={() => {}}
        />
      )}
      {showCreateKurs && profile?.klasseId && (
        <CreateKursModal
          klasseId={profile.klasseId}
          onClose={() => setShowCreateKurs(false)}
          onCreated={() => setShowCreateKurs(false)}
        />
      )}

      <TopBar
        klasseName={klasse?.name}
        onUpload={() => setShowUpload(true)}
        onOverview={() => setShowOverview(true)}
        onProfile={() => setShowProfile(true)}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {activeKurs ? (
          <KursView
            kurs={activeKurs}
            klasseId={profile.klasseId}
            onBack={() => setActiveKurs(null)}
          />
        ) : (
          <Stundenplan
            kurse={kurse}
            onOpenKurs={setActiveKurs}
            onCreateKurs={() => setShowCreateKurs(true)}
          />
        )}
      </div>
    </div>
  );
}