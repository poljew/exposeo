import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo4_1.png";

const Layout = ({ children }) => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("cookieAccepted");
        if (!accepted) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieAccepted", "true");
        setShowBanner(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow p-4 flex items-center">
                <Link to="/home">
                    <img src={logo} alt="Exposéo Logo" className="h-20 w-auto" />
                </Link>
            </header>

            {/* Inhalt */}
            <main className="flex-1 p-6">{children}</main>

            {/* Cookie-Banner */}
            {showBanner && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between z-50">
                    <p className="text-sm mb-2 md:mb-0">
                        Wir verwenden Cookies, um unsere Website zu verbessern.{" "}
                        <a
                            href="/Datenschutzerklaerung.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Mehr erfahren
                        </a>
                    </p>
                    <button
                        onClick={acceptCookies}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    );
};

export default Layout;
