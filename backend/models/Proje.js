const mongoose = require("mongoose");
module.exports = mongoose.model("Proje", new mongoose.Schema({
    ad: { type: String, required: true }, departman: { type: String },
    durum: { type: String, default: "Planlama" }, butce: { type: Number, default: 0 },
    harcanan: { type: Number, default: 0 }, bitis: { type: String }, oncelik: { type: String }
}, { timestamps: true }));