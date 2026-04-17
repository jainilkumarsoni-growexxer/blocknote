import express from 'express';
import { getBlocks, createBlock, updateBlock, deleteBlock, batchUpdateBlocks, reorderBlocks } from '../controllers/blockController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreateBlock, validateBatchUpdate } from '../validators/blockValidator.js';

const router = express.Router({ mergeParams: true }); // to access documentId from parent router

router.use(authenticate);

router.route('/')
  .get(getBlocks)
  .post(validateCreateBlock, createBlock);

router.post('/batch', validateBatchUpdate, batchUpdateBlocks);
router.put('/reorder', reorderBlocks);

router.route('/:blockId')
  .patch(updateBlock)
  .delete(deleteBlock);



// Add a middleware to block writes for share token
const blockWritesForShareToken = (req, res, next) => {
  if (req.isShareToken) {
    return res.status(403).json({ message: 'Read‑only access' });
  }
  next();
};

// Apply to all write endpoints
router.post('/', blockWritesForShareToken, validateCreateBlock, createBlock);
router.patch('/:blockId', blockWritesForShareToken, updateBlock);
router.delete('/:blockId', blockWritesForShareToken, deleteBlock);
router.post('/batch', blockWritesForShareToken, validateBatchUpdate, batchUpdateBlocks);
router.put('/reorder', blockWritesForShareToken, reorderBlocks);



export default router;