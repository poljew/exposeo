import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo4_1.png";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex items-center">
                <Link to="/home">
                    <img src={logo} alt="Exposéo Logo" className="h-20 w-auto" />
                </Link>
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
};

export default Layout;