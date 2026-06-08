const express = require("express");
const router = express.Router();
const Proje = require("../models/Proje");

router.get("/", async (req, res) => res.json(await Proje.find().sort({ createdAt: -1 })));
router.post("/", async (req, res) => res.status(201).json(await new Proje(req.body).save()));
router.delete("/:id", async (req, res) => { await Proje.findByIdAndDelete(req.params.id); res.json({ mesaj: "Silindi" }); });

module.exports = router;