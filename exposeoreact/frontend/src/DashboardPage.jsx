import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Settings, List } from "lucide-react";
import Layout from "./components/Layout";

const DashboardPage = () => {
    const navigate = useNavigate();
    const background = "/assets/BG_home2.png";

    const actions = [
        { label: "Neues Exposé", icon: <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />, onClick: () => navigate("/expose/new") },
        { label: "Meine Exposés", icon: <List className="w-5 h-5 sm:w-6 sm:h-6" />, onClick: () => navigate("/expose/list") },
        { label: "Einstellungen", icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />, onClick: () => navigate("/settings") },
        { label: "Logout", icon: <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />, onClick: () => { localStorage.clear(); navigate("/login"); } }
    ];

    return (
        <Layout>
            <div
                className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md text-center">

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                        Willkommen zurück
                    </h1>

                    <div className="flex flex-col gap-4">
                        {actions.map((action, i) => (
                            <button
                                key={i}
                                onClick={action.onClick}
                                className="flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg shadow transition"
                            >
                                {action.icon}
                                <span className="font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
