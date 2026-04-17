
// src/components/editor/SaveIndicator.jsx
import { Check, Loader2, AlertCircle } from "lucide-react";

export const SaveIndicator = ({ status }) => {
  if (status === "saving") {
    return (
      <div className="flex items-center gap-1 text-sm text-foreground-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving…
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center gap-1 text-sm text-red-400">
        <AlertCircle className="h-3.5 w-3.5" />
        Failed to save
      </div>
    );
  }
  if (status === "saved") {
    return (
      <div className="flex items-center gap-1 text-sm text-foreground-muted">
        <Check className="h-3.5 w-3.5 text-accent" />
        Saved
      </div>
    );
  }
  return null;
};