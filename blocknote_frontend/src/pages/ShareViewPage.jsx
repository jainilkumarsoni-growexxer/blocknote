
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
        className="relative z-10 flex h-screen flex-col px-6 py-6"
      >
        {/* Scrollable Editor Box */}
        <div className="mx-auto w-full max-w-6xl flex-1 overflow-hidden rounded-xl border border-border bg-background-base/50 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            {/* Fixed Title */}
            <div className="shrink-0 px-6 pt-6 ml-3 mt-2 mb-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {document.title}
              </h1>
              <p className="mt-1 text-sm text-foreground-muted">
                Read‑only shared document
              </p>
            </div>

            {/* Scrollable Blocks Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <ReadOnlyEditor blocks={blocks} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};