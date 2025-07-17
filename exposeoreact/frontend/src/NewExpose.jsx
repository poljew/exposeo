import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { generateExposeText } from "./ai/generateExposeText";
import background from "./assets/BG_Home1.png";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout";


const NewExpose = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        adresse: "",
        wohnflaeche: "",
        grundstueck: "",
        baujahr: "",
        immobilientyp: [],
        ausstattung: [],
        zimmer: "",
        zustand: "",
        energieausweis: "",
        besonderheiten: "",
        zielgruppe: [],
        tonfall: "sachlich",
        eigenerTonfall: "", 
        preis: "",
        bilder: [],
        exposeText: "",
        createdAt: new Date().toISOString()
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            const values = form[name];
            if (checked) {
                setForm({ ...form, [name]: [...values, value] });
            } else {
                setForm({ ...form, [name]: values.filter((v) => v !== value) });
            }
        } else if (type === "file") {
            setForm({ ...form, bilder: Array.from(files) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Bilder hochladen
            const imageUrls = [];

            for (const file of form.bilder) {
                const fileName = `${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from("expose-images")
                    .upload(fileName, file);

                if (uploadError) {
                    console.error("Upload-Fehler:", uploadError.message);
                    continue;
                }

                const { data: publicUrl } = supabase.storage
                    .from("expose-images")
                    .getPublicUrl(fileName);

                if (publicUrl?.publicUrl) {
                    imageUrls.push(publicUrl.publicUrl);
                }
            }
            
            const exposeText = await generateExposeText(form);
            
            const { data, error } = await supabase.from("exposes").insert([
                {
                    adresse: form.adresse,
                    wohnflaeche: Number(form.wohnflaeche),
                    grundstueck: Number(form.grundstueck),
                    immobilientyp: form.immobilientyp,
                    baujahr: Number(form.baujahr),
                    ausstattung: form.ausstattung,
                    zimmer: Number(form.zimmer),
                    zustand: form.zustand,
                    energieausweis: form.energieausweis,
                    besonderheiten: form.besonderheiten,
                    zielgruppe: form.zielgruppe,
                    tonfall: form.tonfall,
                    preis: form.preis,
                    bilder: imageUrls,
                    text: exposeText,
                    created_at: form.createdAt
                },
            ]);

            if (error) {
                console.error("Speicher-Fehler:", error.message);
                alert("Fehler beim Speichern: " + error.message);
            } else {
                alert("Exposé erfolgreich gespeichert!");
                navigate("/expose/list"); 
                console.log("Exposé gespeichert:", data);
                setForm({
                    adresse: "",
                    wohnflaeche: "",
                    grundstueck: "",
                    immobilientyp: "",
                    baujahr: "",
                    ausstattung: [],
                    zimmer: "",
                    zustand: "",
                    energieausweis: "",
                    besonderheiten: "",
                    zielgruppe: [],
                    tonfall: "sachlich",
                    preis: "",
                    bilder: [],
                    text: exposeText,
                    createdAt: new Date().toISOString()
                });
            }
        } 
         catch (error) {
            console.error("Fehler beim API-Aufruf:", error);
            alert("Ein Fehler ist aufgetreten: " + error.message); // oder error.toString()
         } finally {
             setLoading(false); // Seite wieder freigeben
         }
    };

    return (
        <Layout>
            {loading && (
                <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
                    <div className="text-xl font-semibold text-blue-600 animate-pulse">
                        Speichere Expos&eacute;...
                    </div>
                </div>
            )}
        <div
            className="h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${background})` }}
        >
       
            
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto p-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                >
                    &larr; Zur&uuml;ck zum Dashboard
                </button>
                <h1 className="text-3xl font-bold mb-6 text-center">Neues Expos&eacute; erstellen</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Spalte 1 */}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="adresse"
                        placeholder="Adresse"
                        className="w-full p-3 border rounded"
                        value={form.adresse}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="wohnflaeche"
                            placeholder="Wohnfl&auml;che (m&sup2;)"
                        className="w-full p-3 border rounded"
                        value={form.wohnflaeche}
                        onChange={handleChange}
                            />
                    <div>
                        <label className="block font-semibold mb-1">Immobilientyp</label>
                        <select
                            name="immobilientyp"
                            value={form.immobilientyp}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Bitte w&auml;hlen</option>
                                    <option value="Haus">Haus</option>
                                    <option value="Wohnung">Wohnung</option>
                                    <option value="Garage">Garage</option>
                        </select>
                    </div>
                    <input
                        type="number"
                        name="grundstueck"
                        placeholder="Grundst&uuml;ck (m&sup2;)"
                        className="w-full p-3 border rounded"
                        value={form.grundstueck}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="baujahr"
                        placeholder="Baujahr"
                        className="w-full p-3 border rounded"
                        value={form.baujahr}
                        onChange={handleChange}
                    />
                    <textarea
                        name="besonderheiten"
                        placeholder="Besonderheiten / Notizen"
                        className="w-full p-3 border rounded"
                        rows={5}
                        value={form.besonderheiten}
                        onChange={handleChange}
                    />
                </div>

                {/* Spalte 2 */}
                <div className="space-y-4">
                    <fieldset>
                        <legend className="font-semibold mb-2">Ausstattung</legend>
                        <div className="space-y-1">
                                    {["Balkon", "Einbauk&uuml;che", "Garage"].map((item) => (
                                <label key={item} className="block">
                                    <input
                                        type="checkbox"
                                        name="ausstattung"
                                        value={item}
                                        checked={form.ausstattung.includes(item)}
                                        onChange={handleChange}
                                    />{" "}
                                    {item}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <input
                        type="number"
                        name="zimmer"
                        placeholder="Anzahl Zimmer"
                        className="w-full p-2 border rounded"
                        value={form.zimmer}
                        onChange={handleChange}
                    />

                    <select
                        name="zustand"
                        value={form.zustand}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Zustand w&auml;hlen</option>
                        <option value="neuwertig">Neuwertig</option>
                        <option value="gepflegt">Gepflegt</option>
                        <option value="renovierungsbedürftig">Renovierungsbed&uuml;rftig</option>
                    </select>

                    <select
                        name="energieausweis"
                                value={form.energieausweis}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                                <option value="">Energieausweis w&auml;hlen</option>
                        <option value="liegt vor">liegt vor</option>
                        <option value="nicht erforderlich">nicht erforderlich</option>
                        <option value="in Vorbereitung">in Vorbereitung</option>
                    </select>
                    <fieldset>
                        <legend className="font-semibold mb-2">Zielgruppe</legend>
                        <div className="space-y-1">
                            {["Familie", "Kapitalanleger"].map((item) => (
                                <label key={item} className="block">
                                    <input
                                        type="checkbox"
                                        name="zielgruppe"
                                        value={item}
                                        checked={form.zielgruppe.includes(item)}
                                        onChange={handleChange}
                                    />{" "}
                                    {item}
                                </label>
                            ))}
                        </div>
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
                            <label className="block mb-2 font-medium">Preis (EUR)</label>
                    <input
                        type="number"
                        name="preis"
                        value={form.preis}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <div>
                        <label className="font-semibold block mb-1">Bilder hochladen</label>
                        <input
                            type="file"
                            name="bilder"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Expos&eacute; erstellen
                </button>
            </form>
          </div>
        </div>
        </Layout>
    );
};

export default NewExpose;