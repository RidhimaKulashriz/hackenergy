import swaggerJsdoc from 'swagger-jsdoc';

// Define version directly to avoid importing package.json outside of rootDir
const API_VERSION = '1.0.0';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CollabForge API Documentation',
      version: API_VERSION,
      description: 'API documentation for CollabForge - A collaborative platform for developers',
      contact: {
        name: 'CollabForge Support',
        url: 'https://github.com/yourusername/collabforge',
        email: 'support@collabforge.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.collabforge.com/api',
        description: 'Production server',
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts',
    './src/controllers/*.ts',
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
