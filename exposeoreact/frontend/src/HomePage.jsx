import React from "react";
import { Link } from "react-router-dom";
import Layout from "./components/Layout";
import background from "./assets/BG_home2.png";

const HomePage = () => {
    return (
        <Layout>
            <div
                className="h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-6">
                <div className="max-w-3xl text-center">
                    <h1 className="text-4xl font-bold mb-6">Willkommen bei ExposéO</h1>
                        <p className="text-lg mb-8 font-bold text-gray-500">
                        Mit ExposéO erstellen Sie hochwertige Immobilien-Exposés in wenigen Minuten – automatisch,
                        stilvoll, und auf Knopfdruck.
                    </p>
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
                    >
                        Jetzt kostenlos starten
                    </Link>
                </div>

                <div className="mt-16 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">Unsere Tarife</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-xl font-bold mb-2">Free</h3>
                            <p className="mb-2"> Bis zu 3 Exposés pro Monat</p>
                            <p className="text-gray-500">0 EUR/Monat</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-xl font-bold mb-2">Plus</h3>
                            <p className="mb-2"> Bis zu 20 Exposés pro Monat</p>
                            <p className="text-gray-500">29 EUR/Monat</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="text-xl font-bold mb-2">Premium</h3>
                            <p className="mb-2"> Bis zu 100 Exposés + Individualisierung</p>
                            <p className="text-gray-500">100 EUR/Monat</p>
                        </div>
                    </div>
                </div>

                <footer className="mt-20 text-sm text-gray-500 text-center">
                    <Link to="/impressum" className="underline mr-4">Impressum</Link>
                    {/*<Link to="/preise" className="underline">Preise</Link>*/}
                </footer>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
