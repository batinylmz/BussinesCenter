const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Gelir = require("../models/Gelir");
const Gider = require("../models/Gider");
const Proje = require("../models/Proje");
const Departman = require("../models/Departman");

router.get("/summary", auth, async (req, res) => {
    try {
        const [gelirler, giderler, aktifProjeSayisi, departmanSayisi] = await Promise.all([
            Gelir.aggregate([{ $group: { _id: null, toplam: { $sum: "$tutar" } } }]),
            Gider.aggregate([{ $group: { _id: null, toplam: { $sum: "$tutar" } } }]),
            Proje.countDocuments({ durum: "Devam Ediyor" }),
            Departman.countDocuments()
        ]);
        const toplamGelir = gelirler[0]?.toplam || 0;
        const toplamGider = giderler[0]?.toplam || 0;
        res.json({ toplamGelir, toplamGider, netKar: toplamGelir - toplamGider, aktifProjeSayisi, departmanSayisi });
    } catch (err) {
        res.status(500).json({ mesaj: "Özet alınamadı", hata: err.message });
    }
});

router.get("/monthly", auth, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const aylikGelir = await Gelir.aggregate([
            { $match: { tarih: { $gte: start.toISOString().slice(0, 10), $lt: end.toISOString().slice(0, 10) } } },
            { $group: { _id: { $month: { $dateFromString: { dateString: "$tarih" } } }, toplam: { $sum: "$tutar" } } }
        ]);
        const aylikGider = await Gider.aggregate([
            { $match: { tarih: { $gte: start.toISOString().slice(0, 10), $lt: end.toISOString().slice(0, 10) } } },
            { $group: { _id: { $month: { $dateFromString: { dateString: "$tarih" } } }, toplam: { $sum: "$tutar" } } }
        ]);

        const gelirMap = Object.fromEntries(aylikGelir.map(x => [x._id, x.toplam]));
        const giderMap = Object.fromEntries(aylikGider.map(x => [x._id, x.toplam]));

        const sonuc = Array.from({ length: 12 }, (_, i) => ({
            ay: i + 1,
            gelir: gelirMap[i + 1] || 0,
            gider: giderMap[i + 1] || 0
        }));
        res.json(sonuc);
    } catch (err) {
        res.status(500).json({ mesaj: "Aylık veri alınamadı", hata: err.message });
    }
});

router.get("/kategori-dagilimi", auth, async (req, res) => {
    try {
        const { tur } = req.query;
        if (!["gelir", "gider"].includes(tur)) {
            return res.status(400).json({ mesaj: "tur parametresi 'gelir' veya 'gider' olmalı" });
        }
        const Model = tur === "gelir" ? Gelir : Gider;
        const sonuc = await Model.aggregate([
            { $group: { _id: "$kategori", toplam: { $sum: "$tutar" } } },
            { $project: { _id: 0, kategori: "$_id", toplam: 1 } },
            { $sort: { toplam: -1 } }
        ]);
        res.json(sonuc);
    } catch (err) {
        res.status(500).json({ mesaj: "Kategori dağılımı alınamadı", hata: err.message });
    }
});

module.exports = router;
