const express = require("express");
const router = express.Router();
const Gelir = require("../models/Gelir"); // Az önce oluşturduğumuz modeli çağırdık

// 1. GET: Veritabanındaki tüm gelirleri çekip React'a gönder
router.get("/", async (req, res) => {
    try {
        const gelirler = await Gelir.find().sort({ createdAt: -1 }); // En yeniler en üstte
        res.json(gelirler);
    } catch (err) {
        res.status(500).json({ mesaj: "Gelirler getirilirken hata oluştu", hata: err.message });
    }
});

// 2. POST: React'tan gelen yeni geliri veritabanına kaydet
router.post("/", async (req, res) => {
    try {
        const yeniGelir = new Gelir(req.body);
        const kaydedilenGelir = await yeniGelir.save(); // Veritabanına yaz!
        res.status(201).json(kaydedilenGelir);
    } catch (err) {
        res.status(400).json({ mesaj: "Gelir eklenemedi", hata: err.message });
    }
});

// 3. DELETE: React'tan gelen ID'ye göre geliri veritabanından sil
router.delete("/:id", async (req, res) => {
    try {
        await Gelir.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Gelir başarıyla silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Gelir silinemedi", hata: err.message });
    }
});
router.put("/:id", async (req, res) => res.json(await Gelir.findByIdAndUpdate(req.params.id, req.body, { new: true })));
module.exports = router;