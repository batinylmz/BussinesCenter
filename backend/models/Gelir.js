const mongoose = require("mongoose");

const gelirSchema = new mongoose.Schema({
    baslik:    { type: String, required: true },
    tutar:     { type: Number, required: true },
    kategori:  { type: String },
    departman: { type: String },
    tarih:     { type: String },
    aciklama:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Gelir", gelirSchema);