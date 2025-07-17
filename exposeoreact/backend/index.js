// backend/index.js
require('dotenv').config(); // ganz oben in deiner Datei

const port = process.env.PORT || 3001;
const openaiKey = process.env.OPENAI_API_KEY;
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Beispielroute: KI-generiertes Immobilien-Exposé
app.post('/generate-expose', async (req, res) => {
    const { propertyDescription } = req.body;

    if (!propertyDescription) {
        return res.status(400).json({ error: 'propertyDescription is required' });
    }
    // Wenn KI-Key vorhanden ist, hier GPT-Aufruf einfügen
    if (OPENAI_API_KEY) {
        // Placeholder für späteren GPT-Call (z. B. mit openai SDK)
        console.log('GPT-Anfrage simuliert');
    }
    // Hier könntest du z. B. OpenAI aufrufen. Beispielausgabe:
    const generatedText = `Exposé-Vorschlag:\n\n${propertyDescription}\n\nHighlights: Lage, Ausstattung, Energieeffizienz, Umgebung ...`;

    res.json({ expose: generatedText });
});

// Start des Servers
app.listen(port, () => {
    console.log(`Backend läuft auf http://localhost:${port}`);
});