export const COLORS = {
  Mathematik: "#6366f1", Deutsch: "#f59e0b", Biologie: "#10b981",
  Englisch: "#3b82f6", Chemie: "#ef4444", Geschichte: "#8b5cf6",
  Physik: "#06b6d4", Französisch: "#ec4899", Sport: "#f97316", Kunst: "#14b8a6",
};

export const ICONS = {
  Mathematik: "📐", Deutsch: "📖", Biologie: "🌿", Englisch: "🇬🇧",
  Chemie: "⚗️", Geschichte: "🏛️", Physik: "⚡", Französisch: "🇫🇷",
  Sport: "⚽", Kunst: "🎨",
};

export const TYPEN = ["Alle", "Mitschrift", "HA-Lösung", "Lernzettel", "Zusammenfassung", "Aufgabenblatt"];

export const TYP_COLORS = {
  "Mitschrift": "#6366f1", "HA-Lösung": "#10b981", "Lernzettel": "#f59e0b",
  "Zusammenfassung": "#3b82f6", "Aufgabenblatt": "#8b5cf6",
};

export const DAYS = ["Mo", "Di", "Mi", "Do", "Fr"];
export const DAY_LABELS = { Mo: "Montag", Di: "Dienstag", Mi: "Mittwoch", Do: "Donnerstag", Fr: "Freitag" };

