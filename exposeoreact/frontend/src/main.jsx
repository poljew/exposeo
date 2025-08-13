import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import NewExpose from "./NewExpose";
import ExposeList from "./ExposeList";
import ExposeDetail from "./ExposeDetail";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import EditExpose from "./EditExpose";
import Settings from "./Settings";
import HomePage from "./HomePage";
import Preise from "./Preise";
import Impressum from "./Impressum";

import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/expose/new" element={<NewExpose />} />
                <Route path="/expose/list" element={<ExposeList />} />
                <Route path="/expose/:id" element={<ExposeDetail />} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/expose/edit/:id" element={<EditExpose />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/preise" element={<Preise />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="*" element={<div>404 - Seite nicht gefunden</div>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);