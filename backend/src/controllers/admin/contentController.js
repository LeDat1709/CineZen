const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const slugify = require('slugify');
const { generateReviewContent } = require('../../services/groqService');
const prisma = new PrismaClient();

// Country mapping helper
const parseCountry = (omdbCountry) => {
  if (!omdbCountry) return null;
  
  const countryMap = {
    'USA': 'my',
    'United States': 'my',
    'US': 'my',
    'South Korea': 'han-quoc',
    'Korea': 'han-quoc',
    'China': 'trung-quoc',
    'Japan': 'nhat-ban',
    'Thailand': 'thai-lan',
    'Vietnam': 'viet-nam',
    'UK': 'anh',
    'United Kingdom': 'anh',
    'France': 'phap',
    'India': 'an-do',
    'Taiwan': 'dai-loan',
    'Hong Kong': 'hong-kong',
    'Philippines': 'philippines'
  };
  
  // Parse first country from "USA, UK"
  const firstCountry = omdbCountry.split(',')[0].trim();
  return countryMap[firstCountry] || null;
};

// Genre mapping helper - Map OMDB genres to our database genres
const mapGenresToIds = async (omdbGenres, contentType) => {
  if (!omdbGenres || omdbGenres === 'N/A') return [];
  
  try {
    // OMDB returns genres as comma-separated string: "Action, Sci-Fi, Thriller"
    const genreNames = omdbGenres.split(',').map(g => g.trim());
    
    // Fetch all genres for this content type from database
    const dbGenres = await prisma.genre.findMany({
      where: { type: contentType }
    });
    
    // Map OMDB genre names to database genre IDs
    const genreIds = [];
    
    for (const omdbGenre of genreNames) {
      // Try exact match first
      let matchedGenre = dbGenres.find(g => 
        g.name.toLowerCase() === omdbGenre.toLowerCase()
      );
      
      // If no exact match, try partial match
      if (!matchedGenre) {
        matchedGenre = dbGenres.find(g => 
          g.name.toLowerCase().includes(omdbGenre.toLowerCase()) ||
          omdbGenre.toLowerCase().includes(g.name.toLowerCase())
        );
      }
      
      if (matchedGenre) {
        genreIds.push(matchedGenre.id);
      }
    }
    
    return genreIds;
  } catch (error) {
    console.error('Error mapping genres:', error);
    return [];
  }
};

// Auto-translate to Vietnamese using Google Translate API (free)
const translateToVietnamese = async (text) => {
  try {
    // Using Google Translate's free API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url);
    
    // Parse response - Google returns nested arrays
    if (response.data && response.data[0]) {
      const translated = response.data[0].map(item => item[0]).join('');
      return translated;
    }
    
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original if translation fails
  }
};

