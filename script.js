// Firebase config (bitte mit deinen Werten ersetzen)
const firebaseConfig = {
  apiKey: "AIzaSyD7pocrD9_46QNoz1jrxggpzkL7E6IhetY",
  authDomain: "einkaufliste-cd5d3.firebaseapp.com",
  projectId: "einkaufliste-cd5d3",
  storageBucket: "einkaufliste-cd5d3.firebasestorage.app",
  messagingSenderId: "36721747923",
  appId: "1:36721747923:web:dbe48ff974c80435eff126",
  measurementId: "G-37TDK0257N"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const LISTEN_ID = params.get("list") || params.get("liste") || "standardliste";

let produkte = [];
let zuletztGeloescht = null;

const produktInput = document.getElementById("produktInput");
const mengeInput = document.getElementById("mengeInput");
const marktInput = document.getElementById("marktInput");
const sortKategorie = document.getElementById("sortKategorie");
const marktSortToggle = document.getElementById("marktSortToggle");
const listeUL = document.getElementById("liste");
const undoPopup = document.getElementById("undoPopup");
const btnUndo = document.getElementById("btnUndo");
const btnHinzufuegen = document.getElementById("btnHinzufuegen");
const btnTeilen = document.getElementById("btnTeilen");

// Markt-Gang Reihenfolge zur Sortierung
const marktGangReihenfolge = {
  "Obst & Gemüse": 1,
  "Getränke": 2,
  "Backwaren": 3,
  "Milchprodukte": 4,
  "Fleisch": 5,
  "Aufschnitt": 6,
  "Haushalt": 7,
  "Körperpflege": 8,
  "Sonstiges": 9
};

// Daten von Firebase laden und automatisch aktualisieren
db.collection("einkaufslisten").doc(LISTEN_ID)
  .onSnapshot(doc => {
    if (doc.exists) {
      produkte = doc.data().produkte || [];
      aktualisiereKategorienDropdown();
      renderListe();
    }
  });

function speichereProdukte() {
  db.collection("einkaufslisten").doc(LISTEN_ID).set({ produkte });
}

function erkenneKategorieUndIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("cola") || n.includes("wasser") || n.includes("saft") || n.includes("bier")) return
