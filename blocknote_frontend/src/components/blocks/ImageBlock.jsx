
import { useState } from "react";
import { Link2 } from "lucide-react";
import { Input, Button } from "../ui";

export const ImageBlock = ({ block, onUpdate, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(!block.content.url);
  const [url, setUrl] = useState(block.content.url || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onUpdate({ url: url.trim() });
      setIsEditing(false);
    }
  };

  if (readOnly) {
    // Read‑only: just display the image without edit controls
    if (!block.content.url) return null;
    return (
      <div className="relative">
        <img
          src={block.content.url}
          alt="Embedded"
          className="max-h-96 rounded-lg border border-border object-contain"
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter image URL..."
          className="flex-1"
          autoFocus
        />
        <Button type="submit" size="sm">
          Embed
        </Button>
        {block.content.url && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </form>
    );
  }

  return (
    <div className="group relative">
      <img
        src={block.content.url}
        alt="Embedded"
        className="max-h-96 rounded-lg border border-border object-contain"
      />
      <button
        onClick={() => setIsEditing(true)}
        className="absolute right-2 top-2 rounded-md bg-background-elevated/80 p-1.5 text-foreground-muted opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
};