import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserProjects,
  getUserPosts
} from '../controllers/user.controller';

const router = Router();

// All routes are protected
router.use(protect);

router
  .route('/profile')
  .get(getUserProfile)
  .put(
    [
      body('name', 'Name is required').not().isEmpty(),
      body('email', 'Please include a valid email').isEmail(),
    ],
    updateUserProfile
  )
  .delete(deleteUser);

router.get('/projects', getUserProjects);
router.get('/posts', getUserPosts);

export default router;
