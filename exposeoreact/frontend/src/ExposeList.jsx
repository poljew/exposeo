import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
//import background from "/bg-dashboard.png";
import Layout from "./components/Layout";

const ExposeList = () => {
    const [exposes, setExposes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const background = "/assets/bg-dashboard.png";

    const fetchExposes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("exposes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fehler beim Laden:", error.message);
        } else {
            setExposes(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExposes();
    }, []);

    const handleDelete = async (id, bilder = []) => {
        if (!window.confirm("Dieses Exposé und alle Bilder wirklich löschen?")) return;

        try {
            const fileNames = bilder.map((url) => url.split("/").pop());

            if (fileNames.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("expose-images")
                    .remove(fileNames);

                if (storageError) {
                    console.error("Fehler beim Löschen der Bilder:", storageError.message);
                    alert("Einige Bilder konnten nicht gelöscht werden.");
                }
            }

            const { error: deleteError } = await supabase
                .from("exposes")
                .delete()
                .eq("id", id);

            if (deleteError) {
                console.error("Fehler beim Löschen des Exposés:", deleteError.message);
                alert("Fehler beim Löschen des Exposés.");
            } else {
                setExposes((prev) => prev.filter((e) => e.id !== id));
            }
        } catch (err) {
            console.error("Unerwarteter Fehler beim Löschen:", err.message);
            alert("Ein Fehler ist aufgetreten.");
        }
    };

    return (
        <Layout>
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-10"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; Zur&uuml;ck zum Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-center mb-8">Meine Exposés</h1>

                    {loading ? (
                        <p className="text-center text-gray-700">Lade Exposés...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exposes.map((expose) => (
                                <div key={expose.id} className="bg-white shadow-lg rounded-xl overflow-hidden p-4">
                                    <h2 className="text-xl font-semibold mb-2">{expose.adresse}</h2>
                                    <p><strong>Wohnfl&auml;che:</strong> {expose.wohnflaeche} m²</p>
                                    <p><strong>Grundst&uuml;ck:</strong> {expose.grundstueck} m²</p>
                                    <p><strong>Baujahr:</strong> {expose.baujahr}</p>

                                    {expose.bilder?.length > 0 && (
                                        <img
                                            src={expose.bilder[0]}
                                            alt="Vorschaubild"
                                            className="mt-4 w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition"
                                            onClick={() => navigate(`/expose/${expose.id}`)}
                                        />
                                    )}

                                    <div className="mt-4 flex justify-between">
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            onClick={() => navigate(`/expose/edit/${expose.id}`)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(expose.id, expose.bilder)}
                                        >
                                            L&ouml;schen
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ExposeList;
