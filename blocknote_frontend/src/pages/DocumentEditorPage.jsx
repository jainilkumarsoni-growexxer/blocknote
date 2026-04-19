

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useDocument } from "../hooks/useDocument";
import { EditorContainer } from "../components/editor/EditorContainer";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";
import { SaveIndicator } from "../components/editor/SaveIndicator";
import { ShareButton } from "../components/editor/ShareButton";
import { Button, Spinner } from "../components/ui";
import api from "../services/api";

export const DocumentEditorPage = () => {
  const { id } = useParams();
  const { document, isLoading, error } = useDocument(id);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");

  useEffect(() => {
    if (document) setTitle(document.title || "Untitled");
  }, [document]);

  const saveTitle = async (newTitle) => {
    setIsSaving(true);
    try {
      await api.patch(`/documents/${id}`, { title: newTitle });
    } catch (err) {
      console.error("Failed to update title:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleTitleBlur = async () => {
    let finalTitle = title.trim();
    if (finalTitle === "") {
      finalTitle = "Untitled";
      setTitle(finalTitle);
    }
    await saveTitle(finalTitle);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-400">Failed to load document</h2>
          <p className="mt-2 text-foreground-muted">{error}</p>
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
        {/* Top Bar */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <SaveIndicator status={saveStatus} />
              <ShareButton documentId={id} />
            </div>
          </div>
        </div>

        {/* Scrollable Editor Box */}
        <div className="mx-auto w-full max-w-6xl flex-1 overflow-hidden rounded-xl border border-border bg-background-base/50 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            {/* Fixed Title */}
            <div className="shrink-0 px-6 pt-6 ml-2 mt-2 mb-2">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                placeholder="Untitled"
                className="w-full border-0 border-b border-transparent bg-transparent text-3xl font-semibold tracking-tight text-foreground placeholder:text-foreground-subtle/40 outline-none transition-colors focus:border-b focus:border-border"
              />
            </div>

            {/* Scrollable Blocks Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <EditorContainer
                document={{ ...document, title }}
                hideHeader
                onSaveStatusChange={setSaveStatus}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};