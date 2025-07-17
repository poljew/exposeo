import React from "react";
import Layout from "./components/Layout";
import background from "./assets/BG_home2.png";

const Impressum = () => {
    return (
        <Layout>
            <div
                className="h-screen w-screen bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${background})` }}
            >
            <div className="min-h-screen bg-white text-gray-800 p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Impressum</h1>
                <p className="mb-2"><strong>Expos&egrave;O</strong></p>
                <p>August-Macke Str. 33</p>
                <p>51375 Leverkusen</p>
                <p>E-Mail: kontakt@exposeo.net</p>
                <p>Gesch&auml;ftsf&uuml;hrer: Jewgeni Poletajew</p>
                <p className="mt-4 text-sm text-gray-500">Angaben gem&auml;&beta; &sect; 5 TMG</p>
                </div>
            </div>
        </Layout>
    );
};

export default Impressum;