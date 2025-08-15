import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import html2pdf from "html2pdf.js";

const ExposeDetail = () => {
    const { id } = useParams();
    const [expose, setExpose] = useState(null);
    const navigate = useNavigate();
    const exportRef = useRef(null);
    const background = "/assets/bg-dashboard.png";

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
        const pdfWidthMM = 210;
        const pdfHeightMM = 297;
        const marginMM = 10;
        const mmToPx = (mm) => Math.round(mm * 96 / 25.4);
        const pageMaxWidthPx = mmToPx(pdfWidthMM - 2 * marginMM);
        const pageMaxHeightPx = mmToPx(pdfHeightMM - 2 * marginMM);

        const parts = (expose.text || "").split(/\[BILD(\d+)\]/g).map((part, i) => {
            if (i % 2 === 1) {
                const index = parseInt(part, 10) - 1;
                usedIndices.add(index);
                const url = expose.bilder?.[index];
                if (url) {
                    return (
                        <div
                            key={`img-${i}`}
                            style={{
                                pageBreakInside: "avoid",
                                margin: "1rem 0",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={url}
                                alt={`Bild ${index + 1}`}
                                style={{
                                    maxWidth: `${pageMaxWidthPx}px`,
                                    maxHeight: `${pageMaxHeightPx}px`,
                                    width: "auto",
                                    height: "auto",
                                }}
                            />
                        </div>
                    );
                }
                return null;
            }
            return (
                <p key={`text-${i}`} className="mb-2" style={{ pageBreakInside: "avoid" }}>
                    {part}
                </p>
            );
        });

        const unusedImages = expose.bilder
            ?.map((url, index) =>
                usedIndices.has(index) ? null : (
                    <div
                        key={`unused-${index}`}
                        style={{
                            pageBreakInside: "avoid",
                            margin: "1rem 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={url}
                            alt={`Bild ${index + 1}`}
                            style={{
                                maxWidth: `${pageMaxWidthPx}px`,
                                maxHeight: `${pageMaxHeightPx}px`,
                                width: "auto",
                                height: "auto",
                            }}
                        />
                    </div>
                )
            )
            .filter(Boolean);

        return (
            <div>
                {parts}
                {unusedImages?.length > 0 && <div className="mt-6">{unusedImages}</div>}
            </div>
        );
    };

    const handleExportPDF = () => {
        if (!exportRef.current) return;
        const opt = {
            margin: [10, 10],
            filename: "expose.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] }
        };
        html2pdf().set(opt).from(exportRef.current).save();
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
                className="min-h-screen bg-no-repeat bg-cover bg-center py-6 px-4"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-4 sm:p-8 rounded-xl max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                    >
                        &larr; Zur&uuml;ck
                    </button>

                    <div ref={exportRef} className="bg-white p-4 sm:p-6 rounded shadow">
                        <div className="text-sm font-semibold underline mb-4">
                            <div>{expose.adresse}</div>
                            <div>
                                Wohnfl&auml;che: {expose.wohnflaeche} m&sup2; | Grundst&uuml;ck: {expose.grundstueck} m&sup2; | Baujahr: {expose.baujahr}
                            </div>
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap mb-6">
                            {renderTextWithImages()}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full sm:w-auto"
                            onClick={() => navigate(`/expose/edit/${expose.id}`)}
                        >
                            Bearbeiten
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                            onClick={() => handleDelete(expose.id, expose.bilder)}
                        >
                            L&ouml;schen
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
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
