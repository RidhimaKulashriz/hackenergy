import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { NODE_ENV, FRONTEND_URL } from '../config/constants';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CollabForge API',
      version: '1.0.0',
      description: 'API documentation for CollabForge application',
      contact: {
        name: 'CollabForge Team',
        url: 'https://collabforge.com/support',
      },
    },
    servers: [
      {
        url: NODE_ENV === 'production' 
          ? 'https://api.collabforge.com' 
          : 'http://localhost:5000',
        description: `${NODE_ENV} server`,
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
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app: Express): void => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 Swagger docs available at ${FRONTEND_URL}/api-docs`);
};

export default swaggerDocs;
