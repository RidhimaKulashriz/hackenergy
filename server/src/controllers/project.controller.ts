import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project';
import User from '../models/User';

export const createProject = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, techStack, repoUrl, demoUrl } = req.body;
    
    const newProject = new Project({
      title,
      description,
      techStack: techStack || [],
      repoUrl: repoUrl || '',
      demoUrl: demoUrl || '',
      createdBy: req.user.id,
      members: [req.user.id]
    });

    const project = await newProject.save();
    
    // Add project to user's projects
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { projects: project._id } },
      { new: true }
    );

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', ['name', 'avatar'])
      .populate('members', ['name', 'avatar'])
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', ['name', 'avatar'])
      .populate('members', ['name', 'avatar']);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { title, description, techStack, repoUrl, demoUrl } = req.body;
    
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Check if user is the creator of the project
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }
    
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, techStack, repoUrl, demoUrl } },
      { new: true }
    );
    
    res.json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Check if user is the creator of the project
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
    }
    
    await project.remove();
    
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
