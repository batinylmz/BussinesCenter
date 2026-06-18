const express = require("express");
const router = express.Router();
const Gelir = require("../models/Gelir");
const auth = require("../middleware/authMiddleware");
const requireWriter = require("../middleware/requireWriter");

router.get("/", async (req, res) => {
    try {
        const gelirler = await Gelir.find().sort({ createdAt: -1 }); // En yeniler en üstte
        res.json(gelirler);
    } catch (err) {
        res.status(500).json({ mesaj: "Gelirler getirilirken hata oluştu", hata: err.message });
    }
});

router.post("/", auth, requireWriter, async (req, res) => {
    try {
        const yeniGelir = new Gelir(req.body);
        const kaydedilenGelir = await yeniGelir.save(); // Veritabanına yaz!
        res.status(201).json(kaydedilenGelir);
    } catch (err) {
        res.status(400).json({ mesaj: "Gelir eklenemedi", hata: err.message });
    }
});

router.delete("/:id", auth, requireWriter, async (req, res) => {
    try {
        await Gelir.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Gelir başarıyla silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Gelir silinemedi", hata: err.message });
    }
});
router.put("/:id", auth, requireWriter, async (req, res) => res.json(await Gelir.findByIdAndUpdate(req.params.id, req.body, { new: true })));
module.exports = router;