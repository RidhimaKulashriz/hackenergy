import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember
} from '../controllers/project.controller';

const router = Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
    ],
    createProject
  );

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router
  .route('/:id/members')
  .get(getProjectMembers)
  .post(
    [body('email', 'Please include a valid email').isEmail()],
    addProjectMember
  );

router.delete('/:id/members/:userId', removeProjectMember);

export default router;
