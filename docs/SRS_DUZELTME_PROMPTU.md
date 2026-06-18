# BusinessCenter SRS Dokümanı — Yapay Zeka Düzeltme Promptu

Bu dosyayı yapay zekaya şu şekilde ilet:
> "Sana ekte verdiğim **BussinesCenter.docx** dosyasını aşağıdaki talimatlara göre düzelt ve bana güncellenmiş bir Word dokümanı olarak ver."

---

## GENEL TALİMAT

Ekte verilen SRS (Software Requirements Specification) dokümanı üzerinde aşağıdaki **5 kategoride** düzeltme yapacaksın. Her değişikliği mevcut dokümanın yapısına uygun yere ekle; dokümanın başarılı olan kısımlarına (AI entegrasyonu, JWT/bcrypt güvenlik tanımları, rol yönetimi açıklamaları) dokunma.

---

## DÜZELTME 1 — İsimlendirme Hatası (Tüm Dokümanda)

**Ne yapılacak:** Dokümanda geçen tüm **"BussinesCenter"** yazımlarını **"BusinessCenter"** olarak düzelt. Bu; başlık sayfası, üstbilgi/altbilgi, tablo başlıkları ve metin içi tüm geçişleri kapsar.

---

## DÜZELTME 2 — Bölüm 2: Karar Tabloları Eklenmesi

**Ne yapılacak:** Bölüm 2'deki (Sistem Çözümleme Tabloları) mevcut madde listelerinin **ardına** aşağıdaki üç karar tablosunu ekle. Tabloları Word'de gerçek tablo formatında oluştur.

---

### Tablo 2-A: Gelir/Gider Kaydı Onay Döngüsü — Karar Tablosu

| Koşul | Senaryo 1 | Senaryo 2 | Senaryo 3 | Senaryo 4 |
|---|---|---|---|---|
| Kullanıcı rolü admin/manager mı? | Evet | Evet | Hayır | Hayır |
| Tutar > 0 ve zorunlu alanlar dolu mu? | Evet | Hayır | Evet | Hayır |
| **Eylem: Kayıt veritabanına yazılır** | ✓ | — | — | — |
| **Eylem: "Alan eksik" hatası döner** | — | ✓ | — | ✓ |
| **Eylem: "Yetersiz yetki" hatası döner** | — | — | ✓ | ✓ |

**İşlem Açıklaması:** Kullanıcı gelir veya gider formu doldurur → Backend `POST /api/gelirler` veya `POST /api/giderler` endpoint'ine istek gönderilir → Mongoose validasyonu çalışır → Başarı durumunda `DataContext` güncellenir, ekran anlık olarak yenilenir.

---

### Tablo 2-B: Bütçe Aşımı Tespiti — Karar Tablosu

| Koşul | Senaryo 1 | Senaryo 2 | Senaryo 3 |
|---|---|---|---|
| Departman harcaması (harcanan) > Bütçe (butce) mi? | Evet | Hayır | — |
| Fark %10'dan fazla mı? | Evet | — | Hayır |
| **Eylem: Kırmızı [BÜTÇE AŞIMI] uyarısı gösterilir** | ✓ | — | — |
| **Eylem: AI sistem promptuna aşım bilgisi eklenir** | ✓ | — | — |
| **Eylem: Dashboard'da yeşil/normal durum gösterilir** | — | ✓ | — |
| **Eylem: Dashboard'da sarı/uyarı durumu gösterilir** | — | — | ✓ |

**İşlem Açıklaması:** Departman verisi `DataContext`'e yüklenirken `harcanan > butce` kontrolü yapılır → Frontend `departmanlar.filter(d => d.harcanan > d.butce)` ile aşan departmanları tespit eder → Bu liste hem Dashboard bileşenine hem de AI servisine iletilir.

---

### Tablo 2-C: AI Asistan Yetki Kontrolü — Karar Tablosu

| Kullanıcı Rolü | Veri Okuma | Kayıt Oluşturma | Kayıt Güncelleme | Kayıt Silme |
|---|---|---|---|---|
| admin | ✓ Serbest | ✓ Yapabilir | ✓ Yapabilir | ✓ Onay ile |
| manager | ✓ Serbest | ✓ Yapabilir | ✓ Yapabilir | ✓ Onay ile |
| viewer | ✓ Serbest | ✗ Reddedilir | ✗ Reddedilir | ✗ Reddedilir |

