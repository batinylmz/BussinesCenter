const mongoose = require("mongoose");

const kategoriSchema = new mongoose.Schema({
    ad:       { type: String, required: true },
    tip:      { type: String, required: true }, // "gelir" veya "gider"
    renk:     { type: String, default: "#2563eb" },
    aciklama: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Kategori", kategoriSchema);