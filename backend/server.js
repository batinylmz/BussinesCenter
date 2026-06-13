require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı!"))
    .catch((err) => console.log("❌ MongoDB Bağlantı Hatası:", err));

// Route Bağlantıları
app.use("/api/gelirler", require("./routes/gelirRoutes"));
app.use("/api/giderler", require("./routes/giderRoutes"));
app.use("/api/projeler", require("./routes/projeRoutes"));
app.use("/api/departmanlar", require("./routes/departmanRoutes"));
app.use("/api/kategoriler", require("./routes/kategoriRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => {
    res.send("BussinesCenter Backend Çalışıyor 🚀");
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda ayaklandı.`);
});
