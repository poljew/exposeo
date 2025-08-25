//import express from "express";
//import fetch from "node-fetch"; // Falls du Node <18 nutzt, sonst global verfügbar
//import dotenv from "dotenv";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { fileURLToPath } = require("url");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route für Text-Generierung
app.post("/api/generate-expose", async (req, res) => {
    try {
        const { form } = req.body;

        const prompt = `
Erstelle ein Immobilien-Exposé im Tonfall "${form.tonfall}".
Hier sind die Eckdaten:
- Adresse: ${form.adresse}
- Wohnfläche: ${form.wohnflaeche} m²
- Grundstück: ${form.grundstueck} m²
- Baujahr: ${form.baujahr}
- Immobilientyp: ${form.immobilientyp}
- Zimmer: ${form.zimmer}
- Zustand: ${form.zustand}
- Energieausweis: ${form.energieausweis}
- Ausstattung: ${form.ausstattung.join(", ")}
- Besonderheiten: ${form.besonderheiten}
- Zielgruppe: ${form.zielgruppe.join(", ")}
- Preis: ${form.preis} EUR

Bitte schreibe einen ansprechenden Exposé-Text.
`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
            }),
        });

        const result = await response.json();
        res.json({ text: result.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler bei der Exposé-Erstellung" });
    }
});

// Statische Dateien ausliefern (Frontend Build)
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Alle unbekannten Routen -> index.html (React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Port dynamisch (Render) oder 5000 lokal
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server l&auml;uft auf Port ${PORT}`));