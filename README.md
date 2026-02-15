# CineZen - Hệ thống Review Phim & Truyện

Hệ thống tổng hợp video review phim và truyện từ YouTube với tính năng tự động hóa.

## Tính năng

- ✅ Phân biệt Phim (Movies) và Truyện (Series)
- ✅ Tự động lấy thông tin từ OMDB API
- ✅ Tự động tìm video review từ YouTube
- ✅ Admin panel thân thiện
- ✅ SEO-friendly với Next.js
- ✅ Layout với sidebar quảng cáo

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **APIs**: YouTube Data API v3, OMDB API

## Yêu cầu

- Node.js 18+
- PostgreSQL 14+
- YouTube API Key
- OMDB API Key

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd CineZen
```

### 2. Setup Database

```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE movie_reviews;"

# Chạy schema
psql -U postgres -d movie_reviews -f schema.sql
```

### 3. Setup Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
```

Sửa file `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/movie_reviews"
JWT_SECRET="your_random_secret_string"
YOUTUBE_API_KEY="your_youtube_api_key"
OMDB_API_KEY="your_omdb_api_key"
PORT=5000
```

```bash
# Generate Prisma Client
npx prisma generate

# Tạo tài khoản admin
node scripts/create-admin.js

# Chạy server
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend
npm install

# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Chạy
npm run dev
```

### 5. Setup Admin

```bash
cd admin
npm install

# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Chạy
npm run dev
```

## Chạy dự án

Mở 3 terminal:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
```

## Truy cập

- Frontend: http://localhost:3000
- Admin: http://localhost:3001
- Backend API: http://localhost:5000

## Sử dụng

1. Truy cập http://localhost:3001
2. Đăng nhập với tài khoản admin
3. Click "Thêm mới"
4. Chọn "Phim" hoặc "Truyện"
5. Nhập tên (ví dụ: "Inception")
6. Hệ thống tự động lấy thông tin
7. Chọn video review từ YouTube
8. Lưu
9. Xem kết quả tại http://localhost:3000

## Lấy API Keys

### YouTube Data API v3
1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới
3. Enable "YouTube Data API v3"
4. Tạo API Key

### OMDB API
1. Truy cập: http://www.omdbapi.com/apikey.aspx
2. Chọn FREE tier (1000 requests/day)
3. Nhập email và xác nhận
4. Copy API key từ email

## Cấu trúc thư mục

```
CineZen/
├── backend/          # Node.js + Express + Prisma
├── frontend/         # Next.js (port 3000)
├── admin/            # Admin panel (port 3001)
├── schema.sql        # Database schema
└── rule.md          # Lộ trình chi tiết
```

## API Endpoints

### Public
- `GET /api/contents` - Tất cả nội dung
- `GET /api/contents/movies` - Chỉ phim
- `GET /api/contents/series` - Chỉ truyện
- `GET /api/contents/:slug` - Chi tiết

### Admin (Cần token)
- `POST /api/auth/login` - Đăng nhập
- `GET /api/admin/fetch-content` - Lấy thông tin từ OMDB
- `GET /api/admin/search-youtube` - Tìm video YouTube
- `POST /api/admin/contents` - Thêm nội dung
- `DELETE /api/admin/contents/:id` - Xóa nội dung
- `POST /api/admin/reviews` - Thêm review

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra DATABASE_URL trong backend/.env
- Kiểm tra password đúng chưa

### Lỗi "npm is not recognized"
- Cài Node.js từ https://nodejs.org/
- Restart terminal sau khi cài

### Port đã được sử dụng
- Backend: Đổi PORT trong backend/.env
- Frontend: `npm run dev -- -p 3002`
- Admin: `npm run dev -- -p 3003`

## License

MIT