// Fetch HD backdrop image from TMDb
const fetchTMDbBackdrop = async (title, year) => {
  try {
    // Search for movie/series on TMDb
    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const searchResponse = await axios.get(searchUrl);
    
    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const result = searchResponse.data.results[0];
      
      // Get backdrop image (1920x1080 HD)
      if (result.backdrop_path) {
        return `https://image.tmdb.org/t/p/original${result.backdrop_path}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('TMDb fetch error:', error);
    return null;
  }
};

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

    const contentType = response.data.Type === 'series' ? 'SERIES' : 'MOVIE';
    
    // Auto-translate description to Vietnamese
    let descriptionVi = response.data.Plot;
    if (response.data.Plot && response.data.Plot !== 'N/A') {
      try {
        descriptionVi = await translateToVietnamese(response.data.Plot);
      } catch (error) {
        console.error('Translation error:', error);
        // Keep English if translation fails
      }
    }
    
    // Fetch HD backdrop from TMDb
    let backdropUrl = null;
    if (process.env.TMDB_API_KEY) {
      try {
        backdropUrl = await fetchTMDbBackdrop(response.data.Title, response.data.Year);
      } catch (error) {
        console.error('TMDb error:', error);
      }
    }

    const contentData = {
      title: response.data.Title,
      slug: slugify(response.data.Title, { lower: true, strict: true }),
      type: contentType,
      description: descriptionVi, // Vietnamese description
      descriptionEn: response.data.Plot, // Keep original English
      posterUrl: response.data.Poster !== 'N/A' ? response.data.Poster : null,
      backdropUrl: backdropUrl, // HD backdrop for banner
      releaseYear: parseInt(response.data.Year),
      rating: response.data.imdbRating !== 'N/A' ? parseFloat(response.data.imdbRating) : null,
      totalEpisodes: response.data.totalSeasons ? parseInt(response.data.totalSeasons) : null,
      country: parseCountry(response.data.Country), // AUTO-PARSE COUNTRY
      omdbGenres: response.data.Genre // Return raw OMDB genres for frontend to map
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

    // Multiple search queries for better Vietnamese coverage
    const searchQueries = [
      `${query} review vietnamese`,
      `${query} đánh giá`,
      `${query} review hay`,
      `review phim ${query}`,
      `${query} review`
    ];
    
    const allVideos = [];
    const seenVideoIds = new Set();
    
    // Search with multiple queries
    for (const searchQuery of searchQueries) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            q: searchQuery,
            part: 'snippet',
            type: 'video',
            maxResults: 5, // 5 per query
            order: 'relevance',
            relevanceLanguage: 'vi', // Prioritize Vietnamese
            videoDuration: 'medium' // Filter out very short videos
          }
        });
        
        // Add unique videos only
        response.data.items.forEach(item => {
          if (!seenVideoIds.has(item.id.videoId)) {
            seenVideoIds.add(item.id.videoId);
            allVideos.push(item);
          }
        });
      } catch (error) {
        console.error(`Error searching with query "${searchQuery}":`, error.message);
        // Continue with other queries even if one fails
      }
    }

    // Format and return top results
    const videos = allVideos.slice(0, parseInt(maxResults)).map(item => ({
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
      reviewContent, // ADD THIS
      posterUrl,
      backdropUrl, // ADD THIS
      releaseYear, 
      genreIds = [], // Array of genre IDs
      rating,
      totalEpisodes,
      status,
      country // ADD THIS
    } = req.body;
    
    const slug = slugify(title, { lower: true, strict: true });

    const content = await prisma.content.create({
      data: {
        title,
        slug,
        type: type.toUpperCase(),
        description,
        reviewContent, // ADD THIS
        posterUrl,
        backdropUrl, // ADD THIS
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        rating: rating ? parseFloat(rating) : null,
        totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
        status: status || 'completed',
        country, // ADD THIS
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
        },
        reviews: true // ADD THIS
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
      reviewContent, // ADD THIS
      posterUrl, 
      backdropUrl, // ADD THIS
      releaseYear, 
      genreIds, // Array of genre IDs
      rating,
      totalEpisodes,
      status,
      country // ADD THIS
    } = req.body;
    
    const updateData = {
      ...(title && { title, slug: slugify(title, { lower: true, strict: true }) }),
      ...(type && { type: type.toUpperCase() }),
      ...(description !== undefined && { description }),
      ...(reviewContent !== undefined && { reviewContent }), // ADD THIS
      ...(posterUrl !== undefined && { posterUrl }),
      ...(backdropUrl !== undefined && { backdropUrl }), // ADD THIS
      ...(releaseYear && { releaseYear: parseInt(releaseYear) }),
      ...(rating !== undefined && { rating: rating ? parseFloat(rating) : null }),
      ...(totalEpisodes !== undefined && { totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null }),
      ...(status && { status }),
      ...(country !== undefined && { country }) // ADD THIS
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
        },
        reviews: true // ADD THIS to return reviews
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

// Generate AI review content using Groq
const generateAIReview = async (req, res) => {
  try {
    const { title, type, description, releaseYear, genres, rating, country } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    console.log('🤖 Generating AI review for:', title);
    
    const result = await generateReviewContent({
      title,
      type: type || 'MOVIE',
      description,
      releaseYear,
      genres,
      rating,
      country
    });
    
    if (result.success) {
      console.log('✅ AI review generated successfully');
      res.json({
        success: true,
        content: result.content,
        wordCount: result.wordCount
      });
    } else {
      console.error('❌ AI review generation failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error in generateAIReview:', error);
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
  addReviewToContent,
  generateAIReview
};
