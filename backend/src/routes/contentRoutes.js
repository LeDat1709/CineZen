const express = require('express');
const { 
  getAllContents, 
  getContentBySlug, 
  getMovies, 
  getSeries,
  getTopRated,
  getLatest,
  getByGenre
} = require('../controllers/contentController');

const router = express.Router();

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Lấy tất cả nội dung (phim và truyện)
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MOVIE, SERIES]
 *         description: Loại nội dung
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên
 *     responses:
 *       200:
 *         description: Danh sách nội dung
 */
router.get('/', getAllContents);

/**
 * @swagger
 * /api/contents/top-rated:
 *   get:
 *     summary: Lấy nội dung có rating cao nhất
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MOVIE, SERIES]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Top nội dung
 */
router.get('/top-rated', getTopRated);

/**
 * @swagger
 * /api/contents/latest:
 *   get:
 *     summary: Lấy nội dung mới nhất (theo năm phát hành)
 *     tags: [Contents]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MOVIE, SERIES]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Nội dung mới nhất
 */
router.get('/latest', getLatest);

/**
 * @swagger
 * /api/contents/movies:
 *   get:
 *     summary: Lấy danh sách phim
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Danh sách phim
 */
router.get('/movies', getMovies);

/**
 * @swagger
 * /api/contents/series:
 *   get:
 *     summary: Lấy danh sách truyện
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: Danh sách truyện
 */
router.get('/series', getSeries);

/**
 * @swagger
 * /api/contents/genre/{genreId}:
 *   get:
 *     summary: Lấy nội dung theo thể loại
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Nội dung theo thể loại
 */
router.get('/genre/:genreId', getByGenre);

/**
 * @swagger
 * /api/contents/{slug}:
 *   get:
 *     summary: Lấy chi tiết nội dung theo slug
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của nội dung
 *     responses:
 *       200:
 *         description: Chi tiết nội dung
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:slug', getContentBySlug);

module.exports = router;
