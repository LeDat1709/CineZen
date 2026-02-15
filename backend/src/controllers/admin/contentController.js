const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const slugify = require('slugify');
const prisma = new PrismaClient();

const fetchContentFromOMDB = async (req, res) => {
  try {
    const { imdbId, title, type = 'movie' } = req.query;
    
    if (!imdbId && !title) {
      return res.status(400).json({ error: 'IMDb ID or title required' });
    }

    const params = {
      apikey: process.env.OMDB_API_KEY,
      type: type.toLowerCase(),
      ...(imdbId ? { i: imdbId } : { t: title })
    };

    const response = await axios.get('http://www.omdbapi.com/', { params });
    
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error });
    }

    const contentData = {
      title: response.data.Title,
      slug: slugify(response.data.Title, { lower: true, strict: true }),
      type: response.data.Type === 'series' ? 'SERIES' : 'MOVIE',
      description: response.data.Plot,
      posterUrl: response.data.Poster !== 'N/A' ? response.data.Poster : null,
      releaseYear: parseInt(response.data.Year),
      rating: response.data.imdbRating !== 'N/A' ? parseFloat(response.data.imdbRating) : null,
      totalEpisodes: response.data.totalSeasons ? parseInt(response.data.totalSeasons) : null
    };

    res.json(contentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchYouTubeVideos = async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: `${query} review`,
        part: 'snippet',
        type: 'video',
        maxResults,
        order: 'relevance'
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt
    }));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContent = async (req, res) => {
  try {
    const { 
      title, 
      type = 'MOVIE',
      description, 
      posterUrl, 
      releaseYear, 
      genreIds = [], // Array of genre IDs
      rating,
      totalEpisodes,
      status
    } = req.body;
    
    const slug = slugify(title, { lower: true, strict: true });

    const content = await prisma.content.create({
      data: {
        title,
        slug,
        type: type.toUpperCase(),
        description,
        posterUrl,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        rating: rating ? parseFloat(rating) : null,
        totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
        status: status || 'completed',
        genres: {
          create: genreIds.map(genreId => ({
            genre: {
              connect: { id: parseInt(genreId) }
            }
          }))
        }
      },
      include: { 
        genres: {
          include: {
            genre: true
          }
        }
      }
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await prisma.content.findUnique({
      where: { id: parseInt(id) },
      include: { 
        genres: {
          include: {
            genre: true
          }
        },
        reviews: true
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      type,
      description, 
      posterUrl, 
      releaseYear, 
      genreIds, // Array of genre IDs
      rating,
      totalEpisodes,
      status
    } = req.body;
    
    const updateData = {
      ...(title && { title, slug: slugify(title, { lower: true, strict: true }) }),
      ...(type && { type: type.toUpperCase() }),
      ...(description !== undefined && { description }),
      ...(posterUrl !== undefined && { posterUrl }),
      ...(releaseYear && { releaseYear: parseInt(releaseYear) }),
      ...(rating !== undefined && { rating: rating ? parseFloat(rating) : null }),
      ...(totalEpisodes !== undefined && { totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null }),
      ...(status && { status })
    };

    // Update genres if provided
    if (genreIds !== undefined) {
      // Delete existing genre relationships
      await prisma.contentGenre.deleteMany({
        where: { contentId: parseInt(id) }
      });
      
      // Create new genre relationships
      if (genreIds.length > 0) {
        updateData.genres = {
          create: genreIds.map(genreId => ({
            genre: {
              connect: { id: parseInt(genreId) }
            }
          }))
        };
      }
    }

    const content = await prisma.content.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { 
        genres: {
          include: {
            genre: true
          }
        }
      }
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.content.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addReviewToContent = async (req, res) => {
  try {
    const { contentId, youtubeVideoId, reviewerName, reviewSummary } = req.body;

    const review = await prisma.review.create({
      data: {
        contentId: parseInt(contentId),
        youtubeVideoId,
        reviewerName,
        reviewSummary
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchContentFromOMDB,
  searchYouTubeVideos,
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  addReviewToContent
};
