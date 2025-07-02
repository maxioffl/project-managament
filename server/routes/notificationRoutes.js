import express from 'express';
import { getAllNotifications, markAsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, notificationSchemas } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticateToken, getAllNotifications);
router.put('/:id/read', authenticateToken, validate(notificationSchemas.markAsRead, 'params'), markAsRead);

export default router;