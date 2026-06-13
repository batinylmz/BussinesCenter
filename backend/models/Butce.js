const mongoose = require("mongoose");

const butceSchema = new mongoose.Schema({
    baslik:    { type: String, required: true },
    kategori:  { type: String, required: true },
    departman: { type: String },
    limit:     { type: Number, required: true },
    harcanan:  { type: Number, default: 0 },
    donem:     { type: String },  // örn: "2026-06"
    aciklama:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Butce", butceSchema);
