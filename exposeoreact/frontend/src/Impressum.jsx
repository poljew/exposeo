import React from "react";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext.jsx";

const background = "/assets/BG_home2.png";
const Impressum = () => {
    const { t } = useLanguage();
    return (
        <Layout>
            <div
                className="h-screen w-screen bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${background})` }}
            >
            <div className="min-h-screen bg-white text-gray-800 p-6 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">{t.impressum_title}</h1>
                    <p className="mb-2"><strong>{t.impressum_company}</strong></p>
                    <p>{t.impressum_address}</p>
                    <p>{t.impressum_city}</p>
                    <p>{t.impressum_email}</p>
                    <p>{t.impressum_ceo}: Jewgeni Poletajew</p>
                    <p className="mt-4 text-sm text-gray-500">{t.impressum_law}</p>
                </div>
            </div>
        </Layout>
    );
};

export default Impressum;