**İşlem Açıklaması:** AI her yazma isteği öncesinde JWT token'dan çıkarılan `role` alanını kontrol eder. Silme işlemi hiçbir zaman otomatik gerçekleşmez; AI `{"type": "confirmation_required"}` objesi döndürür ve kullanıcı onayı beklenir.

---

## DÜZELTME 3 — Madde 3.4: Use Case Detaylandırması

**Ne yapılacak:** Halihazırda detaylı olan UC-01 (Giriş Yapma) ve UC-14 (AI Asistan) formatını örnek alarak aşağıdaki **7 core Use Case'i** aynı bölüme ekle. Her UC için ön koşul, temel akış, alternatif akış ve son koşul bilgilerini belirt.

---

### UC-02: Gelir Kaydı Ekleme

- **Aktörler:** Manager, Admin
- **Ön Koşul:** Kullanıcı sisteme giriş yapmış, rolü `admin` veya `manager`
- **Temel Akış:**
  1. Kullanıcı sol menüden "Gelirler" sayfasını açar
  2. "Yeni Gelir Ekle" butonuna tıklar
  3. Modal açılır; tutar, kategori, tarih ve açıklama alanlarını doldurur
  4. "Kaydet" butonuna tıklar
  5. Sistem `POST /api/gelirler` isteği gönderir
  6. Mongoose validasyonu geçilir, MongoDB'ye yazılır
  7. `DataContext.gelirler` güncellenir, liste anlık yenilenir
- **Alternatif Akış — Zorunlu Alan Eksik:**
  - 4a. Tutar alanı boşsa modal hata mesajı gösterir, kayıt gönderilmez
- **Alternatif Akış — Sunucu Hatası:**
  - 5a. Backend çevrimdışıysa kullanıcıya "Bağlantı hatası" mesajı gösterilir
- **Son Koşul:** Gelir kaydı MongoDB'de `gelirler` collection'ına eklendi

---

### UC-03: Gider Kaydı Ekleme

- **Aktörler:** Manager, Admin
- **Ön Koşul:** Kullanıcı giriş yapmış; isteğe bağlı olarak ilgili proje ve departman sistemde kayıtlı
- **Temel Akış:**
  1. Kullanıcı "Giderler" sayfasını açar
  2. "Yeni Gider Ekle" butonuna tıklar
  3. Tutar, kategori, tarih, açıklama girer; departman ve proje seçimi isteğe bağlı
  4. Kaydet → `POST /api/giderler` → MongoDB'ye yazar
  5. Departman bütçe kontrolü anlık güncellenir
- **Alternatif Akış — Bütçe Aşımı:**
  - 5a. Gider eklendikten sonra ilgili departmanın `harcanan > butce` koşulu sağlanıyorsa Dashboard'da kırmızı uyarı gösterilir
- **Son Koşul:** Gider kaydı eklendi, departman bütçe durumu güncellendi

---

### UC-05: Departman Yönetimi

- **Aktörler:** Admin
- **Ön Koşul:** Kullanıcı rolü `admin`
- **Temel Akış:**
  1. "Departmanlar" sayfası açılır
  2. Yeni departman eklemek için ad, kod (örn: "FIN", "HR") ve yönetici adı girilir
  3. `POST /api/departmanlar` ile kaydedilir
  4. Düzenleme için mevcut departman seçilir, `PUT /api/departmanlar/:id` çağrılır
- **Alternatif Akış — Kodun Zaten Var Olması:**
  - 3a. Unique constraint ihlali varsa "Bu kod zaten kullanılıyor" hatası döner
- **Alternatif Akış — Bağımlı Kayıt Silinmeye Çalışılması:**
  - Departmana bağlı gelir/gider/proje varken silme işlemi engellenir
- **Son Koşul:** Departman listesi güncellendi, ilişkili gelir/gider/proje kayıtları etkilenmedi

---

### UC-06: Proje Yönetimi

- **Aktörler:** Manager, Admin
- **Ön Koşul:** En az bir departman sistemde kayıtlı
- **Temel Akış:**
  1. "Projeler" sayfası açılır
  2. Yeni proje: ad, durum (aktif/tamamlandi/beklemede), bütçe, başlangıç-bitiş tarihi, departman seçilir
  3. `POST /api/projeler` ile kaydedilir
  4. Proje tamamlandığında durum güncellenir: `PUT /api/projeler/:id`
- **Alternatif Akış — Bitiş Tarihi Başlangıçtan Önce:**
  - 3a. Validasyon hatası, kayıt yapılmaz
