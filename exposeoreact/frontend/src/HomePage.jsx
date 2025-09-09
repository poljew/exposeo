import React from "react";
import { Link } from "react-router-dom";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext.jsx";

const background = "/assets/BG_home2.png";

const HomePage = () => {
    const { t } = useLanguage();   

    return (
        <Layout>
            <div
                className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md rounded-xl w-full max-w-5xl p-6 sm:p-8 shadow-xl flex flex-col items-center">

                    {/* Hero-Bereich */}
                    <div className="max-w-3xl text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6">{t.home_welcome}</h1>
                        <p className="text-base sm:text-lg mb-8 font-medium text-gray-600">
                            {t.home_description1}
                        </p>
                        <p className="text-base sm:text-lg mb-8 font-medium">{t.home_description2}</p>
                        <Link
                            to="/register"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded transition"
                        >
                            {t.home_start}
                        </Link>
                    </div>

                    {/* Tarife */}
                    <div className="mt-16 w-full">
                        <h2 className="text-2xl font-bold mb-6 text-center">{t.home_plans}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">{t.home_free}</h3>
                                <p className="mb-2">{t.home_freeDesc}</p>
                                <p className="text-gray-500">0 EUR/Monat</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">{t.home_plus}</h3>
                                <p className="mb-2">{t.home_plusDesc}</p>
                                <p className="text-gray-500">29 EUR/Monat</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">{t.home_premium}</h3>
                                <p className="mb-2">{t.home_premiumDesc}</p>
                                <p className="text-gray-500">100 EUR/Monat</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-20 text-sm text-gray-500 text-center">
                        <Link to="/impressum" className="underline mr-4">
                            {t.home_impressum}
                        </Link>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
