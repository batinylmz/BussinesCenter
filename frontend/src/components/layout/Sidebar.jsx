import { useData } from "../../context/DataContext";
import { C } from "../../utils/constants";

const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "gelirler", label: "Gelirler", icon: "↗" },
    { id: "giderler", label: "Giderler", icon: "↙" },
    { id: "yatirimlar", label: "Yatırımlar", icon: "◈" },
    { id: "butce", label: "Bütçe", icon: "◎" },
    { id: "raporlar", label: "Raporlar", icon: "▤" },
    { id: "projeler", label: "Projeler", icon: "⬡" },
    { id: "departmanlar", label: "Departmanlar", icon: "⊞" },
    { id: "kategoriler", label: "Kategoriler", icon: "◈" },
    { id: "ai", label: "AI Asistan", icon: "✦" },
];

export default function Sidebar({ page, setPage }) {
    const { setLoggedIn } = useData();

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
                    const active = page === item.id;
                    return (
                        <button key={item.id} onClick={() => setPage(item.id)} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                            borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
                            background: active ? C.primaryLight : "transparent",
                            color: active ? C.primary : C.textMuted,
                            fontSize: 14, fontWeight: active ? 700 : 500, transition: "all 0.12s",
                            fontFamily: "inherit"
                        }}>
                            <span style={{ fontSize: 15, opacity: 0.8 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setLoggedIn(false)} style={{
                    width: "100%", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: "transparent", color: C.textMuted, fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit"
                }}>
                    ⬡ Çıkış Yap
                </button>
            </div>
        </aside>
    );
}