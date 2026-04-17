import express from 'express';
import { getDocuments, createDocument, getDocument, updateDocument, deleteDocument } from '../controllers/documentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreateDocument, validateUpdateDocument } from '../validators/documentValidator.js';

const router = express.Router();

router.use(authenticate); // All document routes require authentication

router.route('/')
  .get(getDocuments)
  .post(validateCreateDocument, createDocument);


router.route('/:id')
  .get(getDocument)
  .patch(validateUpdateDocument, updateDocument)
  .delete(deleteDocument);


export default router;