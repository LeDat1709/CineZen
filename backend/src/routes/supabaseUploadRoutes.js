const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Cấu hình multer để lưu file tạm trong memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp)'));
    }
  }
});

/**
 * @swagger
 * /api/supabase-upload/poster:
 *   post:
 *     summary: Upload poster image to Supabase Storage
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               poster:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                 publicUrl:
 *                   type: string
 */
router.post('/poster', authMiddleware, upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload' });
    }

    // Tạo tên file unique
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `poster-${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;
    const filePath = `posters/${fileName}`;

    // Upload lên Supabase Storage
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Lỗi khi upload lên Supabase: ' + error.message });
    }

    // Lấy public URL
    const { data: publicUrlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    res.json({
      success: true,
      url: publicUrlData.publicUrl,
      publicUrl: publicUrlData.publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
