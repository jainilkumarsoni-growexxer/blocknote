



import { useState } from "react";
import { Share2, Copy, Check, Globe, Lock, X, Loader2 } from "lucide-react";
import { Button, Card, Input } from "../ui";
import api from "../../services/api";

export const ShareButton = ({ documentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchShareInfo = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/documents/${documentId}/share`);
      setShareData(response.data);
    } catch (err) {
      console.error("Failed to fetch share info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublic = async () => {
    if (!shareData) return;
    const newPublic = !shareData.is_public;
    try {
      const response = await api.patch(`/documents/${documentId}/share`, {
        is_public: newPublic,
      });
      setShareData(response.data);
    } catch (err) {
      console.error("Failed to toggle share:", err);
    }
  };

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post(`/documents/${documentId}/share`);
      setShareData(response.data);
    } catch (err) {
      console.error("Failed to generate share link:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    if (!shareData?.share_token) return;
    const link = `${window.location.origin}/share/${shareData.share_token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error("Copy failed:", err));
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchShareInfo();
  };

  const handleClose = () => {
    setIsOpen(false);
    setShareData(null);
    setCopied(false);
  };

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={handleOpen}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <Card className="absolute right-0 top-full z-50 mt-2 w-96 p-6 shadow-card-hover">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Share document</h3>
              <button
                onClick={handleClose}
                className="rounded-md p-1 text-foreground-muted hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-foreground-muted">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">

                {/* Public Access Toggle */}
                <div className="flex items-center justify-between rounded-lg bg-surface/30 p-3">
                  <div className="flex items-center gap-3">
                    {shareData?.is_public ? (
                      <Globe className="h-5 w-5 text-accent" />
                    ) : (
                      <Lock className="h-5 w-5 text-foreground-muted" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">Public access</p>
                      <p className="text-xs text-foreground-muted">
                        {shareData?.is_public
                          ? "Anyone with the link can view"
                          : "Only you can access"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={togglePublic}
                    className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                      shareData?.is_public ? "bg-accent" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        shareData?.is_public ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Link Section */}
                {shareData?.is_public && (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-foreground-muted">SHARE LINK</label>
                    {shareData.share_token ? (
                      <>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={`${window.location.origin}/share/${shareData.share_token}`}
                            className="flex-1 text-sm"
                          />
                          <Button size="sm" variant="secondary" onClick={copyLink}>
                            {copied ? (
                              <Check className="h-4 w-4 text-accent" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-foreground-subtle">
                          This link is active. Toggle off to revoke access.
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-foreground-muted">
                          No link generated yet.
                        </p>
                        <Button
                          onClick={generateShareLink}
                          size="sm"
                          className="w-full"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate share link"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!shareData?.is_public && (
                  <div className="rounded-lg bg-surface/30 p-3 text-center">
                    <p className="text-sm text-foreground-muted">
                      Enable public access to create a shareable link.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};