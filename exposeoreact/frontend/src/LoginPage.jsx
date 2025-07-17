import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import background from "/tabletHg1.png";
import Layout from "./components/Layout";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            setMessage("X" + error.message);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <Layout>
        <div
            style={{
                backgroundImage: `url(${background})`,
                height: "100vh",
                width: "200vh",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
       
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto p-6">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                    <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
        
                <input
                    type="email"
                    className="w-full p-2 mb-4 border rounded"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p></p>
                <input
                    type="password"
                    className="w-full p-2 mb-4 border rounded"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p></p>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Anmelden..." : "Login"}
                </button>

                {errorMsg && (
                    <p className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
                )}

                <p className="mt-6 text-center text-sm">
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