

import { useState, useRef } from "react";
import { MoreVertical, Trash2, Pencil, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "../ui";
import { RenameInput } from "./RenameInput";
import { useClickOutside } from "../../hooks/useClickOutside";

export const DocumentCard = ({ document, onDelete, onRename, onOpen }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const clickTimerRef = useRef(null);

  const closeMenu = () => setShowMenu(false);

  useClickOutside(menuRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target)) {
      return;
    }
    closeMenu();
  });

  const handleRename = async (newTitle) => {
    await onRename(document.id, newTitle);
    setIsRenaming(false);
  };

  const handleTitleClick = () => {
    // Clear any existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    // Set a timer for single-click action
    clickTimerRef.current = setTimeout(() => {
      onOpen(document.id);
      clickTimerRef.current = null;
    }, 250); // 250ms delay
  };

  const handleTitleDoubleClick = () => {
    // Cancel the single-click timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    // Enter rename mode
    setIsRenaming(true);
  };

  return (
    <Card className="group relative flex h-full flex-col p-5 transition-all hover:-translate-y-1">
      <div className="mb-4 text-3xl">📝</div>

      {isRenaming ? (
        <RenameInput
          initialValue={document.title}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      ) : (
        <h3
          className="mb-1 line-clamp-2 flex-1 cursor-pointer text-lg font-semibold text-foreground hover:text-accent"
          onClick={handleTitleClick}
          onDoubleClick={handleTitleDoubleClick}
        >
          {document.title}
        </h3>
      )}

      <p className="text-sm text-foreground-muted">
        Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
      </p>

      <div className="absolute right-3 top-3">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
          className="rounded-md p-1 text-foreground-muted hover:bg-white/5"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-background-elevated py-1 shadow-card backdrop-blur-none"
          >
            <button
              onClick={() => {
                setIsRenaming(true);
                closeMenu();
              }}
              className="flex w-full items-center px-3 py-2 text-sm text-foreground-muted hover:bg-white/5"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </button>
            <button
              onClick={() => {
                onOpen(document.id);
                closeMenu();
              }}
              className="flex w-full items-center px-3 py-2 text-sm text-foreground-muted hover:bg-white/5"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </button>
            <button
              onClick={() => {
                onDelete(document.id);
                closeMenu();
              }}
              className="flex w-full items-center px-3 py-2 text-sm text-red-400 hover:bg-white/5"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};