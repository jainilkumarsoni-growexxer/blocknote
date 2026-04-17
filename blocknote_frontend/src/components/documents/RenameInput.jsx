

// src/components/documents/RenameInput.jsx
import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Input } from "../ui";

export const RenameInput = ({ initialValue, onSubmit, onCancel }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && value !== initialValue) {
      onSubmit(value.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <button type="submit" className="rounded-md p-1 text-accent hover:bg-white/5">
        <Check className="h-4 w-4" />
      </button>
      <button type="button" onClick={onCancel} className="rounded-md p-1 text-foreground-muted hover:bg-white/5">
        <X className="h-4 w-4" />
      </button>
    </form>
  );
};