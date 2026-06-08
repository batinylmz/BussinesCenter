const mongoose = require("mongoose");
module.exports = mongoose.model("Departman", new mongoose.Schema({
    ad: { type: String, required: true }, yonetici: { type: String },
    calisan: { type: Number, default: 0 }, butce: { type: Number, default: 0 },
    harcanan: { type: Number, default: 0 }
}, { timestamps: true }));