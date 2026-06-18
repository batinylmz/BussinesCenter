const express = require("express");
const router = express.Router();
const Yatirim = require("../models/Yatirim");

// Tüm yatırımları getir (GET)
router.get("/", async (req, res) => {
    try {
        const yatirimlar = await Yatirim.find();
        res.json(yatirimlar);
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

// Yeni yatırım ekle (POST)
router.post("/", async (req, res) => {
    try {
        const yeni = new Yatirim(req.body);
        const kaydedilen = await yeni.save();
        res.status(201).json(kaydedilen);
    } catch (err) {
        res.status(400).json({ hata: err.message });
    }
});

// Yatırım güncelle (PUT)
router.put("/:id", async (req, res) => {
    try {
        const guncellenen = await Yatirim.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(400).json({ hata: err.message });
    }
});

// Yatırım sil (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        await Yatirim.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Başarıyla silindi" });
    } catch (err) {
        res.status(500).json({ hata: err.message });
    }
});

module.exports = router;