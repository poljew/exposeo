import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
                navigate("/dashboard");
            }, 3000);
        }
    };

    return (
        <Layout>
            <div
                className="min-h-screen w-screen bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center px-4 py-6"
                style={{ backgroundImage: `url(${background})` }}
            >
                {/* Formular Container */}
                <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-lg w-full max-w-md mb-20">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Registrieren..." : "Registrieren"}
                        </button>

                        {message && (
                            <p
                                className={`mt-4 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Sticky Footer für Mobile */}
                <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md py-4 text-center border-t border-gray-200 md:hidden">
                    <p className="text-sm">
                        Bereits registriert?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:underline"
                        >
                            Zur&uuml;ck zum Login
                        </button>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
