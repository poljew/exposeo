import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // NEU
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const background = "/assets/bg-dashboard.png";

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        setLoading(false);

        if (error) {
            setMessage("X " + error.message);
        } else {
            setMessage("✅ Registrierungslink wurde an deine E-Mail gesendet.");
            // Redirect verzögern, damit Meldung sichtbar bleibt
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
        }
    };

    return (
        <Layout>
            <div
                className="h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto">
                    <form
                        onSubmit={handleRegister}
                        className="bg-white p-8 rounded shadow-md w-full max-w-md"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center">Registrieren</h2>

                        <input
                            type="email"
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="E-Mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