export const KLASSEN = {
  Q12A: {
    name: "Q12 – Kurs A", stufe: "Q12",
    kurse: [
      { id: 1, name: "Mathematik", lehrer: "Hr. Hoffmann", raum: "204" },
      { id: 2, name: "Deutsch", lehrer: "Fr. Maier", raum: "112" },
      { id: 3, name: "Biologie", lehrer: "Fr. Schmidt", raum: "310" },
      { id: 4, name: "Englisch", lehrer: "Hr. Weber", raum: "108" },
      { id: 5, name: "Chemie", lehrer: "Hr. Braun", raum: "Chemiesaal" },
      { id: 6, name: "Geschichte", lehrer: "Fr. König", raum: "215" },
      { id: 7, name: "Physik", lehrer: "Hr. Fischer", raum: "Physikraum" },
    ],
    stundenplan: {
      Mo: [{ fach: "Mathematik", zeit: "07:50", raum: "204" }, { fach: "Deutsch", zeit: "09:40", raum: "112" }, { fach: "Biologie", zeit: "11:30", raum: "310" }, { fach: "Geschichte", zeit: "13:15", raum: "215" }],
      Di: [{ fach: "Englisch", zeit: "07:50", raum: "108" }, { fach: "Chemie", zeit: "09:40", raum: "Chemiesaal" }, { fach: "Mathematik", zeit: "12:20", raum: "204" }, { fach: "Physik", zeit: "14:05", raum: "Physikraum" }],
      Mi: [{ fach: "Deutsch", zeit: "08:45", raum: "112" }, { fach: "Biologie", zeit: "10:35", raum: "310" }, { fach: "Physik", zeit: "12:20", raum: "Physikraum" }],
      Do: [{ fach: "Mathematik", zeit: "07:50", raum: "204" }, { fach: "Englisch", zeit: "09:40", raum: "108" }, { fach: "Chemie", zeit: "11:30", raum: "Chemiesaal" }, { fach: "Deutsch", zeit: "13:15", raum: "112" }],
      Fr: [{ fach: "Biologie", zeit: "07:50", raum: "310" }, { fach: "Geschichte", zeit: "09:40", raum: "215" }, { fach: "Englisch", zeit: "11:30", raum: "108" }],
    },
    materialien: {
      Mathematik: [
        { id: 1, typ: "Mitschrift", titel: "Ableitungsregeln – Zusammenfassung", autor: "Lisa M.", datum: "Heute", likes: 7, dateiTyp: "PDF", seiten: 3, preview: "Ketten-, Produkt- und Quotientenregel mit Beispielen" },
        { id: 2, typ: "HA-Lösung", titel: "S. 87 Aufg. 3–7 vollständig", autor: "Jannik", datum: "Gestern", likes: 12, dateiTyp: "Foto", seiten: 2, preview: "Alle Lösungswege mit Zwischenschritten" },
        { id: 3, typ: "Lernzettel", titel: "Analysis Formelsammlung Abitur", autor: "Anna K.", datum: "12.05.", likes: 24, dateiTyp: "PDF", seiten: 4, preview: "Kompakte Übersicht aller Ableitungs- und Integrationsregeln" },
        { id: 4, typ: "Mitschrift", titel: "Tafelbild Kettenregel", autor: "Max B.", datum: "11.05.", likes: 5, dateiTyp: "Foto", seiten: 1, preview: "Foto des Tafelbilds von Montag" },
        { id: 5, typ: "Aufgabenblatt", titel: "Übungsblatt Klausurvorbereitung", autor: "Hr. Hoffmann", datum: "10.05.", likes: 18, dateiTyp: "PDF", seiten: 6, preview: "Klausurrelevante Aufgaben mit Lösungshinweisen" },
      ],
      Deutsch: [
        { id: 6, typ: "Mitschrift", titel: "Faust I – Charakteranalyse", autor: "Max B.", datum: "Heute", likes: 9, dateiTyp: "Notiz", seiten: 2, preview: "Gretchen, Faust, Mephisto – Charakterzüge & Beziehungen" },
        { id: 7, typ: "Zusammenfassung", titel: "Epoche Sturm und Drang", autor: "Sara L.", datum: "13.05.", likes: 15, dateiTyp: "PDF", seiten: 3, preview: "Merkmale, Vertreter, Werke" },
        { id: 8, typ: "HA-Lösung", titel: "Kurzanalyse Szene 3", autor: "Lena W.", datum: "12.05.", likes: 8, dateiTyp: "Notiz", seiten: 1, preview: "Vollständige Analyse mit Zitaten" },
      ],
      Biologie: [
        { id: 9, typ: "Lernzettel", titel: "Mitose – alle Phasen", autor: "Anna K.", datum: "Heute", likes: 11, dateiTyp: "PDF", seiten: 2, preview: "Interphase bis Telophase mit Skizzen" },
        { id: 10, typ: "Mitschrift", titel: "Genetik Stunde vom 13.05.", autor: "Tom F.", datum: "13.05.", likes: 6, dateiTyp: "Foto", seiten: 3, preview: "Mendel'sche Regeln, Kreuzungsschema" },
        { id: 11, typ: "HA-Lösung", titel: "Diagramm Zellteilung", autor: "Mia K.", datum: "12.05.", likes: 4, dateiTyp: "Foto", seiten: 1, preview: "Gezeichnetes und beschriftetes Diagramm" },
      ],
      Englisch: [
        { id: 12, typ: "Lernzettel", titel: "Vokabeln Unit 6 komplett", autor: "Felix W.", datum: "Heute", likes: 20, dateiTyp: "PDF", seiten: 2, preview: "Alle Vokabeln mit Übersetzung und Beispielsätzen" },
        { id: 13, typ: "Mitschrift", titel: "Grammar: Conditionals", autor: "Jana P.", datum: "11.05.", likes: 13, dateiTyp: "Notiz", seiten: 2, preview: "Type 1, 2, 3 mit Beispielen" },
      ],
      Chemie: [
        { id: 14, typ: "Mitschrift", titel: "Redoxreaktionen – Einführung", autor: "Tom F.", datum: "Heute", likes: 7, dateiTyp: "PDF", seiten: 3, preview: "Oxidation, Reduktion, Elektronenübertragung" },
        { id: 15, typ: "HA-Lösung", titel: "Gleichungen Redox S.44", autor: "Lisa M.", datum: "12.05.", likes: 9, dateiTyp: "Foto", seiten: 2, preview: "Alle Gleichungen ausgeglichen und erklärt" },
        { id: 16, typ: "Zusammenfassung", titel: "Klausurvorbereitung Redox", autor: "Jannik", datum: "10.05.", likes: 21, dateiTyp: "PDF", seiten: 5, preview: "Alles Klausurrelevante auf 5 Seiten" },
      ],
      Geschichte: [
        { id: 17, typ: "Lernzettel", titel: "Weimarer Republik Zeitleiste", autor: "Sara L.", datum: "Gestern", likes: 16, dateiTyp: "Foto", seiten: 2, preview: "Alle wichtigen Ereignisse 1918–1933" },
        { id: 18, typ: "Mitschrift", titel: "Stunde vom 13.05. – Inflation", autor: "Max B.", datum: "13.05.", likes: 5, dateiTyp: "Notiz", seiten: 2, preview: "Hyperinflation 1923, Ursachen & Folgen" },
      ],
      Physik: [
        { id: 19, typ: "Mitschrift", titel: "Brechungsgesetz – Herleitung", autor: "Felix W.", datum: "Gestern", likes: 8, dateiTyp: "PDF", seiten: 2, preview: "Snellius'sches Brechungsgesetz mit Beweis" },
        { id: 20, typ: "HA-Lösung", titel: "Aufgaben Optik S. 55", autor: "Anna K.", datum: "12.05.", likes: 6, dateiTyp: "Foto", seiten: 2, preview: "Vollständige Lösungen mit Zeichnungen" },
      ],
    },
    hausaufgaben: {
      Mathematik: [{ id: 1, text: "S. 87 Aufgaben 3–7", faellig: "Morgen", done: false }, { id: 2, text: "Klausurvorbereitung Blatt 2", faellig: "Fr, 17.05.", done: false }],
      Deutsch: [{ id: 3, text: "Kurzanalyse Faust I, Szene 3", faellig: "Übermorgen", done: false }, { id: 4, text: "Epochenmerkmale auswendig", faellig: "Mo, 19.05.", done: true }],
      Biologie: [{ id: 5, text: "Diagramm Zellteilung", faellig: "Fr, 17.05.", done: false }],
      Englisch: [{ id: 6, text: "Vokabeln Unit 6", faellig: "Heute", done: true }, { id: 7, text: "Essay Climate Change 200 Wörter", faellig: "Do, 16.05.", done: false }],
      Chemie: [{ id: 8, text: "Redoxgleichungen S.44", faellig: "Di, 20.05.", done: false }],
      Geschichte: [{ id: 9, text: "S. 102–105 lesen", faellig: "Morgen", done: false }],
      Physik: [{ id: 10, text: "Aufgaben Optik S. 55", faellig: "Mi, 21.05.", done: false }],
    },
    pruefungen: [
      { id: 1, fach: "Chemie", titel: "Klausur Redox", datum: "20.05.2025", tage: 7 },
      { id: 2, fach: "Mathematik", titel: "Klausur Analysis", datum: "28.05.2025", tage: 15 },
      { id: 3, fach: "Deutsch", titel: "Aufsatz Faust I", datum: "03.06.2025", tage: 21 },
      { id: 4, fach: "Geschichte", titel: "Test Weimarer Republik", datum: "10.06.2025", tage: 28 },
      { id: 5, fach: "Physik", titel: "Klausur Optik", datum: "17.06.2025", tage: 35 },
    ],
  },
};