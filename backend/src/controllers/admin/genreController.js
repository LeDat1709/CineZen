const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
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

const createGenre = async (req, res) => {
  try {
    const { name, forType } = req.body;
    
    const slug = slugify(name, { lower: true, strict: true });

    const genre = await prisma.genre.create({
      data: {
        name,
        slug,
        forType: forType || 'MOVIE'
      }
    });

    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, forType } = req.body;
    
    const updateData = {
      ...(name && { name, slug: slugify(name, { lower: true, strict: true }) }),
      ...(forType && { forType })
    };

    const genre = await prisma.genre.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.genre.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre
};
