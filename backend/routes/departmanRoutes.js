const express = require("express");
const router = express.Router();
const Departman = require("../models/Departman");
const auth = require("../middleware/authMiddleware");
const requireWriter = require("../middleware/requireWriter");

router.get("/", async (req, res) => {
    try {
        const departmanlar = await Departman.find().sort({ createdAt: -1 });
        res.json(departmanlar);
    } catch (err) {
        res.status(500).json({ mesaj: "Departmanlar getirilirken hata", hata: err.message });
    }
});

router.post("/", auth, requireWriter, async (req, res) => {
    try {
        const yeniDepartman = new Departman(req.body);
        res.status(201).json(await yeniDepartman.save());
    } catch (err) {
        res.status(400).json({ mesaj: "Departman eklenemedi", hata: err.message });
    }
});

router.put("/:id", auth, requireWriter, async (req, res) => {
    try {
        const guncellenen = await Departman.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guncellenen);
    } catch (err) {
        res.status(400).json({ mesaj: "Departman güncellenemedi", hata: err.message });
    }
});

router.delete("/:id", auth, requireWriter, async (req, res) => {
    try {
        await Departman.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Departman silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Departman silinemedi", hata: err.message });
    }
});

module.exports = router;