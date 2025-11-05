"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LIMIT = exports.DEFAULT_PAGE = exports.UPLOAD_PATH = exports.MAX_FILE_UPLOAD = exports.EMAIL_FROM = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.EMAIL_PORT = exports.EMAIL_HOST = exports.RATE_LIMIT_MAX = exports.RATE_LIMIT_WINDOW_MS = exports.FRONTEND_URL = exports.JWT_COOKIE_EXPIRES_IN = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGODB_URI = exports.IS_PRODUCTION = exports.NODE_ENV = exports.PORT = void 0;
// Server configuration
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.IS_PRODUCTION = exports.NODE_ENV === 'production';
// Database
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'collabforge';
exports.MONGODB_URI = process.env.MONGODB_URI ||
    `mongodb://${MONGO_USER && `${MONGO_USER}:${MONGO_PASSWORD}@`}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;
// JWT
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
exports.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN
    ? parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10)
    : 7;
// Frontend
if (!process.env.FRONTEND_URL) {
    console.warn('FRONTEND_URL is not defined in environment variables. Defaulting to http://localhost:5173');
}
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Rate limiting
exports.RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
exports.RATE_LIMIT_MAX = 100; // Limit each IP to 100 requests per windowMs
// Email (for future use)
exports.EMAIL_HOST = process.env.EMAIL_HOST || '';
exports.EMAIL_PORT = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
exports.EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@collabforge.com';
// File uploads
exports.MAX_FILE_UPLOAD = 5 * 1024 * 1024; // 5MB
exports.UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';
// Pagination
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 10;
exports.default = {
    PORT: exports.PORT,
    NODE_ENV: exports.NODE_ENV,
    IS_PRODUCTION: exports.IS_PRODUCTION,
    MONGODB_URI: exports.MONGODB_URI,
    JWT_SECRET: exports.JWT_SECRET,
    JWT_EXPIRES_IN: exports.JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN: exports.JWT_COOKIE_EXPIRES_IN,
    FRONTEND_URL: exports.FRONTEND_URL,
    RATE_LIMIT_WINDOW_MS: exports.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX: exports.RATE_LIMIT_MAX,
    EMAIL_HOST: exports.EMAIL_HOST,
    EMAIL_PORT: exports.EMAIL_PORT,
    EMAIL_USERNAME: exports.EMAIL_USERNAME,
    EMAIL_PASSWORD: exports.EMAIL_PASSWORD,
    EMAIL_FROM: exports.EMAIL_FROM,
    MAX_FILE_UPLOAD: exports.MAX_FILE_UPLOAD,
    UPLOAD_PATH: exports.UPLOAD_PATH,
    DEFAULT_PAGE: exports.DEFAULT_PAGE,
    DEFAULT_LIMIT: exports.DEFAULT_LIMIT,
};
