



import { useEffect, useRef, useState } from "react";
import { Search, Type, Heading1, Heading2, CheckSquare, Code, Minus, Image } from "lucide-react";
import { Input } from "../ui";

const blockTypes = [
  { type: "paragraph", label: "Paragraph", icon: Type },
  { type: "heading_1", label: "Heading 1", icon: Heading1 },
  { type: "heading_2", label: "Heading 2", icon: Heading2 },
  { type: "todo", label: "To-do", icon: CheckSquare },
  { type: "code", label: "Code", icon: Code },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "image", label: "Image", icon: Image },
];

export const SlashMenu = ({ isOpen, position, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = blockTypes.filter((b) =>
    b.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-64"
      style={{ top: position.y, left: position.x }}
    >
      <div className="overflow-hidden rounded-lg border border-border bg-background-elevated shadow-lg shadow-black/40">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter..."
              className="h-8 border-0 bg-transparent pl-8 text-sm focus:ring-0"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-foreground-muted">No results</div>
          ) : (
            filtered.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
                onClick={() => {
                  onSelect(type);
                  onClose();
                }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};