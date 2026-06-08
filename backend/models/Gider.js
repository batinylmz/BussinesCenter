const mongoose = require("mongoose");
module.exports = mongoose.model("Gider", new mongoose.Schema({
    baslik: { type: String, required: true },
    tutar: { type: Number, required: true },
    kategori: { type: String }, departman: { type: String },
    tarih: { type: String }, aciklama: { type: String }
}, { timestamps: true }));