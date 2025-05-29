const produktVorlagen = [
  // Aufschnitt
  { name: "Salami", kategorie: "Aufschnitt", icon: "bi-list-ul", menge: "1 Pck." },
  { name: "Schinken", kategorie: "Aufschnitt", icon: "bi-list-ul", menge: "1 Pck." },
  { name: "Wurst", kategorie: "Aufschnitt", icon: "bi-list-ul", menge: "1 Pck." },
  { name: "Leberwurst", kategorie: "Aufschnitt", icon: "bi-list-ul", menge: "1 Pck." },
  { name: "Putenschinken", kategorie: "Aufschnitt", icon: "bi-list-ul", menge: "1 Pck." },

  // Milchprodukte
  { name: "Milch", kategorie: "Milchprodukte", icon: "bi-box", menge: "1 L" },
  { name: "Joghurt", kategorie: "Milchprodukte", icon: "bi-cup-straw", menge: "4 Becher" },
  { name: "Butter", kategorie: "Milchprodukte", icon: "bi-droplet-half", menge: "1 Stück" },
  { name: "Käse", kategorie: "Milchprodukte", icon: "bi-droplet-half", menge: "1 Pck." },
  { name: "Sahne", kategorie: "Milchprodukte", icon: "bi-box", menge: "1 Becher" },
  { name: "Quark", kategorie: "Milchprodukte", icon: "bi-cup-straw", menge: "1 Becher" },

  // Backwaren
  { name: "Toast", kategorie: "Backwaren", icon: "bi-basket", menge: "1 Pck." },
  { name: "Brot", kategorie: "Backwaren", icon: "bi-basket", menge: "1 Laib" },
  { name: "Brötchen", kategorie: "Backwaren", icon: "bi-basket", menge: "6 Stück" },
  { name: "Croissants", kategorie: "Backwaren", icon: "bi-basket", menge: "4 Stück" },
  { name: "Wraps", kategorie: "Backwaren", icon: "bi-basket", menge: "1 Pck." },

  // Obst & Gemüse
  { name: "Apfel", kategorie: "Obst", icon: "bi-apple", menge: "4 Stück" },
  { name: "Banane", kategorie: "Obst", icon: "bi-apple", menge: "6 Stück" },
  { name: "Trauben", kategorie: "Obst", icon: "bi-apple", menge: "500 g" },
  { name: "Birnen", kategorie: "Obst", icon: "bi-apple", menge: "3 Stück" },
  { name: "Tomaten", kategorie: "Gemüse", icon: "bi-egg", menge: "4 Stück" },
  { name: "Gurke", kategorie: "Gemüse", icon: "bi-egg", menge: "1 Stück" },
  { name: "Kartoffeln", kategorie: "Gemüse", icon: "bi-egg", menge: "2 kg" },
  { name: "Zwiebeln", kategorie: "Gemüse", icon: "bi-egg", menge: "1 kg" },
  { name: "Paprika", kategorie: "Gemüse", icon: "bi-egg", menge: "2 Stück" },
  { name: "Möhren", kategorie: "Gemüse", icon: "bi-egg", menge: "1 Bund" },

  // Getränke
  { name: "Wasser", kategorie: "Getränke", icon: "bi-cup", menge: "6 Flaschen" },
  { name: "Cola", kategorie: "Getränke", icon: "bi-cup", menge: "1 Flasche" },
  { name: "Saft", kategorie: "Getränke", icon: "bi-cup", menge: "1 Flasche" },
  { name: "Bier", kategorie: "Getränke", icon: "bi-cup", menge: "6 Flaschen" },
  { name: "Tee", kategorie: "Getränke", icon: "bi-cup", menge: "1 Pck." },
  { name: "Kaffee", kategorie: "Getränke", icon: "bi-cup", menge: "1 Packung" },

  // Süßwaren
  { name: "Schokolade", kategorie: "Süßwaren", icon: "bi-star", menge: "1 Tafel" },
  { name: "Gummibärchen", kategorie: "Süßwaren", icon: "bi-star", menge: "1 Tüte" },
  { name: "Kekse", kategorie: "Süßwaren", icon: "bi-star", menge: "1 Pck." },
  { name: "Chips", kategorie: "Süßwaren", icon: "bi-star", menge: "1 Tüte" },
  { name: "Nüsse", kategorie: "Süßwaren", icon: "bi-star", menge: "1 Tüte" },

  // Haushalt
  { name: "Toilettenpapier", kategorie: "Haushalt", icon: "bi-house", menge: "1 Pck." },
  { name: "Zewa", kategorie: "Haushalt", icon: "bi-house", menge: "1 Pck." },
  { name: "Waschmittel", kategorie: "Haushalt", icon: "bi-house", menge: "1 Flasche" },
  { name: "Weichspüler", kategorie: "Haushalt", icon: "bi-house", menge: "1 Flasche" },
  { name: "Spülmittel", kategorie: "Haushalt", icon: "bi-house", menge: "1 Flasche" },
  { name: "Müllbeutel", kategorie: "Haushalt", icon: "bi-trash", menge: "1 Rolle" },
  { name: "Alufolie", kategorie: "Haushalt", icon: "bi-house", menge: "1 Rolle" },
  { name: "Frischhaltefolie", kategorie: "Haushalt", icon: "bi-house", menge: "1 Rolle" },
  { name: "Allzweckreiniger", kategorie: "Haushalt", icon: "bi-house", menge: "1 Flasche" },

  // Sonstiges
  { name: "Eier", kategorie: "Sonstiges", icon: "bi-egg", menge: "10 Stück" },
  { name: "Nudeln", kategorie: "Sonstiges", icon: "bi-egg", menge: "500 g" },
  { name: "Reis", kategorie: "Sonstiges", icon: "bi-egg", menge: "1 kg" },
  { name: "Öl", kategorie: "Sonstiges", icon: "bi-droplet", menge: "1 Flasche" },
  { name: "Mehl", kategorie: "Sonstiges", icon: "bi-droplet", menge: "1 kg" },
  { name: "Zucker", kategorie: "Sonstiges", icon: "bi-droplet", menge: "1 kg" },
  { name: "Hefe", kategorie: "Sonstiges", icon: "bi-droplet", menge: "1 Würfel" },
  { name: "Backpulver", kategorie: "Sonstiges", icon: "bi-droplet", menge: "1 Pck." },

  // Tiefkühl
  { name: "TK-Beeren", kategorie: "Tiefkühl", icon: "bi-snow", menge: "1 Pck." },
  { name: "Fischstäbchen", kategorie: "Tiefkühl", icon: "bi-snow", menge: "1 Pck." },

  // Tierbedarf
  { name: "Katzenfutter", kategorie: "Tierbedarf", icon: "bi-heart-pulse", menge: "1 Dose" },

  // Babyartikel
  { name: "Babybrei", kategorie: "Baby", icon: "bi-bandaid", menge: "1 Glas" },
  { name: "Schnuller", kategorie: "Baby", icon: "bi-bandaid", menge: "1 Stück" },

  // Drogerie
  { name: "Seife", kategorie: "Drogerie", icon: "bi-person", menge: "1 Stück" },
  { name: "Wattestäbchen", kategorie: "Drogerie", icon: "bi-person", menge: "1 Pck." },

  // Basics
  { name: "Essig", kategorie: "Basics", icon: "bi-dash", menge: "1 Flasche" },
  { name: "Senf", kategorie: "Basics", icon: "bi-dash", menge: "1 Tube" }
];
