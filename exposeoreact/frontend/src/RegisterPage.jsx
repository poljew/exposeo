import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import background from "/bg-dashboard.png";
import Layout from "./components/Layout";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        setLoading(false);

        if (error) {
            setMessage(" X " + error.message);
        } else {
            navigate("/dashboard");
            setMessage("Registrierungslink wurde an deine E-Mail gesendet.");
        }
    };

    return (
        <Layout >
            <div
                className="h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto p-6">
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

                {errorMsg && (
                    <p className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
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