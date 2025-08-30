# Tuana Güzellik Salonu Backend API

Bu backend sistemi, Tuana Güzellik Salonu'nun fiyat listesi yönetimi için geliştirilmiştir.

## Özellikler

- 🔐 JWT tabanlı admin authentication
- 💰 Fiyat listesi CRUD işlemleri
- 👥 Admin kullanıcı yönetimi
- 📊 Dashboard istatistikleri
- 🔄 Toplu fiyat güncelleme
- 🗄️ MongoDB veritabanı

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (v4.4 veya üzeri)
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment dosyasını oluşturun:**
   ```bash
   cp env.example .env
   ```

3. **Environment değişkenlerini düzenleyin:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/guzellik-merkezi
   JWT_SECRET=your-super-secret-key
   PORT=5000
   NODE_ENV=development
   ```

4. **MongoDB'yi başlatın:**
   ```bash
   # MongoDB'nin çalıştığından emin olun
   mongod
   ```

5. **Veritabanını seed edin:**
   ```bash
   node seed/seedPrices.js
   ```

6. **İlk admin kullanıcısını oluşturun:**
   ```bash
   # POST /api/auth/setup endpoint'ini kullanın
   curl -X POST http://localhost:5000/api/auth/setup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@tuanaguzellik.com",
       "password": "123456",
       "fullName": "Admin User"
     }'
   ```

7. **Sunucuyu başlatın:**
   ```bash
   # Development modu
   npm run dev
   
   # Production modu
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin girişi
- `POST /api/auth/setup` - İlk admin oluşturma
- `GET /api/auth/profile` - Admin profili

### Fiyat Yönetimi (Public)

- `GET /api/prices` - Tüm aktif fiyatları getir
- `GET /api/prices/category/:category` - Kategoriye göre fiyatları getir

### Fiyat Yönetimi (Admin)

- `GET /api/prices/admin` - Tüm fiyatları getir (admin)
- `POST /api/prices` - Yeni fiyat ekle
- `PUT /api/prices/:id` - Fiyat güncelle
- `DELETE /api/prices/:id` - Fiyat sil (soft delete)
- `PATCH /api/prices/:id/restore` - Silinen fiyatı geri yükle

### Admin Yönetimi

- `GET /api/admin/dashboard` - Dashboard istatistikleri
- `GET /api/admin/admins` - Tüm adminleri listele
- `POST /api/admin/admins` - Yeni admin oluştur
- `PUT /api/admin/admins/:id` - Admin güncelle
- `DELETE /api/admin/admins/:id` - Admin sil
- `POST /api/admin/prices/bulk-update` - Toplu fiyat güncelleme

## Kullanım Örnekleri

### Admin Girişi

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

### Fiyat Güncelleme

```bash
curl -X PUT http://localhost:5000/api/prices/PRICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "price": 4500
  }'
```

### Toplu Fiyat Güncelleme

```bash
curl -X POST http://localhost:5000/api/admin/prices/bulk-update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "updates": [
      {"id": "PRICE_ID_1", "price": 4500},
      {"id": "PRICE_ID_2", "price": 2800}
    ]
  }'
```

## Veritabanı Şeması

### Price Model

```javascript
{
  category: String, // Kategori adı
  serviceName: String, // Hizmet adı
  price: Number, // Fiyat
  description: String, // Açıklama
  isActive: Boolean, // Aktif/Pasif durumu
  createdAt: Date, // Oluşturulma tarihi
  updatedAt: Date // Güncellenme tarihi
}
```

### Admin Model

```javascript
{
  username: String, // Kullanıcı adı
  email: String, // Email
  password: String, // Şifre (hash'lenmiş)
  fullName: String, // Ad soyad
  role: String, // Rol (admin/super_admin)
  isActive: Boolean, // Aktif/Pasif durumu
  lastLogin: Date, // Son giriş tarihi
  createdAt: Date // Oluşturulma tarihi
}
```

## Güvenlik

- JWT token tabanlı authentication
- Şifre hash'leme (bcrypt)
- Input validation
- CORS yapılandırması
- Role-based access control

## Geliştirme

### Scripts

- `npm run dev` - Development modu (nodemon ile)
- `npm start` - Production modu
- `node seed/seedPrices.js` - Veritabanını seed et

### Dosya Yapısı

```
backend/
├── models/          # MongoDB modelleri
├── routes/          # API routes
├── middleware/      # Middleware'ler
├── seed/           # Seed dosyaları
├── server.js       # Ana server dosyası
├── package.json    # Bağımlılıklar
└── README.md       # Bu dosya
```

## Lisans

Bu proje Tuana Güzellik Salonu için özel olarak geliştirilmiştir.
