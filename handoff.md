# ClassSync – Vollständiges Handoff-Dokument
*Zuletzt aktualisiert: Mai 2026*

---

## 1. Projektübersicht

**ClassSync** ist eine Web-App für Schüler zum Teilen von Unterrichtsmaterial. Schüler können Mitschriften, Hausaufgaben-Lösungen, Lernzettel und Aufgabenblätter hochladen und mit ihrer Klasse teilen – organisiert nach Kursen und Stundenplan.

- **Zielgruppe:** Schüler weiterführender Schulen (Sek I & II), primär Deutschland
- **Plattform:** Web-App, optimiert für iPad/Desktop (große Bildschirme)
- **Sprache:** Deutsch (UI vollständig auf Deutsch)
- **Status:** Live, produktionsbereit mit echtem Firebase-Backend + aktiven Sicherheitsregeln

---

## 2. Features

### Auth & Nutzer
- Registrierung mit **Email, Passwort & Nickname** (Email nie sichtbar)
- Login mit Email + Passwort via Firebase Authentication
- Jeder Nutzer gehört zu genau einer Klasse (vorbereitet für Multi-Klassen später)
- Admin-Status wird über `klassen.adminIds` verwaltet (kein `rolle`-Feld mehr)

### Klassen
- Jeder kann eine Klasse erstellen → wird automatisch erster Klassen-Admin
- **Automatisch generierter 5-stelliger Zugangscode** (z.B. `X7K2P`)
- Andere Nutzer treten per Code bei → wählen danach ihre Kurse aus
- **Mehrere Klassen-Admins möglich** – Admins können andere User promoten/degradieren
- Admin kann nie sich selbst degradieren wenn er der letzte Admin ist
- Klassen-Admin kann alles bearbeiten und die Klasse löschen
- Beim Löschen: alle Kurse, Subcollections und Storage-Dateien werden mitgelöscht

### Kurse/Fächer
- Nur Klassen-Admins können Kurse erstellen
- Beim Erstellen: Name, Lehrer, Raum, Wochentage + **Start- und Endzeit**, Farbe (freier Farbwähler), Icon (Emoji)
- Vordefinierte Fächervorlagen mit Farbe & Icon
- Stundenplan baut sich automatisch aus den Zeitangaben auf
- Kurs-Admin kann nur seinen eigenen Kurs bearbeiten/löschen
- Klassen-Admin kann alle Kurse bearbeiten/löschen

### Kurswahl
- Beim ersten Beitreten zu einer Klasse erscheint automatisch ein Kurswahlmodal
- Alle Kurse der Klasse als togglebare Karten mit Suchleiste
- Jederzeit erneut aufrufbar über „⚙️ Verwalten" im Profil
- Kurse können einzeln ab- und wieder angewählt werden

### Materialien
- Echte Datei-Uploads (PDF & Bilder) bis **10 MB** via Firebase Storage
- PDF-Viewer (iframe) & Bild-Vorschau direkt in der App
- **Typen:** Mitschrift, Aufgabenblatt, HA-Lösung, Lernzettel
- **Like/Danksagungs-System** (⭐) – Echtzeit via Firestore
- Beim Löschen wird die Datei automatisch aus Storage gelöscht
- `storagePath` wird beim Upload in Firestore gespeichert für zuverlässiges Löschen

### Hausaufgaben
- Pro Kurs eintragbar von allen Mitgliedern
- Fälligkeitsdatum (date picker)
- **Erledigungsstatus ist pro Nutzer** – jeder hat seinen eigenen Haken
- Gespeichert als `doneBy: string[]` (Array von UIDs)
- Offene HAs werden in der Übersicht und im Tab-Badge nur für den jeweiligen User gezählt

### Prüfungen
- Pro Kurs eintragbar
- Datum + **dynamischer Countdown** in Tagen (wird live aus `datum` berechnet, nicht gespeichert)
- Farbkodierung: rot (≤7 Tage), gelb (≤14 Tage), grün (>14 Tage)

### Chat
- Pro Kurs ein eigener Echtzeit-Chat via Firestore
- Nur Kursmitglieder können schreiben
- Nachrichten erscheinen sofort ohne neu laden
- Nachrichten können nicht bearbeitet oder gelöscht werden

### Benachrichtigungen (neu)
- 🔔 Glocken-Icon in der TopBar mit rotem Badge
- Zeigt neue Materialien seit dem letzten Besuch
- **Live-Updates**: Während der Session werden neu hochgeladene Materialien sofort angezeigt
- Timestamp des letzten Besuchs wird in `localStorage` gespeichert (`classsync_lastSeen_{uid}`)
- Badge bleibt bis man explizit „✓ Alle gelesen" klickt
- Panel zeigt Materialien gruppiert nach Kurs mit Typ, Autor und relativem Zeitstempel

