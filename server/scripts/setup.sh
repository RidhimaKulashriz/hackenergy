#!/bin/bash

# Install production dependencies
npm install express mongoose bcryptjs jsonwebtoken cors helmet express-rate-limit express-mongo-sanitize xss-clean hpp cookie-parser

# Install development dependencies
npm install --save-dev typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/cookie-parser @types/morgan @types/jest ts-jest jest supertest @types/supertest nodemon

# Install Swagger dependencies
npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express

echo "✅ Dependencies installed successfully!"

# Create necessary directories
mkdir -p src/{config,controllers,middleware,models,routes,utils,tests}

echo "✅ Directory structure created!"

echo "🚀 Setup complete! You can now start the development server with 'npm run dev'"
