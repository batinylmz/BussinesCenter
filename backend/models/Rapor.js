const mongoose = require("mongoose");

const raporSchema = new mongoose.Schema({
    baslik:     { type: String, required: true },
    tur:        { type: String, enum: ["gelir-gider", "butce", "departman", "proje", "genel"], required: true },
    donem:      { type: String },        // örn: "2026-06"
    olusturan:  { type: String },
    ozet:       { type: String },
    veri:       { type: mongoose.Schema.Types.Mixed }  // rapor snapshot'ı
}, { timestamps: true });

module.exports = mongoose.model("Rapor", raporSchema);
