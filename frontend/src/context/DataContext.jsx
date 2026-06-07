import { createContext, useState, useContext } from "react";

// ─── INITIAL DATA (Sahte Veritabanımız) ──────────────────────────────
const INIT = {
    gelirler: [
        { id: 1, baslik: "E-Ticaret Satışı", tutar: 12400, kategori: "E-Ticaret", tarih: "2024-06-01", departman: "Satış", aciklama: "" },
        { id: 2, baslik: "Danışmanlık A", tutar: 8500, kategori: "Danışmanlık", tarih: "2024-06-03", departman: "IT", aciklama: "" },
        { id: 3, baslik: "Danışmanlık B", tutar: 7200, kategori: "Danışmanlık", tarih: "2024-06-07", departman: "IT", aciklama: "" },
        { id: 4, baslik: "Danışmanlık C", tutar: 5800, kategori: "Danışmanlık", tarih: "2024-06-12", departman: "IT", aciklama: "" },
        { id: 5, baslik: "Danışmanlık D", tutar: 3750, kategori: "Danışmanlık", tarih: "2024-06-18", departman: "IT", aciklama: "" },
        { id: 6, baslik: "Proje A", tutar: 28000, kategori: "Proje", tarih: "2024-06-05", departman: "Operasyon", aciklama: "" },
        { id: 7, baslik: "Proje B", tutar: 22000, kategori: "Proje", tarih: "2024-06-11", departman: "Operasyon", aciklama: "" },
        { id: 8, baslik: "Proje C", tutar: 20600, kategori: "Proje", tarih: "2024-06-20", departman: "Operasyon", aciklama: "" },
        { id: 9, baslik: "Abonelik A", tutar: 7200, kategori: "Abonelik", tarih: "2024-06-01", departman: "Ürün", aciklama: "" },
        { id: 10, baslik: "Abonelik B", tutar: 5600, kategori: "Abonelik", tarih: "2024-06-15", departman: "Ürün", aciklama: "" },
    ],
    giderler: [
        { id: 1, baslik: "Maaşlar Haziran", tutar: 42000, kategori: "Personel", tarih: "2024-06-01", departman: "İK", aciklama: "" },
        { id: 2, baslik: "Yazılım A", tutar: 3200, kategori: "Yazılım", tarih: "2024-06-05", departman: "IT", aciklama: "" },
        { id: 3, baslik: "Yazılım B", tutar: 2800, kategori: "Yazılım", tarih: "2024-06-08", departman: "IT", aciklama: "" },
        { id: 4, baslik: "Yazılım C", tutar: 3250, kategori: "Yazılım", tarih: "2024-06-12", departman: "IT", aciklama: "" },
        { id: 5, baslik: "Hizmet A", tutar: 8500, kategori: "Hizmet", tarih: "2024-06-10", departman: "Operasyon", aciklama: "" },
        { id: 6, baslik: "Hizmet B", tutar: 9200, kategori: "Hizmet", tarih: "2024-06-15", departman: "Operasyon", aciklama: "" },
        { id: 7, baslik: "Hizmet C", tutar: 6400, kategori: "Hizmet", tarih: "2024-06-18", departman: "Operasyon", aciklama: "" },
        { id: 8, baslik: "Hizmet D", tutar: 4000, kategori: "Hizmet", tarih: "2024-06-22", departman: "Operasyon", aciklama: "" },
        { id: 9, baslik: "Hizmet E", tutar: 3900, kategori: "Hizmet", tarih: "2024-06-25", departman: "Operasyon", aciklama: "" },
        { id: 10, baslik: "Ofis Kirası", tutar: 8500, kategori: "Kira", tarih: "2024-06-01", departman: "Operasyon", aciklama: "" },
    ],
    kategoriler: [
        { id: 1, ad: "E-Ticaret", tip: "gelir", renk: "#2563eb", aciklama: "" },
        { id: 2, ad: "Danışmanlık", tip: "gelir", renk: "#16a34a", aciklama: "" },
        { id: 3, ad: "Proje", tip: "gelir", renk: "#f59e0b", aciklama: "" },
        { id: 4, ad: "Abonelik", tip: "gelir", renk: "#7c3aed", aciklama: "" },
        { id: 5, ad: "Diğer", tip: "gelir", renk: "#dc2626", aciklama: "" },
        { id: 6, ad: "Personel", tip: "gider", renk: "#2563eb", aciklama: "" },
        { id: 7, ad: "Yazılım", tip: "gider", renk: "#7c3aed", aciklama: "" },
        { id: 8, ad: "Donanım", tip: "gider", renk: "#dc2626", aciklama: "" },
        { id: 9, ad: "Hizmet", tip: "gider", renk: "#16a34a", aciklama: "" },
        { id: 10, ad: "Kira", tip: "gider", renk: "#f59e0b", aciklama: "" },
        { id: 11, ad: "Pazarlama", tip: "gider", renk: "#db2777", aciklama: "" },
        { id: 12, ad: "Diğer Gider", tip: "gider", renk: "#6b7280", aciklama: "" },
    ],
    departmanlar: [
        { id: 1, ad: "AR-GE", yonetici: "Dr. Mehmet Yılmaz", calisan: 12, butce: 35000, harcanan: 9200 },
        { id: 2, ad: "Pazarlama", yonetici: "Ayşe Kaya", calisan: 8, butce: 20000, harcanan: 9900 },
        { id: 3, ad: "İnsan Kaynakları", yonetici: "Fatma Demir", calisan: 5, butce: 55000, harcanan: 44800 },
        { id: 4, ad: "Operasyon", yonetici: "Ali Çelik", calisan: 15, butce: 25000, harcanan: 10980 },
        { id: 5, ad: "BT & Altyapı", yonetici: "Kemal Arslan", calisan: 10, butce: 22000, harcanan: 15200 },
        { id: 6, ad: "Finans", yonetici: "Zeynep Öz", calisan: 4, butce: 18000, harcanan: 9850 },
    ],
    projeler: [
        { id: 1, ad: "CRM Geliştirme", departman: "AR-GE", durum: "Devam Ediyor", butce: 45000, harcanan: 28000, bitis: "2024-09-30", oncelik: "Yüksek" },
        { id: 2, ad: "Pazar Genişleme", departman: "Pazarlama", durum: "Planlama", butce: 80000, harcanan: 5000, bitis: "2024-12-31", oncelik: "Orta" },
        { id: 3, ad: "Marka Yenileme", departman: "Pazarlama", durum: "Tamamlandı", butce: 25000, harcanan: 24500, bitis: "2024-05-15", oncelik: "Düşük" },
        { id: 4, ad: "ERP Entegrasyonu", departman: "BT & Altyapı", durum: "Devam Ediyor", butce: 120000, harcanan: 67000, bitis: "2025-03-31", oncelik: "Kritik" },
    ],
    yatirimlar: [
        { id: 1, ad: "Türk Hava Yolları", sembol: "THYAO", tip: "Hisse", alis: 245.4, guncel: 268.2, adet: 500, maliyet: 122700, deger: 134100, karZarar: 11400 },
        { id: 2, ad: "Garanti BBVA", sembol: "GARAN", tip: "Hisse", alis: 89.6, guncel: 94.3, adet: 1200, maliyet: 107520, deger: 113160, karZarar: 5640 },
        { id: 3, ad: "Ereğli Demir Çelik", sembol: "EREGL", tip: "Hisse", alis: 42.8, guncel: 39.5, adet: 2000, maliyet: 85600, deger: 79000, karZarar: -6600 },
        { id: 4, ad: "İş Yatırım Fonu A", sembol: "ISYFA", tip: "Fon", alis: 1.82, guncel: 1.964, adet: 150, maliyet: 273000, deger: 294600, karZarar: 21600 },
    ],
    butce: [
        { id: 1, departman: "AR-GE", yillik: 35000, q1: 8500, q1g: 9200, q2: 12000, q2g: 9200, q3plan: 12000, q4plan: 14000 },
        { id: 2, departman: "Pazarlama", yillik: 20000, q1: 8200, q1g: 9900, q2: 10500, q2g: 9900, q3plan: 10500, q4plan: 11000 },
        { id: 3, departman: "İnsan Kaynakları", yillik: 55000, q1: 42000, q1g: 44800, q2: 50000, q2g: 44800, q3plan: 50000, q4plan: 52000 },
        { id: 4, departman: "Operasyon", yillik: 25000, q1: 9800, q1g: 10980, q2: 11500, q2g: 10980, q3plan: 11500, q4plan: 12000 },
        { id: 5, departman: "BT & Altyapı", yillik: 22000, q1: 12500, q1g: 15200, q2: 16000, q2g: 15200, q3plan: 16000, q4plan: 17000 },
        { id: 6, departman: "Finans", yillik: 18000, q1: 7200, q1g: 9850, q2: 10000, q2g: 9850, q3plan: 10000, q4plan: 11000 },
    ],
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(INIT);
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <DataContext.Provider value={{ data, setData, loggedIn, setLoggedIn }}>
            {children}
        </DataContext.Provider>
    );
};

// İŞTE EKSİK OLAN VE HATAYA SEBEP OLAN SATIR BURASI:
export const useData = () => useContext(DataContext);