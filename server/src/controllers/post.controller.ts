import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Post from '../models/Post';
import Project from '../models/Project';

export const createPost = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is a member of the project
    if (!project.members.includes(req.user.id)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to post in this project' 
      });
    }

    const newPost = new Post({
      content,
      user: req.user.id,
      project: projectId
    });

    const post = await newPost.save();
    
    // Populate user details
    await post.populate('user', ['name', 'avatar']);
    
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPosts = async (req: any, res: Response) => {
  try {
    const { projectId } = req.query;
    let query: any = {};
    
    if (projectId) {
      query.project = projectId;
      
      // Verify user has access to this project
      const project = await Project.findById(projectId);
      if (!project || !project.members.includes(req.user.id)) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized to view these posts' 
        });
      }
    }

    const posts = await Post.find(query)
      .populate('user', ['name', 'avatar'])
      .populate('likes', ['name', 'avatar'])
      .populate({
        path: 'comments.user',
        select: 'name avatar'
      })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['name', 'avatar'])
      .populate('likes', ['name', 'avatar'])
      .populate({
        path: 'comments.user',
        select: 'name avatar'
      });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Verify user has access to this post's project
    const project = await Project.findById(post.project);
    if (!project || !project.members.includes(req.user.id)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to view this post' 
      });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updatePost = async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if user is the author of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to update this post' 
      });
    }
    
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { content } },
      { new: true }
    )
    .populate('user', ['name', 'avatar']);
    
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if user is the author of the post or an admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to delete this post' 
      });
    }
    
    await post.deleteOne();
    
    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const likePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post already liked' 
      });
    }
    
    post.likes.unshift(req.user.id);
    await post.save();
    
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const unlikePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if the post has been liked by this user
    if (!post.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post has not yet been liked' 
      });
    }
    
    // Remove the like
    post.likes = post.likes.filter(
      (like: any) => like.toString() !== req.user.id
    ) as any;
    
    await post.save();
    
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addComment = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Verify user has access to this post's project
    const project = await Project.findById(post.project);
    if (!project || !project.members.includes(req.user.id)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to comment on this post' 
      });
    }
    
    const { text } = req.body;
    
    const newComment = {
      text,
      user: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar,
      date: new Date()
    } as const;
    
    post.comments.unshift(newComment as any);
    await post.save();
    
    // Populate the user field in the new comment
    await post.populate({
      path: 'comments.user',
      select: 'name avatar'
    });
    
    const addedComment = post.comments[0];
    
    res.status(201).json({ success: true, comment: addedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteComment = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if comment exists
    const commentId = req.params.commentId;
    const comment = post.comments.find(
      (c: any) => c._id && c._id.toString() === commentId
    ) as any;

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is the comment author or an admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to delete this comment' 
      });
    }
    
    // Remove the comment
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );
    
    await post.save();
    
    res.json({ success: true, message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
