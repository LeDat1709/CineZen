-- CineZen Database Schema
-- PostgreSQL
-- Hỗ trợ cả Phim (MOVIE) và Truyện (SERIES)
-- Đồng bộ với Prisma Schema

-- ============================================
-- Bước 1: Tạo database (chạy riêng nếu chưa có)
-- ============================================
-- CREATE DATABASE cinezen;
-- \c cinezen;

-- ============================================
-- Bước 2: Tạo các bảng
-- ============================================

-- Bảng Genres (Thể loại)
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    for_type VARCHAR(20)
);

-- Bảng Tags (Nhãn)
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Bảng Contents (Phim và Truyện)
CREATE TABLE contents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) DEFAULT 'MOVIE',
    description TEXT,
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    release_year INTEGER,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    total_episodes INTEGER,
    status VARCHAR(50) DEFAULT 'completed',
    country VARCHAR(100),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_contents_views ON contents(views);
CREATE INDEX idx_contents_created_at ON contents(created_at);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_country ON contents(country);

-- Bảng Reviews (Video review từ YouTube)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    youtube_video_id VARCHAR(20) NOT NULL,
    reviewer_name VARCHAR(255),
    review_summary TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Content_Genres (Quan hệ nhiều-nhiều cho thể loại)
CREATE TABLE content_genres (
    content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, genre_id)
);

-- Bảng Content_Tags (Quan hệ nhiều-nhiều)
CREATE TABLE content_tags (
    content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- Bảng Users (Tài khoản admin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Bước 3: Tạo indexes bổ sung
-- ============================================
CREATE INDEX idx_reviews_content ON reviews(content_id);
CREATE INDEX idx_genres_slug ON genres(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_content_genres_content ON content_genres(content_id);
CREATE INDEX idx_content_genres_genre ON content_genres(genre_id);

-- ============================================
-- Bước 4: Tạo trigger tự động update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contents_updated_at 
    BEFORE UPDATE ON contents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Bước 5: Insert dữ liệu mẫu - Genres
-- ============================================

-- Thể loại Phim
INSERT INTO genres (name, slug, for_type) VALUES
    ('Hành động', 'hanh-dong', 'MOVIE'),
    ('Phiêu lưu', 'phieu-luu', 'MOVIE'),
    ('Hoạt hình', 'hoat-hinh', 'MOVIE'),
    ('Hài', 'hai', 'MOVIE'),
    ('Tội phạm', 'toi-pham', 'MOVIE'),
    ('Tài liệu', 'tai-lieu', 'MOVIE'),
    ('Chính kịch', 'chinh-kich', 'MOVIE'),
    ('Gia đình', 'gia-dinh', 'MOVIE'),
    ('Giả tưởng', 'gia-tuong', 'MOVIE'),
    ('Kinh dị', 'kinh-di', 'MOVIE'),
    ('Bí ẩn', 'bi-an', 'MOVIE'),
    ('Lãng mạn', 'lang-man', 'MOVIE'),
    ('Khoa học viễn tưởng', 'khoa-hoc-vien-tuong', 'MOVIE'),
    ('Gây cấn', 'gay-can', 'MOVIE'),
    ('Chiến tranh', 'chien-tranh', 'MOVIE')
ON CONFLICT (slug) DO NOTHING;

-- Thể loại Truyện
INSERT INTO genres (name, slug, for_type) VALUES
    ('Tiên hiệp', 'tien-hiep', 'SERIES'),
    ('Huyền huyễn', 'huyen-huyen', 'SERIES'),
    ('Đô thị', 'do-thi', 'SERIES'),
    ('Lịch sử', 'lich-su', 'SERIES'),
    ('Võng du', 'vong-du', 'SERIES'),
    ('Khoa huyễn', 'khoa-huyen', 'SERIES'),
    ('Đam mỹ', 'dam-my', 'SERIES'),
    ('Ngôn tình', 'ngon-tinh', 'SERIES'),
    ('Huyền ảo', 'huyen-ao', 'SERIES'),
    ('Kiếm hiệp', 'kiem-hiep', 'SERIES')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Bước 6: Insert dữ liệu mẫu - Tags
-- ============================================
INSERT INTO tags (name, slug) VALUES
    ('Cảm động', 'cam-dong'),
    ('Hấp dẫn', 'hap-dan'),
    ('Kinh điển', 'kinh-dien'),
    ('Bom tấn', 'bom-tan'),
    ('Indie', 'indie'),
    ('Hot', 'hot'),
    ('Đề cử', 'de-cu')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Bước 7: Tạo tài khoản admin mặc định (Optional)
-- ============================================
-- Password: admin123 (đã hash bằng bcrypt)
-- Bạn nên chạy script Node.js để tạo admin với password hash đúng
-- Hoặc sử dụng: node backend/scripts/create-admin.js

-- INSERT INTO users (email, password, name, role) VALUES
--     ('admin@example.com', '$2a$10$rKvVPZqGhf5vVZJZqZqZqeK5vVZJZqZqZqZqZqZqZqZqZqZqZqZqZ', 'Admin', 'admin')
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Bước 8: Kiểm tra kết quả
-- ============================================
SELECT 'Database schema created successfully!' as status;

SELECT 
    'Tables: contents, reviews, genres, tags, content_tags, users' as info;

SELECT 
    (SELECT COUNT(*) FROM genres WHERE for_type = 'MOVIE') as movie_genres,
    (SELECT COUNT(*) FROM genres WHERE for_type = 'SERIES') as series_genres,
    (SELECT COUNT(*) FROM tags) as total_tags;

-- ============================================
-- Các lệnh hữu ích
-- ============================================

-- Xem tất cả bảng
-- \dt

-- Xem cấu trúc bảng
-- \d contents

-- Xem dữ liệu
-- SELECT * FROM genres;
-- SELECT * FROM contents;

-- Đếm số lượng
-- SELECT 
--     (SELECT COUNT(*) FROM contents WHERE type = 'MOVIE') as total_movies,
--     (SELECT COUNT(*) FROM contents WHERE type = 'SERIES') as total_series,
--     (SELECT COUNT(*) FROM reviews) as total_reviews,
--     (SELECT COUNT(*) FROM users) as total_users;

-- Reset database (XÓA TẤT CẢ)
-- DROP TABLE IF EXISTS content_tags CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS contents CASCADE;
-- DROP TABLE IF EXISTS tags CASCADE;
-- DROP TABLE IF EXISTS genres CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
