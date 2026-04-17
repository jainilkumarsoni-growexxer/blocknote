
import { useState, useRef } from "react";
import { MoreVertical, Trash2, Pencil, ExternalLink, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RenameInput } from "./RenameInput";
import { useClickOutside } from "../../hooks/useClickOutside";

export const DocumentListItem = ({ document, onDelete, onRename, onOpen }) => {
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
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    clickTimerRef.current = setTimeout(() => {
      onOpen(document.id);
      clickTimerRef.current = null;
    }, 250);
  };

  const handleTitleDoubleClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    setIsRenaming(true);
  };

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-border bg-gradient-to-b from-white/8 to-white/2 p-4 shadow-card transition-all duration-200 ease-expo-out hover:-translate-y-0.5 hover:border-border-hover hover:shadow-card-hover">
      <FileText className="h-5 w-5 flex-shrink-0 text-foreground-muted" />

      <div className="min-w-0 flex-1">
        {isRenaming ? (
          <RenameInput
            initialValue={document.title}
            onSubmit={handleRename}
            onCancel={() => setIsRenaming(false)}
          />
        ) : (
          <h3
            className="cursor-pointer truncate text-base font-medium text-foreground hover:text-accent"
            onClick={handleTitleClick}
            onDoubleClick={handleTitleDoubleClick}
          >
            {document.title}
          </h3>
        )}
      </div>

      <p className="hidden flex-shrink-0 text-sm text-foreground-muted sm:block">
        {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
      </p>

      <div className="relative flex-shrink-0">
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
    </div>
  );
};