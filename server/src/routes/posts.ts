import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from '../controllers/post.controller';

const router = Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getPosts)
  .post(
    [
      body('content', 'Content is required').not().isEmpty(),
      body('projectId', 'Project ID is required').not().isEmpty(),
    ],
    createPost
  );

router
  .route('/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost);

router.put('/:id/like', likePost);
router.put('/:id/unlike', unlikePost);
router.post(
  '/:id/comments',
  [body('text', 'Text is required').not().isEmpty()],
  addComment
);
router.delete('/:id/comments/:commentId', deleteComment);

export default router;
