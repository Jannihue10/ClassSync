import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { db } from "./firebase";
import { collection, onSnapshot, doc, getDocs } from "firebase/firestore";
import { GLOBAL_CSS } from "./styles/theme";
import { Spinner } from "./components/UI";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Onboarding   from "./pages/Onboarding";
import Stundenplan  from "./pages/Stundenplan";
import KursView     from "./pages/KursView";
import Profile      from "./pages/Profile";
import TopBar       from "./components/TopBar";
import OverviewPanel      from "./components/OverviewPanel";
import NotificationPanel from "./components/NotificationPanel";
import CreateKursModal   from "./components/CreateKursModal";
import UploadModal        from "./components/UploadModal";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  // Load new materials since last visit
  useEffect(() => {
    if (!profile?.klasseId || !profile?.uid || kurse.length === 0) return;

    const storageKey = `classsync_lastSeen_${profile.uid}`;
    const lastSeen = parseInt(localStorage.getItem(storageKey) || "0", 10);

    // Save current time so next visit compares against now
    localStorage.setItem(storageKey, Date.now().toString());

    const meineKurse = kurse.filter(k => profile?.kurseIds?.includes(k.id));
    if (meineKurse.length === 0) return;

    const fetchNew = async () => {
      const results = [];
      for (const kurs of meineKurse) {
        const snap = await getDocs(
          collection(db, "klassen", profile.klasseId, "kurse", kurs.id, "materialien")
        );
        snap.docs.forEach(d => {
          const mat = d.data();
          const createdMs = mat.createdAt?.toMillis
            ? mat.createdAt.toMillis()
            : mat.createdAt?.seconds
              ? mat.createdAt.seconds * 1000
              : 0;
          if (createdMs > lastSeen) {
            results.push({
              id: d.id,
              ...mat,
              kursName: kurs.name,
              farbe:    kurs.farbe,
              icon:     kurs.icon,
            });
          }
        });
      }
      // Sort newest first
      results.sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0) * 1000;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0) * 1000;
        return tb - ta;
      });
      setNotifications(results);
    };

    fetchNew();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.klasseId, profile?.uid, kurse.length]);

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
    <Profile kurse={kurse} klasse={klasse} onClose={() => setShowProfile(false)} onKursClick={k => { setActiveKurs(k); setShowProfile(false); }} />
  );

  // Main app
  return (
    <div style={{ height: "100vh", background: t.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => { setShowNotifications(false); setNotifications([]); }}
        />
      )}
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
        notificationCount={notifications.length}
        onNotifications={() => setShowNotifications(true)}
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