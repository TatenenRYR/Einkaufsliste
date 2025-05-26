// Firebase-Konfiguration & Initialisierung
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

// Daten aus Firebase live laden
db.collection("einkaufslisten").doc(LISTEN_ID)
  .onSnapshot((doc) => {
    if (doc.exists) {
      produkte = doc.data().produkte || [];
      aktualisiereKategorienDropdown();
      renderListe();
    }
  });

function speichereProdukte() {
  db.collection("einkaufslisten").doc(LISTEN_ID).set({ produkte });
}

// Kategorie- und Icon-Erkennung
function erkenneKategorieUndIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("cola") || n.includes("wasser") || n.includes("saft") || n.includes("bier")) return { kategorie: "Getränke", icon: "bi-cup-straw" };
  if (n.includes("apfel") || n.includes("banane") || n.includes("birne")) return { kategorie: "Obst", icon: "bi-apple" };
  if (n.includes("salat")) return { kategorie: "Salat", icon: "bi-emoji-smile" };
  if (n.includes("eier")) return { kategorie: "Eier", icon: "bi-egg" };
  if (n.includes("brot") || n.includes("brötchen")) return { kategorie: "Backwaren", icon: "bi-basket" };
  if (n.includes("milch") || n.includes("joghurt")) return { kategorie: "Milchprodukte", icon: "bi-box" };
  if (n.includes("käse")) return { kategorie: "Milchprodukte", icon: "bi-droplet" };
  if (n.includes("wurst") || n.includes("aufschnitt")) return { kategorie: "Aufschnitt", icon: "bi-list-ul" };
  if (n.includes("hackfleisch") || n.includes("fleisch")) return { kategorie: "Fleisch", icon: "bi-egg-fried" };
  if (n.includes("zahnpasta") || n.includes("seife")) return { kategorie: "Körperpflege", icon: "bi-heart-pulse" };
  if (n.includes("spülmittel") || n.includes("reiniger")) return { kategorie: "Haushalt", icon: "bi-house" };
  return { kategorie: "Sonstiges", icon: "bi-bag" };
}

// Produkt hinzufügen (plus Mengenaddition bei gleichem Produkt + Markt)
function hinzufuegen() {
  const name = document.getElementById("produktInput").value.trim();
  let menge = document.getElementById("mengeInput").value.trim();
  const markt = document.getElementById("marktInput").value.trim();
  if (!name) return;
  if (!menge) menge = "1 Stück";

  // Prüfen ob Produkt mit gleicher Kategorie, Menge & Markt schon existiert
  const { kategorie, icon } = erkenneKategorieUndIcon(name);
  const existierendesProdukt = produkte.find(p =>
    p.name.toLowerCase() === name.toLowerCase() &&
    p.kategorie === kategorie &&
    p.markt === markt
  );

  if (existierendesProdukt) {
    // Menge parsen & addieren
    const matchExist = existierendesProdukt.menge.match(/(\d+)(\s*\w*)/);
    const matchNeu = menge.match(/(\d+)(\s*\w*)/);
    if (matchExist && matchNeu && matchExist[2].trim() === matchNeu[2].trim()) {
      const neueZahl = parseInt(matchExist[1]) + parseInt(matchNeu[1]);
      existierendesProdukt.menge = neueZahl + matchExist[2];
    } else {
      // Falls Einheiten unterschiedlich oder nicht parsebar, hänge Menge an (z.B. "2 Stück + 1 Paket")
      existierendesProdukt.menge += " + " + menge;
    }
  } else {
    const id = Date.now();
    produkte.push({ id, name, menge, markt, kategorie, icon, erledigt: false });
  }

  speichereProdukte();
  document.getElementById("produktInput").value = '';
  document.getElementById("mengeInput").value = '';
  document.getElementById("marktInput").value = '';
}

function aktualisiereKategorienDropdown() {
  const katSet = new Set(produkte.map(p => p.kategorie));
  const sortKategorie = document.getElementById("sortKategorie");
  sortKategorie.innerHTML = '<option value="">Keine Sortierung</option>';
  katSet.forEach(k
