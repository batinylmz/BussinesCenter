# API Reference

Şu an `server.js`'e mount edilmiş ve çalışan endpoint'lerin tam listesi.
Base URL: `http://localhost:5001`

---

## Durum Özeti

| Route dosyası | Mount durumu | Base path |
|---|---|---|
| `gelirRoutes.js` | ✅ Aktif | `/api/gelirler` |
| `giderRoutes.js` | ✅ Aktif | `/api/giderler` |
| `projeRoutes.js` | ✅ Aktif | `/api/projeler` |
| `departmanRoutes.js` | ✅ Aktif | `/api/departmanlar` |
| `kategoriRoutes.js` | ✅ Aktif | `/api/kategoriler` |
| `dashboardRoutes.js` | ❌ server.js'e bağlı değil | `/api/dashboard` |
| `authRoutes.js` | ❌ server.js'e bağlı değil | `/api/auth` |

---

## Çalışan Endpoint'ler

### Gelirler `/api/gelirler`

```
GET    /api/gelirler          Tüm gelirleri getir (createdAt desc)
POST   /api/gelirler          Yeni gelir ekle
PUT    /api/gelirler/:id      Geliri güncelle
DELETE /api/gelirler/:id      Geliri sil
```

**POST / PUT body:**
```json
{
  "tutar": 15000,
  "kategori": "Satış",
  "tarih": "2025-06-01",
  "aciklama": "Ürün satışı",
  "departmanId": "<ObjectId>"
}
```

---

### Giderler `/api/giderler`

```
GET    /api/giderler          Tüm giderleri getir (createdAt desc)
POST   /api/giderler          Yeni gider ekle
PUT    /api/giderler/:id      Gideri güncelle
DELETE /api/giderler/:id      Gideri sil
```

**POST / PUT body:**
```json
{
  "tutar": 5000,
  "kategori": "Kira",
  "tarih": "2025-06-01",
  "aciklama": "Ofis kirası",
  "departmanId": "<ObjectId>",
  "projeId": "<ObjectId>"
}
```
> `projeId` opsiyonel.

---

### Projeler `/api/projeler`

```
GET    /api/projeler          Tüm projeleri getir (createdAt desc)
POST   /api/projeler          Yeni proje ekle
PUT    /api/projeler/:id      Projeyi güncelle
DELETE /api/projeler/:id      Projeyi sil
```

**POST / PUT body:**
```json
{
  "ad": "Web Sitesi Yenileme",
  "durum": "aktif",
  "butce": 50000,
  "baslangicTarihi": "2025-01-01",
  "bitisTarihi": "2025-06-30",
  "departmanId": "<ObjectId>"
}
```
> `durum` değerleri: `"aktif"` | `"tamamlandi"` | `"beklemede"`

---

### Departmanlar `/api/departmanlar`

```
GET    /api/departmanlar          Tüm departmanları getir (createdAt desc)
POST   /api/departmanlar          Yeni departman ekle
PUT    /api/departmanlar/:id      Departmanı güncelle
DELETE /api/departmanlar/:id      Departmanı sil
```

**POST / PUT body:**
```json
{
  "ad": "Finans",
  "kod": "FIN",
  "yonetici": "Ahmet Yılmaz"
}
```

---

### Kategoriler `/api/kategoriler`

```
GET    /api/kategoriler          Tüm kategorileri getir (createdAt asc)
POST   /api/kategoriler          Yeni kategori ekle
PUT    /api/kategoriler/:id      Kategoriyi güncelle
DELETE /api/kategoriler/:id      Kategoriyi sil
```

**POST / PUT body:**
```json
{
  "ad": "Maaş",
  "tur": "gider"
}
```

---

## Henüz Çalışmayan Endpoint'ler

### Dashboard `/api/dashboard` — server.js'e mount edilmemiş

`dashboardRoutes.js` yazılmış, içeriği hazır. `server.js`'e şu satır eklenmeli:
```js
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
```

Mount edildikten sonra çalışacak endpoint'ler:

```
GET /api/dashboard/summary                          Toplam gelir, gider, net kar, aktif proje sayısı
GET /api/dashboard/monthly?year=2025                Aylık gelir/gider dizisi (12 ay)
GET /api/dashboard/kategori-dagilimi?tur=gelir      Kategori bazlı toplamlar
```

> Tüm endpoint'lerde `authMiddleware` var — `Authorization: Bearer <JWT>` header'ı gerektirir.

---

### Auth `/api/auth` — server.js'e mount edilmemiş

`authRoutes.js` yazılmış, `server.js`'e şu satır eklenmeli:
```js
app.use("/api/auth", require("./routes/authRoutes"));
```

Mount edildikten sonra çalışacak endpoint'ler:

```
POST /api/auth/register     Kayıt ol → JWT döner
POST /api/auth/login        Giriş yap → JWT döner
GET  /api/auth/me           Token'dan kullanıcı bilgisi (korumalı)
```

---

## Ortak Notlar

- **ID convention:** MongoDB `_id` döner, frontend `id` olarak kullanır (`{ ...x, id: x._id }` mapping DataContext'te yapılıyor)
- **Hata formatı:** `{ "mesaj": "...", "hata": "..." }`
- **API URL** şu an hardcoded: `http://localhost:5001` — deploy öncesi `VITE_API_URL` env variable'ına taşınmalı
