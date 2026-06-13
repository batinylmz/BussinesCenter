const express = require("express");
const router = express.Router();
const Butce = require("../models/Butce");

router.get("/", async (req, res) => {
    try {
        const butceler = await Butce.find().sort({ createdAt: -1 });
        res.json(butceler);
    } catch (err) {
        res.status(500).json({ mesaj: "Bütçeler getirilemedi", hata: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const yeni = new Butce(req.body);
        const kaydedilen = await yeni.save();
        res.status(201).json(kaydedilen);
    } catch (err) {
        res.status(400).json({ mesaj: "Bütçe eklenemedi", hata: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const guncellenen = await Butce.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(500).json({ mesaj: "Bütçe güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Butce.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Bütçe silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Bütçe silinemedi", hata: err.message });
    }
});

module.exports = router;
