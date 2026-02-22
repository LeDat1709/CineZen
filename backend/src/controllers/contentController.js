const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllContents = async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, search, type, year, minRating, sort = 'latest', country } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    // Filter by genre slug
    if (genre) {
      const genreRecord = await prisma.genre.findUnique({
        where: { slug: genre }
      });
      if (genreRecord) {
        where.genres = {
          some: {
            genreId: genreRecord.id
          }
        };
      }
    }
    
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (type) where.type = type.toUpperCase();
    if (year) where.releaseYear = parseInt(year);
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (country) where.country = country;

    // Determine sort order
    let orderBy = { createdAt: 'desc' }; // default
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'rating') {
      orderBy = [
        { rating: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' }
      ];
    } else if (sort === 'year') {
      orderBy = { releaseYear: 'desc' };
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: { 
          genres: {
            include: {
              genre: true
            }
          },
          reviews: true 
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        reviews: { orderBy: { createdAt: 'desc' } },
        tags: { include: { tag: true } }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Increment views count
    await prisma.content.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovies = async (req, res) => {
  req.query.type = 'MOVIE';
  return getAllContents(req, res);
};

const getSeries = async (req, res) => {
  req.query.type = 'SERIES';
  return getAllContents(req, res);
};

// Top rated contents (highest rating)
const getTopRated = async (req, res) => {
  try {
    const { type, limit = 12 } = req.query;
    
    const where = {};
    if (type) where.type = type.toUpperCase();

    const contents = await prisma.content.findMany({
      where,
      include: { 
        genres: {
          include: {
            genre: true
          }
        },
        reviews: true 
      },
      orderBy: { rating: 'desc' },
      take: parseInt(limit)
    });

    res.json({ contents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Latest contents (newest release year)
const getLatest = async (req, res) => {
  try {
    const { type, limit = 12 } = req.query;
    
    const where = {};
    if (type) where.type = type.toUpperCase();

    const contents = await prisma.content.findMany({
      where,
      include: { 
        genres: {
          include: {
            genre: true
          }
        },
        reviews: true 
      },
      orderBy: { createdAt: 'desc' }, // Mới thêm vào database
      take: parseInt(limit)
    });

    res.json({ contents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Trending contents (added in last 7 days + high rating)
const getTrending = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const where = {
      createdAt: {
        gte: sevenDaysAgo
      }
    };
    if (type) where.type = type.toUpperCase();

    const contents = await prisma.content.findMany({
      where,
      include: { 
        genres: {
          include: {
            genre: true
          }
        },
        reviews: true 
      },
      orderBy: [
        { rating: 'desc' },
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit)
    });

    // If not enough trending content in last 7 days, fallback to top rated
    if (contents.length < parseInt(limit)) {
      const fallbackWhere = {};
      if (type) fallbackWhere.type = type.toUpperCase();

      const fallbackContents = await prisma.content.findMany({
        where: fallbackWhere,
        include: { 
          genres: {
            include: {
              genre: true
            }
          },
          reviews: true 
        },
        orderBy: [
          { rating: 'desc' },
          { views: 'desc' }
        ],
        take: parseInt(limit)
      });

      res.json({ contents: fallbackContents });
    } else {
      res.json({ contents });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get contents by genre
const getByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { limit = 12 } = req.query;

    const contents = await prisma.content.findMany({
      where: { 
        genres: {
          some: {
            genreId: parseInt(genreId)
          }
        }
      },
      include: { 
        genres: {
          include: {
            genre: true
          }
        },
        reviews: true 
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ contents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllContents,
  getContentBySlug,
  getMovies,
  getSeries,
  getTopRated,
  getLatest,
  getTrending,
  getByGenre
};
