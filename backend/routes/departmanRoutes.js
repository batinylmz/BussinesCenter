const express = require("express");
const router = express.Router();
const Departman = require("../models/Departman");

router.get("/", async (req, res) => res.json(await Departman.find().sort({ createdAt: -1 })));
router.post("/", async (req, res) => res.status(201).json(await new Departman(req.body).save()));
router.delete("/:id", async (req, res) => { await Departman.findByIdAndDelete(req.params.id); res.json({ mesaj: "Silindi" }); });

module.exports = router;