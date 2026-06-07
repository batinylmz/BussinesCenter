import { C } from "../utils/constants";

export function Field({ label, req, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 5 }}>
                {label}{req && <span style={{ color: C.danger }}> *</span>}
            </label>
            {children}
        </div>
    );
}

export function Modal({ title, onClose, wide, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: wide ? 680 : 440, maxWidth: "95%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: C.textMuted, lineHeight: 1, padding: "0 4px" }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function Btn({ onClick, color = C.primary, textColor = "#fff", children, disabled }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#9ca3af" : color, color: textColor, border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {children}
        </button>
    );
}

export function BtnOutline({ onClick, children }) {
    return (
        <button onClick={onClick} style={{ background: "#fff", color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            {children}
        </button>
    );
}

export function PageHeader({ title, action }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.text }}>{title}</h1>
            {action}
        </div>
    );
}

export function StatCard({ label, value, sub, subColor, icon, iconColor = C.primary }) {
    return (
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                <span style={{ fontSize: 22, color: iconColor }}>{icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: sub ? 4 : 0 }}>{value}</div>
            {sub && <div style={{ fontSize: 13, color: subColor || C.textMuted }}>{sub}</div>}
        </div>
    );
}

export function Badge({ label, color }) {
    const lightBg = { "#2563eb": "#dbeafe", "#16a34a": "#dcfce7", "#dc2626": "#fee2e2", "#d97706": "#fef3c7", "#7c3aed": "#ede9fe", "#0d9488": "#d1fae5", "#db2777": "#fce7f3" };
    const bg = lightBg[color] || "#f3f4f6";
    return <span style={{ background: bg, color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{label}</span>;
}

export function ProgressBar({ pct, color }) {
    const col = pct >= 80 ? C.danger : pct >= 60 ? C.warning : C.success;
    return (
        <div style={{ background: "#f3f4f6", borderRadius: 6, height: 8, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color || col, transition: "width 0.5s ease", borderRadius: 6 }} />
        </div>
    );
}

export function ActionBtns({ onEdit, onDelete }) {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={onEdit} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>
                Düzenle
            </button>
            <button onClick={onDelete} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>
                Sil
            </button>
        </div>
    );
}

export function BarChart({ data }) {
    const maxVal = Math.max(...data.flatMap(d => [d.hedef, d.gercek]));
    const W = 620, H = 200, PL = 50, PB = 40, PT = 10, PR = 10;
    const chartW = W - PL - PR;
    const chartH = H - PB - PT;
    const n = data.length;
    const groupW = chartW / n;
    const barW = (groupW - 16) / 2;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 220 }}>
            {[0, 0.25, 0.5, 0.75, 1].map(f => {
                const y = PT + chartH * (1 - f);
                const val = Math.round(maxVal * f);
                return (
                    <g key={f}>
                        <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                        <text x={PL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{val >= 1000 ? `${Math.round(val / 1000)}k` : val}</text>
                    </g>
                );
            })}
            {data.map((d, i) => {
                const x = PL + i * groupW + 8;
                const hH = (d.hedef / maxVal) * chartH;
                const gH = (d.gercek / maxVal) * chartH;
                const cx = x + groupW / 2 - 4;
                const label = d.departman.length > 8 ? d.departman.slice(0, 8) + "…" : d.departman;
                return (
                    <g key={i}>
                        <rect x={x} y={PT + chartH - hH} width={barW} height={hH} fill={C.primary} rx={3} opacity={0.9} />
                        <rect x={x + barW + 4} y={PT + chartH - gH} width={barW} height={gH} fill="#16a34a" rx={3} opacity={0.9} />
                        <text x={cx} y={H - 8} textAnchor="middle" fontSize={10} fill="#6b7280">{label}</text>
                    </g>
                );
            })}
            <rect x={PL + 10} y={H - 28} width={10} height={10} fill={C.primary} rx={2} />
            <text x={PL + 24} y={H - 19} fontSize={11} fill="#374151">Hedef</text>
            <rect x={PL + 80} y={H - 28} width={10} height={10} fill="#16a34a" rx={2} />
            <text x={PL + 94} y={H - 19} fontSize={11} fill="#374151">Gerçek</text>
        </svg>
    );
}