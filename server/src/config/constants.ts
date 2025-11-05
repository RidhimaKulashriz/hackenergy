// Server configuration
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Database
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'collabforge';

export const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb://${MONGO_USER && `${MONGO_USER}:${MONGO_PASSWORD}@`}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;

// JWT
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN 
  ? parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) 
  : 7;

// Frontend
if (!process.env.FRONTEND_URL) {
  console.warn('FRONTEND_URL is not defined in environment variables. Defaulting to http://localhost:5173');
}

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX = 100; // Limit each IP to 100 requests per windowMs

// Email (for future use)
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@collabforge.com';

// File uploads
export const MAX_FILE_UPLOAD = 5 * 1024 * 1024; // 5MB
export const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export default {
  PORT,
  NODE_ENV,
  IS_PRODUCTION,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  FRONTEND_URL,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  MAX_FILE_UPLOAD,
  UPLOAD_PATH,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
};
