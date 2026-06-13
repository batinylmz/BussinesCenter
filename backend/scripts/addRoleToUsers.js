require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateMany({ role: { $exists: false } }, { $set: { role: "viewer" } });
    console.log(`✅ ${result.modifiedCount} kullanıcıya 'viewer' rolü atandı.`);
    process.exit(0);
};

run().catch(err => { console.error("❌ Hata:", err); process.exit(1); });
