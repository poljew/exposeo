import React from "react";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext";

const Preise = () => {
    const { t } = useLanguage();

    return (
        <Layout>
            <div className="min-h-screen bg-white text-gray-800 p-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{t.prices_title}</h1>
                <ul className="space-y-4">
                    <li>
                        <strong>{t.prices.free.title}:</strong> {t.prices.free.desc}
                    </li>
                    <li>
                        <strong>{t.prices.plus.title}:</strong> {t.prices.plus.desc}
                    </li>
                    <li>
                        <strong>{t.prices.premium.title}:</strong> {t.prices.premium.desc}
                    </li>
                </ul>
            </div>
        </Layout>
    );
};

export default Preise;
