

import express from 'express';
import { getShareInfo, generateShareLink, togglePublic, getSharedDocument } from '../controllers/shareController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateShareToken } from '../middleware/shareTokenMiddleware.js';

const router = express.Router();

// Owner only
router.get('/:id/share', authenticate, getShareInfo);
router.post('/:id/share', authenticate, generateShareLink);
router.patch('/:id/share', authenticate, togglePublic);

// Public read‑only
router.get('/share/:token', validateShareToken, getSharedDocument);

export default router;