import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
//import background from "/bg-dashboard.png";
import Layout from "./components/Layout";
import { generateExposeText } from "./ai/generateExposeText";



const EditExpose = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const textAreaRef = useRef();
    const background = "/assets/bg-dashboard.png";

    useEffect(() => {
        const fetchExpose = async () => {
            const { data, error } = await supabase
                .from("exposes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Fehler beim Laden:", error.message);
            } else {
                setForm(data);
            }
            setLoading(false);
        };

        fetchExpose();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                [name]: checked
                    ? [...(prev[name] || []), value]
                    : prev[name].filter((v) => v !== value)
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const saveForm = async (generate = false) => {
        setSaving(true);
        let updatedData = { ...form };

        if (generate) {
            const newText = await generateExposeText(form);
            updatedData.text = newText;
        }

        const { error } = await supabase
            .from("exposes")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            alert("Fehler beim Speichern: " + error.message);
        } else {
            alert(generate ? "Text wurde neu generiert." : "Änderungen gespeichert.");
            navigate("/expose/" + id);
        }

        setSaving(false);
    };

    if (!form) return <p className="text-white">Lade Expos&eacute; ...</p>;

    return (
        <Layout>
            {saving && (
                <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
                    <div className="text-xl font-semibold text-blue-600 animate-pulse">
                        Erstelle Expos&eacute; ...
                    </div>
                </div>
            )}
            <div
                className="min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; Zur&uuml;ck
                    </button>
                    <h2 className="text-2xl font-semibold mb-6">Exposé bearbeiten</h2>

                    <form onSubmit={(e) => { e.preventDefault(); saveForm(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <input type="text" name="adresse" className="w-full p-2 border rounded" value={form.adresse} onChange={handleChange} placeholder="Adresse" />
                                <select name="immobilientyp" value={form.immobilientyp || "Haus"} onChange={handleChange} className="w-full p-2 border rounded">
                                    <option value="Haus">Haus</option>
                                    <option value="Wohnung">Wohnung</option>
                                    <option value="Garage">Garage</option>
                                </select>
                                <input type="number" name="wohnflaeche" className="w-full p-2 border rounded" value={form.wohnflaeche} onChange={handleChange} placeholder="Wohnfläche (m²)" />
                                <input type="number" name="grundstueck" className="w-full p-2 border rounded" value={form.grundstueck} onChange={handleChange} placeholder="Grundst&uuml;ck (m²)" />
                                <input type="number" name="baujahr" className="w-full p-2 border rounded" value={form.baujahr} onChange={handleChange} placeholder="Baujahr" />
                                <input type="number" name="zimmer" className="w-full p-2 border rounded" value={form.zimmer || ""} onChange={handleChange} placeholder="Zimmer" />
                                <input type="text" name="energieausweis" className="w-full p-2 border rounded" value={form.energieausweis || ""} onChange={handleChange} placeholder="Energieausweis" />
                                <input type="text" name="zustand" className="w-full p-2 border rounded" value={form.zustand || ""} onChange={handleChange} placeholder="Zustand" />

                                <fieldset>
                                    <legend className="font-semibold">Ausstattung</legend>
                                    {["Balkon", "Einbauküche", "Garage"].map((item) => (
                                        <label key={item} className="block">
                                            <input type="checkbox" name="ausstattung" value={item} checked={form.ausstattung?.includes(item)} onChange={handleChange} />
                                            {" " + item}
                                        </label>
                                    ))}
                                </fieldset>

                                <fieldset>
                                    <legend className="font-semibold">Zielgruppe</legend>
                                    {["Familie", "Kapitalanleger"].map((item) => (
                                        <label key={item} className="block">
                                            <input type="checkbox" name="zielgruppe" value={item} checked={form.zielgruppe?.includes(item)} onChange={handleChange} />
                                            {" " + item}
                                        </label>
                                    ))}
                                </fieldset>

                                <div>
                                    <label className="font-semibold block mb-1">Tonfall</label>
                                    <select
                                        name="tonfall"
                                        value={form.tonfall}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded"
                                    >
                                        <option value="sachlich">Sachlich</option>
                                        <option value="neutral">Neutral</option>
                                        <option value="freundlich">Freundlich</option>
                                        <option value="professionell">Professionell</option>
                                        <option value="emotional">Emotional</option>
                                        <option value="locker">Locker</option>
                                        <option value="eigener">Eigener</option>
                                    </select>
                                    {form.tonfall === "eigener" && (
                                        <input
                                            type="text"
                                            name="eigenerTonfall"
                                            placeholder="z.B. humorvoll, charmant..."
                                            value={form.eigenerTonfall}
                                            onChange={handleChange}
                                            className="mt-2 w-full p-2 border border-gray-300 rounded"
                                        />
                                    )}
                                </div>

                                <textarea name="besonderheiten" placeholder="Besonderheiten / Notizen" className="w-full p-2 border rounded" value={form.besonderheiten} onChange={handleChange} />
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {form.bilder?.map((url, index) => (
                                        <img key={index} src={url} alt={`Bild ${index}`} className="w-full h-32 object-cover rounded" />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    💡 Du kannst Platzhalter wie <code>[BILD1]</code>, <code>[BILD2]</code> usw. im Text verwenden,
                                    um Bilder aus deiner Galerie an der gewünschten Stelle anzuzeigen.
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Exposé-Text</label>
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        {form.bilder?.map((_, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                className="text-sm text-blue-600 underline"
                                                onClick={() => {
                                                    const textarea = textAreaRef.current;
                                                    const insert = `[BILD${i + 1}]`;

                                                    if (textarea) {
                                                        const start = textarea.selectionStart;
                                                        const end = textarea.selectionEnd;
                                                        const newText =
                                                            form.text.slice(0, start) + insert + form.text.slice(end);

                                                        setForm({ ...form, text: newText });

                                                        // Setze Cursor hinter den eingefügten Platzhalter
                                                        setTimeout(() => {
                                                            textarea.focus();
                                                            textarea.setSelectionRange(start + insert.length, start + insert.length);
                                                        }, 0);
                                                    }
                                                }}
                                            >
                                                + {`[BILD${i + 1}]`}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        ref={textAreaRef}
                                        name="text"
                                        value={form.text || ""}
                                        onChange={handleChange}
                                        rows={10}
                                        placeholder="Der generierte Text kann hier bearbeitet werden..."
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700" disabled={saving}>
                                        Speichern
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        onClick={() => saveForm(true)}
                                        disabled={saving}
                                    >
                                        Exposé neu erstellen
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                        onClick={() => navigate("/expose/list")}
                                    >
                                        Zur&uuml;ck
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default EditExpose;
