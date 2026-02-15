const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineZen API',
      version: '1.0.0',
      description: 'API cho hệ thống review phim và truyện',
      contact: {
        name: 'CineZen Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/routes/admin/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
