# REST API - Point of Sale System

## Deskripsi Proyek

Proyek ini adalah **REST API untuk sistem Point of Sale (POS)** yang dibangun menggunakan **NestJS + TypeScript** dengan database **MongoDB (NoSQL)**. Ini adalah proyek lama yang dipertahankan menggunakan NoSQL untuk efisiensi waktu pengembangan tanpa perlu migrasi ke SQL.

Proyek ini memenuhi persyaratan tugas dengan implementasi:
- ✅ **JWT Authentication** - Sistem autentikasi berbasis token dengan proteksi endpoint
- ✅ **Dua CRUD Saling Terkait** - Products dan Orders dengan relationship yang jelas
- ✅ **E2E Testing** - Testing end-to-end yang fokus pada proteksi endpoint dengan token

---

## Tech Stack

Proyek ini dibangun dengan teknologi berikut:

- **NestJS + TypeScript** - Framework Node.js untuk aplikasi backend yang scalable
- **MongoDB (Mongoose)** - NoSQL database untuk fleksibilitas penyimpanan data
- **JWT Auth** - Sistem autentikasi berbasis token untuk keamanan API
- **Jest** - Testing framework untuk e2e testing
- **Postman** - Alat dokumentasi dan testing API
- **bcrypt** - Hashing password untuk keamanan
- **Class Validator** - Validasi data request

---

## Arsitektur Aplikasi

### Pattern: Modular Monolith + Feature Modules

Proyek ini menggunakan arsitektur **Modular Monolith** dengan **Feature Modules**, di mana setiap fitur bisnis dikemas dalam modul terpisah yang independen namun dapat berintegrasi.

#### Struktur Folder

```
src/
├── module/                    # Feature modules
│   ├── auth/                  # JWT authentication
│   ├── products/              # Product management
│   ├── orders/                # Order management
│   ├── customers/             # Customer management
│   ├── users/                 # User management
│   ├── roles/                 # Role & permission
│   └── ... (module lainnya)
├── guard/                     # JWT & authorization guards
├── decorator/                 # Custom decorators
├── filter/                    # Exception filters
├── interceptor/               # Response interceptors
└── config/                    # Configuration files
```

#### Keuntungan Pattern Ini:

- **Maintainability** - Kode terorganisir per fitur, mudah dicari dan dimodifikasi
- **Scalability** - Setiap module dapat dikembangkan independen tanpa mengganggu yang lain
- **Testability** - Masing-masing module dapat ditest secara terpisah
- **Separation of Concerns** - Setiap module memiliki responsibilitas yang jelas

---

## Authentication - JWT

Sistem autentikasi menggunakan JWT (JSON Web Token) dengan algoritma **RS256**.

### Cara Menggunakan

1. **Login** untuk mendapatkan access token
2. **Gunakan header** `Authorization: Bearer <token>` pada request berikutnya
3. **Token** berisi informasi user, role, dan permissions

### Contoh Request & Response

**POST** `/auth/login`

```json
// Request
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "rahasia"
}

// Response
{
  "message": "Successfully login!",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "Admin",
      "username": "admin",
      "email": "admin@example.com",
      "roles": ["ADMIN"]
    }
  }
}
```

### Proteksi Endpoint

Semua endpoint (kecuali `/auth/login`) memerlukan JWT token. Tambahkan header:

```
Authorization: Bearer <token>
```

---

## Dua CRUD Saling Terkait

### 1. Products (CRUD Lengkap)

Products adalah master data untuk semua produk yang dijual di sistem.

#### Endpoints:
- `GET /products` - List semua produk
- `GET /products/:productId` - Detail produk
- `POST /products` - Create produk baru
- `PATCH /products/:productId` - Update produk
- `DELETE /products/:productId` - Soft delete produk

#### Contoh Create Product

**POST** `/products`

