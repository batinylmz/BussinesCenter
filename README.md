# BussinesCenter

KOBİ'ler ve girişimler için gelir-gider takibi, bütçe planlama, departman ve proje yönetimini tek bir panelde sunan finansal yönetim platformu.

Şirketini yöneten ama muhasebeciye her küçük bilgi için bağımlı olmak istemeyen işletme sahipleri, startup kurucuları ve finans sorumluları için tasarlandı. Aylık nakit akışını, departman harcamalarını ve yatırımlarını anlık olarak görüp yapay zeka destekli analizlerle karar almana yardımcı olur.

---

## Kurulum

### Adım 1 — Repoyu klonla

```bash
git clone https://github.com/batinylmz/BussinesCenter.git
cd BussinesCenter
```

### Adım 2 — Backend bağımlılıklarını yükle

```bash
cd backend
npm install
```

### Adım 3 — `.env` dosyası oluştur (`backend/.env`)

```
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=bussinescenter_super_secret_key_2024
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=...buraya_kendi_keyini_yaz

ANTHROPIC_API_KEY=sk-ant-api03-...buraya_kendi_keyini_yaz
```

> Anthropic API key için: [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key

---



```

> Gemini API key için: [aistudio.google.com](https://aistudio.google.com) → Get API Key

### Adım 4 — Backend'i başlat


```bash
node server.js
```

Çıktı:
```
✅ MongoDB Bağlantısı Başarılı!
Sunucu 5001 portunda ayaklandı.
```


### Adım 5 — Frontend kurulumu ve başlatma


Yeni bir terminal aç:

```bash
cd frontend
npm install
npm run dev
```

Uygulama: [http://localhost:5173](http://localhost:5173)

### Adım 6 


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
│   │   └── aiRoutes.js        # Gemini AI chat (SSE streaming)
│   ├── models/                # Mongoose şemaları
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT doğrulama
│   │   └── requireWriter.js   # Rol kontrolü (admin/manager)
│   └── seed.js                # Test verisi yükler
└── frontend/
    └── src/
        ├── context/
        │   └── DataContext.jsx  # Global state, API çağrıları, apiFetch
        ├── pages/               # Ekranlar
        └── components/          # Ortak UI bileşenleri
```

---

## API Endpoint'leri

| Method | URL | Yetki | Açıklama |
|---|---|---|---|
| POST | `/api/auth/login` | Herkese açık | Giriş yap |
| POST | `/api/auth/register` | Herkese açık | Kayıt ol |
| GET | `/api/gelirler` | Herkese açık | Gelirleri listele |
| POST | `/api/gelirler` | admin / manager | Gelir ekle |
| PUT | `/api/gelirler/:id` | admin / manager | Gelir güncelle |
| DELETE | `/api/gelirler/:id` | admin / manager | Gelir sil |
| GET | `/api/giderler` | Herkese açık | Giderleri listele |
| POST | `/api/giderler` | admin / manager | Gider ekle |
| PUT | `/api/giderler/:id` | admin / manager | Gider güncelle |
| DELETE | `/api/giderler/:id` | admin / manager | Gider sil |
| GET | `/api/departmanlar` | Herkese açık | Departmanları listele |
| POST | `/api/departmanlar` | admin / manager | Departman ekle |
| GET | `/api/projeler` | Herkese açık | Projeleri listele |
| POST | `/api/projeler` | admin / manager | Proje ekle |
| POST | `/api/ai/chat` | Tüm giriş yapmış kullanıcılar | AI asistan (streaming) |
