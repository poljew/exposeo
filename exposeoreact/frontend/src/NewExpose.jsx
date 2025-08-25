// src/ai/generateExposeText.js
export const generateExposeText = async (form) => {
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

    try {
        // Hier rufen wir jetzt unser eigenes Backend auf, nicht direkt OpenAI
        const response = await fetch("/api/generate-text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend-Fehler: ${response.status} – ${errorText}`);
        }

        const data = await response.json();
        return data.result.trim();
    } catch (err) {
        console.error("Fehler bei generateExposeText:", err);
        throw err;
    }
};
