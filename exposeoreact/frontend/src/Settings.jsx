import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import { useLanguage } from "./LanguageContext";

const Settings = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [abo, setAbo] = useState("free");
    const [loading, setLoading] = useState(false);
    const background = "/assets/BG_Home.png";

    const fetchUserData = async () => {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) return;

        const { data, error } = await supabase
            .from("profiles")
            .select("name, abo")
            .eq("id", user.user.id)
            .single();

        if (!error) {
            setName(data?.name || "");
            setAbo(data?.abo || "free");
            setEmail(user.user.email);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) return;

        const updates = { id: user.user.id, name };

        const { error } = await supabase.from("profiles").upsert(updates);
        if (error) {
            alert(t.settings.save_error);
        } else {
            alert(t.settings.save_success);
        }

        if (password) {
            const { error: pwError } = await supabase.auth.updateUser({ password });
            if (pwError) alert(t.settings.password_error);
        }
    };

    const fetchAboStatus = async () => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const { data, error } = await supabase
            .from("profiles")
            .select("abo")
            .eq("id", userData.user.id)
            .single();

        if (!error && data?.abo) setAbo(data.abo);
    };

    const handleUpgrade = async (newTier) => {
        if (!confirm(t.settings.confirm_upgrade.replace("{tier}", newTier))) return;

        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
            alert(t.settings.user_not_found);
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({ abo: newTier })
            .eq("id", userData.user.id);

        setLoading(false);

        if (error) {
            alert(t.settings.upgrade_failed);
            console.error(error);
        } else {
            alert(t.settings.upgrade_success.replace("{tier}", newTier));
            setAbo(newTier);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchAboStatus();
    }, []);

    if (loading) return <p className="p-6 text-center">{t.settings.loading}</p>;

    const plans = [
        { tier: "free", label: t.settings.plans.free.label, preis: "0 €", limit: t.settings.plans.free.limit },
        { tier: "plus", label: t.settings.plans.plus.label, preis: "29 €/Monat", limit: t.settings.plans.plus.limit },
        { tier: "premium", label: t.settings.plans.premium.label, preis: "100 €/Monat", limit: t.settings.plans.premium.limit },
    ];

    return (
        <Layout>
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-xl">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{t.settings.title}</h1>

                    <div className="space-y-4 text-gray-800">
                        <div>
                            <label className="block font-medium mb-1">{t.settings.name}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">{t.settings.email}</label>
                            <input
                                type="email"
                                value={email}
                                placeholder={email}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">{t.settings.new_password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.settings.password_placeholder}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">{t.settings.current_plan}: <span className="text-blue-600">{abo}</span></h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {plans.map(plan => (
                                    <div key={plan.tier} className="border p-4 rounded-lg shadow bg-white">
                                        <h3 className="text-lg font-bold">{plan.label}</h3>
                                        <p className="text-sm mt-2">{plan.limit}</p>
                                        <p className="mt-1 text-gray-600">{plan.preis}</p>

                                        <button
                                            onClick={() => handleUpgrade(plan.tier)}
                                            disabled={abo === plan.tier || loading}
                                            className={`mt-4 w-full px-4 py-2 rounded ${abo === plan.tier
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-cyan-600 hover:bg-cyan-700 text-white"
                                                }`}
                                        >
                                            {abo === plan.tier ? t.settings.current_plan_btn : t.settings.upgrade_btn.replace("{tier}", plan.label)}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded"
                        >
                            {t.settings.save_changes}
                        </button>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-center"
                        >
                            &larr; {t.settings.back_dashboard}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
