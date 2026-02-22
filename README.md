# CineZen - Movie & Series Review Platform

A comprehensive platform that aggregates movie and series video reviews from YouTube with automated features.

## Features

- ✅ Separate Movies and Series sections
- ✅ Auto-fetch content information from OMDB API
- ✅ Auto-search review videos from YouTube
- ✅ User-friendly admin panel
- ✅ SEO-friendly with Next.js
- ✅ Responsive layout with ad sidebar
- ✅ Genre management system
- ✅ Trending content algorithm
- ✅ View tracking

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **APIs**: YouTube Data API v3, OMDB API

## Requirements

- Node.js 18+
- PostgreSQL 14+
- YouTube API Key
- OMDB API Key

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd CineZen
```

### 2. Setup Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE cinezen;"

# Run schema
psql -U postgres -d cinezen -f schema.sql
```

### 3. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cinezen"
JWT_SECRET="your_random_secret_string"
YOUTUBE_API_KEY="your_youtube_api_key"
OMDB_API_KEY="your_omdb_api_key"
PORT=5000
```

```bash
# Generate Prisma Client
npx prisma generate

# Create admin account
node scripts/create-admin.js

# Seed genres
node scripts/seed-genres.js

# Start server
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start
npm run dev
```

### 5. Setup Admin Panel

```bash
cd admin
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start
npm run dev
```

## Running the Project

Open 3 terminals:

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

## Access URLs

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3001
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## Usage

1. Go to http://localhost:3001
2. Login with admin credentials
3. Click "Add New"
4. Select "Movie" or "Series"
5. Enter title (e.g., "Inception")
6. System auto-fetches information
7. Select review video from YouTube
8. Save
9. View result at http://localhost:3000

## Getting API Keys

### YouTube Data API v3
1. Visit: https://console.cloud.google.com/
2. Create new project
3. Enable "YouTube Data API v3"
4. Create API Key

### OMDB API
1. Visit: http://www.omdbapi.com/apikey.aspx
2. Select FREE tier (1000 requests/day)
3. Enter email and confirm
4. Copy API key from email

## Project Structure

```
CineZen/
├── backend/          # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── scripts/
├── frontend/         # Next.js (port 3000)
│   ├── app/
│   └── components/
├── admin/            # Admin panel (port 3001)
│   ├── app/
│   └── components/
└── schema.sql        # Database schema
```

## API Endpoints

### Public
- `GET /api/contents` - All content
- `GET /api/contents/movies` - Movies only
- `GET /api/contents/series` - Series only
- `GET /api/contents/trending` - Trending content
- `GET /api/contents/:slug` - Content details
- `GET /api/genres` - All genres

### Admin (Requires token)
- `POST /api/auth/login` - Login
- `GET /api/admin/fetch-content` - Fetch from OMDB
- `GET /api/admin/search-youtube` - Search YouTube videos
- `POST /api/admin/contents` - Add content
- `PUT /api/admin/contents/:id` - Update content
- `DELETE /api/admin/contents/:id` - Delete content
- `POST /api/admin/reviews` - Add review
- `GET /api/admin/genres` - Manage genres
- `POST /api/admin/genres` - Create genre

## Troubleshooting

### Database connection error
- Check if PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Verify password is correct

### "npm is not recognized" error
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Port already in use
- Backend: Change PORT in backend/.env
- Frontend: `npm run dev -- -p 3002`
- Admin: `npm run dev -- -p 3003`

### Prisma errors
- Run `npx prisma generate` in backend folder
- Run `npx prisma db push` to sync schema

## License

MIT
