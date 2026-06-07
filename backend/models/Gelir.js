const mongoose = require("mongoose");

const gelirSchema = new mongoose.Schema({
    baslik: { type: String, required: true },
    tutar: { type: Number, required: true },
    kategori: { type: String, required: true },
    departman: { type: String },
    tarih: { type: String },
    aciklama: { type: String }
}, { timestamps: true }); // Ne zaman eklendiğini otomatik tutar

module.exports = mongoose.model("Gelir", gelirSchema);