const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  fetchContentFromOMDB,
  searchYouTubeVideos,
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  addReviewToContent
} = require('../../controllers/admin/contentController');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/admin/fetch-content:
 *   get:
 *     summary: Lấy thông tin phim/truyện từ OMDB
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Tên phim/truyện
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [movie, series]
 *         description: Loại
 *     responses:
 *       200:
 *         description: Thông tin từ OMDB
 */
router.get('/fetch-content', fetchContentFromOMDB);

/**
 * @swagger
 * /api/admin/search-youtube:
 *   get:
 *     summary: Tìm video review trên YouTube
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách video
 */
router.get('/search-youtube', searchYouTubeVideos);

/**
 * @swagger
 * /api/admin/contents:
 *   post:
 *     summary: Thêm nội dung mới
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [MOVIE, SERIES]
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/contents', createContent);

/**
 * @swagger
 * /api/admin/contents/{id}:
 *   get:
 *     summary: Lấy chi tiết nội dung
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết nội dung
 */
router.get('/contents/:id', getContentById);

/**
 * @swagger
 * /api/admin/contents/{id}:
 *   put:
 *     summary: Cập nhật nội dung
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/contents/:id', updateContent);

/**
 * @swagger
 * /api/admin/contents/{id}:
 *   delete:
 *     summary: Xóa nội dung
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/contents/:id', deleteContent);

/**
 * @swagger
 * /api/admin/reviews:
 *   post:
 *     summary: Thêm review video
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: integer
 *               youtubeVideoId:
 *                 type: string
 *               reviewerName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm thành công
 */
router.post('/reviews', addReviewToContent);

module.exports = router;
