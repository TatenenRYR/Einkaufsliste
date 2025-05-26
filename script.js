document.addEventListener("DOMContentLoaded", () => {
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

  const LISTEN_ID = new URLSearchParams(window.location.search).get("list") || "standardliste";

  let produkte = [];
  let zuletztGeloescht = null;

  const produktInput = document.getElementById("produktInput");
  const mengeInput = document.getElementById("mengeInput");
  const marktInput = document.getElementById("marktInput");
  const sortKategorie = document.getElementById("sortKategorie");
  const ul = document.getElementById("liste");

  db.collection("einkaufslisten").doc(LISTEN_ID).onSnapshot((doc) => {
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
  const kategorien = [
    { keywords: ["cola", "wasser", "saft", "bier"], kategorie: "Getränke", icon: "bi-cup-straw" },
    { keywords: ["apfel", "banane", "birne", "orange", "obst"], kategorie: "Obst", icon: "bi-apple" },
    { keywords: ["salat", "gurke", "tomate"], kategorie: "Gemüse", icon: "bi-emoji-smile" },
    { keywords: ["eier"], kategorie: "Eier", icon: "bi-egg" },
    { keywords: ["brot", "brötchen", "toast"], kategorie: "Backwaren", icon: "bi-basket" },
    { keywords: ["milch", "joghurt", "quark"], kategorie: "Milchprodukte", icon: "bi-box" },
    { keywords: ["käse"], kategorie: "Milchprodukte", icon: "bi-droplet" },
    { keywords: ["wurst", "aufschnitt", "salami"], kategorie: "Aufschnitt", icon: "bi-list-ul" },
    { keywords: ["hackfleisch", "fleisch", "hähnchen"], kategorie: "Fleisch", icon: "bi-egg-fried" },
    { keywords: ["zahnpasta", "seife", "duschgel"], kategorie: "Körperpflege", icon: "bi-heart-pulse" },
    { keywords: ["spülmittel", "reiniger", "putz"], kategorie: "Haushalt", icon: "bi-house" },
    { keywords: ["nudel", "reis", "mehl", "zucker"], kategorie: "Grundnahrungsmittel", icon: "bi-cart" },
  ];

  for (const eintrag of kategorien) {
    if (eintrag.keywords.some(k => n.includes(k))) {
      return { kategorie: eintrag.kategorie, icon: eintrag.icon };
    }
  }

  return { kategorie: "Sonstiges", icon: "bi-bag" };
}
  

  window.hinzufuegen = function () {
    const name = produktInput.value.trim();
    let menge = mengeInput.value.trim();
    const markt = marktInput.value.trim();
    if (!name) return;
    if (!menge) menge = "1 Stück";

    const { kategorie, icon } = erkenneKategorieUndIcon(name);
    const id = Date.now();
    produkte.push({ id, name, menge, markt, kategorie, icon, erledigt: false });

    speichereProdukte();
    produktInput.value = mengeInput.value = marktInput.value = '';
  }

  function aktualisiereKategorienDropdown() {
    const katSet = new Set(produkte.map(p => p.kategorie));
    sortKategorie.innerHTML = '<option value="">Keine Sortierung</option>';
    katSet.forEach(k => {
      if (k) {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        sortKategorie.appendChild(opt);
      }
    });
  }

  window.renderListe = function () {
    const kat = sortKategorie.value;
    ul.innerHTML = '';
    const gefiltert = kat ? produkte.filter(p => p.kategorie === kat) : produkte;
    gefiltert.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="produkt-info ${p.erledigt ? 'erledigt' : ''}" onclick="toggleErledigt(${p.id})">
        <i class="bi ${p.icon}"></i>
        <span><strong>${p.name}</strong> (${p.menge})<br><span class='kategorie'>${p.kategorie}${p.markt ? ' @ ' + p.markt : ''}</span></span>
      </span>
      <span class='aktionen'>
        <button onclick="aendereMenge(${p.id},1)">+</button>
        <button onclick="aendereMenge(${p.id},-1)">-</button>
      </span>`;
      ul.appendChild(li);
    });
  }

  window.aendereMenge = function (id, delta) {
    const p = produkte.find(p => p.id === id);
    const match = p.menge.match(/(\d+)(\s*\w*)/);
    if (match) {
      let zahl = parseInt(match[1]);
      const einheit = match[2];
      zahl += delta;
      if (zahl <= 0) {
        zuletztGeloescht = p;
        produkte = produkte.filter(prod => prod.id !== id);
        zeigeUndo();
      } else {
        p.menge = `${zahl}${einheit}`.trim();
      }
      speichereProdukte();
    }
  }

  window.toggleErledigt = function (id) {
    const p = produkte.find(p => p.id === id);
    if (p) {
      p.erledigt = !p.erledigt;
      speichereProdukte();
    }
  }

  function zeigeUndo() {
    const popup = document.getElementById("undoPopup");
    popup.style.display = "block";
    setTimeout(() => popup.style.display = "none", 5000);
  }

  window.undoLoeschen = function () {
    if (zuletztGeloescht) {
      produkte.push(zuletztGeloescht);
      speichereProdukte();
      zuletztGeloescht = null;
      document.getElementById("undoPopup").style.display = "none";
    }
  }

  window.teileListe = function () {
    const text = produkte.map(p => `• ${p.name} (${p.menge})`).join("%0A");
    const link = `https://wa.me/?text=${text}`;
    window.open(link, '_blank');
  }
});
