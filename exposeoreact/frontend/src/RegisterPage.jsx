import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext.jsx";

export default function RegisterPage() {    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
            setMessage(t.register_message_error_prefix + error.message);
        } else {
            setMessage(t.register_message_sent);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    };
    const { t } = useLanguage();
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
                            {t.register_title}
                        </h2>

                        <input
                            type="email"
                            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder={t.register_email_placeholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder={t.register_password_placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        
                        <label className="flex items-start mb-2 text-sm">
                            <input
                                type="checkbox"
                                checked={termsChecked}
                                onChange={(e) => setTermsChecked(e.target.checked)}
                                className="mt-1 mr-2"
                            />
                            <span>
                                {t.register_terms_text}{" "}
                                <a
                                    href="/Nutzungsbedingungen.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {t.register_terms_link}
                                </a>{" "}
                                {t.register_terms_text2}
                            </span>
                        </label>

                        
                        <label className="flex items-start mb-4 text-sm">
                            <input
                                type="checkbox"
                                checked={privacyChecked}
                                onChange={(e) => setPrivacyChecked(e.target.checked)}
                                className="mt-1 mr-2"
                            />
                            <span>
                                {t.register_privacy_text}{" "}
                                <a
                                    href="/Datenschutzerklaerung.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {t.register_privacy_link}
                                </a>{" "}
                                {t.register_privacy_text2}
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
                            {loading ? t.register_button_loading : t.register_button}
                        </button>

                        {message && (
                            <p
                                className={`mt-4 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                        <p className="mt-6 text-center text-sm">
                            {t.register_login_prompt}{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-blue-600 hover:underline"
                            >
                                {t.register_login_button}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
