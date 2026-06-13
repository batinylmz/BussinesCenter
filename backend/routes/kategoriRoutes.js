const express = require("express");
const router = express.Router();
const Kategori = require("../models/Kategori");

router.get("/", async (req, res) => {
    try {
        res.json(await Kategori.find().sort({ createdAt: 1 }));
    } catch (err) {
        res.status(500).json({ mesaj: "Kategoriler getirilemedi", hata: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        res.status(201).json(await new Kategori(req.body).save());
    } catch (err) {
        res.status(400).json({ mesaj: "Kategori eklenemedi", hata: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        res.json(await Kategori.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (err) {
        res.status(400).json({ mesaj: "Kategori güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Kategori.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Kategori silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Kategori silinemedi", hata: err.message });
    }
});

module.exports = router;
