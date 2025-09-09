import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { generateExposeText } from "./ai/generateExposeText";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext";

export default function NewExpose() {
    const background = "/assets/BG_Home1.png";
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        adresse: "",
        wohnflaeche: "",
        grundstueck: "",
        baujahr: "",
        immobilientyp: "",
        ausstattung: [],
        zimmer: "",
        zustand: "",
        energieausweis: "",
        besonderheiten: "",
        zielgruppe: [],
        tonfall: "objective", // Default englischer Schlüssel
        eigenerTonfall: "",
        preis: "",
        bilder: [],
        text: "",
        created_at: new Date().toISOString()
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
                if (publicUrl?.publicUrl) imageUrls.push(publicUrl.publicUrl);
            }

            const exposeText = await generateExposeText(form, t);
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from("exposes").insert([
                {
                    ...form,
                    wohnflaeche: Number(form.wohnflaeche),
                    grundstueck: Number(form.grundstueck),
                    baujahr: Number(form.baujahr),
                    zimmer: Number(form.zimmer),
                    bilder: imageUrls,
                    text: exposeText,
                    user_id: user.id,
                },
            ]);

            if (error) {
                alert(t.error_message + error.message);
            } else {
                alert(t.success_message);
                navigate("/expose/list");
            }
        } catch (error) {
            alert(t.unexpected_error + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
                    <div className="text-xl font-semibold text-blue-600 animate-pulse">
                        {t.saving_expose}
                    </div>
                </div>
            )}
            <div
                className="min-h-screen w-full bg-no-repeat bg-cover bg-center flex justify-center items-start pt-12 px-4 md:pt-20"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/95 backdrop-blur-md rounded-xl max-w-4xl w-full p-6 md:p-8 shadow-lg">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; {t.back_to_dashboard}
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                        {t.new_expose_title}
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Spalte 1 */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="adresse"
                                placeholder={t.adresse}
                                className="w-full p-3 border rounded"
                                value={form.adresse}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="wohnflaeche"
                                placeholder={t.wohnflaeche}
                                className="w-full p-3 border rounded"
                                value={form.wohnflaeche}
                                onChange={handleChange}
                            />
                            <div>
                                <label className="block font-semibold mb-1">
                                    {t.immobilientyp_label}
                                </label>
                                <select
                                    name="immobilientyp"
                                    value={form.immobilientyp}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">{t.immobilientyp_placeholder}</option>
                                    <option value="house">{t.immobilientyp_options.haus}</option>
                                    <option value="apartment">{t.immobilientyp_options.wohnung}</option>
                                    <option value="garage">{t.immobilientyp_options.garage}</option>
                                </select>
                            </div>
                            <input
                                type="number"
                                name="grundstueck"
                                placeholder={t.grundstueck}
                                className="w-full p-3 border rounded"
                                value={form.grundstueck}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="baujahr"
                                placeholder={t.baujahr}
                                className="w-full p-3 border rounded"
                                value={form.baujahr}
                                onChange={handleChange}
                            />
                            <textarea
                                name="besonderheiten"
                                placeholder={t.besonderheiten}
                                className="w-full p-3 border rounded"
                                rows={5}
                                value={form.besonderheiten}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Spalte 2 */}
                        <div className="space-y-4">
                            <fieldset>
                                <legend className="font-semibold mb-2">{t.ausstattung}</legend>
                                <div className="space-y-1">
                                    {Object.entries(t.ausstattung_options).map(([key, label]) => (
                                        <label key={key} className="block">
                                            <input
                                                type="checkbox"
                                                name="ausstattung"
                                                value={key} // Schlüssel speichern
                                                checked={form.ausstattung.includes(key)}
                                                onChange={handleChange}
                                            />{" "}
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <input
                                type="number"
                                name="zimmer"
                                placeholder={t.zimmer}
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
                                <option value="">{t.zustand}</option>
                                <option value="new">{t.zustand_options.neuwertig}</option>
                                <option value="well_maintained">{t.zustand_options.gepflegt}</option>
                                <option value="needs_renovation">
                                    {t.zustand_options.renovierungsbeduerftig}
                                </option>
                            </select>

                            <select
                                name="energieausweis"
                                value={form.energieausweis}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">{t.energieausweis}</option>
                                <option value="available">{t.energieausweis_options.liegt_vor}</option>
                                <option value="not_required">
                                    {t.energieausweis_options.nicht_erforderlich}
                                </option>
                                <option value="in_preparation">
                                    {t.energieausweis_options.in_vorbereitung}
                                </option>
                            </select>

                            <fieldset>
                                <legend className="font-semibold mb-2">{t.zielgruppe}</legend>
                                <div className="space-y-1">
                                    {Object.entries(t.zielgruppe_options).map(([key, label]) => (
                                        <label key={key} className="block">
                                            <input
                                                type="checkbox"
                                                name="zielgruppe"
                                                value={key} // Schlüssel speichern
                                                checked={form.zielgruppe.includes(key)}
                                                onChange={handleChange}
                                            />{" "}
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <div>
                                <label className="font-semibold block mb-1">{t.tonfall}</label>
                                <select
                                    name="tonfall"
                                    value={form.tonfall}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded"
                                >
                                    <option value="objective">{t.tonfall_options.sachlich}</option>
                                    <option value="friendly">{t.tonfall_options.freundlich}</option>
                                    <option value="luxury">{t.tonfall_options.luxurioes}</option>
                                    <option value="professional">{t.tonfall_options.professionell}</option>
                                    <option value="casual">{t.tonfall_options.locker}</option>
                                    <option value="emotional">{t.tonfall_options.emotional}</option>
                                    <option value="neutral">{t.tonfall_options.neutral}</option>
                                    <option value="custom">{t.tonfall_options.eigener}</option>
                                </select>

                                {form.tonfall === "custom" && (
                                    <input
                                        type="text"
                                        name="eigenerTonfall"
                                        placeholder={t.eigenerTonfall_placeholder}
                                        value={form.eigenerTonfall}
                                        onChange={handleChange}
                                        className="mt-2 w-full p-2 border rounded"
                                    />
                                )}
                            </div>

                            <label className="block mb-2 font-medium">{t.preis_label}</label>
                            <input
                                type="number"
                                name="preis"
                                value={form.preis}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <div>
                                <label className="font-semibold block mb-1">{t.bilder_label}</label>
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
                            className={`col-span-1 md:col-span-2 bg-cyan-600 text-white px-4 py-3 rounded hover:bg-cyan-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {t.submit_button}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
