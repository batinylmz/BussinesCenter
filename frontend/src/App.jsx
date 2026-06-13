import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useData } from "./context/DataContext";
import Sidebar from "./components/layout/Sidebar";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GelirlerPage from "./pages/GelirlerPage";
import GiderlerPage from "./pages/GiderlerPage";
import YatirimlarPage from "./pages/YatirimlarPage";
import ButcePage from "./pages/ButcePage";
import RaporlarPage from "./pages/RaporlarPage";
import ProjelerPage from "./pages/ProjelerPage";
import DepartmanlarPage from "./pages/DepartmanlarPage";
import KategorilerPage from "./pages/KategorilerPage";
import AIPage from "./pages/AIPage";
import { C } from "./utils/constants";

function ProtectedLayout() {
    const { loggedIn } = useData();
    if (!loggedIn) return <Navigate to="/login" replace />;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Sidebar />
            <main style={{ marginLeft: 220, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/gelirler" element={<GelirlerPage />} />
                    <Route path="/giderler" element={<GiderlerPage />} />
                    <Route path="/yatirimlar" element={<YatirimlarPage />} />
                    <Route path="/butce" element={<ButcePage />} />
                    <Route path="/raporlar" element={<RaporlarPage />} />
                    <Route path="/projeler" element={<ProjelerPage />} />
                    <Route path="/departmanlar" element={<DepartmanlarPage />} />
                    <Route path="/kategoriler" element={<KategorilerPage />} />
                    <Route path="/ai" element={<AIPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
        </BrowserRouter>
    );
}
