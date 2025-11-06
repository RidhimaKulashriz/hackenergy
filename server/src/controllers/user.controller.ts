import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Project from '../models/Project';
import Post from '../models/Post';

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email } = req.body;
  
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    
    await user.save();
    user = user.toObject();
    delete user.password;
    
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.remove();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserProjects = async (req: any, res: Response) => {
  try {
    const projects = await Project.find({ members: req.user.id });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserPosts = async (req: any, res: Response) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
