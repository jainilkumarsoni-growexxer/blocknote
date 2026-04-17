import { useState, useEffect } from "react";
import api from "../services/api";

export const useDocument = (documentId) => {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/documents/${documentId}`);
        setDocument(response.data.document);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  return { document, isLoading, error };
};