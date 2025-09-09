import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { useLanguage } from "./LanguageContext.jsx";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pfade für __dirname / __filename definieren (weil ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { t } = useLanguage();

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});
// Route für Text-Generierung
app.post("/api/generate-text", async (req, res) => {
    try {
        const { form } = req.body;
        const translatedAusstattung = form.ausstattung.map(a => t.ausstattung_options[a] || a);
        const translatedZustand = t.zustand_options[form.zustand] || form.zustand;
        const translatedZielgruppe = form.zielgruppe.map(z => t.zielgruppe_options[z] || z);
        const translatedImmobilientyp = Array.isArray(form.immobilientyp)
        ? form.immobilientyp.map(i => t.immobilientyp_options[i] || i).join(", ")
        : t.immobilientyp_options[form.immobilientyp] || form.immobilientyp;


        const prompt = `
${t.prompt_part_1} ${form.tonfall} ${t.prompt_part_5} ${t.given_language}. ${t.prompt_part_4}:
- ${t.adresse}: ${form.adresse}
- ${t.wohnflaeche}: ${form.wohnflaeche} m²
- ${t.grundstueck}: ${form.grundstueck} m²
- ${t.baujahr}: ${form.baujahr}
- ${t.immobilientyp_label}: ${translatedImmobilientyp}
- ${t.zimmer}: ${form.zimmer}
- ${t.zustand}: ${translatedZustand}
- ${t.energieausweis}: ${form.energieausweis}
- ${t.ausstattung}: ${translatedAusstattung.join(", ")}
- ${t.besonderheiten}: ${form.besonderheiten}
- ${t.zielgruppe}: ${translatedZielgruppe.join(", ")}
- ${t.preis}: ${form.preis} EUR

${t.prompt_part_2} ${form.adresse} ${t.prompt_part_3} ${form.adresse}.
${t.prompt_part_6} ${t.given_language}. 
`;
        
       
//        const prompt = `
//Erstelle ein Immobilien-Exposé im Tonfall "${form.tonfall}".
//Hier sind die Eckdaten:
//- Adresse: ${form.adresse}
//- Wohnfläche: ${form.wohnflaeche} m²
//- Grundstück: ${form.grundstueck} m²
//- Baujahr: ${form.baujahr}
//- Immobilientyp: ${form.immobilientyp}
//- Zimmer: ${form.zimmer}
//- Zustand: ${form.zustand}
//- Energieausweis: ${form.energieausweis}
//- Ausstattung: ${form.ausstattung.join(", ")}
//- Besonderheiten: ${form.besonderheiten}
//- Zielgruppe: ${form.zielgruppe.join(", ")}
//- Preis: ${form.preis} EUR

//Bitte schreibe einen ansprechenden Exposé-Text.
//`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }]
            })
        });

        console.log(prompt);
        console.log(t.given_language);

        const result = await response.json();
        

        if (!result.choices || !result.choices[0]?.message?.content) {
            throw new Error("Ungültige API-Antwort");
        }

        res.json({ text: result.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler bei der Expose-Erstellung" });
    }
});

// Statische Dateien ausliefern (Frontend Build)
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Alle unbekannten Routen -> index.html (für React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Port dynamisch (Render) oder 5000 lokal
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
