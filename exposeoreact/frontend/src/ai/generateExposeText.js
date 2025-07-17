// src/ai/generateExposeText.js
export const generateExposeText = async (form) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Vite: .env Variable

    const prompt = `
Erstelle ein Immobilien-Exposé im Tonfall "${form.tonfall}".
Hier sind die Eckdaten:
- Adresse: ${form.adresse}
- Wohnfläche: ${form.wohnflaeche} m&sup2;
- Grundstück: ${form.grundstueck} m&sup2;
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
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4", //  fallback unten, falls kein Zugriff
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API-Fehler: ${response.status} – ${errorText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
};