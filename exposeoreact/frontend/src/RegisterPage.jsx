import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Neue States für Checkboxen
    const [termsChecked, setTermsChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const navigate = useNavigate();
    const background = "/assets/bg-dashboard.png";

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setMessage("X " + error.message);
        } else {
            setMessage("✅ Registrierungslink wurde an deine E-Mail gesendet.");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    };

    // Button nur aktiv, wenn beide Checkboxen true sind
    const canRegister = termsChecked && privacyChecked && !loading;

    return (
        <Layout>
            <div
                className="min-h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center px-4 py-6"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-lg w-full max-w-md">
                    <form onSubmit={handleRegister} className="w-full">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                            Registrieren
                        </h2>

                        <input
                            type="email"
                            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="E-Mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* ✅ Checkbox Nutzungsbedingungen */}
                        <label className="flex items-start mb-2 text-sm">
                            <input
                                type="checkbox"
                                checked={termsChecked}
                                onChange={(e) => setTermsChecked(e.target.checked)}
                                className="mt-1 mr-2"
                            />
                            <span>
                                Ich habe die{" "}
                                <a
                                    href="/Nutzungsbedienungen.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Nutzungsbedingungen
                                </a>{" "}
                                gelesen und akzeptiere sie.
                            </span>
                        </label>

                        {/* ✅ Checkbox Datenschutz */}
                        <label className="flex items-start mb-4 text-sm">
                            <input
                                type="checkbox"
                                checked={privacyChecked}
                                onChange={(e) => setPrivacyChecked(e.target.checked)}
                                className="mt-1 mr-2"
                            />
                            <span>
                                Ich habe die{" "}
                                <a
                                    href="/Datenschutzerklärung.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Datenschutzerklärung
                                </a>{" "}
                                gelesen und akzeptiere sie.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={!canRegister}
                            className={`w-full py-3 rounded transition-colors duration-200 ${canRegister
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {loading ? "Registrieren..." : "Registrieren"}
                        </button>

                        {message && (
                            <p
                                className={`mt-4 text-center text-sm ${message.startsWith("✅")
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                        <p className="mt-6 text-center text-sm">
                            Bereits registriert?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-blue-600 hover:underline"
                            >
                                Zur&uuml;ck zum Login
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
