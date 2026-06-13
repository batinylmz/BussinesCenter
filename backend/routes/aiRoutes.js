const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
    const { messages, financialData } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages gerekli" });
    }

    const d = financialData || {};
    const gelirler = d.gelirler || [];
    const giderler = d.giderler || [];
    const departmanlar = d.departmanlar || [];
    const projeler = d.projeler || [];
    const yatirimlar = d.yatirimlar || [];
    const kategoriler = d.kategoriler || [];

    const toplamGelir = gelirler.reduce((s, x) => s + (x.tutar || 0), 0);
    const toplamGider = giderler.reduce((s, x) => s + (x.tutar || 0), 0);
    const netKar = toplamGelir - toplamGider;
    const karMarji = toplamGelir > 0 ? ((netKar / toplamGelir) * 100).toFixed(1) : "0";

    const fmt = n => `₺${Number(n).toLocaleString("tr-TR")}`;

    const enBuyukGelir = [...gelirler].sort((a, b) => b.tutar - a.tutar)[0];
    const enBuyukGider = [...giderler].sort((a, b) => b.tutar - a.tutar)[0];
    const butceAsanlar = departmanlar.filter(dep => dep.harcanan > dep.butce);
    const toplamDeptButce = departmanlar.reduce((s, dep) => s + (dep.butce || 0), 0);
    const toplamDeptHarcanan = departmanlar.reduce((s, dep) => s + (dep.harcanan || 0), 0);

    const systemPrompt = `Sen BussinesCenter finansal yönetim platformunun AI asistanısın. Kullanıcıya şirketinin finansal durumu hakkında Türkçe, somut ve uygulanabilir tavsiyeler ver. Belirsiz genel öneriler değil, şirketin gerçek sayılarına dayanan öneriler sun.

## Finansal Özet
- Toplam Gelir: ${fmt(toplamGelir)}
- Toplam Gider: ${fmt(toplamGider)}
- Net Kâr/Zarar: ${fmt(netKar)} ${netKar < 0 ? "(ZARAR)" : "(KÂR)"}
- Kâr Marjı: %${karMarji}

## Gelirler (${gelirler.length} kalem)
${gelirler.map(g => `- ${g.baslik}: ${fmt(g.tutar)}${g.kategori ? ` [${g.kategori}]` : ""}${g.tarih ? ` (${g.tarih})` : ""}`).join("\n") || "Kayıtlı gelir yok"}
${enBuyukGelir ? `\nEn büyük gelir kalemi: ${enBuyukGelir.baslik} — ${fmt(enBuyukGelir.tutar)}` : ""}

## Giderler (${giderler.length} kalem)
${giderler.map(g => `- ${g.baslik}: ${fmt(g.tutar)}${g.kategori ? ` [${g.kategori}]` : ""}${g.tarih ? ` (${g.tarih})` : ""}`).join("\n") || "Kayıtlı gider yok"}
${enBuyukGider ? `\nEn büyük gider kalemi: ${enBuyukGider.baslik} — ${fmt(enBuyukGider.tutar)}` : ""}

## Departmanlar
${departmanlar.map(dep => {
    const asim = dep.harcanan > dep.butce;
    const oran = dep.butce > 0 ? ((dep.harcanan / dep.butce) * 100).toFixed(0) : "?";
    return `- ${dep.ad}: Bütçe ${fmt(dep.butce)}, Harcanan ${fmt(dep.harcanan)} (%${oran}) ${asim ? "[BÜTÇE AŞIMI]" : ""}`;
}).join("\n") || "Departman verisi yok"}
Toplam departman bütçesi: ${fmt(toplamDeptButce)}, Toplam harcanan: ${fmt(toplamDeptHarcanan)}
${butceAsanlar.length > 0 ? `Bütçe aşan departmanlar: ${butceAsanlar.map(d => d.ad).join(", ")}` : "Bütçe aşımı yok"}

## Projeler (${projeler.length} adet)
${projeler.map(p => `- ${p.ad}: ${p.durum}${p.butce ? `, Bütçe: ${fmt(p.butce)}` : ""}${p.tamamlanma !== undefined ? `, Tamamlanma: %${p.tamamlanma}` : ""}`).join("\n") || "Kayıtlı proje yok"}

## Yatırımlar (${yatirimlar.length} adet)
${yatirimlar.length > 0 ? yatirimlar.map(y => `- ${y.ad || y.baslik || "İsimsiz"}: ${fmt(y.miktar || y.tutar || 0)}${y.getiri !== undefined ? `, Getiri: %${y.getiri}` : ""}${y.tur ? ` [${y.tur}]` : ""}`).join("\n") : "Kayıtlı yatırım yok"}

## Kategoriler
${kategoriler.length > 0 ? kategoriler.map(k => `- ${k.ad}`).join(", ") : "Kategori tanımlanmamış"}`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: { role: "system", parts: [{ text: systemPrompt }] }
        });

        // Gemini chat geçmişi: son mesaj hariç history, son mesaj ayrı gönderilir
        // Gemini her zaman 'user' rolüyle başlamalı — baştaki assistant mesajlarını at
        const filtered = [...messages];
        while (filtered.length > 0 && (filtered[0].role === "assistant" || filtered[0].role === "model")) {
            filtered.shift();
        }

        const history = filtered.slice(0, -1).map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
        }));
        const lastMessage = filtered[filtered.length - 1].content;

        const chat = model.startChat({ history });

        const result = await chat.sendMessageStream(lastMessage);

        req.on("close", () => result.stream.return());

        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
});

module.exports = router;
