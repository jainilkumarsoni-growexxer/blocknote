import express from 'express';
// import { authenticate } from '../middleware/authMiddleware.js';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;