const express = require("express");
const router = express.Router();
const Gider = require("../models/Gider");

router.get("/", async (req, res) => res.json(await Gider.find().sort({ createdAt: -1 })));
router.post("/", async (req, res) => res.status(201).json(await new Gider(req.body).save()));
router.delete("/:id", async (req, res) => { await Gider.findByIdAndDelete(req.params.id); res.json({ mesaj: "Silindi" }); });

module.exports = router;