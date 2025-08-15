import React from "react";
import { Link } from "react-router-dom";
import Layout from "./components/Layout";

const background = "/assets/BG_home2.png";

const HomePage = () => {
    return (
        <Layout>
            <div
                className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md rounded-xl w-full max-w-5xl p-6 sm:p-8 shadow-xl flex flex-col items-center">

                    {/* Hero-Bereich */}
                    <div className="max-w-3xl text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
                            Willkommen bei ExposéO
                        </h1>
                        <p className="text-base sm:text-lg mb-8 font-medium text-gray-600">
                            Mit ExposéO erstellen Sie hochwertige Immobilien-Exposés in wenigen Minuten – automatisch,
                            stilvoll und auf Knopfdruck.
                        </p>
                        <Link
                            to="/register"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded transition"
                        >
                            Jetzt kostenlos starten
                        </Link>
                    </div>

                    {/* Tarife */}
                    <div className="mt-16 w-full">
                        <h2 className="text-2xl font-bold mb-6 text-center">Unsere Tarife</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">Free</h3>
                                <p className="mb-2">Bis zu 3 Exposés pro Monat</p>
                                <p className="text-gray-500">0 EUR/Monat</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">Plus</h3>
                                <p className="mb-2">Bis zu 20 Exposés pro Monat</p>
                                <p className="text-gray-500">29 EUR/Monat</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-bold mb-2">Premium</h3>
                                <p className="mb-2">Bis zu 100 Exposés + Individualisierung</p>
                                <p className="text-gray-500">100 EUR/Monat</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-20 text-sm text-gray-500 text-center">
                        <Link to="/impressum" className="underline mr-4">
                            Impressum
                        </Link>
                    </footer>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
