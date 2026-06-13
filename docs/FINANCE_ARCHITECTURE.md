# Finans Servisi Mimarisi

Bu dosya `backend/services/financeService.js` ve `backend/routes/financeRoutes.js`
dosyalarının nasıl yazılacağını açıklar.

---

## Dosya Yapısı (eklenmesi gerekenler)

```
backend/
├── services/
│   └── financeService.js     ← Yahoo Finance sorguları + cache
├── routes/
│   └── financeRoutes.js      ← /api/finance/* endpoint'leri
└── models/
    └── Yatirim.js            ← Kullanıcı portföyü (YENİ)
```

---

## Kurulum

```bash
cd backend
npm install yahoo-finance2
```

---

## Yatirim Modeli

```js
// backend/models/Yatirim.js
const mongoose = require('mongoose');

const yatirimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  sembol: {
    type: String,
    required: true,
    uppercase: true,
    // Örnekler:
    // Hisse BIST:  "THYAO.IS", "ASELS.IS", "BIMAS.IS"
    // Hisse NYSE:  "AAPL", "TSLA", "GOOGL"
    // Kripto:      "BTC-USD", "ETH-USD"
    // Döviz:       "USDTRY=X", "EURTRY=X"
    // Altın:       "GC=F"
  },

  varlikTipi: {
    type: String,
    enum: ['hisse', 'kripto', 'doviz', 'emtia'],
    required: true,
  },

  ad: { type: String }, // "Apple Inc.", "Bitcoin" vb.

  adet: { type: Number, required: true, min: 0 },
  alisFiyati: { type: Number, required: true },   // Ortalama alış fiyatı (TRY)
  alisTarihi: { type: Date, required: true },

  notlar: { type: String },
}, {
  timestamps: true,
});

// Aynı kullanıcıda aynı sembol birden fazla kez olabilir (farklı tarihli alımlar)
yatirimSchema.index({ userId: 1, sembol: 1 });

module.exports = mongoose.model('Yatirim', yatirimSchema);
```

---

## Sembol Rehberi

| Varlık Tipi | Örnek Semboller | Format |
|-------------|-----------------|--------|
| BIST Hisse  | THYAO, ASELS, BIMAS, EREGL | `SEMBOL.IS` |
| NYSE/NASDAQ | AAPL, TSLA, MSFT, GOOGL | Direkt sembol |
| Kripto      | Bitcoin, Ethereum, BNB | `BTC-USD`, `ETH-USD` |
| Döviz (TRY karşı) | Dolar, Euro | `USDTRY=X`, `EURTRY=X` |
| Altın       | Ons altın | `GC=F` |
| Gümüş       | Ons gümüş | `SI=F` |

---

## financeService.js

### Cache Yapısı (in-memory, Redis gerekmez)

```js
const priceCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 dakika

function getCached(key) {
  const entry = priceCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    priceCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  priceCache.set(key, { data, timestamp: Date.now() });
}
```

### Temel Fonksiyonlar

```js
const yahooFinance = require('yahoo-finance2').default;

// Tekil fiyat çek
async function getQuote(sembol) {
  const cached = getCached(sembol);
  if (cached) return cached;

  const quote = await yahooFinance.quote(sembol);
  const data = {
    sembol,
    anlikFiyat:    quote.regularMarketPrice,
    gunlukDegisim: quote.regularMarketChange,
    degisimYuzde:  quote.regularMarketChangePercent,
    currency:      quote.currency,
    ad:            quote.longName || quote.shortName,
    piyasaDurumu:  quote.marketState, // "REGULAR" | "CLOSED" | "PRE" | "POST"
    guncellemeZamani: new Date(),
  };

  setCache(sembol, data);
  return data;
}

// Çoklu fiyat çek (portföy için)
async function getMultipleQuotes(semboller) {
  const results = await Promise.allSettled(semboller.map(s => getQuote(s)));
  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { sembol: semboller[i], hata: true }
  );
}

// Geçmiş fiyat verisi (grafik için)
async function getHistorical(sembol, period = '3mo') {
  // period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y'
  const result = await yahooFinance.historical(sembol, {
    period1: getPeriodStart(period),
    interval: period === '1d' ? '5m' : '1d',
  });
  return result.map(r => ({
    tarih: r.date,
    kapanis: r.close,
    acilis: r.open,
    yuksek: r.high,
    dusuk: r.low,
    hacim: r.volume,
  }));
}
```

