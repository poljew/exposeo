import express from "express";
import fetch from "node-fetch"; // Falls du Node <18 nutzt, sonst global verfügbar
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Route für Text-Generierung
app.post("/api/generate-text", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt fehlt" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}` // nur serverseitig
            },
            body: JSON.stringify({
                model: "gpt-4", // oder gpt-4o / gpt-3.5-turbo, je nach Verfügbarkeit
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res
                .status(response.status)
                .json({ error: `OpenAI API-Fehler: ${errorText}` });
        }

        const data = await response.json();
        const result = data.choices[0].message.content;

        res.json({ result });
    } catch (err) {
        console.error("Fehler beim Aufruf der OpenAI API:", err);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});