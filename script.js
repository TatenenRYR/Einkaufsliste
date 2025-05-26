// Firebase-Konfiguration (DEINE Werte hier einsetzen)

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7pocrD9_46QNoz1jrxggpzkL7E6IhetY",
  authDomain: "einkaufliste-cd5d3.firebaseapp.com",
  databaseURL: "https://einkaufliste-cd5d3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "einkaufliste-cd5d3",
  storageBucket: "einkaufliste-cd5d3.firebasestorage.app",
  messagingSenderId: "36721747923",
  appId: "1:36721747923:web:dbe48ff974c80435eff126",
  measurementId: "G-37TDK0257N"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const LISTEN_ID = "standardliste";

const produktInput = document.getElementById("produktInput");
const mengeInput = document.getElementById("mengeInput");
const marktInput = document.getElementById("marktInput");
const btnHinzufuegen = document.getElementById("btnHinzufuegen");
const listeUL = document.getElementById("liste");
const sortKategorie = document.getElementById("sortKategorie");
const btnTeilen = document.getElementById("btnTeilen");

let produkte = [];

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

function speichereProdukte() {
  return db.collection("einkaufslisten").doc(LISTEN_ID).set({ produkte });
}

function aktualisiereKategorienDropdown() {
  const katSet = new Set(produkte.map(p => p.kategorie));
  sortKategorie.innerHTML = '<option value="">Alle Kategorien</option>';
  katSet.forEach(k => {
    if (k) {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      sortKategorie.appendChild(opt);
    }
  });
}

function renderListe() {
  const filterKat = sortKategorie.value;
  listeUL.innerHTML = "";

  const gefiltert = filterKat ? produkte.filter(p => p.kategorie === filterKat) : produkte;
  if (gefiltert.length === 0) {
    listeUL.innerHTML = `<li>Keine Produkte${filterKat ? " in Kategorie " + filterKat : ""}.</li>`;
    return;
  }

  gefiltert.forEach(p => {
    const li = document.createElement("li");
    li.className = p.erledigt ? "erledigt" : "";
    li.innerHTML = `
      <div class="produkt-info">
        <i class="bi ${p.icon}"></i>
        <span><strong>${p.name}</strong> (${p.menge})<br><span class="kategorie">${p.kategorie}${p.markt ? " @ " + p.markt : ""}</span></span>
      </div>
      <div>
        <button class="plus" aria-label="Menge erhöhen">+</button>
        <button class="minus" aria-label="Menge verringern">-</button>
      </div>
    `;

    // Menge erhöhen
    li.querySelector(".plus").onclick = () => {
      p.menge = parseInt(p.menge) + 1;
      speichereProdukte();
    };
    // Menge verringern oder löschen
    li.querySelector(".minus").onclick = () => {
      let mengeNum = parseInt(p.menge);
      mengeNum--;
      if (mengeNum <= 0) {
        produkte = produkte.filter(x => x !== p);
      } else {
        p.menge = mengeNum;
      }
      speichereProdukte();
    };

    // Toggle erledigt durch Klick auf li
    li.querySelector(".produkt-info").onclick = () => {
      p.erledigt = !p.erledigt;
      speichereProdukte();
    };

    listeUL.appendChild(li);
  });
}

btnHinzufuegen.addEventListener("click", () => {
  const name = produktInput.value.trim();
  let menge = mengeInput.value.trim() || "1";
  const markt = marktInput.value.trim();

  if (!name) {
    alert("Bitte Produktname eingeben.");
    return;
  }

  const { kategorie, icon } = erkenneKategorieUndIcon(name);

  // Prüfen, ob Produkt mit selbem Namen & Markt existiert
  const existierendesProdukt = produkte.find(p => p.name.toLowerCase() === name.toLowerCase() && p.markt === markt);

  if (existierendesProdukt) {
    // Menge addieren (nur Zahlen)
    const alt = parseInt(existierendesProdukt.menge) || 1;
    const neu = parseInt(menge) || 1;
    existierendesProdukt.menge = alt + neu;
  } else {
    produkte.push({ name, menge: parseInt(menge) || 1, markt, kategorie, icon, erledigt: false });
  }

  speichereProdukte().then(() => {
    produktInput.value = "";
    mengeInput.value = "";
    marktInput.value = "";
    produktInput.focus();
  });
});

sortKategorie.addEventListener("change", () => {
  renderListe();
});

btnTeilen.addEventListener("click", () => {
  const text = produkte.map(p => `• ${p.name} (${p.menge})${p.markt ? " @ " + p.markt : ""}`).join("\n");
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

// Echtzeit Listener, aktualisiert lokal bei Firebase-Änderungen
db.collection("einkaufslisten").doc(LISTEN_ID).onSnapshot(doc => {
  if (doc.exists) {
    produkte = doc.data().produkte || [];
    aktualisiereKategorienDropdown();
    renderListe();
  } else {
    produkte = [];
    aktualisiereKategorienDropdown();
    renderListe();
  }
});
