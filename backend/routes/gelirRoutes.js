const express = require("express");
const router = express.Router();

// Şimdilik sahte veri dönen bir GET isteği
router.get("/", (req, res) => {
    res.json([
        { id: 1, baslik: "Backend'den Gelen Gelir", tutar: 15000, kategori: "Proje" }
    ]);
});

// Yeni gelir ekleme rotası (POST)
router.post("/", (req, res) => {
    const yeniGelir = req.body;
    console.log("Gelen veri:", yeniGelir);
    res.status(201).json({ mesaj: "Gelir başarıyla eklendi", veri: yeniGelir });
});

module.exports = router;