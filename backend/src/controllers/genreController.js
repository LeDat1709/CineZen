const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllGenres = async (req, res) => {
  try {
    const { type } = req.query;
    
    const where = {};
    if (type) where.forType = type.toUpperCase();

    const genres = await prisma.genre.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGenres
};
