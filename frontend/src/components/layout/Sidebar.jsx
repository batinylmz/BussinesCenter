import { Link, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { C } from "../../utils/constants";
import {
    AiOutlineHome,
    AiOutlineDollarCircle,
    AiOutlineCreditCard,
    AiOutlineLineChart,
    AiOutlinePieChart,
    AiOutlineFileText,
    AiOutlineProject,
    AiOutlineBank,
    AiOutlineAppstore,
    AiOutlineRobot,
    AiOutlineLogout,
} from "react-icons/ai";

const NAV = [
    { path: "/", label: "Dashboard", Icon: AiOutlineHome, color: "#8b5cf6" },
    { path: "/gelirler", label: "Gelirler", Icon: AiOutlineDollarCircle, color: "#10b981" },
    { path: "/giderler", label: "Giderler", Icon: AiOutlineCreditCard, color: "#ef4444" },
    { path: "/yatirimlar", label: "Yatırımlar", Icon: AiOutlineLineChart, color: "#f59e0b" },
    { path: "/butce", label: "Bütçe", Icon: AiOutlinePieChart, color: "#3b82f6" },
    { path: "/raporlar", label: "Raporlar", Icon: AiOutlineFileText, color: "#6366f1" },
    { path: "/projeler", label: "Projeler", Icon: AiOutlineProject, color: "#ec4899" },
    { path: "/departmanlar", label: "Departmanlar", Icon: AiOutlineBank, color: "#64748b" },
    { path: "/kategoriler", label: "Kategoriler", Icon: AiOutlineAppstore, color: "#06b6d4" },
    { path: "/ai", label: "AI Asistan", Icon: AiOutlineRobot, color: "#a855f7" },
];

export default function Sidebar() {
    const { logout } = useData();
    const { pathname } = useLocation();

    return (
        <aside style={{ width: 220, background: "#fff", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100 }}>
            <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: C.primary, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏢</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>BussinesCenter</div>
                </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
                {NAV.map(item => {
                    const active = pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                            borderRadius: 10, marginBottom: 2, textDecoration: "none",
                            background: active ? C.primaryLight : "transparent",
                            color: active ? C.primary : C.textMuted,
                            borderLeft: active ? `4px solid ${C.primary}` : "4px solid transparent",
                            fontSize: 14, fontWeight: active ? 700 : 500, transition: "all 0.12s",
                        }}>
                            <item.Icon style={{ fontSize: 17, color: active ? C.primary : item.color, opacity: 0.85, flexShrink: 0 }} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
                <button onClick={logout} style={{
                    width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: "transparent", color: "#ef4444", fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit"
                }}>
                    <AiOutlineLogout style={{ fontSize: 17, flexShrink: 0 }} /> Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
