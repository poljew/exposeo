import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const background = "/assets/tabletHg1.png";    

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate("/dashboard");
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) {
            setErrorMsg("X " + error.message); // Fehler gefixt
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <Layout>
            <div
                className="min-h-screen w-full bg-cover bg-center flex justify-center items-center px-4"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md rounded-xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 shadow-lg">
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                            Login
                        </h2>

                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            placeholder="E-Mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
                        >
                            {loading ? "Anmelden..." : "Login"}
                        </button>

                        {errorMsg && (
                            <p className="text-center text-sm text-red-600">{errorMsg}</p>
                        )}

                        <p className="text-center text-sm">
                            Noch kein Konto?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-blue-600 hover:underline"
                            >
                                Jetzt registrieren
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
