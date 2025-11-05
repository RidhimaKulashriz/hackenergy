"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', [
    (0, express_validator_1.body)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], auth_controller_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Password is required').exists(),
], auth_controller_1.login);
// Protected routes
router.get('/me', authMiddleware_1.protect, auth_controller_1.getMe);
router.get('/logout', authMiddleware_1.protect, auth_controller_1.logout);
// Admin routes
router.get('/admin/stats', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('admin'), auth_controller_1.getAdminStats);
exports.default = router;
