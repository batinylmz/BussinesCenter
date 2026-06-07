// ─── DESIGN TOKENS (Renkler ve Temel Ayarlar) ────────────────────────
export const C = {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryLight: "#dbeafe",
    success: "#16a34a",
    successLight: "#dcfce7",
    danger: "#dc2626",
    dangerLight: "#fee2e2",
    warning: "#d97706",
    warningLight: "#fef3c7",
    purple: "#7c3aed",
    purpleLight: "#ede9fe",
    teal: "#0d9488",
    tealLight: "#d1fae5",
    pink: "#db2777",
    gray: "#6b7280",
    grayLight: "#f3f4f6",
    bg: "#f9fafb",
    surface: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    textMuted: "#6b7280",
    sidebar: "#111827",
};

export const PRESET_COLORS = ["#2563eb","#16a34a","#f59e0b","#7c3aed","#dc2626","#0d9488","#6b7280","#db2777"];

// ─── UTILS (Para Formatlama Araçları) ────────────────────────────────
export const fmt = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n || 0);
export const fmtD = (n) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n || 0);

// ─── ORTAK STİLLER ───────────────────────────────────────────────────
export const inputSt = {
    width: "100%",
    padding: "9px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 14,
    color: C.text,
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit"
};