import { useTheme } from "../context/ThemeContext";
import { Btn, SectionTitle, Pill } from "./UI";
import { FACH_COLORS, MAT_COLORS } from "../styles/theme";

// Relative time formatter (e.g. "vor 3 Stunden")
function timeAgo(ts) {
  if (!ts) return "";
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  return `vor ${Math.floor(diff / 86400)} Tagen`;
}

export default function NotificationPanel({ notifications, onClose }) {
  const { t } = useTheme();

  // Group by kursName
  const grouped = notifications.reduce((acc, n) => {
    const key = n.kursName;
    if (!acc[key]) acc[key] = { farbe: n.farbe, icon: n.icon, items: [] };
    acc[key].items.push(n);
    return acc;
  }, {});

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.3)" }} />

      {/* Panel */}
      <div style={{
        width: 360,
        background: t.bgCard,
        height: "100%",
        borderLeft: `1px solid ${t.border}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Neuigkeiten</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
                {notifications.length === 0
                  ? "Alles auf dem neuesten Stand"
                  : `${notifications.length} neue${notifications.length === 1 ? "s Material" : " Materialien"}`}
              </div>
            </div>
          </div>
          <Btn variant="ghost" onClick={onClose} style={{ padding: "5px 9px", fontSize: 13 }}>✕</Btn>
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 40, color: t.textMuted }}>
            <span style={{ fontSize: 40 }}>✅</span>
            <div style={{ fontSize: 14, textAlign: "center" }}>Keine neuen Materialien seit deinem letzten Besuch.</div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            {Object.entries(grouped).map(([kursName, { farbe, icon, items }]) => {
              const color = farbe || FACH_COLORS[kursName] || t.accent;
              return (
                <div key={kursName} style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
                  {/* Kurs-Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: color + "22",
                      border: `1.5px solid ${color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0,
                    }}>
                      {icon || "📁"}
                    </div>
                    <SectionTitle style={{ marginBottom: 0 }}>{kursName}</SectionTitle>
                  </div>

                  {/* Material items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((mat, i) => (
                      <div key={i} style={{
                        background: t.bgSub,
                        borderRadius: 10,
                        padding: "10px 12px",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}>
                        {/* Colored bar */}
                        <div style={{
                          width: 3, borderRadius: 2,
                          background: MAT_COLORS[mat.typ] || color,
                          alignSelf: "stretch",
                          flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {mat.titel}
                            </span>
                            <Pill label={mat.typ} color={MAT_COLORS[mat.typ] || color} />
                          </div>
                          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>
                            von <span style={{ color: t.textSub, fontWeight: 500 }}>{mat.autor}</span>
                            {" · "}{timeAgo(mat.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
