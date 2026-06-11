const mongoose = require("mongoose");
module.exports = mongoose.model("Kategori", new mongoose.Schema({
    ad: { type: String, required: true },
    tur: { type: String, enum: ["gelir", "gider", "genel"], required: true },
    renk: { type: String, default: "#6b7280" }
}, { timestamps: true }));
