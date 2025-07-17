import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import background from "./assets/bg-dashboard.png";
import html2pdf from "html2pdf.js";

const ExposeDetail = () => {
    const { id } = useParams();
    const [expose, setExpose] = useState(null);
    const navigate = useNavigate();
    const exportRef = useRef(null);

    useEffect(() => {
        const fetchExpose = async () => {
            const { data } = await supabase
                .from("exposes")
                .select("*")
                .eq("id", id)
                .single();
            setExpose(data);
        };
        fetchExpose();
    }, [id]);

    const renderTextWithImages = () => {
        const usedIndices = new Set();

        const parts = (expose.text || "").split(/\[BILD(\d+)\]/g).map((part, i) => {
            if (i % 2 === 1) {
                const index = parseInt(part, 10) - 1;
                usedIndices.add(index);
                const url = expose.bilder?.[index];
                if (url) {
                    return (
                        <img
                            key={`img-${i}`}
                            src={url}
                            alt={`Bild ${index + 1}`}
                            className="w-full h-64 object-cover rounded my-4"
                        />
                    );
                }
                return null;
            }
            return <p key={`text-${i}`} className="mb-2">{part}</p>;
        });

        const unusedImages = expose.bilder
            ?.map((url, index) =>
                usedIndices.has(index) ? null : (
                    <img
                        key={`unused-${index}`}
                        src={url}
                        alt={`Bild ${index + 1}`}
                        className="w-full h-64 object-cover rounded my-4"
                    />
                )
            )
            .filter(Boolean);

        return (
            <div>
                {parts}
                {unusedImages?.length > 0 && (
                    <div className="mt-6">{unusedImages}</div>
                )}
            </div>
        );
    };

    const handleExportPDF = async () => {
        if (!exportRef.current) return;

        const element = exportRef.current;

        const opt = {
            margin: [10, 10],
            filename: "expose.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ['css', 'legacy'] },
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleDelete = async (id, bilder = []) => {
        if (!window.confirm("Dieses Exposé und alle Bilder wirklich löschen?")) return;

        try {
            const fileNames = bilder.map((url) => url.split("/").pop());
            if (fileNames.length > 0) {
                await supabase.storage.from("expose-images").remove(fileNames);
            }
            await supabase.from("exposes").delete().eq("id", id);
            navigate("/expose/list");
        } catch (err) {
            console.error("Fehler:", err);
            alert("Löschen fehlgeschlagen.");
        }
    };

    if (!expose) return <div className="p-6 text-center text-gray-700">Exposé wird geladen...</div>;

    return (
        <Layout>
            <div
                className="min-h-screen bg-no-repeat bg-cover bg-center py-12 px-4"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto no-print">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; Zurück
                    </button>

                    <div ref={exportRef} className="bg-white p-6 rounded shadow" id="pdf-content">
                        <div className="text-sm font-semibold underline mb-4">
                            <div>{expose.adresse}</div>
                            <div>
                                Wohnfläche: {expose.wohnflaeche} m² | Grundstück: {expose.grundstueck} m² | Baujahr: {expose.baujahr}
                            </div>
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap mb-6">
                            {renderTextWithImages()}
                        </div>
                    </div>

                    <div className="flex justify-between no-print mt-6">
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
                            Löschen
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleExportPDF}
                        >
                            Als PDF exportieren
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ExposeDetail;
