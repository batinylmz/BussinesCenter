require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const EMAIL = "admin@businesscenter.com";
const YEN_SIFRE = "demo123";

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const hash = await bcrypt.hash(YEN_SIFRE, 10);
    const result = await User.updateOne({ email: EMAIL }, { password: hash });
    if (result.matchedCount === 0) {
        console.log("❌ Kullanıcı bulunamadı:", EMAIL);
    } else {
        console.log("✅ Şifre sıfırlandı.");
        console.log("   E-posta :", EMAIL);
        console.log("   Şifre   :", YEN_SIFRE);
    }
    process.exit(0);
};

run().catch(err => { console.error("❌ Hata:", err.message); process.exit(1); });
