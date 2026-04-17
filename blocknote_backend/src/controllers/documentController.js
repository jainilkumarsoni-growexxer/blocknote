import * as documentService from '../services/documentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.getUserDocuments(req.userId);
  res.status(200).json({ documents });
});


export const createDocument = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const document = await documentService.createDocument(req.userId, title);
  res.status(201).json({ document });
});


export const getDocument = asyncHandler(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.status(200).json({ document });
});


export const updateDocument = asyncHandler(async (req, res) => {
  const { title, is_public } = req.body;
  const document = await documentService.updateDocument(req.params.id, req.userId, { title, is_public });
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.status(200).json({ document });
});


export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await documentService.deleteDocument(req.params.id, req.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.status(200).json({ message: 'Document deleted successfully' });
});