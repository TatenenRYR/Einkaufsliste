
// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'einkaufsliste.json');

app.use(express.json());
app.use(express.static('public')); // Ordner für index.html + JS + CSS

// Einkaufsliste laden oder neu erstellen
function loadList() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function saveList(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// API: Liste holen
app.get('/api/list', (req, res) => {
  try {
    const list = loadList();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Laden der Liste' });
  }
});

// API: Item hinzufügen oder updaten
app.post('/api/list', (req, res) => {
  try {
    const { name, category, checked = false, qty = 1 } = req.body;
    if (!name) return res.status(400).json({ error: 'Name fehlt' });

    const list = loadList();
    const existing = list.find(i => i.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      existing.qty += qty;
      existing.checked = checked;
    } else {
      list.push({ name, category, checked, qty });
    }

    saveList(list);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Speichern' });
  }
});

// API: Item löschen
app.delete('/api/list/:name', (req, res) => {
  try {
    const name = req.params.name;
    let list = loadList();
    list = list.filter(i => i.name.toLowerCase() !== name.toLowerCase());
    saveList(list);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Löschen' });
  }
});

// API: Item ändern (z.B. checked oder qty ändern)
app.put('/api/list/:name', (req, res) => {
  try {
    const name = req.params.name;
    const { checked, qty } = req.body;
    const list = loadList();
    const item = list.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) return res.status(404).json({ error: 'Item nicht gefunden' });

    if (typeof checked === 'boolean') item.checked = checked;
    if (typeof qty === 'number') item.qty = qty > 0 ? qty : 1;

    saveList(list);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
