const NodeCache = require('node-cache');

// Create cache instance with 10 minutes default TTL
const cache = new NodeCache({ 
  stdTTL: 600, // 10 minutes
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Better performance
});

// Cache middleware for Express routes
const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json
    res.json = (body) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

// Clear cache by pattern
const clearCacheByPattern = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  matchingKeys.forEach(key => cache.del(key));
  return matchingKeys.length;
};

module.exports = {
  cache,
  cacheMiddleware,
  clearCacheByPattern
};
