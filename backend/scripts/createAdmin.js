require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlandı");

    const existing = await User.findOne({ email: "admin@businesscenter.com" });
    if (existing) {
        console.log("✅ Admin kullanıcı zaten mevcut — tekrar oluşturmaya gerek yok.");
        process.exit(0);
    }

    const hash = await bcrypt.hash("demo123", 10);
    await User.create({ email: "admin@businesscenter.com", password: hash, role: "admin" });
    console.log("✅ Admin kullanıcı oluşturuldu.");
    console.log("   E-posta : admin@businesscenter.com");
    console.log("   Şifre   : demo123");
    process.exit(0);
};

run().catch(err => { console.error("❌ Hata:", err.message); process.exit(1); });
