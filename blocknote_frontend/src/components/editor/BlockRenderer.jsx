




import { useRef, useState , useCallback} from "react";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./DragHandle";
import {
  ParagraphBlock,
  Heading1Block,
  Heading2Block,
  TodoBlock,
  CodeBlock,
  DividerBlock,
  ImageBlock,
} from "../blocks";

const blockComponents = {
  paragraph: ParagraphBlock,
  heading_1: Heading1Block,
  heading_2: Heading2Block,
  todo: TodoBlock,
  code: CodeBlock,
  divider: DividerBlock,
  image: ImageBlock,
};

const TEXT_BLOCK_TYPES = ["paragraph", "heading_1", "heading_2", "todo", "code"];

export const BlockRenderer = ({
  block,
  isFirst,
  isLast,
  onUpdate,
  onEnter,
  onBackspace,
  onSlashCommand,
  onChangeType,
  onDelete,
  onAdd,
  onMove,
  registerRef,
  isMenuOpen,
  isOverlay = false,
  readOnly = false,   // <-- New prop
}) => {
  const BlockComponent = blockComponents[block.type] || ParagraphBlock;
  const [isHovered, setIsHovered] = useState(false);
  const blockRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: isOverlay || readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const containerClassName = isOverlay
    ? "group relative flex items-start gap-2 overflow-visible rounded-lg border px-3 py-2 shadow-card-hover border-white/30"
    : `group relative ${readOnly ? "ml-0" : "ml-16"} flex items-start gap-2 overflow-visible rounded-lg border px-3 py-2 transition-all duration-150 ${
        !readOnly && (isHovered || isDragging) ? "border-white/20" : "border-transparent"
      } ${TEXT_BLOCK_TYPES.includes(block.type) ? "max-w-full" : ""}`;

  const mergedAttributes = readOnly ? {} : { ...attributes, tabIndex: -1 };

  const handleContainerClick = useCallback((e) => {
    if (readOnly || isMenuOpen) return;
    const editable = contentRef.current?.querySelector('[contenteditable="true"]');
    if (editable) editable.focus();
  }, [readOnly, isMenuOpen]);

  const contentRef = useRef(null);

  return (
    <div
      ref={readOnly ? undefined : setNodeRef}
      style={readOnly ? undefined : style}
      data-block-id={block.id}
      className={containerClassName}
      onMouseEnter={() => !readOnly && setIsHovered(true)}
      onMouseLeave={() => !readOnly && setIsHovered(false)}
      onClick={handleContainerClick}
      {...(readOnly ? {} : mergedAttributes)}
    >
      {/* Drag Handle – hidden in readOnly mode */}
      {!readOnly && (
        <DragHandle
          isVisible={isOverlay || isHovered || isDragging}
          onAdd={() => onAdd(block.id)}
          listeners={listeners}
          isDragging={isDragging}
        />
      )}

      <div
        ref={contentRef}
        className={`flex-1 ${TEXT_BLOCK_TYPES.includes(block.type) ? "overflow-hidden" : ""}`}
      >
        <BlockComponent
          block={block}
          onUpdate={(content) => !readOnly && onUpdate(block.id, content)}
          onEnter={(cursorPos, content) => !readOnly && onEnter(block.id, cursorPos, content)}
          onBackspace={(atStart, content) => !readOnly && onBackspace(block.id, atStart, content)}
          onSlashCommand={(pos) => !readOnly && onSlashCommand(block.id, pos)}
          registerRef={(el) => !readOnly && registerRef(block.id, el)}
          isMenuOpen={isMenuOpen}
          readOnly={readOnly}
        />
      </div>

      {/* Delete button – hidden in readOnly mode */}
      {!readOnly && !isFirst && !isOverlay && (
        <button
          onClick={() => onDelete(block.id)}
          className={`flex-shrink-0 rounded p-1 text-foreground-muted transition-all hover:bg-red-500/20 hover:text-red-400 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Delete block"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};