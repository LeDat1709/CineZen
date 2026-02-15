const express = require('express');
const authMiddleware = require('../../middleware/auth');
const {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre
} = require('../../controllers/admin/genreController');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/admin/genres:
 *   get:
 *     summary: Lấy danh sách thể loại
 *     tags: [Admin - Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MOVIE, SERIES]
 *     responses:
 *       200:
 *         description: Danh sách thể loại
 */
router.get('/', getAllGenres);

/**
 * @swagger
 * /api/admin/genres:
 *   post:
 *     summary: Thêm thể loại mới
 *     tags: [Admin - Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               forType:
 *                 type: string
 *                 enum: [MOVIE, SERIES]
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', createGenre);

/**
 * @swagger
 * /api/admin/genres/{id}:
 *   put:
 *     summary: Cập nhật thể loại
 *     tags: [Admin - Genres]
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
router.put('/:id', updateGenre);

/**
 * @swagger
 * /api/admin/genres/{id}:
 *   delete:
 *     summary: Xóa thể loại
 *     tags: [Admin - Genres]
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
router.delete('/:id', deleteGenre);

module.exports = router;
