

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Grid, List, LogOut, ArrowLeft } from "lucide-react";
import { Button, Card, Input, Spinner } from "../components/ui";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";
import { useDocuments } from "../hooks/useDocuments";
import { DocumentGrid } from "../components/documents/DocumentGrid";
import { DocumentList } from "../components/documents/DocumentList";
import { useAuth } from "../hooks/useAuth";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { documents, isLoading, createDocument, deleteDocument, renameDocument } = useDocuments();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      await createDocument({ title: "Untitled" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <BackgroundLayer />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Bar with Home button (left) and actions (right) */}
            <div className="mb-6 flex items-center justify-between">
              <Button variant="ghost" size="lg" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  onClick={handleCreateDocument}
                  disabled={isCreating}
                  className="shadow-glow"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {isCreating ? "Creating..." : "New document"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-semibold tracking-tight text-gradient md:text-5xl lg:text-6xl">
                Your documents
              </h1>
              <p className="mt-3 text-lg text-foreground-muted">
                Create, edit, and share your block notes.
              </p>
            </div>

            {/* Search & View Toggle */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Documents Display */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <Card className="mx-auto max-w-md p-12">
                  <div className="mb-4 text-6xl">📄</div>
                  <h3 className="mb-2 text-xl font-semibold">No documents yet</h3>
                  <p className="mb-6 text-foreground-muted">
                    {searchQuery
                      ? "No documents match your search."
                      : "Create your first document to get started."}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreateDocument}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create document
                    </Button>
                  )}
                </Card>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <DocumentGrid
                    key="grid"
                    documents={filteredDocuments}
                    onDelete={deleteDocument}
                    onRename={renameDocument}
                    onOpen={(id) => navigate(`/documents/${id}`)}
                  />
                ) : (
                  <DocumentList
                    key="list"
                    documents={filteredDocuments}
                    onDelete={deleteDocument}
                    onRename={renameDocument}
                    onOpen={(id) => navigate(`/documents/${id}`)}
                  />
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};