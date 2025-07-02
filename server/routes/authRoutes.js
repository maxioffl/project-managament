import express from 'express';
import { login } from '../controllers/authController.js';
import { validate, authSchemas } from '../middleware/validation.js';

const router = express.Router();

router.post('/login', validate(authSchemas.login), login);

export default router;