- **Son Koşul:** Proje MongoDB `projeler` collection'ına eklendi; ilgili giderler bu projeye bağlanabilir hale geldi

---

### UC-07: Dashboard Görüntüleme

- **Aktörler:** Viewer, Manager, Admin
- **Ön Koşul:** Kullanıcı giriş yapmış
- **Temel Akış:**
  1. Uygulama açıldığında varsayılan sayfa Dashboard'dur
  2. `DataContext` mount'ta 4 paralel API çağrısı (`Promise.all`) ile veri çeker:
     - `GET /api/gelirler`, `GET /api/giderler`, `GET /api/departmanlar`, `GET /api/projeler`
  3. Toplam gelir, gider, net kar/zarar StatCard'larında gösterilir
  4. Bütçe aşan departmanlar kırmızı badge ile işaretlenir
- **Alternatif Akış — Veri Yüklenemedi:**
  - 2a. API yanıt vermezse boş liste ile devam edilir, hata konsola yazılır
- **Son Koşul:** Kullanıcı şirketin güncel finansal özetini görür

---

### UC-09: Kullanıcı ve Rol Yönetimi

- **Aktörler:** Admin
- **Ön Koşul:** Kullanıcı rolü `admin`
- **Temel Akış:**
  1. Yönetici panelinden yeni kullanıcı oluşturulur (ad, soyad, e-posta, şifre, rol)
  2. Şifre backend'de `bcryptjs` ile hashlenir, plain text saklanmaz
  3. Rol ataması: `admin` | `manager` | `viewer`
  4. Mevcut kullanıcının rolü güncellenebilir
- **Alternatif Akış — E-posta Zaten Kayıtlı:**
  - 2a. Unique index ihlali → "Bu e-posta zaten kullanımda" hatası
- **Alternatif Akış — Son Admin Silinmeye Çalışılıyor:**
  - Sistemde en az bir admin kalması zorunlu; silme engellenir
- **Son Koşul:** Kullanıcı oluşturuldu/güncellendi, rol ve yetkileri aktif

---

### UC-12: Bütçe Aşımı Uyarısı Alma

- **Aktörler:** Manager, Admin (sistem tetikler)
- **Ön Koşul:** Departman bütçesi tanımlı; gider kaydı ekleniyor veya güncelleniyor
- **Temel Akış:**
  1. Gider kaydedildiğinde `DataContext` departman `harcanan` değerini günceller
  2. `harcanan > butce` koşulu sağlanırsa:
     - Dashboard'da ilgili departman satırında `[BÜTÇE AŞIMI]` uyarısı gösterilir
     - AI sistem promptuna otomatik olarak bütçe aşım bilgisi eklenir
  3. Kullanıcı AI asistana sorduğunda spesifik öneri alır
- **Alternatif Akış — Bütçe Tanımlı Değil:**
  - Departmanın `butce` alanı 0 veya boşsa uyarı gösterilmez
- **Son Koşul:** Kullanıcı görsel uyarıyla bilgilendirildi, AI bağlamına aşım bilgisi yansıdı

---

## DÜZELTME 4 — Madde 3.5: Veri Modeli Kardinalite İlişkileri

**Ne yapılacak:** Madde 3.5'te listelenen entity'lerin hemen altına aşağıdaki metin tabanlı ER ilişki tablosunu ve kardinalite açıklamalarını ekle.

---

### Entity-Relationship İlişki Tablosu

| Ana Tablo | İlişki | Bağlı Tablo | Foreign Key | Açıklama |
|---|---|---|---|---|
| departmanlar | 1 : N | gelirler | `gelirler.departmanId` | Bir departmanın sınırsız gelir kaydı olabilir |
| departmanlar | 1 : N | giderler | `giderler.departmanId` | Bir departmanın sınırsız gider kaydı olabilir |
| departmanlar | 1 : N | projeler | `projeler.departmanId` | Bir departman birden fazla projeye sahip olabilir |
| departmanlar | 1 : N | users | `users.departmanId` | Bir departmanda birden fazla kullanıcı çalışabilir |
| projeler | 1 : N | giderler | `giderler.projeId` | Bir projeye ait birden fazla gider kaydı olabilir (opsiyonel bağ) |
| users | 1 : N | conversations | `conversations.userId` | Bir kullanıcının birden fazla AI sohbet geçmişi olabilir |
| users | 1 : N | yatirimlar | `yatirimlar.userId` | Bir kullanıcının birden fazla yatırım kaydı olabilir |
| kategoriler | 1 : N | gelirler | `gelirler.kategori` | Bir kategori birden fazla gelire atanabilir (string ref) |
| kategoriler | 1 : N | giderler | `giderler.kategori` | Bir kategori birden fazla gidere atanabilir (string ref) |