---

## Kar/Zarar Hesabı

```js
// Portföy kar/zarar hesaplama
// Backend'de yapılır, frontend'e hazır veri gönderilir

function hesaplaKarZarar(yatirim, anlikFiyat) {
  const maliyet     = yatirim.adet * yatirim.alisFiyati;
  const anlikDeger  = yatirim.adet * anlikFiyat;
  const karZarar    = anlikDeger - maliyet;
  const karZararPct = ((karZarar / maliyet) * 100).toFixed(2);

  return {
    maliyet,
    anlikDeger,
    karZarar,
    karZararPct: parseFloat(karZararPct),
    karMi: karZarar >= 0,
  };
}
```

---

## financeRoutes.js Endpoint'leri

### GET /api/finance/quote/:sembol
```
Tekil anlık fiyat
Response: { sembol, anlikFiyat, gunlukDegisim, degisimYuzde, currency, ad, piyasaDurumu }
```

### POST /api/finance/quotes
```
Body: { semboller: ["THYAO.IS", "BTC-USD", ...] }
Toplu anlık fiyat (portföy için)
```

### GET /api/finance/historical/:sembol?period=3mo
```
Geçmiş fiyat verisi (grafik için)
period: 1d | 5d | 1mo | 3mo | 6mo | 1y
```

### GET /api/yatirimlar
```
Header: Authorization: Bearer <JWT>
Bu kullanıcının tüm yatırımları + anlık fiyat + kar/zarar
Response:
{
  toplamMaliyet: number,
  toplamAnlikDeger: number,
  toplamKarZarar: number,
  toplamKarZararPct: number,
  varliklar: [
    {
      ...yatirim,
      anlikFiyat,
      gunlukDegisim,
      karZarar,
      karZararPct
    }
  ]
}
```

### POST /api/yatirimlar
```
Header: Authorization: Bearer <JWT>
Body: { sembol, varlikTipi, adet, alisFiyati, alisTarihi, notlar? }
Yeni yatırım ekle
```

### PUT /api/yatirimlar/:id
```
Header: Authorization: Bearer <JWT>
Body: { adet?, alisFiyati?, notlar? }
Yatırım güncelle (sadece kendi yatırımı)
```

### DELETE /api/yatirimlar/:id
```
Header: Authorization: Bearer <JWT>
Yatırım sil (sadece kendi yatırımı)
```

### GET /api/finance/search?q=thyao
```
Sembol arama (kullanıcı portföye eklerken arar)
Response: [{ sembol, ad, varlikTipi, borsa }]
```

---

## Sembol Arama

```js
async function searchSymbol(query) {
  const results = await yahooFinance.search(query, { newsCount: 0 });
  return (results.quotes || [])
    .filter(q => q.isYahooFinance)
    .slice(0, 8)
    .map(q => ({
      sembol: q.symbol,
      ad:     q.longname || q.shortname,
      borsa:  q.exchange,
      tip:    q.quoteType, // "EQUITY" | "CRYPTOCURRENCY" | "CURRENCY" | "FUTURE"
    }));
}
```

---

## Hata Yönetimi

Yahoo Finance bazen hata verebilir (rate limit, piyasa kapalı, geçersiz sembol):

```js
async function safeGetQuote(sembol) {
  try {
    return await getQuote(sembol);
  } catch (err) {
    return {
      sembol,
      hata: true,
      hataMesaji: 'Fiyat alınamadı',
      anlikFiyat: null,
    };
  }
}
```

---

## Piyasa Saatleri Notu

- **BIST**: 10:00 – 18:00 TSİ (hafta içi)
- **NYSE/NASDAQ**: 16:30 – 23:00 TSİ (hafta içi)
- **Kripto**: 7/24 açık
- **Döviz (Forex)**: Hafta içi 7/24

`piyasaDurumu` alanını frontend'de göster:
- `"REGULAR"` → Yeşil nokta (açık)
- `"CLOSED"` → Gri nokta (kapalı)
- `"PRE"` / `"POST"` → Sarı nokta (öncesi/sonrası seans)
