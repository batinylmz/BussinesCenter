import { useState } from "react";
import { useData } from "./context/DataContext";
import { C } from "./utils/constants";
import Sidebar from "./components/layout/Sidebar";

// Sayfa Importları
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

export default function App() {
    const { loggedIn } = useData();
    const [page, setPage] = useState("dashboard");

    if (!loggedIn) return <LoginPage />;

    const renderPage = () => {
        switch (page) {
            case "dashboard": return <Dashboard />;
            case "gelirler": return <GelirlerPage />;
            case "giderler": return <GiderlerPage />;
            case "yatirimlar": return <YatirimlarPage />;
            case "butce": return <ButcePage />;
            case "raporlar": return <RaporlarPage />;
            case "projeler": return <ProjelerPage />;
            case "departmanlar": return <DepartmanlarPage />;
            case "kategoriler": return <KategorilerPage />;
            case "ai": return <AIPage />;
            default: return <Dashboard />;
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <Sidebar page={page} setPage={setPage} />
            <main style={{ marginLeft: 220, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
                {renderPage()}
            </main>
        </div>
    );
}