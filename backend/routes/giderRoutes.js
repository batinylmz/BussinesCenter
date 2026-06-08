const express = require("express");
const router = express.Router();
const Gider = require("../models/Gider");

router.get("/", async (req, res) => {
    try {
        const giderler = await Gider.find().sort({ createdAt: -1 });
        res.json(giderler);
    } catch (err) {
        res.status(500).json({ mesaj: "Giderler getirilirken hata oluştu", hata: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const yeniGider = new Gider(req.body);
        res.status(201).json(await yeniGider.save());
    } catch (err) {
        res.status(400).json({ mesaj: "Gider eklenemedi", hata: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const guncellenen = await Gider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(400).json({ mesaj: "Gider güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Gider.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Gider silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Gider silinemedi", hata: err.message });
    }
});

module.exports = router;