# Backend Geliştirme Fazları

Sorumluluk: Backend API + AI Servisi + Finans Servisi
Stack: Node.js, Express, MongoDB, Mongoose, JWT, Anthropic SDK, Yahoo Finance

---

## Faz Durumu (Özet)

| Faz | Durum | Kalan |
|-----|-------|-------|
| Faz 1 — Auth | ⚠️ Kısmen | server.js mount + scripts klasörü |
| Faz 2 — Dashboard | ⚠️ Kısmen | server.js mount |
| Faz 3 — AI Servisi | ❌ Yapılmadı | Tüm dosyalar |
| Faz 4 — Finans & Yatırım | ❌ Yapılmadı | Tüm dosyalar |
| Faz 5 — Raporlar & Bütçe | ❌ Yapılmadı | Tüm dosyalar |
| Faz 6 — Kullanıcı Yönetimi | ❌ Yapılmadı | Tüm dosyalar |

---

## Faz 1 — Authentication Backend

> **Durum: ⚠️ Kısmen tamamlandı** — Kod yazıldı, `server.js`'e mount edilmedi.

> Diğer tüm fazlar bu faza bağımlı. `userId` ve `role` olmadan devam edilemez.

**Kurulum:** ✅ Tamamlandı (`bcryptjs`, `jsonwebtoken` yüklü)

**`.env` eklemeleri:**
```
JWT_SECRET=gizli_bir_anahtar_buraya
JWT_EXPIRES_IN=7d
```

**Yapılacaklar:**

- [x] `backend/models/User.js` — `role` alanı eklendi
  ```js
  role: { type: String, enum: ['admin', 'manager', 'viewer'], default: 'viewer' }
  ```
- [x] `backend/middleware/authMiddleware.js` — JWT doğrulama yazıldı
- [x] `backend/routes/authRoutes.js` — register / login / me endpoint'leri yazıldı
- [ ] `backend/scripts/addRoleToUsers.js` — mevcut kullanıcılara `viewer` rolü ata
  ```bash
  node backend/scripts/addRoleToUsers.js
  ```
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/auth", require("./routes/authRoutes"));
  ```

**Çıktı:** Frontend `POST /api/auth/login`'e istek atabilir, JWT alabilir.

---

## Faz 2 — Dashboard API Endpoint'leri

> **Durum: ⚠️ Kısmen tamamlandı** — Route dosyası yazıldı, `server.js`'e mount edilmedi.

> Frontend'in grafik çizmesi için özet veri endpoint'leri.

**Yapılacaklar:**

- [x] `backend/routes/dashboardRoutes.js` yazıldı
  - `GET /api/dashboard/summary` — toplam gelir, gider, net kar, aktif proje sayısı
  - `GET /api/dashboard/monthly?year=2025` — her ay için gelir/gider dizisi
  - `GET /api/dashboard/kategori-dagilimi?tur=gelir` — kategori bazlı toplamlar
- [x] Tüm endpoint'lere `authMiddleware` eklendi
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/dashboard", require("./routes/dashboardRoutes"));
  ```

> **Not:** Bu mount yapılınca `DataContext.jsx` güncellenmeli — dashboard verileri
> şu an React'ta hesaplanıyor, bunun yerine `/api/dashboard/summary` kullanılmalı.

**Örnek response (`/summary`):**
```json
{
  "toplamGelir": 150000,
  "toplamGider": 98000,
  "netKar": 52000,
  "aktifProjeSayisi": 3,
  "departmanSayisi": 4
}
```

---

## Faz 3 — AI Servisi

> **Durum: ❌ Yapılmadı** — Hiçbir dosya oluşturulmadı.

> Detaylı spesifikasyon: `AI_ARCHITECTURE.md`
> Sistem promptu: `AI_SYSTEM_PROMPT.md` — `backend/` klasörüne taşı

**Kurulum:**
```bash
cd backend
npm install @anthropic-ai/sdk
```

**`.env` eklemesi:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Yapılacaklar:**

- [ ] `backend/models/Conversation.js` — sohbet geçmişi (kayan pencere, max 20 mesaj)
- [ ] `backend/services/aiService.js`
  - `AI_SYSTEM_PROMPT.md` dosyasını okur, system prompt olarak kullanır
  - Tool listesi: `getCompanyData`, `getGelirler`, `getGiderler`,
    `getProjeler`, `getDepartmanlar`, `createRecord`, `updateRecord`, `deleteRecord`
  - `deleteRecord` → DB'ye yazmaz, `{ type: "confirmation_required" }` döner
  - Rol kontrolü: `createRecord` / `updateRecord` için `admin` veya `manager` gerekir
- [ ] `backend/routes/aiRoutes.js`
  - `POST /api/ai/chat` — mesaj gönder, yanıt al
  - `POST /api/ai/confirm` — silme onayı gelince gerçek silmeyi yap
  - `GET /api/ai/conversations` — bu kullanıcının sohbet listesi
  - `GET /api/ai/conversations/:id` — sohbet detayı
  - `DELETE /api/ai/conversations/:id` — sohbet sil
- [ ] Tüm endpoint'lere `authMiddleware` ekle
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/ai", require("./routes/aiRoutes"));
  ```

**Kritik akış:**
```
POST /api/ai/chat gelir
→ JWT'den userId + role çıkar
→ Conversation yükle (yoksa oluştur)
→ Anthropic API çağır (system + messages + tools)
→ tool_use gelirse çalıştır
  → deleteRecord ise: { type: "confirmation_required" } döndür
  → diğerleri: tool_result gönder, final yanıt al
