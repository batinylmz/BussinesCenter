import { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import { C, fmt, inputSt } from "../utils/constants";
import { PageHeader, Btn } from "../components/SharedComponents";

export default function AIPage() {
    const { data } = useData();
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Merhaba! BussinesCenter AI Asistanınım. Finansal verileriniz hakkında sorularınızı yanıtlayabilirim." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);

    const toplamGelir = data.gelirler.reduce((s, x) => s + x.tutar, 0);
    const toplamGider = data.giderler.reduce((s, x) => s + x.tutar, 0);
    const systemPrompt = `Sen BussinesCenter finansal yönetim platformunun AI asistanısın.
Şirket verileri:
- Toplam Gelir: ${fmt(toplamGelir)}
- Toplam Gider: ${fmt(toplamGider)}
- Net Kâr: ${fmt(toplamGelir - toplamGider)}
- Gelirler: ${data.gelirler.map(g => `${g.baslik}(${fmt(g.tutar)})`).join(", ")}
- Giderler: ${data.giderler.map(g => `${g.baslik}(${fmt(g.tutar)})`).join(", ")}
- Departmanlar: ${data.departmanlar.map(d => `${d.ad}(bütçe:${fmt(d.butce)},harcanan:${fmt(d.harcanan)})`).join(", ")}
- Projeler: ${data.projeler.map(p => `${p.ad}(${p.durum})`).join(", ")}
Türkçe, kısa ve net yanıt ver.`;

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: "user", content: input };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setInput("");
        setLoading(true);
        try {
            const resp = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
                })
            });
            const d = await resp.json();
            const text = d.content?.map(c => c.text || "").join("") || "Yanıt alınamadı.";
            setMessages(m => [...m, { role: "assistant", content: text }]);
        } catch {
            setMessages(m => [...m, { role: "assistant", content: "Bağlantı hatası. Tekrar deneyin." }]);
        } finally {
            setLoading(false);
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    };

    const quickQ = ["Giderlerimi analiz et", "Bütçe önerileri ver", "Yatırım portföyümü değerlendir", "Bu ayki özet"];

    return (
        <div>
            <PageHeader title="AI Asistan" />
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 440, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                            <div style={{
                                maxWidth: "78%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                background: m.role === "user" ? C.primary : C.bg,
                                color: m.role === "user" ? "#fff" : C.text,
                                fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap"
                            }}>{m.content}</div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", gap: 5, padding: "8px 16px" }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
                            ))}
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        {quickQ.map(q => (
                            <button key={q} onClick={() => setInput(q)} style={{ background: C.primaryLight, color: C.primary, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{q}</button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                               placeholder="Finansal verileriniz hakkında soru sorun..." style={{ ...inputSt, flex: 1 }} />
                        <Btn onClick={send} disabled={loading || !input.trim()}>Gönder</Btn>
                    </div>
                </div>
            </div>
            <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}`}</style>
        </div>
    );
}