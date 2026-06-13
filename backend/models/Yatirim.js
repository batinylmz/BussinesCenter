const mongoose = require("mongoose");

const yatirimSchema = new mongoose.Schema({
    ad:       { type: String, required: true }, // Varlık Adı (Zorunlu)
    sembol:   { type: String },                 // Örn: THYAO, BTC
    tip:      { type: String },                 // Örn: Hisse, Kripto, Fon
    adet:     { type: Number, default: 0 },     // Alınan adet sayısı
    alis:     { type: Number, default: 0 },     // Alış fiyatı
    guncel:   { type: Number, default: 0 },     // Güncel piyasa fiyatı
    maliyet:  { type: Number, default: 0 },     // Toplam Maliyet (adet * alis)
    deger:    { type: Number, default: 0 },     // Güncel Değer (adet * guncel)
    karZarar: { type: Number, default: 0 }      // Anlık kâr/zarar durumu
}, { timestamps: true }); // Kayıt ve güncelleme tarihlerini otomatik tutar

module.exports = mongoose.model("Yatirim", yatirimSchema);