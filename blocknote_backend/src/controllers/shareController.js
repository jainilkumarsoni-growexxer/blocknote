
import * as documentService from '../services/documentService.js';
import * as blockService from '../services/blockService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

const generateShareToken = () => crypto.randomBytes(32).toString('hex');

export const getShareInfo = asyncHandler(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.status(200).json({
    is_public: document.is_public,
    share_token: document.share_token,
  });
});

export const generateShareLink = asyncHandler(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  const share_token = generateShareToken();
  const updated = await documentService.updateDocument(req.params.id, req.userId, {
    is_public: true,
    share_token,
  });
  
  res.status(200).json({
    is_public: updated.is_public,
    share_token: updated.share_token,
  });
});

export const togglePublic = asyncHandler(async (req, res) => {
  const { is_public } = req.body;
  const document = await documentService.getDocumentById(req.params.id, req.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  let share_token = document.share_token;
  if (is_public && !share_token) {
    share_token = generateShareToken();
  } else if (!is_public) {
    share_token = null;
  }

  const updated = await documentService.updateDocument(req.params.id, req.userId, {
    is_public,
    share_token,
  });
  
  res.status(200).json({
    is_public: updated.is_public,
    share_token: updated.share_token,
  });
});


export const getSharedDocument = asyncHandler(async (req, res) => {
  // req.documentId is set by validateShareToken middleware
  const document = await documentService.getDocumentById(req.documentId);
  const blocks = await blockService.getBlocksByDocumentId(req.documentId);
  
  // Always return an object with 'document' and 'blocks' keys
  res.status(200).json({
    document: document || null,
    blocks: blocks || []
  });
});