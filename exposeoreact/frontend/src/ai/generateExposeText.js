export const generateExposeText = async (form, t) => {
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
    //console.log(prompt);
    //console.log(t.given_language);

    try {
        
        const baseUrl =
            import.meta.env.MODE === "development"
                ? "http://localhost:5000" 
                : "https://api-exposeo.onrender.com";

        const response = await fetch(`${baseUrl}/api/generate-text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ form, prompt })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend-Fehler: ${response.status} – ${errorText}`);
        }

        const data = await response.json();
        return data.text.trim();
    } catch (err) {
        console.error("Fehler bei generateExposeText:", err);
        throw err;
    }
};