### Kalender (neu)
- Erreichbar über „📅 Kalender"-Button im Stundenplan-Header
- Eigene Vollbild-Page (wie Profil)
- **Wochenansicht:** Stundenraster Mo–Fr mit exakter Positionierung nach Start-/Endzeit, farbige Kursblöcke mit Name, Icon, Zeiten und Raum. Heute hervorgehoben. Nur das Raster scrollt, Header bleibt fixiert.
- **Monatsansicht:** Vollständiges Kalender-Raster mit KW-Spalte, Navigation vor/zurück, Prüfungen als farbige Pills auf dem richtigen Tag, Heute-Highlight, Legende unten
- Heute-Button springt zur aktuellen Woche/Monat zurück
- Zeitraster passt sich dynamisch an die späteste Endzeit an (kein hartes Limit)

### Übersicht (Sidebar Panel)
- Erreichbar über „☰ Übersicht" Button in der TopBar
- Zeigt alle offenen HAs (nur eigene unerledigte) und Prüfungen aller eigenen Kurse
- Prüfungen sortiert nach Nähe (dynamisch berechnet)
- Lädt Daten direkt aus Firestore via eigene Listener

### Profil
- Nickname ändern
- Klassenname & Zugangscode einsehen
- **Kurse verwalten** – Kurswahlmodal öffnen zum Ab-/Anwählen
- **Klassenmitglieder-Liste** – alle User der Klasse mit Admin-Badge
- Admins sehen „👑 Zum Admin"- und „Admin entfernen"-Buttons bei anderen Usern
- Light/Dark Mode umschalten
- Klasse löschen (nur Klassen-Admin)
- Abmelden

### Theme
- **Light & Dark Mode** – Systemeinstellung wird erkannt, manuell umschaltbar
- Einstellung wird in `localStorage` gespeichert
- Design-Tokens zentral in `src/styles/theme.js`

---

## 3. Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | React 18 + Vite |
| Datenbank | Firebase Firestore (Echtzeit) |
| Auth | Firebase Authentication (Email/Passwort) |
| Datei-Upload | Firebase Storage |
| Hosting | Vercel (Auto-Deploy bei Git Push) |
| Versionskontrolle | Git + GitHub |
| Styling | Inline Styles + CSS-in-JS (keine externe CSS-Library) |
| Fonts | Inter (Google Fonts, via index.html) |

---

## 4. Externe Services

### Firebase (console.firebase.google.com)
- **Authentication:** Email/Passwort Login.
- **Firestore:** Aktive Sicherheitsregeln (kein Testmodus mehr).
- **Storage:** Aktive Sicherheitsregeln. Dateien unter `klassen/{klasseId}/kurse/{kursId}/{timestamp}_{filename}`.
- **IAM:** Storage-Dienstkonto hat `Cloud Datastore User`-Rolle (nötig für Storage→Firestore-Regelzugriff).
- Keys in `.env.local` (lokal) und als Vercel Environment Variables (produktiv).

### Vercel (vercel.com)
- Verbunden mit GitHub-Repo (`main`-Branch)
- Jeder Push → automatisches Deployment in ~30 Sekunden
- Environment Variables identisch zu `.env.local`

### GitHub
- `.env.local` ist in `.gitignore` – Keys nie im Repo

---

## 5. Projektstruktur

```
classsync/
├── index.html
├── vite.config.js
├── package.json
├── .env.local                      ← Firebase Keys (nicht in Git!)
└── src/
    ├── main.jsx                    ← React Entry, Provider-Wrapper
    ├── App.jsx                     ← Haupt-Router, globaler State
    ├── firebase.js                 ← Firebase-Initialisierung
    ├── context/
    │   ├── AuthContext.jsx         ← Firebase Auth + Firestore Profil
    │   └── ThemeContext.jsx        ← Light/Dark Mode
    ├── styles/
    │   └── theme.js                ← Design Tokens, Fachfarben, Icons
    ├── components/
    │   ├── UI.jsx                  ← Wiederverwendbare Komponenten
    │   ├── TopBar.jsx              ← Navigationsleiste (inkl. Glocke)
    │   ├── OverviewPanel.jsx       ← Seitenleiste HAs & Prüfungen
    │   ├── NotificationPanel.jsx   ← Benachrichtigungs-Panel (neu)
    │   ├── KurswahlModal.jsx       ← Kursauswahl-Modal (neu)
    │   ├── CreateKursModal.jsx     ← Kurs erstellen (inkl. Endzeit)
    │   ├── EditKursModal.jsx       ← Kurs bearbeiten (inkl. Endzeit)
    │   └── UploadModal.jsx         ← Material hochladen
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── Onboarding.jsx          ← Klasse erstellen/beitreten + Kurswahl
        ├── Stundenplan.jsx         ← Startseite (inkl. Kalender-Button)
        ├── KalenderView.jsx        ← Kalender-Page (neu)
        ├── KursView.jsx            ← Kursansicht
        └── Profile.jsx             ← Profil (inkl. Mitgliederliste)
```

