import { Project } from '../models/Project.js';
import { isDatabaseConnected } from '../config/database.js';
import { createNotification } from '../services/notificationService.js';

// In-memory storage fallback
let projects = [];

export const getProjects = async (req, res) => {
  try {
    const { search, status, priority } = req.query;
    let projectList;

    if (isDatabaseConnected()) {
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (status) query.status = status;
      if (priority) query.priority = priority;

      projectList = await Project.find(query).sort({ createdAt: -1 });
    } else {
      projectList = projects.filter(project => {
        let matches = true;
        if (search) {
          matches = matches && (
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (status) matches = matches && project.status === status;
        if (priority) matches = matches && project.priority === priority;
        return matches;
      });
    }

    res.json(projectList);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const projectData = {
      title,
      description,
      status: status || 'planning',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: req.user.username
    };

    let project;
    if (isDatabaseConnected()) {
      project = new Project(projectData);
      await project.save();
    } else {
      project = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      projects.push(project);
    }

    // Create notification
    const notification = await createNotification(
      `New project "${title}" was created by ${req.user.username}`,
      'create',
      project._id || project.id,
      req.user.id
    );

    // Emit to all connected clients
    req.io.emit('projectCreated', { project, notification });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    const updateData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      updatedAt: new Date()
    };

    let project;
    if (isDatabaseConnected()) {
      project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const projectIndex = projects.findIndex(p => p.id === id);
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      projects[projectIndex] = { ...projects[projectIndex], ...updateData };
      project = projects[projectIndex];
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create notification
    const notification = await createNotification(
      `Project "${title}" was updated by ${req.user.username}`,
      'update',
      project._id || project.id,
      req.user.id
    );

    // Emit to all connected clients
    req.io.emit('projectUpdated', { project, notification });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    let project;

    if (isDatabaseConnected()) {
      project = await Project.findByIdAndDelete(id);
    } else {
      const projectIndex = projects.findIndex(p => p.id === id);
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project = projects[projectIndex];
      projects.splice(projectIndex, 1);
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create notification
    const notification = await createNotification(
      `Project "${project.title}" was deleted by ${req.user.username}`,
      'delete',
      project._id || project.id,
      req.user.id
    );

    // Emit to all connected clients
    req.io.emit('projectDeleted', { projectId: id, notification });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};