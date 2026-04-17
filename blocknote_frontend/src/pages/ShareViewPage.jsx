



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";
import { Spinner } from "../components/ui";
import { ReadOnlyEditor } from "../components/editor/ReadOnlyEditor";
import api from "../services/api";

export const ShareViewPage = () => {
  const { token } = useParams();
  const [document, setDocument] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const response = await api.get(`/documents/share/${token}`);
        // Expecting { document: {...}, blocks: [...] }
        setDocument(response.data.document);
        setBlocks(response.data.blocks || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShared();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-400">Access Denied</h2>
          <p className="mt-2 text-foreground-muted">{error || "Document not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundLayer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 min-h-screen px-6 py-8"
      >
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-semibold tracking-tight text-gradient">
            {document.title}
          </h1>
          <ReadOnlyEditor blocks={blocks} />
        </div>
      </motion.div>
    </>
  );
};