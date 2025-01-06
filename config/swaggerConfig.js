const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Task Management System',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], //  Path to the API  docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
