import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';
import Post from '../models/Post';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: any, res: Response) => {
  try {
    const { name, email, role } = req.body;
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already in use' 
        });
      }
    }
    
    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (role && ['user', 'admin'].includes(role)) {
      (user as any).role = role;
    }
    
    await user.save();
    
    // Remove password from response
    const userObj = user.toObject();
    delete (userObj as any).password;
    delete (userObj as any).__v;
    
    res.json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if user is authorized to delete
    const userId = (user as any)._id ? (user as any)._id.toString() : (user as any).toString();
    if (userId === req.user.id || req.user.role === 'admin') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }
    
    // Remove user's posts and comments
    await Post.deleteMany({ user: user._id });
    
    // Remove user from projects and delete if they're the only member
    const projects = await Project.find({ members: user._id });
    
    for (const project of projects) {
      if (project.members.length === 1) {
        // If user is the only member, delete the project
        await Project.findByIdAndDelete(project._id);
      } else {
        // Otherwise, just remove the user from members
        // Check if member exists in project
        const memberId = project.members[0];
        const memberIdStr = typeof memberId === 'object' && memberId !== null && '_id' in memberId 
          ? (memberId as any)._id.toString() 
          : memberId.toString();
        if (!project.members.some((id: any) => id.toString() === memberIdStr)) {
          project.members = project.members.filter((member: any) => member.toString() !== memberIdStr);
          await project.save();
        }
      }
    }
    
    // Finally, delete the user
    await User.deleteOne({ _id: user._id });
    
    res.json({ success: true, message: 'User removed' });
  } catch (error: any) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get user projects
// @route   GET /api/admin/users/:id/projects
// @access  Private/Admin
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ members: req.params.id })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    
    res.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get user posts
// @route   GET /api/admin/users/:id/posts
// @access  Private/Admin
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Get app statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      userCount,
      projectCount,
      postCount,
      adminCount,
      activeUsers,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Post.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.find().sort({ lastLogin: -1 }).limit(5).select('name email lastLogin'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt')
    ]);
    
    const stats = {
      users: {
        total: userCount,
        admins: adminCount,
        activeUsers,
        recentUsers
      },
      projects: projectCount,
      posts: postCount
    };
    
    res.json({ success: true, stats });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Delete project (admin)
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Delete all posts related to this project
    await Post.deleteMany({ project: project._id });
    
    // Remove project from all users' projects array
    await User.updateMany(
      { projects: project._id },
      { $pull: { projects: project._id } }
    );
    
    // Delete the project
    await project.deleteOne();
    
    res.json({ success: true, message: 'Project and all related data removed' });
  } catch (error: any) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// @desc    Delete post (admin)
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    await post.deleteOne();
    
    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