```json
// Request (multipart/form-data)
{
  "name": "Nasi Goreng Spesial",
  "description": "Nasi goreng dengan telur dan ayam",
  "stock": 50,
  "buy_price": 10000,
  "sell_price": 15000,
  "batch_code": "BATCH-001",
  "is_promo": false
}

// Response
{
  "message": "Product has been created successfully.",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "Nasi Goreng Spesial",
    "description": "Nasi goreng dengan telur dan ayam",
    "image": "product_image.jpg",
    "stock": 50,
    "buy_price": 10000,
    "sell_price": 15000,
    "batch_code": "BATCH-001",
    "is_active": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### Contoh Get Products

**GET** `/products`

```json
// Response
{
  "message": "Successfully fetched products!",
  "data": {
    "docs": [
      {
        "_id": "65f1234567890abcdef12345",
        "name": "Nasi Goreng Spesial",
        "sell_price": 15000,
        "stock": 50
      }
    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1
  }
}
```

---

### 2. Orders (CRUD + Status Management)

Orders adalah transaksi penjualan yang saling terkait dengan Products.

#### Hubungan antara Orders dan Products:
- Order **mengacu pada Product** melalui field `productId` dan `batch_code`
- Order **menghitung total** berdasarkan `qty × product.sell_price`
- Order **validasi stock** sebelum create (stock tidak boleh kurang dari qty)

#### Endpoints:
- `GET /orders` - List semua order
- `GET /orders/:orderId` - Detail order
- `POST /orders` - Create order baru
- `PATCH /orders/:orderId` - Update order
- `DELETE /orders/:orderId` - Soft delete order
- `POST /orders/approve` - Approve order
- `POST /orders/cancel` - Cancel order

#### Contoh Create Order

**POST** `/orders`

```json
// Request (multipart/form-data)
{
  "customer": "65f1234567890abcdef99999",
  "user": "65f1234567890abcdef11111",
  "payment_method": "65f1234567890abcdef88888",
  "batch_code": "BATCH-001",
  "qty": 2,
  "pay": 50000,
  "note": "Extra pedas"
}

// Response
{
  "message": "Create order successfully",
  "data": {
    "_id": "65f1234567890abcdef77777",
    "customer": "65f1234567890abcdef99999",
    "product": "65f1234567890abcdef12345",
    "qty": 2,
    "total": 30000,
    "pay": 50000,
    "change": 20000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Contoh Get Orders

**GET** `/orders`

```json
// Response
{
  "message": "Get orders successfully",
  "data": {
    "docs": [
      {
        "_id": "65f1234567890abcdef77777",
        "customer": "65f1234567890abcdef99999",
        "product": {
          "name": "Nasi Goreng Spesial",
          "sell_price": 15000
        },
        "total": 30000,
        "qty": 2,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalDocs": 1
  }
}
```

---

## Menjalankan Aplikasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Buat file `.env` di root project dengan konfigurasi:

```env
MONGODB_URI=mongodb://localhost:27017/api-rap
APP_PORT=3000
```

### 3. Generate Keys (Opsional)

Generate RSA key pair untuk JWT:

```bash
# Generate private key
openssl genrsa -out src/config/auth/private.key 2048

# Generate public key
openssl rsa -in src/config/auth/private.key -pubout -out src/config/auth/public.key
```

### 4. Seed Data (Opsional)

Generate users, customers, dan payment methods:

```bash
# Generate users (admin & kasir)
node src/utilities/generate-users.js

# Generate customers
npm run gen:customers

# Generate payment methods
npm run gen:payment-methods
```

Credentials default:
- **Username**: `admin` | Password: `rahasia`
- **Username**: `kasir` | Password: `rahasia`

### 5. Start Application

```bash
# Development mode (hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## Testing (E2E)

Proyek ini menggunakan **Jest** untuk end-to-end testing dengan fokus pada **proteksi endpoint dengan JWT token**.

### Menjalankan E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

File test: `test/app.e2e-spec.ts`

#### Test yang dijalankan:
- ✅ Test **403 Forbidden** ketika request tanpa token
- ✅ Test **login dan mendapatkan token**
- ✅ Test **akses endpoint protected** dengan valid token

```typescript
describe('Auth Token (e2e)', () => {
  it('should return 403 without token', async () => {
    await request(server).get('/products').expect(403);
  });

  it('should login and get token', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({ username: 'admin', password: 'rahasia' })
      .expect(201);
    
    expect(res.body.data.access_token).toBeDefined();
  });

  it('should access protected route with valid token', async () => {
    await request(server)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

---

## API Documentation (Postman)

Dokumentasi API tersedia dalam format **Postman Collection**.

### Setup Postman

1. Import collection file `.json` ke Postman
2. Setup environment variable:
   - `{{baseUrl}}` = `http://localhost:3000`
3. Login untuk mendapatkan token
4. Token akan otomatis tersimpan di collection variable

### Collection Include:
- ✅ **Authentication** - Login endpoint
- ✅ **Products CRUD** - Create, Read, Update, Delete
- ✅ **Orders CRUD** - Full CRUD operations
- ✅ **Protected Endpoints** - Semua endpoint dengan auth guard

---

## Pemilihan MongoDB (NoSQL)

### Mengapa MongoDB dipilih untuk proyek ini?

1. **Legacy Code** - Proyek ini adalah proyek lama yang sudah berbasis MongoDB. Migrasi ke SQL akan memakan waktu yang tidak efisien.

2. **Efisiensi** - Dengan mempertahankan MongoDB, kami dapat fokus pada implementasi fitur dan testing alih-alih refactoring database.

3. **Fleksibilitas Schema** - MongoDB cocok untuk data dokumen yang fleksibel seperti products dan orders dengan berbagai atribut opsional.

4. **Performance** - Untuk aplikasi POS dengan transaksi banyak, MongoDB memberikan performa read/write yang optimal.

5. **Pengalaman Team** - Tim sudah familiar dengan MongoDB dan Mongoose, sehingga development lebih cepat.

### Schema Design:

Products dan Orders menggunakan referensi ObjectId untuk relationship:

```typescript
// Products Schema
{
  name: string,
  sell_price: number,
  stock: number,
  batch_code: string (unique)
}

// Orders Schema
{
  customer: ObjectId (ref: Customer),
  product: ObjectId (ref: Product),
  user: ObjectId (ref: User),
  qty: number,
  total: number
}
```

---

## Penutup

Proyek ini menunjukkan implementasi lengkap REST API dengan NestJS, termasuk JWT authentication, CRUD operations yang saling terkait, dan e2e testing.

### Silakan jalankan:
1. ✅ Clone dan install dependencies
2. ✅ Setup database dan environment
3. ✅ Seed data users
4. ✅ Jalankan aplikasi: `npm run start:dev`
5. ✅ Jalankan e2e test: `npm run test:e2e`
6. ✅ Test API melalui Postman

**Demo video** akan menampilkan semua poin di atas secara detail!

---

## Lisensi

Nest is [MIT licensed](LICENSE).
