-- Migration: Add review_content column to contents table
-- Date: 2026-02-27

-- Add review_content column
ALTER TABLE contents ADD COLUMN IF NOT EXISTS review_content TEXT;

-- Make youtube_video_id optional in reviews table
ALTER TABLE reviews ALTER COLUMN youtube_video_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN contents.review_content IS 'Detailed review content written by admin';
COMMENT ON COLUMN reviews.youtube_video_id IS 'YouTube video ID - now optional';
