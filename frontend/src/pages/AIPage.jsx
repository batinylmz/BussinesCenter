import { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import { C, inputSt } from "../utils/constants";
import { PageHeader, Btn } from "../components/SharedComponents";

const API_URL = "http://localhost:5001/api/ai/chat";

function buildQuickQuestions(data) {
    const toplamGelir = data.gelirler.reduce((s, x) => s + x.tutar, 0);
    const toplamGider = data.giderler.reduce((s, x) => s + x.tutar, 0);
    const butceAsanlar = data.departmanlar.filter(d => d.harcanan > d.butce);
    const aktifProjeler = data.projeler.filter(p => p.durum === "devam" || p.durum === "aktif");

    const sorular = [];

    if (toplamGider > toplamGelir) {
        sorular.push("Neden zarar ediyorum ve nasıl düzeltebilirim?");
    } else {
        sorular.push("Kârımı artırmak için ne yapabilirim?");
    }

    if (butceAsanlar.length > 0) {
        sorular.push(`${butceAsanlar[0].ad} departmanı bütçeyi neden aşıyor?`);
    } else {
        sorular.push("Bütçe optimizasyonu için önerilerin neler?");
    }

    if (data.yatirimlar.length > 0) {
        sorular.push("Yatırım portföyümü değerlendir");
    } else {
        sorular.push("Hangi alanlara yatırım yapmalıyım?");
    }

    if (aktifProjeler.length > 0) {
        sorular.push(`${aktifProjeler[0].ad} projesi hakkında değerlendirme yap`);
    } else {
        sorular.push("Bu ayki finansal özeti çıkar");
    }

    return sorular;
}

export default function AIPage() {
    const { data } = useData();
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Merhaba! BussinesCenter AI Asistanınım. Şirketinizin finansal verilerine tam erişimim var — giderler, gelirler, departman bütçeleri, projeler ve yatırımlar hakkında somut öneriler sunabilirim." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);

    const quickQ = buildQuickQuestions(data);

    const send = async (overrideInput) => {
        const text = (overrideInput ?? input).trim();
        if (!text || loading) return;

        const userMsg = { role: "user", content: text };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setInput("");
        setLoading(true);

        setMessages(m => [...m, { role: "assistant", content: "" }]);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
                    financialData: {
                        gelirler: data.gelirler,
                        giderler: data.giderler,
                        departmanlar: data.departmanlar,
                        projeler: data.projeler,
                        yatirimlar: data.yatirimlar || [],
                        kategoriler: data.kategoriler || [],
                    }
                })
            });

            if (!res.ok || !res.body) {
                setMessages(m => {
                    const copy = [...m];
                    copy[copy.length - 1] = { role: "assistant", content: "Sunucu hatası. Backend çalışıyor mu?" };
                    return copy;
                });
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const raw = line.slice(6);
                    if (raw === "[DONE]") break;

                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed.error) {
                            accumulated = "Hata: " + parsed.error;
                        } else if (parsed.text) {
                            accumulated += parsed.text;
                        }
                        setMessages(m => {
                            const copy = [...m];
                            copy[copy.length - 1] = { role: "assistant", content: accumulated };
                            return copy;
                        });
                    } catch {
                        // geçersiz JSON satırı — atla
                    }
                }
            }
        } catch {
            setMessages(m => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: "Bağlantı hatası. Backend çalışıyor mu kontrol edin." };
                return copy;
            });
        } finally {
            setLoading(false);
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    };

    return (
        <div>
            <PageHeader title="AI Asistan" />
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 460, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                            <div style={{
                                maxWidth: "78%", padding: "12px 16px",
                                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                background: m.role === "user" ? C.primary : C.bg,
                                color: m.role === "user" ? "#fff" : C.text,
                                fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap"
                            }}>
                                {m.content || (loading && i === messages.length - 1 ? (
                                    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                                        {[0, 1, 2].map(j => (
                                            <span key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.primary, display: "inline-block", animation: `bounce 1.2s ${j * 0.2}s infinite ease-in-out` }} />
                                        ))}
                                    </span>
                                ) : "")}
                            </div>
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        {quickQ.map(q => (
                            <button key={q} onClick={() => send(q)} disabled={loading}
                                style={{ background: C.primaryLight, color: C.primary, border: "none", borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, opacity: loading ? 0.5 : 1 }}>
                                {q}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                            placeholder="Finansal verileriniz hakkında soru sorun..."
                            style={{ ...inputSt, flex: 1 }}
                            disabled={loading}
                        />
                        <Btn onClick={() => send()} disabled={loading || !input.trim()}>
                            {loading ? "Yazıyor..." : "Gönder"}
                        </Btn>
                    </div>
                </div>
            </div>
            <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}`}</style>
        </div>
    );
}
