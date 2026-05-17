# 📚 ClassSync

> Unterrichtsmaterial teilen – einfach, schnell, für deine Klasse.

ClassSync ist eine Web-App die Schülern ermöglicht, Mitschriften, Hausaufgaben-Lösungen und Lernzettel mit ihrer Klasse zu teilen. Organisiert nach Stundenplan, immer aktuell, ohne Werbung.

---

## Was kann ClassSync?

**📁 Material teilen**
Lade PDFs und Fotos hoch – direkt in der App lesbar. Typen wie Mitschrift, HA-Lösung, Aufgabenblatt und Lernzettel helfen beim schnellen Finden.

**🗓 Stundenplan als Startpunkt**
Klicke auf eine Stunde und komm direkt zu den Materialien des Fachs. Du siehst nur die Kurse in denen du bist.

**📋 Hausaufgaben & Prüfungen**
Trag Hausaufgaben ein, hak sie ab wenn erledigt. Prüfungen zeigen einen automatischen Countdown in Tagen.

**💬 Echtzeit-Chat**
Jeder Kurs hat seinen eigenen Chat – Nachrichten erscheinen sofort, ohne neu laden.

**⭐ Danksagungen**
Like nützliche Materialien um deinen Mitschülern Feedback zu geben.

**🔒 Nur deine Klasse**
Inhalte sind nur für Mitglieder der eigenen Klasse sichtbar. Kein fremder kann auf eure Materialien zugreifen.

---

## Wie funktioniert es?

1. **Account erstellen** – mit Email, Passwort und einem Nickname
2. **Klasse beitreten** – mit dem Zugangscode deines Klassensprechers, oder selbst eine Klasse erstellen
3. **Kurse wählen** – tritt den Fächern bei die du belegst
4. **Loslegen** – Material hochladen, Hausaufgaben eintragen, im Chat schreiben

---

## Rollen

| Rolle | Rechte |
|---|---|
| Schüler | Kurse beitreten, Material hochladen, HA & Prüfungen eintragen |
| Kurs-Admin | Eigenen Kurs bearbeiten und löschen |
| Klassen-Admin | Alle Kurse verwalten, Klasse löschen |

---

## Tech Stack

- **React** + **Vite**
- **Firebase** – Authentication, Firestore, Storage
- **Vercel** – Hosting

---

## Selbst hosten

```bash
git clone https://github.com/dein-username/classsync.git
cd classsync
npm install
```

Erstelle eine `.env.local` mit deinen Firebase-Keys und starte den Entwicklungsserver:

```bash
npm run dev
```

---

Gebaut von einem Schüler, für Schüler.