→ Conversation'a kaydet (son 20 mesaj)
→ Frontend'e döndür
```

---

## Faz 4 — Finans & Yatırım Servisi

> **Durum: ❌ Yapılmadı** — Hiçbir dosya oluşturulmadı.

> Detaylı spesifikasyon: `FINANCE_ARCHITECTURE.md`

**Kurulum:**
```bash
cd backend
npm install yahoo-finance2
```

**Yapılacaklar:**

- [ ] `backend/models/Yatirim.js`
  - `userId`, `sembol`, `varlikTipi`, `adet`, `alisFiyati`, `alisTarihi`, `notlar`
- [ ] `backend/services/financeService.js`
  - Yahoo Finance sorguları
  - 5 dakikalık in-memory cache (`Map` ile, Redis gerekmez)
  - `getQuote(sembol)`, `getMultipleQuotes(semboller)`, `getHistorical(sembol, period)`
  - `searchSymbol(query)`, `hesaplaKarZarar(yatirim, anlikFiyat)`
- [ ] `backend/routes/financeRoutes.js`
  - `GET /api/finance/quote/:sembol` — anlık fiyat
  - `POST /api/finance/quotes` — toplu fiyat
  - `GET /api/finance/historical/:sembol?period=3mo` — geçmiş veri
  - `GET /api/finance/search?q=thyao` — sembol arama
  - `GET /api/yatirimlar` — kullanıcının portföyü + kar/zarar
  - `POST /api/yatirimlar` — yatırım ekle
  - `PUT /api/yatirimlar/:id` — yatırım güncelle
  - `DELETE /api/yatirimlar/:id` — yatırım sil
- [ ] Tüm endpoint'lere `authMiddleware` ekle
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/finance", require("./routes/financeRoutes"));
  app.use("/api/yatirimlar", require("./routes/financeRoutes"));
  ```

**Sembol formatları:**
| Varlık | Format | Örnek |
|--------|--------|-------|
| BIST hisse | `SEMBOL.IS` | `THYAO.IS` |
| NYSE/NASDAQ | Direkt | `AAPL` |
| Kripto | `SEMBOL-USD` | `BTC-USD` |
| Döviz | `ÇIFT=X` | `USDTRY=X` |
| Altın | — | `GC=F` |

---

## Faz 5 — Raporlar & Bütçe API

> **Durum: ❌ Yapılmadı** — Hiçbir dosya oluşturulmadı.

**Yapılacaklar:**

- [ ] `backend/models/Butce.js`
  ```js
  { departmanId, yil, ay, hedefGelir, hedefGider, aciklama }
  ```
- [ ] `backend/routes/raporRoutes.js`
  - `GET /api/raporlar/gelir-gider?startDate=&endDate=&departmanId=`
  - `GET /api/raporlar/proje-maliyetleri`
  - `GET /api/raporlar/export?format=csv&startDate=&endDate=`
- [ ] `backend/routes/butceRoutes.js`
  - `GET /api/butce?yil=2025&departmanId=`
  - `POST /api/butce` — bütçe hedefi oluştur (admin/manager)
  - `PUT /api/butce/:id` — güncelle
  - `DELETE /api/butce/:id` — sil
- [ ] Tüm endpoint'lere `authMiddleware` ekle
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/raporlar", require("./routes/raporRoutes"));
  app.use("/api/butce", require("./routes/butceRoutes"));
  ```

---

## Faz 6 — Kullanıcı Yönetimi API

> **Durum: ❌ Yapılmadı** — Hiçbir dosya oluşturulmadı.

> Sadece `admin` rolü erişebilir.

**Yapılacaklar:**

- [ ] `backend/middleware/adminMiddleware.js`
  - `req.role !== 'admin'` ise 403 döndür
- [ ] `backend/routes/userRoutes.js`
  - `GET /api/users` — kullanıcı listesi (admin)
  - `POST /api/users` — kullanıcı oluştur (admin)
  - `PUT /api/users/:id/role` — rol değiştir (admin)
  - `DELETE /api/users/:id` — kullanıcı sil (admin, kendini silemez)
- [ ] `server.js`'e mount et:
  ```js
  app.use("/api/users", require("./routes/userRoutes"));
  ```

---

## Final Dosya Yapısı (tüm fazlar bittikten sonra)

```
backend/
├── middleware/
│   ├── authMiddleware.js       Faz 1 ✅
│   └── adminMiddleware.js      Faz 6 ❌
├── models/
│   ├── User.js                 Faz 1 ✅
│   ├── Conversation.js         Faz 3 ❌
│   ├── Yatirim.js              Faz 4 ❌
│   └── Butce.js                Faz 5 ❌
├── routes/
│   ├── authRoutes.js           Faz 1 ✅ (mount edilmedi)
│   ├── dashboardRoutes.js      Faz 2 ✅ (mount edilmedi)
│   ├── aiRoutes.js             Faz 3 ❌
│   ├── financeRoutes.js        Faz 4 ❌
│   ├── raporRoutes.js          Faz 5 ❌
│   ├── butceRoutes.js          Faz 5 ❌
│   └── userRoutes.js           Faz 6 ❌
├── services/
│   ├── aiService.js            Faz 3 ❌
│   └── financeService.js       Faz 4 ❌
├── scripts/
│   └── addRoleToUsers.js       Faz 1 ❌
├── AI_SYSTEM_PROMPT.md         Faz 3 (taşınacak)
├── server.js                   Her fazda güncellenir
├── seed.js
└── package.json
```
