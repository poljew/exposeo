import { useEffect, useState } from "react";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // prüfen ob schon akzeptiert
        const accepted = localStorage.getItem("cookieAccepted");
        if (!accepted) {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieAccepted", "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between z-50">
            <p className="text-sm mb-2 md:mb-0">
                Wir verwenden Cookies, um unsere Website zu verbessern.{" "}
                <a
                    href="/datenschutz.pdf"
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
    );
}