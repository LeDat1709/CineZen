-- Migration: Add content_genres table for many-to-many relationship

-- Create content_genres junction table
CREATE TABLE IF NOT EXISTS content_genres (
  content_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (content_id, genre_id),
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- Migrate existing data from contents.genre_id to content_genres
INSERT INTO content_genres (content_id, genre_id)
SELECT id, genre_id 
FROM contents 
WHERE genre_id IS NOT NULL;

-- Drop the old genre_id column
ALTER TABLE contents DROP COLUMN IF EXISTS genre_id;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_genres_content ON content_genres(content_id);
CREATE INDEX IF NOT EXISTS idx_content_genres_genre ON content_genres(genre_id);