---

## 6. Firestore Datenstruktur

```
/users/{userId}
  uid:        string
  nickname:   string
  email:      string
  klasseId:   string | null
  kurseIds:   string[]         ← IDs der beigetretenen Kurse
  createdAt:  number
  // ENTFERNT: rolle ("admin"|"schueler") – wird nicht mehr verwendet

/klassen/{klasseId}
  name:       string
  code:       string           ← 5-stelliger Zugangscode (Großbuchstaben)
  adminIds:   string[]         ← Array von Admin-UIDs (mehrere möglich!)
  createdAt:  number
  // ENTFERNT: adminId (string) – ersetzt durch adminIds (array)

/klassen/{klasseId}/kurse/{kursId}
  name:       string
  lehrer:     string
  raum:       string
  zeiten:     [{
    day:      "Mo"|"Di"|"Mi"|"Do"|"Fr",
    zeit:     "HH:MM",         ← Startzeit
    zeitEnde: "HH:MM"          ← Endzeit (neu! – für Kalender nötig)
  }]
  farbe:      string           ← Hex-Farbe z.B. "#6366f1"
  icon:       string           ← Emoji z.B. "📐"
  adminId:    string           ← userId des Kurs-Erstellers
  adminNick:  string
  createdAt:  number

/klassen/{klasseId}/kurse/{kursId}/materialien/{matId}
  typ:         "Mitschrift"|"Aufgabenblatt"|"HA-Lösung"|"Lernzettel"
  titel:       string
  beschreibung: string
  dateiUrl:    string | null
  storagePath: string | null   ← Für zuverlässiges Löschen
  dateiTyp:    "PDF"|"Bild"|"Notiz"
  autor:       string          ← Nickname
  autorId:     string          ← userId
  likes:       string[]        ← Array von userIds
  createdAt:   timestamp

/klassen/{klasseId}/kurse/{kursId}/hausaufgaben/{haId}
  text:        string
  faellig:     string          ← "YYYY-MM-DD"
  doneBy:      string[]        ← Array von userIds (pro User!)
  autor:       string          ← Nickname des Erstellers
  createdAt:   timestamp
  // ENTFERNT: done (boolean) – ersetzt durch doneBy (array)

/klassen/{klasseId}/kurse/{kursId}/pruefungen/{prId}
  titel:       string
  datum:       string          ← "YYYY-MM-DD"
  autor:       string
  createdAt:   timestamp
  // ENTFERNT: tage (number) – wird jetzt dynamisch clientseitig berechnet

/klassen/{klasseId}/kurse/{kursId}/chat/{msgId}
  text:        string
  autor:       string          ← Nickname
  autorId:     string
  createdAt:   timestamp
```

---

## 7. Rollen & Rechte

| Aktion | Mitglied | Kurs-Admin | Klassen-Admin |
|---|---|---|---|
| Kurse beitreten/verlassen | ✅ | ✅ | ✅ |
| Material hochladen | ✅ | ✅ | ✅ |
| Eigenes Material löschen | ✅ | ✅ | ✅ |
| Fremdes Material löschen | ❌ | ✅ | ✅ |
| HA & Prüfungen eintragen | ✅ | ✅ | ✅ |
| HA abhaken | ✅ (nur eigene) | ✅ | ✅ |
| Kurs erstellen | ❌ | ❌ | ✅ |
| Kurs bearbeiten | ❌ | ✅ (nur eigener) | ✅ (alle) |
| Kurs löschen | ❌ | ✅ (nur eigener) | ✅ (alle) |
| User zum Admin machen | ❌ | ❌ | ✅ |
| Klasse löschen | ❌ | ❌ | ✅ |

---

## 8. Firebase Sicherheitsregeln

