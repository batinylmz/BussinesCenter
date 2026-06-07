const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors()); // Frontend'in istek atabilmesi için
app.use(express.json()); // Gelen verileri JSON olarak okuyabilmek için

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