require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const contentRoutes = require('./routes/contentRoutes');
const adminContentRoutes = require('./routes/admin/contentRoutes');
const adminGenreRoutes = require('./routes/admin/genreRoutes');
const genreRoutes = require('./routes/genreRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const supabaseUploadRoutes = require('./routes/supabaseUploadRoutes');
const { specs, swaggerUi } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CineZen API Docs'
}));

// Routes
app.use('/api/contents', contentRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api/admin/genres', adminGenreRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/supabase-upload', supabaseUploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'CineZen API',
    docs: '/api-docs'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});
