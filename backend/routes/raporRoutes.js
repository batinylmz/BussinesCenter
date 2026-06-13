const express = require("express");
const router = express.Router();
const Rapor = require("../models/Rapor");

router.get("/", async (req, res) => {
    try {
        const raporlar = await Rapor.find().sort({ createdAt: -1 });
        res.json(raporlar);
    } catch (err) {
        res.status(500).json({ mesaj: "Raporlar getirilemedi", hata: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const yeni = new Rapor(req.body);
        const kaydedilen = await yeni.save();
        res.status(201).json(kaydedilen);
    } catch (err) {
        res.status(400).json({ mesaj: "Rapor kaydedilemedi", hata: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const guncellenen = await Rapor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(500).json({ mesaj: "Rapor güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Rapor.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Rapor silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Rapor silinemedi", hata: err.message });
    }
});

module.exports = router;