### Firestore Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() {
      return request.auth != null;
    }
    function uid() {
      return request.auth.uid;
    }
    function me() {
      return get(/databases/$(database)/documents/users/$(uid())).data;
    }
    function isMember(klasseId) {
      return isAuth() && me().klasseId == klasseId;
    }
    function isAdmin(klasseId) {
      return isMember(klasseId) &&
        uid() in get(/databases/$(database)/documents/klassen/$(klasseId)).data.adminIds;
    }

    match /users/{userId} {
      allow read: if isAuth() && (
        uid() == userId ||
        (resource.data.klasseId != null &&
         me().klasseId == resource.data.klasseId)
      );
      allow create: if isAuth() && uid() == userId;
      allow update: if isAuth() && uid() == userId;
      allow delete: if false;
    }

    match /klassen/{klasseId} {
      allow read: if isAuth();
      allow create: if isAuth() &&
        request.resource.data.adminIds is list &&
        uid() in request.resource.data.adminIds;
      allow update: if isAuth() && uid() in resource.data.adminIds;
      allow delete: if isAuth() && uid() in resource.data.adminIds;

      match /kurse/{kursId} {
        allow read: if isMember(klasseId);
        allow create: if isAdmin(klasseId);
        allow update: if isMember(klasseId) && (
          isAdmin(klasseId) || resource.data.adminId == uid()
        );
        allow delete: if isAdmin(klasseId) ||
          (isMember(klasseId) && resource.data.adminId == uid());

        match /materialien/{matId} {
          allow read: if isMember(klasseId);
          allow create: if isMember(klasseId) &&
            request.resource.data.autorId == uid();
          allow update: if isMember(klasseId) && (
            isAdmin(klasseId) ||
            resource.data.autorId == uid() ||
            request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes'])
          );
          allow delete: if isMember(klasseId) && (
            isAdmin(klasseId) || resource.data.autorId == uid()
          );
        }

        match /hausaufgaben/{haId} {
          allow read: if isMember(klasseId);
          allow create: if isMember(klasseId);
          allow update: if isMember(klasseId) && (
            isAdmin(klasseId) ||
            resource.data.autor == uid() ||
            request.resource.data.diff(resource.data).affectedKeys().hasOnly(['doneBy'])
          );
          allow delete: if isMember(klasseId) && (
            isAdmin(klasseId) || resource.data.autor == uid()
          );
        }

        match /pruefungen/{prId} {
          allow read: if isMember(klasseId);
          allow create: if isMember(klasseId);
          allow update: if isMember(klasseId) && (
            isAdmin(klasseId) || resource.data.autor == uid()
          );
          allow delete: if isMember(klasseId) && (
            isAdmin(klasseId) || resource.data.autor == uid()
          );
        }

        match /chat/{msgId} {
          allow read: if isMember(klasseId);
          allow create: if isMember(klasseId) &&
            request.resource.data.autorId == uid();
          allow update, delete: if false;
        }
      }
    }
  }
}
```

### Storage Rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /klassen/{klasseId}/kurse/{kursId}/{fileName} {
      allow read: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid))
          .data.klasseId == klasseId;
      allow create: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid))
          .data.klasseId == klasseId &&
        request.resource.size <= 10 * 1024 * 1024 &&
        (request.resource.contentType == 'application/pdf' ||
         request.resource.contentType.matches('image/.*'));
      allow update: if false;
      allow delete: if request.auth != null &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid))
          .data.klasseId == klasseId;
    }
  }
}
```

**Was die Regeln verhindern:**
- Nicht eingeloggte User können nichts lesen oder schreiben
- User die nicht in der Klasse sind sehen keine Kurse, Materialien, HAs, Prüfungen oder Chats
- Niemand kann fremde Profile ändern
- Niemand kann im Chat als jemand anderes schreiben (autorId wird geprüft)
- Niemand kann beim Hochladen eine fremde autorId eintragen
- User können HAs anderer nur abhaken (`doneBy`), nicht den Text ändern
- User können Likes nur auf dem `likes`-Array ändern, nicht andere Felder
- Dateien über 10 MB oder falschem Typ werden auf Storage-Ebene abgelehnt
- Bestehende Dateien können nicht überschrieben werden

---

## 9. Wichtige Implementierungsdetails

### Admin-System
Admin-Status liegt ausschließlich in `klassen.adminIds` (Array). Es gibt kein `rolle`-Feld mehr im User-Dokument. Admin-Check überall: `klasse?.adminIds?.includes(profile?.uid)`. Kompatibilität mit alten Klassen die noch `adminId` (string) haben ist in `Profile.jsx` eingebaut: `klasse?.adminIds || (klasse?.adminId ? [klasse.adminId] : [])`.

