



import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/documents');
      setDocuments(response.data.documents);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (data = {}) => {
    try {
      const response = await api.post('/documents', data);
      const newDoc = response.data.document;
      setDocuments(prev => [newDoc, ...prev]);
      return newDoc;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create document');
    }
  };

  const deleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete document');
    }
  };

  const renameDocument = async (id, title) => {
    try {
      const response = await api.patch(`/documents/${id}`, { title });
      const updated = response.data.document;
      setDocuments(prev => prev.map(doc => doc.id === id ? updated : doc));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to rename document');
    }
  };

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    createDocument,
    deleteDocument,
    renameDocument,
  };
};