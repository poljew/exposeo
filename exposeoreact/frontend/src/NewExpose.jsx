import React, { useState } from "react";
import { generateExposeText } from "./ai/generateExposeText";

export default function NewExpose() {
    const [form, setForm] = useState({
        adresse: "",
        wohnflaeche: "",
        grundstueck: "",
        baujahr: "",
        immobilientyp: "",
        zimmer: "",
        zustand: "",
        energieausweis: "",
        ausstattung: [],
        besonderheiten: "",
        zielgruppe: [],
        preis: "",
        tonfall: "neutral"
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult("");

        try {
            const text = await generateExposeText(form);
            setResult(text);
        } catch (err) {
            setError("Fehler beim Generieren: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h1>Neues Exposé erstellen</h1>
            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    name="adresse"
                    placeholder="Adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="wohnflaeche"
                    placeholder="Wohnfläche (m²)"
                    value={form.wohnflaeche}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="grundstueck"
                    placeholder="Grundstück (m²)"
                    value={form.grundstueck}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="baujahr"
                    placeholder="Baujahr"
                    value={form.baujahr}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="immobilientyp"
                    placeholder="Immobilientyp"
                    value={form.immobilientyp}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="zimmer"
                    placeholder="Zimmer"
                    value={form.zimmer}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="zustand"
                    placeholder="Zustand"
                    value={form.zustand}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="energieausweis"
                    placeholder="Energieausweis"
                    value={form.energieausweis}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="ausstattung"
                    placeholder="Ausstattung (kommagetrennt)"
                    value={form.ausstattung}
                    onChange={(e) => setForm({ ...form, ausstattung: e.target.value.split(",") })}
                />
                <input
                    type="text"
                    name="besonderheiten"
                    placeholder="Besonderheiten"
                    value={form.besonderheiten}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="zielgruppe"
                    placeholder="Zielgruppe (kommagetrennt)"
                    value={form.zielgruppe}
                    onChange={(e) => setForm({ ...form, zielgruppe: e.target.value.split(",") })}
                />
                <input
                    type="number"
                    name="preis"
                    placeholder="Preis (€)"
                    value={form.preis}
                    onChange={handleChange}
                />
                <select
                    name="tonfall"
                    value={form.tonfall}
                    onChange={handleChange}
                >
                    <option value="neutral">Neutral</option>
                    <option value="freundlich">Freundlich</option>
                    <option value="luxuriös">Luxuriös</option>
                    <option value="professionell">Professionell</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? "Generiere..." : "Exposé generieren"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {result && (
                <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
                    <h2>Generiertes Exposé</h2>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
                </div>
            )}
        </div>
    );
}
