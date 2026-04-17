import * as blockService from '../services/blockService.js';
import * as documentService from '../services/documentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// Verify document ownership middleware (can be extracted)
const verifyDocumentOwnership = async (documentId, userId) => {
  const document = await documentService.getDocumentById(documentId, userId);
  if (!document) throw new Error('DOCUMENT_NOT_FOUND');
  return document;
};


export const getBlocks = asyncHandler(async (req, res) => {
  await verifyDocumentOwnership(req.params.documentId, req.userId);
  const blocks = await blockService.getBlocksByDocumentId(req.params.documentId);
  res.status(200).json({ blocks });
});


export const createBlock = asyncHandler(async (req, res) => {
  await verifyDocumentOwnership(req.params.documentId, req.userId);
  const { type, content, order_index, parent_id } = req.body;
  const block = await blockService.createBlock(req.params.documentId, { type, content, order_index, parent_id });
  res.status(201).json({ block });
});


export const updateBlock = asyncHandler(async (req, res) => {
  const { type, content, order_index } = req.body;
  const block = await blockService.updateBlock(req.params.blockId, { type, content, order_index });
  if (!block) {
    return res.status(404).json({ message: 'Block not found' });
  }
  res.status(200).json({ block });
});


export const deleteBlock = asyncHandler(async (req, res) => {
  const block = await blockService.deleteBlock(req.params.blockId);
  if (!block) {
    return res.status(404).json({ message: 'Block not found' });
  }
  res.status(200).json({ message: 'Block deleted' });
});


export const batchUpdateBlocks = asyncHandler(async (req, res) => {
  await verifyDocumentOwnership(req.params.documentId, req.userId);
  const { blocks, version } = req.body;
  await blockService.batchUpdateBlocks(req.params.documentId, blocks, version);
  res.status(200).json({ message: 'Blocks saved' });
});


export const reorderBlocks = asyncHandler(async (req, res) => {
  await verifyDocumentOwnership(req.params.documentId, req.userId);
  const { blocks } = req.body;
  await blockService.reorderBlocks(req.params.documentId, blocks);
  res.status(200).json({ message: 'Blocks reordered' });
});