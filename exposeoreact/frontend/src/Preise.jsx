import React from "react";
import Layout from "./components/Layout";

const Preise = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-white text-gray-800 p-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Preise</h1>
                <ul className="space-y-4">
                    <li>
                        <strong>Free:</strong> 0 EUR/Monat – bis zu 3 Exposés monatlich
                    </li>
                    <li>
                        <strong>Plus:</strong> 29 EUR/Monat – bis zu 20 Exposés, Standardfunktionen
                    </li>
                    <li>
                        <strong>Premium:</strong> 100 EUR/Monat – bis zu 100 Exposés, Exporte & Logo, Textstile etc.
                    </li>
                </ul>
            </div>
        </Layout>
    );
};

export default Preise;