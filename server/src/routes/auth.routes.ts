import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout, getAdminStats } from '../controllers/auth.controller';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  login
);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

// Admin routes
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);

export default router;
