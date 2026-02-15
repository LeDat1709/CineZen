const express = require('express');
const { getAllGenres } = require('../controllers/genreController');

const router = express.Router();

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Lấy danh sách thể loại (public)
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MOVIE, SERIES]
 *         description: Lọc theo loại
 *     responses:
 *       200:
 *         description: Danh sách thể loại
 */
router.get('/', getAllGenres);

module.exports = router;