### Benachrichtigungen – Live-Listener
`App.jsx` startet beim Login für jeden beigetretenen Kurs einen `onSnapshot`-Listener auf die Materialien-Subcollection. Beim ersten Feuern werden nur Materialien neuer als `lastSeen` gezählt. Danach gilt jedes `added`-Event als Live-Upload. Listener werden beim Logout/Kurswechsel sauber abgemeldet. Duplikate werden per ID-Check verhindert.

### Kalender – Zeitberechnung
`KalenderView.jsx` berechnet Positionen mit `minToPx(min) = INNER_PAD + (min - DAY_START) * PX_PER_MIN`. Alle Elemente (Stundenlinien, Labels, Kursblöcke) nutzen dieselbe Funktion → pixelgenaue Ausrichtung. `DAY_END` ist dynamisch: späteste `zeitEnde` aller Kurse + 30 min Puffer.

### Prüfungs-Countdown
`tage` wird **nicht** mehr in Firestore gespeichert. Stattdessen gibt es `calcTage(datum)` in `KursView.jsx` und `OverviewPanel.jsx`:
```js
function calcTage(datum) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(datum); target.setHours(0,0,0,0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}
```
Bestehende Prüfungen mit altem `tage`-Feld zeigen `?` bis sie neu eingetragen werden.

### HA-Erledigungsstatus
`done: boolean` wurde ersetzt durch `doneBy: string[]`. Toggle-Logik:
```js
await updateDoc(ref, {
  doneBy: isDone ? arrayRemove(uid) : arrayUnion(uid)
});
```
Überall wo HAs angezeigt werden: `h.doneBy?.includes(profile.uid)`.

### Storage-Löschen
`storagePath` wird beim Upload gespeichert (nicht die Download-URL). Beim Löschen: `deleteObject(ref(storage, mat.storagePath))`.

### Klasse gelöscht – automatischer Rauswurf
`App.jsx` beobachtet das Klassen-Dokument via `onSnapshot`. Wenn es nicht mehr existiert, landen alle Mitglieder automatisch im Onboarding.

---

## 10. Bekannte Limitierungen & TODOs

- **Kein Multi-Klassen-Support** – Nutzer kann nur einer Klasse angehören
- **Keine Push-Notifications** – nur in-App Benachrichtigungen
- **Keine Offline-Unterstützung** – App benötigt Internetverbindung
- **Keine Email-Verifizierung** – jede Email kann sich registrieren
- **Maximale Dateigröße:** 10 MB (in `UploadModal.jsx` als `MAX_MB` konfigurierbar)
- **Alte Prüfungen** mit gespeichertem `tage`-Feld zeigen `?` als Countdown

---

## 11. Update-Workflow

```bash
git add .
git commit -m "kurze beschreibung"
git push
# → Vercel deployed automatisch in ~30 Sekunden
```

Für Rollback auf einen bestimmten Commit:
```bash
git reset --hard <commit-hash>
git push --force
# → Vercel deployed die alte Version
```

---

## 12. Fächervorlagen (theme.js)

| Fach | Farbe | Icon |
|---|---|---|
| Mathematik | #6366f1 | 📐 |
| Deutsch | #f59e0b | 📖 |
| Biologie | #10b981 | 🌿 |
| Englisch | #3b82f6 | 🇬🇧 |
| Chemie | #ef4444 | ⚗️ |
| Geschichte | #8b5cf6 | 🏛️ |
| Physik | #06b6d4 | ⚡ |
| Französisch | #ec4899 | 🇫🇷 |
| Sport | #f97316 | ⚽ |
| Kunst | #14b8a6 | 🎨 |
| Informatik | #3b82f6 | 💻 |
| Musik | #ec4899 | 🎵 |
| Geografie | #10b981 | 🌍 |
| Wirtschaft | #f59e0b | 📈 |
| Politik & Gesellschaft | #8b5cf6 | 🗳️ |
| Religion/Ethik | #94a3b8 | ✝️ |
| Latein | #d97706 | 📜 |
| Spanisch | #ef4444 | 🇪🇸 |

---

## 13. Environment Variables

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

## 14. UI-Komponenten (UI.jsx)

- `<Btn variant="primary|ghost|danger|success">` – Button
- `<Input label error>` – Formular-Input mit Label
- `<Modal width onClose>` – Overlay-Modal
- `<ModalHeader title onClose>` – Modal-Kopfzeile
- `<Pill label color>` – Farbiges Badge
- `<Divider>` – Trennlinie
- `<SectionTitle>` – Abschnittsüberschrift
- `<Spinner>` – Lade-Animation
- `<Empty icon text>` – Leerer Zustand
- `<Tag label bg fg>` – Kleines farbiges Tag
