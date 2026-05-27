import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:       "#ffffff",
  text:     "#111111",
  textSub:  "#555555",
  textMuted:"#999999",
  border:   "#e5e5e5",
  bgSub:    "#f5f5f5",
  accent:   "#111111",
};

const FEATURES = [
  { icon: "📁", title: "Materialien teilen", desc: "PDFs, Mitschriften und Lernzettel hochladen und sofort für die ganze Klasse verfügbar machen." },
  { icon: "📅", title: "Stundenplan & Kalender", desc: "Alle Stunden auf einen Blick – Wochen- und Monatsansicht mit Prüfungsterminen direkt im Kalender." },
  { icon: "✅", title: "Hausaufgaben", desc: "HAs eintragen und persönlich abhaken. Jeder sieht seinen eigenen Erledigungsstand." },
  { icon: "🔔", title: "Benachrichtigungen", desc: "Nie wieder etwas verpassen. Neue Materialien werden sofort angezeigt, auch während der Session." },
  { icon: "💬", title: "Kurschat", desc: "Pro Fach ein eigener Echtzeit-Chat. Fragen stellen, Antworten bekommen – direkt in der App." },
  { icon: "👑", title: "Klassenorganisation", desc: "Admins verwalten Kurse und Mitglieder. Mehrere Admins möglich, Rechte flexibel vergeben." },
];

const STEPS = [
  { nr: "01", title: "Klasse erstellen", desc: "Erstelle eine Klasse und teile den automatisch generierten Code mit deinen Mitschülern." },
  { nr: "02", title: "Kurse beitreten", desc: "Wähle aus allen Kursen deiner Klasse die aus, die du wirklich brauchst." },
  { nr: "03", title: "Loslegen", desc: "Material hochladen, HAs eintragen, Prüfungstermine setzen – alles an einem Ort." },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        .nav-btn:hover { background: #f5f5f5 !important; }
        .nav-btn-accent:hover { background: #333 !important; }
        .feature-card:hover { border-color: #ccc !important; }
        .footer-link:hover { color: #111 !important; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.92)" : "#ffffff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all .2s",
        padding: "0 48px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📚</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>ClassSync</span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="nav-btn" onClick={() => navigate("/app")} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "7px 16px",
            fontSize: 13, fontWeight: 500, color: C.textSub, cursor: "pointer",
            transition: "background .15s",
          }}>
            Anmelden
          </button>
          <button className="nav-btn-accent" onClick={() => navigate("/app")} style={{
            background: C.accent, border: "none",
            borderRadius: 8, padding: "7px 16px",
            fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
            transition: "background .15s",
          }}>
            Kostenlos starten
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 160, paddingBottom: 120, textAlign: "center", maxWidth: 720, margin: "0 auto", padding: "160px 24px 120px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.bgSub, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 500, color: C.textSub, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Kostenlos für Schüler
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.text, marginBottom: 24 }}>
          Alles für deine Klasse.<br />An einem Ort.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: C.textSub, maxWidth: 480, margin: "0 auto 48px", fontWeight: 400 }}>
          ClassSync bringt Materialien, Hausaufgaben, Stundenplan und Chat deiner Klasse zusammen – einfach, schnell und ohne App-Download.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="nav-btn-accent" onClick={() => navigate("/app")} style={{
            background: C.accent, border: "none", borderRadius: 10,
            padding: "13px 28px", fontSize: 15, fontWeight: 600,
            color: "#fff", cursor: "pointer", transition: "background .15s",
          }}>
            Jetzt kostenlos starten →
          </button>
          <button className="nav-btn" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "13px 28px",
            fontSize: 15, fontWeight: 500, color: C.textSub, cursor: "pointer",
            transition: "background .15s",
          }}>
            Mehr erfahren
          </button>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: C.border, maxWidth: 1100, margin: "0 auto" }} />

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.text, marginBottom: 12 }}>
            Alles was du brauchst
          </h2>
          <p style={{ fontSize: 16, color: C.textSub, maxWidth: 440, margin: "0 auto" }}>
            Kein Chaos mehr in WhatsApp-Gruppen. ClassSync hält alles strukturiert.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{
              border: `1px solid ${C.border}`, borderRadius: 14,
              padding: "28px 28px",
              transition: "border-color .2s",
            }}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: C.border, maxWidth: 1100, margin: "0 auto" }} />

      {/* ── How it works ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.text, marginBottom: 12 }}>
            In 3 Schritten loslegen
          </h2>
          <p style={{ fontSize: 16, color: C.textSub }}>
            Keine Installation, kein Abo, kein Aufwand.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, letterSpacing: "0.05em" }}>{s.nr}</div>
              <div style={{ width: 40, height: 1, background: C.border }} />
              <div style={{ fontSize: 17, fontWeight: 600, color: C.text }}>{s.title}</div>
              <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: C.border, maxWidth: 1100, margin: "0 auto" }} />

      {/* ── CTA ── */}
      <section style={{ textAlign: "center", padding: "100px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.text, marginBottom: 16 }}>
          Bereit loszulegen?
        </h2>
        <p style={{ fontSize: 16, color: C.textSub, marginBottom: 40 }}>
          Kostenlos, ohne App-Download, direkt im Browser.
        </p>
        <button className="nav-btn-accent" onClick={() => navigate("/app")} style={{
          background: C.accent, border: "none", borderRadius: 10,
          padding: "14px 32px", fontSize: 15, fontWeight: 600,
          color: "#fff", cursor: "pointer", transition: "background .15s",
        }}>
          Jetzt kostenlos starten →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: C.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>📚</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>ClassSync</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: C.textMuted }}>
          <a href="/impressum" className="footer-link" style={{ color: C.textMuted, textDecoration: "none", transition: "color .15s" }}>Impressum</a>
          <a href="/datenschutz" className="footer-link" style={{ color: C.textMuted, textDecoration: "none", transition: "color .15s" }}>Datenschutz</a>
        </div>
      </footer>
    </div>
  );
}
