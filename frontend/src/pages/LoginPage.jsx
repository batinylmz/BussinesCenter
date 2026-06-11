import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { C, inputSt } from "../utils/constants";
import { Field } from "../components/SharedComponents";

export default function LoginPage() {
    const { login } = useData();
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@businesscenter.com");
    const [pass, setPass] = useState("demo123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px 44px", width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 44, height: 44, background: C.primary, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏢</div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>BussinesCenter</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>KOBİ Finansal Yönetim Platformu</div>
                    </div>
                </div>
                <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "20px 0" }} />
                <Field label="E-posta"><input style={inputSt} value={email} onChange={e => setEmail(e.target.value)} /></Field>
                <Field label="Şifre"><input style={inputSt} type="password" value={pass} onChange={e => setPass(e.target.value)} /></Field>
                <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <span style={{ fontSize: 13, color: C.primary, cursor: "pointer" }}>Şifremi unuttum</span>
                </div>
                {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</div>}
                <button onClick={async () => {
                    setError(""); setLoading(true);
                    try {
                        const res = await fetch("http://localhost:5001/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password: pass })
                        });
                        const d = await res.json();
                        if (!res.ok) { setError(d.mesaj || "Giriş başarısız"); return; }
                        login(d.token);
                        navigate("/");
                    } catch { setError("Sunucuya bağlanılamadı"); }
                    finally { setLoading(false); }
                }} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
                <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: 16 }}>
                    Hesabın yok mu? <span style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}>Kayıt Ol</span>
                </p>
            </div>
        </div>
    );
}