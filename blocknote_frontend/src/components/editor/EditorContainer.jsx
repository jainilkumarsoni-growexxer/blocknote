


import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBlocks } from "../../hooks/useBlocks";
import { useAutosave } from "../../hooks/useAutosave";
import { BlockRenderer } from "./BlockRenderer";
import { SlashMenu } from "./SlashMenu";
import { ShareButton } from "./ShareButton";
import { SaveIndicator } from "./SaveIndicator";
import { Button } from "../ui";

const getDocument = () => (typeof document !== "undefined" ? document : null);

export const EditorContainer = ({ document, hideHeader = false, onSaveStatusChange }) => {
  const navigate = useNavigate();
  const { blocks, isLoading, addBlock, updateBlock, deleteBlock, moveBlock, changeBlockType, reorderBlocks } = useBlocks(document.id);
  const { saveStatus, triggerSave } = useAutosave(document.id, blocks);

  const [slashMenuState, setSlashMenuState] = useState({
    isOpen: false,
    blockId: null,
    position: { x: 0, y: 0 },
  });
  const [activeId, setActiveId] = useState(null);
  const activeBlock = blocks.find(b => b.id === activeId);

  const blockRefs = useRef(new Map());

  // Forward save status to parent
  useEffect(() => {
    onSaveStatusChange?.(saveStatus);
  }, [saveStatus, onSaveStatusChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const registerBlockRef = useCallback((blockId, element) => {
    if (element) {
      blockRefs.current.set(blockId, element);
    } else {
      blockRefs.current.delete(blockId);
    }
  }, []);

  const focusBlockStart = useCallback((blockId) => {
    const element = blockRefs.current.get(blockId);
    const doc = getDocument();
    if (!element || !doc) return;
    element.focus();
    const range = doc.createRange();
    const sel = doc.defaultView.getSelection();
    range.setStart(element, 0);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const focusBlockEnd = useCallback((blockId) => {
    const element = blockRefs.current.get(blockId);
    const doc = getDocument();
    if (!element || !doc) return;
    element.focus();

    const setCursorToEnd = (node) => {
      const range = doc.createRange();
      const sel = doc.defaultView.getSelection();
      if (node.nodeType === Node.TEXT_NODE) {
        range.setStart(node, node.length);
      } else {
        const walker = doc.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let lastTextNode = null;
        while (walker.nextNode()) lastTextNode = walker.currentNode;
        if (lastTextNode) {
          range.setStart(lastTextNode, lastTextNode.length);
        } else {
          range.setStart(node, 0);
        }
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    };

    setCursorToEnd(element);
  }, []);

  const focusAfterUpdate = useCallback((blockId, position = "end") => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (position === "start") {
          focusBlockStart(blockId);
        } else {
          focusBlockEnd(blockId);
        }
      }, 20);
    });
  }, [focusBlockStart, focusBlockEnd]);

  useEffect(() => {
    if (!slashMenuState.isOpen && slashMenuState.blockId) {
      const blockId = slashMenuState.blockId;
      setTimeout(() => focusBlockStart(blockId), 20);
    }
  }, [slashMenuState.isOpen, slashMenuState.blockId, focusBlockStart]);

  useEffect(() => {
    if (!isLoading && blocks.length === 0) {
      addBlock({ type: "paragraph", content: { text: "" }, order_index: 0 });
    }
  }, [isLoading, blocks.length, addBlock]);

  const handleBlockUpdate = useCallback((blockId, content) => {
    updateBlock(blockId, content);
    triggerSave();
  }, [updateBlock, triggerSave]);

  const handleEnter = useCallback((blockId, cursorOffset, text) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const currentBlock = blocks[blockIndex];
    if (currentBlock.type === "divider" || currentBlock.type === "image") {
      const newOrderIndex = blockIndex < blocks.length - 1
        ? (currentBlock.order_index + blocks[blockIndex + 1].order_index) / 2
        : currentBlock.order_index + 1.0;
      addBlock({ type: "paragraph", content: { text: "" }, order_index: newOrderIndex });
      triggerSave();
      return;
    }

    const beforeText = text.slice(0, cursorOffset);
    const afterText = text.slice(cursorOffset);

    updateBlock(blockId, { text: beforeText });

    const newOrderIndex = blockIndex < blocks.length - 1
      ? (currentBlock.order_index + blocks[blockIndex + 1].order_index) / 2
      : currentBlock.order_index + 1.0;

    const newBlock = {
      type: "paragraph",
      content: { text: afterText },
      order_index: newOrderIndex,
    };

    addBlock(newBlock).then((createdBlock) => {
      focusAfterUpdate(createdBlock.id, "start");
    });

    triggerSave();
  }, [blocks, updateBlock, addBlock, triggerSave, focusAfterUpdate]);

  const handleBackspace = useCallback((blockId, atStart, text) => {
    if (!atStart) return;

    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const currentBlock = blocks[blockIndex];
    const isEmpty = text.length === 0;

    if (isEmpty) {
      if (blockIndex === 0) return;
      const prevBlockId = blocks[blockIndex - 1].id;
      deleteBlock(blockId);
      triggerSave();
      focusAfterUpdate(prevBlockId, "end");
      return;
    }

    if (blockIndex === 0) return;

    const prevBlock = blocks[blockIndex - 1];
    if (prevBlock.type === "divider" || prevBlock.type === "image") return;

    const prevText = prevBlock.content.text || "";
    const mergedText = prevText + text;
    updateBlock(prevBlock.id, { text: mergedText });
    deleteBlock(blockId);
    triggerSave();

    setTimeout(() => {
      const element = blockRefs.current.get(prevBlock.id);
      const doc = getDocument();
      if (!element || !doc) return;
      element.focus();
      const range = doc.createRange();
      const sel = doc.defaultView.getSelection();
      const walker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
      let targetNode = null;
      let accumulatedLength = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const nodeLength = node.length;
        if (accumulatedLength + nodeLength >= prevText.length) {
          targetNode = node;
          break;
        }
        accumulatedLength += nodeLength;
      }
      if (targetNode) {
        range.setStart(targetNode, prevText.length - accumulatedLength);
      } else {
        range.setStart(element, 0);
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 30);
  }, [blocks, updateBlock, deleteBlock, triggerSave, focusAfterUpdate]);

  const handleAddBlock = useCallback((blockId) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const currentBlock = blocks[blockIndex];
    const newOrderIndex = blockIndex < blocks.length - 1
      ? (currentBlock.order_index + blocks[blockIndex + 1].order_index) / 2
      : currentBlock.order_index + 1.0;

    addBlock({
      type: "paragraph",
      content: { text: "" },
      order_index: newOrderIndex,
    }).then((newBlock) => {
      focusAfterUpdate(newBlock.id, "start");
    });
    triggerSave();
  }, [blocks, addBlock, triggerSave, focusAfterUpdate]);

  const handleSlashCommand = useCallback((blockId, position) => {
    setSlashMenuState({
      isOpen: true,
      blockId,
      position: { x: position.x, y: position.y },
    });
  }, []);

  const closeSlashMenu = useCallback(() => {
    setSlashMenuState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleSlashSelect = useCallback((type) => {
    if (slashMenuState.blockId) {
      changeBlockType(slashMenuState.blockId, type);
      triggerSave();
    }
    closeSlashMenu();
  }, [slashMenuState.blockId, changeBlockType, triggerSave, closeSlashMenu]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('dnd-dragging');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('dnd-dragging');
    }

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      
      const newBlocksOrder = arrayMove(blocks, oldIndex, newIndex);
      const movedBlock = newBlocksOrder[newIndex];
      const prevBlock = newBlocksOrder[newIndex - 1];
      const nextBlock = newBlocksOrder[newIndex + 1];
      
      let newOrderIndex;
      if (newIndex === 0) {
        newOrderIndex = nextBlock ? nextBlock.order_index / 2 : 1.0;
      } else if (newIndex === newBlocksOrder.length - 1) {
        newOrderIndex = prevBlock.order_index + 1.0;
      } else {
        newOrderIndex = (prevBlock.order_index + nextBlock.order_index) / 2;
      }
      
      const updatedMovedBlock = { ...movedBlock, order_index: newOrderIndex };
      const finalBlocks = newBlocksOrder.map(b => 
        b.id === movedBlock.id ? updatedMovedBlock : b
      ).sort((a, b) => a.order_index - b.order_index);
      
      reorderBlocks([{ id: movedBlock.id, order_index: newOrderIndex }]);
      setBlocks(finalBlocks);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('dnd-dragging');
    }
  };

  if (isLoading) {
    return <div className="py-4 text-center text-foreground-muted">Loading blocks…</div>;
  }

  const sortableItems = blocks.map(b => b.id);

  return (
    <div className="relative">
      {/* Optional header with save indicator and share button */}
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <SaveIndicator status={saveStatus} />
            <ShareButton documentId={document.id} />
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onUpdate={handleBlockUpdate}
                onEnter={handleEnter}
                onBackspace={handleBackspace}
                onSlashCommand={handleSlashCommand}
                onChangeType={changeBlockType}
                onDelete={(blockId) => { deleteBlock(blockId); triggerSave(); }}
                onAdd={handleAddBlock}
                registerRef={registerBlockRef}
                isMenuOpen={slashMenuState.isOpen}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeBlock ? (
            <BlockRenderer
              block={activeBlock}
              isFirst={false}
              isLast={false}
              onUpdate={() => {}}
              onEnter={() => {}}
              onBackspace={() => {}}
              onSlashCommand={() => {}}
              onChangeType={() => {}}
              onDelete={() => {}}
              onAdd={() => {}}
              registerRef={() => {}}
              isMenuOpen={false}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <SlashMenu
        isOpen={slashMenuState.isOpen}
        position={slashMenuState.position}
        onClose={closeSlashMenu}
        onSelect={handleSlashSelect}
      />
    </div>
  );
};