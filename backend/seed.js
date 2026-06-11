require("dotenv").config();
const mongoose = require("mongoose");

// Modellerimizi çağırıyoruz
const Gelir = require("./models/Gelir");
const Gider = require("./models/Gider");
const Departman = require("./models/Departman");
const Proje = require("./models/Proje");
const Kategori = require("./models/Kategori");

// MongoDB'ye basılacak test verilerimiz
const tohumVerileriBas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Veritabanına bağlanıldı, tohumlama başlıyor...");

        // 1. Önce veritabanındaki eski/deneme verileri temizleyelim ki çift kayıt olmasın
        await Gelir.deleteMany();
        await Gider.deleteMany();
        await Departman.deleteMany();
        await Proje.deleteMany();
        await Kategori.deleteMany();

        // 2. Yeni verileri ekleyelim
        await Gelir.insertMany([
            { baslik: "E-Ticaret Satışı", tutar: 12400, kategori: "E-Ticaret", tarih: "2024-06-01", departman: "Satış" },
            { baslik: "Danışmanlık A", tutar: 8500, kategori: "Danışmanlık", tarih: "2024-06-03", departman: "IT" },
            { baslik: "Proje Ön Ödeme", tutar: 28000, kategori: "Proje", tarih: "2024-06-05", departman: "Operasyon" }
        ]);

        await Gider.insertMany([
            { baslik: "Maaşlar Haziran", tutar: 42000, kategori: "Personel", tarih: "2024-06-01", departman: "İK" },
            { baslik: "AWS Sunucu", tutar: 3200, kategori: "Yazılım", tarih: "2024-06-05", departman: "IT" },
            { baslik: "Ofis Kirası", tutar: 8500, kategori: "Kira", tarih: "2024-06-01", departman: "Operasyon" }
        ]);

        await Departman.insertMany([
            { ad: "AR-GE", yonetici: "Dr. Mehmet Yılmaz", calisan: 12, butce: 35000, harcanan: 9200 },
            { ad: "Pazarlama", yonetici: "Ayşe Kaya", calisan: 8, butce: 20000, harcanan: 9900 },
            { ad: "İnsan Kaynakları", yonetici: "Fatma Demir", calisan: 5, butce: 55000, harcanan: 44800 }
        ]);

        await Kategori.insertMany([
            { ad: "E-Ticaret", tur: "gelir", renk: "#2563eb" },
            { ad: "Danışmanlık", tur: "gelir", renk: "#16a34a" },
            { ad: "Proje", tur: "gelir", renk: "#0d9488" },
            { ad: "Personel", tur: "gider", renk: "#dc2626" },
            { ad: "Yazılım", tur: "gider", renk: "#7c3aed" },
            { ad: "Kira", tur: "gider", renk: "#f59e0b" }
        ]);

        await Proje.insertMany([
            { ad: "CRM Geliştirme", departman: "AR-GE", durum: "Devam Ediyor", butce: 45000, harcanan: 28000, bitis: "2024-09-30", oncelik: "Yüksek" },
            { ad: "Pazar Genişleme", departman: "Pazarlama", durum: "Planlama", butce: 80000, harcanan: 5000, bitis: "2024-12-31", oncelik: "Orta" }
        ]);

        console.log("✅ Tüm veriler başarıyla MongoDB'ye yüklendi!");
        process.exit(); // İşlem bitince terminali kapat

    } catch (error) {
        console.error("❌ Hata oluştu:", error);
        process.exit(1);
    }
};

tohumVerileriBas();