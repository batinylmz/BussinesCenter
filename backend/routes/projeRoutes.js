const express = require("express");
const router = express.Router();
const Proje = require("../models/Proje");

router.get("/", async (req, res) => {
    try {
        const projeler = await Proje.find().sort({ createdAt: -1 });
        res.json(projeler);
    } catch (err) {
        res.status(500).json({ mesaj: "Projeler getirilirken hata", hata: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const yeniProje = new Proje(req.body);
        res.status(201).json(await yeniProje.save());
    } catch (err) {
        res.status(400).json({ mesaj: "Proje eklenemedi", hata: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const guncellenen = await Proje.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(400).json({ mesaj: "Proje güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Proje.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Proje silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Proje silinemedi", hata: err.message });
    }
});

module.exports = router;