# BussinesCenter

KOBİ'ler ve girişimler için gelir-gider takibi, bütçe planlama, departman ve proje yönetimini tek bir panelde sunan finansal yönetim platformu.

Şirketini yöneten ama muhasebeciye her küçük bilgi için bağımlı olmak istemeyen işletme sahipleri, startup kurucuları ve finans sorumluları için tasarlandı. Aylık nakit akışını, departman harcamalarını ve yatırımlarını anlık olarak görüp yapay zeka destekli analizlerle karar almana yardımcı olur.

---

## Backend

```bash
cd backend
npm install
node server.js
```

`.env` dosyası gerekli (`backend/.env`):

```
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster0.xxxxx.mongodb.net/
JWT_SECRET=gizli_anahtar
GEMINI_API_KEY=...
```

Sunucu `http://localhost:5001` üzerinde çalışır.

---

## Frontend

Yeni bir terminal aç:

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.
