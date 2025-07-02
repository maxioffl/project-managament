import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, projectSchemas } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticateToken, validate(projectSchemas.query, 'query'), getProjects);
router.post('/', authenticateToken, requireAdmin, validate(projectSchemas.create), createProject);
router.put('/:id', authenticateToken, requireAdmin, validate(projectSchemas.update), updateProject);
router.delete('/:id', authenticateToken, requireAdmin, deleteProject);

export default router;