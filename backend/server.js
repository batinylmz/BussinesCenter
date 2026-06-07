require("dotenv").config(); // Gizli şifreleri okumak için
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors()); // Frontend'in istek atabilmesi için
app.use(express.json()); // Gelen verileri JSON olarak okuyabilmek için

// MongoDB Bağlantısı (İşte eksik olan hayati kısım burası!)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı!"))
    .catch((err) => console.log("❌ MongoDB Bağlantı Hatası:", err));

// Route Bağlantıları
const gelirRoutes = require("./routes/gelirRoutes");
app.use("/api/gelirler", gelirRoutes);

// Test Rotası
app.get("/", (req, res) => {
    res.send("BussinesCenter Backend Çalışıyor 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda ayaklandı.`);
});