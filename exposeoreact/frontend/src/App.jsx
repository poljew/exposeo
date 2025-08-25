import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import EditExpose from "./EditExpose";
import ExposeDetail from "./ExposeDetail";
import Settings from "./Settings";
import Impressum from "./Impressum";
import HomePage from "./HomePage"; 

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route path="/expose/edit/:id" element={<EditExpose />} />
                <Route path="/expose/details/:id" element={<ExposeDetail />} />
                <Route path="*" element={<HomePage />} /> {/* Fallback */}
            </Routes>
        </Router>
    );
}