---

### Metin Tabanlı ER Özeti

```
[users] ──(1:N)──► [conversations]
[users] ──(1:N)──► [yatirimlar]
[users] ──(0..1:N)─► [departmanlar]   (bir kullanıcı bir departmana atanabilir)

[departmanlar] ──(1:N)──► [gelirler]
[departmanlar] ──(1:N)──► [giderler]
[departmanlar] ──(1:N)──► [projeler]

[projeler] ──(1:N, opsiyonel)──► [giderler]
```

**Notlar:**
- MongoDB'de foreign key kısıtlaması (CASCADE/RESTRICT) veritabanı seviyesinde yoktur; ilişki bütünlüğü uygulama katmanında sağlanır.
- `kategoriler` collection'ı frontend-only'dir (sayfa yenilemede sıfırlanır); backend'de ayrı bir koleksiyon olarak tutulmamaktadır.
- `yatirimlar` ve `butce` modülleri mevcut sürümde backend modeli olmaksızın çalışmakta; veri kalıcılığı ilerleyen sürümlerde eklenecektir.

---

## DÜZELTME 5 — İşlevsel Olmayan Gereksinimler (GRO): Eksik Maddeler

**Ne yapılacak:** GRO (Non-Functional Requirements) bölümüne aşağıdaki iki maddeyi yeni başlıklar olarak ekle.

---

### GRO-05: Yedekleme ve Kurtarma (Backup/Recovery)

| Parametre | Hedef Değer |
|---|---|
| Yedekleme Sıklığı | Günlük otomatik yedek (MongoDB Atlas Backup veya cron-based mongodump) |
| RPO (Recovery Point Objective — Kabul Edilebilir Veri Kaybı) | Maksimum 24 saat |
| RTO (Recovery Time Objective — Kurtarma Süresi Hedefi) | Maksimum 4 saat |
| Yedek Saklama Süresi | Son 30 günün yedeği tutulur |
| Yedek Depolama | MongoDB Atlas'ta coğrafi olarak ayrılmış bölge (region) |

**Gerekçe:** KOBİ finansal verileri kaybolduğunda yasal ve muhasebe sorumlulukları doğabilir. Günlük yedek ile maksimum 1 günlük veri kaybı toleransı kabul edilebilir düzeyde tutulmuştur.

---

### GRO-06: Erişilebilirlik / Sistem Sürekliliği (Availability)

| Parametre | Hedef Değer |
|---|---|
| Yıllık Uptime Hedefi | %99.9 (yaklaşık 8.7 saat/yıl planlı bakım dahil kesinti toleransı) |
| Anlık Yanıt Süresi | API endpoint'leri < 500ms (P95) |
| AI Yanıt Süresi | İlk token < 2 saniye (streaming SSE ile) |
| Bakım Penceresi | Hafta içi 02:00–04:00 saatleri arası (Türkiye saati) |
| Hata İzleme | Sunucu tarafı hatalar Express error-handler middleware ile loglanır |

**Gerekçe:** KOBİ ortamında çalışma saatlerinde (09:00–18:00) kesintisiz erişim kritik önem taşır. %99.9 hedefi, tek sunucu (single-node) deployment için gerçekçi ve ulaşılabilir bir standarttır.

---

## ÖZET: Yapılacak Değişiklikler Listesi

| # | Bölüm | İşlem |
|---|---|---|
| 1 | Tüm doküman | "BussinesCenter" → "BusinessCenter" düzelt |
| 2 | Bölüm 2 | 3 adet karar tablosu ekle (Tablo 2-A, 2-B, 2-C) |
| 3 | Madde 3.4 | UC-02, UC-03, UC-05, UC-06, UC-07, UC-09, UC-12 detaylarını ekle |
| 4 | Madde 3.5 | Kardinalite tablosu ve metin ER diyagramı ekle |
| 5 | GRO bölümü | GRO-05 (Yedekleme) ve GRO-06 (Availability) maddelerini ekle |

**Dokunma:** AI entegrasyonu açıklamaları, JWT/bcrypt güvenlik tanımları, SSE/streaming teknik detayları, rol yönetimi bölümleri — bunlar olduğu gibi kalacak.
