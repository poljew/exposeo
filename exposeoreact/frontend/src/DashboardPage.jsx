import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Settings, List } from "lucide-react";
//import background from "/BG_home2.png";
import Layout from "./components/Layout";

const DashboardPage = () => {
    const navigate = useNavigate();
    const background = "/assets/BG_home2.png";

    const actions = [
        { label: "Neues Exposé", icon: <PlusCircle className="w-6 h-6" />, onClick: () => navigate("/expose/new") },
        { label: "Meine Exposés", icon: <List className="w-6 h-6" />, onClick: () => navigate("/expose/list") },
        { label: "Einstellungen", icon: <Settings className="w-6 h-6" />, onClick: () => navigate("/settings") },
        { label: "Logout", icon: <LogOut className="w-6 h-6" />, onClick: () => { localStorage.clear(); navigate("/login"); } }
    ];

    return (
        <Layout>
        <div
            className="h-screen w-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Willkommen zur&uuml;ck</h1>
                
                <div className="flex flex-col gap-4">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={action.onClick}
                            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow transition"
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