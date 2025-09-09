import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext.jsx";

const ExposeList = () => {
    const { t } = useLanguage();
    const [exposes, setExposes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const background = "/assets/bg-dashboard.png";

    const fetchExposes = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("exposes")
            .select("*")
            .order("created_at", { ascending: false })
            .eq('user_id', user.id);

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
        if (!window.confirm(t.list_delete_confirm)) return;

        try {
            const fileNames = bilder.map((url) => url.split("/").pop());

            if (fileNames.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("expose-images")
                    .remove(fileNames);

                if (storageError) {
                    console.error(t.list_delete_error, storageError.message);
                    alert(t.list_delete_images_error);
                }
            }

            const { error: deleteError } = await supabase
                .from("exposes")
                .delete()
                .eq("id", id);

            if (deleteError) {
                console.error(t.list_delete_error, deleteError.message);
                alert(t.list_delete_error);
            } else {
                setExposes((prev) => prev.filter((e) => e.id !== id));
            }
        } catch (err) {
            console.error(t.list_delete_error, err.message);
            alert(t.list_delete_unexpected);
        }
    };

    return (
        <Layout>
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 py-8"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; {t.list_back}
                    </button>

                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">{t.list_title}</h1>

                    {loading ? (
                        <p className="text-center text-gray-700">{t.list_loading}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exposes.map((expose) => (
                                <div
                                    key={expose.id}
                                    className="bg-white shadow-lg rounded-xl overflow-hidden p-4 flex flex-col"
                                >
                                    <h2 className="text-lg sm:text-xl font-semibold mb-2">{expose.adresse}</h2>
                                    <p><strong>{t.list_area}</strong> {expose.wohnflaeche} m²</p>
                                    <p><strong>{t.list_plot}</strong> {expose.grundstueck} m²</p>
                                    <p><strong>{t.list_year}</strong> {expose.baujahr}</p>

                                    {expose.bilder?.length > 0 && (
                                        <img
                                            src={expose.bilder[0]}
                                            alt="Vorschaubild"
                                            className="mt-4 w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition"
                                            onClick={() => navigate(`/expose/${expose.id}`)}
                                        />
                                    )}

                                    <div className="mt-4 flex flex-col gap-2">
                                        <button
                                            className="w-full bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                                            onClick={() => navigate(`/expose/edit/${expose.id}`)}
                                        >
                                            {t.list_edit}
                                        </button>
                                        <button
                                            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(expose.id, expose.bilder)}
                                        >
                                            {t.list_delete}
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
