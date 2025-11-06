import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProjects,
  getUserPosts,
  getStats
} from '../controllers/admin.controller';

const router = Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/stats').get(getStats);
router.route('/users').get(getUsers);

router
  .route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.get('/users/:id/projects', getUserProjects);
router.get('/users/:id/posts', getUserPosts);

export default router;
