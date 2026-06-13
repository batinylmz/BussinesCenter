# BussinesCenter

KOBİ'ler için gelir-gider, departman bütçesi, proje ve yatırım yönetim platformu. React + Vite frontend, Express.js + MongoDB backend, Claude AI entegrasyonu.

---

## Kurulum Sırası

### Adım 1 — Repoyu klonla

```bash
git clone https://github.com/batinylmz/BussinesCenter.git
cd BussinesCenter
```

---

### Adım 2 — MongoDB Atlas ayarı

1. [mongodb.com/atlas](https://www.mongodb.com/atlas) → hesabına giriş yap
2. **Network Access** → **Add IP Address** → `0.0.0.0/0` ekle (her yerden erişim)
3. **Database Access** → kullanıcı adı ve şifreyi not al
4. **Clusters** → **Connect** → connection string'i kopyala

---

### Adım 3 — Backend kurulumu

```bash
cd backend
npm install
```

`backend/.env` dosyası oluştur (yoksa):

```
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=bussinescenter_super_secret_key_2024
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-api03-...buraya_kendi_keyini_yaz
```

> Anthropic API key için: [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key

---

### Adım 4 — Veritabanına test verisi yükle

```bash
cd backend
node seed.js
```

Çıktı:
```
✅ Tüm veriler başarıyla MongoDB'ye yüklendi!
```

---

### Adım 5 — Admin kullanıcısı oluştur

```bash
node scripts/createAdmin.js
```

Çıktı:
```
✅ Admin kullanıcı oluşturuldu.
   E-posta : admin@businesscenter.com
   Şifre   : demo123
```

> Bu script yalnızca bir kez çalıştırılır. Kullanıcı zaten varsa hiçbir şey yapmaz.

---

### Adım 6 — Backend'i başlat

```bash
node server.js
```

Çıktı:
```
✅ MongoDB Bağlantısı Başarılı!
Sunucu 5001 portunda ayaklandı.
```

---

### Adım 7 — Frontend kurulumu ve başlatma

Yeni bir terminal aç:

```bash
cd frontend
npm install
npm run dev
```

Uygulama: [http://localhost:5173](http://localhost:5173)

---

### Adım 8 — Giriş yap

| Alan | Değer |
|---|---|
| E-posta | `admin@businesscenter.com` |
| Şifre | `demo123` |

---

## Proje Yapısı

```
BussinesCenter/
├── backend/
│   ├── server.js              # Express uygulaması — ana giriş noktası
│   ├── routes/                # API endpoint'leri
│   │   ├── gelirRoutes.js
│   │   ├── giderRoutes.js
│   │   ├── departmanRoutes.js
│   │   ├── projeRoutes.js
│   │   ├── kategoriRoutes.js
│   │   ├── authRoutes.js      # Giriş / kayıt
│   │   └── aiRoutes.js        # Claude AI chat
│   ├── models/                # Mongoose şemaları
│   ├── middleware/            # JWT doğrulama
│   ├── scripts/
│   │   └── createAdmin.js     # İlk admin kullanıcısını oluşturur
│   └── seed.js                # Test verisi yükler
└── frontend/
    └── src/
        ├── context/
        │   └── DataContext.jsx  # Global state ve API çağrıları
        ├── pages/               # Ekranlar
        └── components/          # Ortak UI bileşenleri
```

---

## API Endpoint'leri

| Method | URL | Açıklama |
|---|---|---|
| POST | `/api/auth/login` | Giriş yap |
| POST | `/api/auth/register` | Kayıt ol |
| GET | `/api/gelirler` | Gelirleri listele |
| POST | `/api/gelirler` | Gelir ekle |
| PUT | `/api/gelirler/:id` | Gelir güncelle |
| DELETE | `/api/gelirler/:id` | Gelir sil |
| GET | `/api/giderler` | Giderleri listele |
| POST | `/api/giderler` | Gider ekle |
| GET | `/api/departmanlar` | Departmanları listele |
| GET | `/api/projeler` | Projeleri listele |
| POST | `/api/ai/chat` | AI asistan (streaming) |

---

## Sık Karşılaşılan Hatalar

**"Sunucuya bağlanılamadı" (Login ekranı)**
→ Backend çalışmıyor olabilir. `node server.js` komutunu çalıştır.
→ `authRoutes` mount edilmemiş olabilir. `server.js`'de `/api/auth` satırı var mı kontrol et.

**"Could not connect to any servers in your MongoDB Atlas cluster"**
→ Atlas panelinde **Network Access** → IP adresini whitelist'e ekle.
→ `.env` dosyasındaki `MONGO_URI` doğru mu kontrol et.

**AI asistan yanıt vermiyor**
→ `backend/.env` içinde `ANTHROPIC_API_KEY` tanımlı mı kontrol et.
→ Backend yeniden başlatılmış mı kontrol et.
