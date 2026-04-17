

import { useRef, useEffect } from "react";
import { getCursorOffset } from "../../utils/editorHelpers";

const MENU_HEIGHT = 260;
const MENU_WIDTH = 224;

export const CodeBlock = ({
  block,
  onUpdate,
  onEnter,
  onBackspace,
  onSlashCommand,
  registerRef,
  isMenuOpen,
  readOnly = false,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      registerRef(ref.current);
      if (block.content.text !== ref.current.innerText) {
        ref.current.innerText = block.content.text || "";
      }
    }
    return () => registerRef(null);
  }, [registerRef, block.content.text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleKeyUp = (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (el.innerText.trim() === "" && el.innerHTML !== "") {
          el.innerHTML = "";
        }
      }
    };
    el.addEventListener("keyup", handleKeyUp);
    return () => el.removeEventListener("keyup", handleKeyUp);
  }, []);

  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    onUpdate({ text });
  };

  const isReallyEmpty = (element) => {
    const text = element.innerText || "";
    return text.trim().length === 0;
  };

  const handleKeyDown = (e) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const text = e.currentTarget.innerText || "";
    const cursorOffset = getCursorOffset(range, ref.current);

    // Slash command
    if (e.key === "/" && isReallyEmpty(e.currentTarget) && !isMenuOpen) {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      let y = rect.bottom + 4;
      if (spaceBelow < MENU_HEIGHT) y = rect.top - MENU_HEIGHT - 4;
      let x = rect.left;
      if (x + MENU_WIDTH > window.innerWidth) x = window.innerWidth - MENU_WIDTH - 8;
      onSlashCommand({ x, y });
      return;
    }

    // Tab: insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const before = text.slice(0, cursorOffset);
      const after = text.slice(cursorOffset);
      const newText = before + "  " + after;
      ref.current.innerText = newText;
      onUpdate({ text: newText });

      const newRange = document.createRange();
      const sel = window.getSelection();
      const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT, null, false);
      let targetNode = null;
      let accumulated = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const len = node.length;
        if (accumulated + len >= cursorOffset + 2) {
          targetNode = node;
          break;
        }
        accumulated += len;
      }
      if (targetNode) {
        newRange.setStart(targetNode, cursorOffset + 2 - accumulated);
      } else {
        newRange.setStart(ref.current, 0);
      }
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      return;
    }

    // Enter: insert newline (stay in code block)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Use execCommand for reliable newline insertion with proper cursor placement
      document.execCommand('insertLineBreak');
      // Trigger content update
      onUpdate({ text: ref.current.innerText });
      return;
    }

    // Shift+Enter: create new paragraph block below
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      onEnter(cursorOffset, text);
      return;
    }

    // Backspace
    if (e.key === "Backspace") {
      const atStart = cursorOffset === 0;
      onBackspace(atStart, text);
    }
  };

  return (
    <div className="rounded-lg bg-[#0F0F12] p-4 font-mono text-sm">
      <div
        ref={ref}
        contentEditable={!isMenuOpen && !readOnly}
        suppressContentEditableWarning
        className="min-h-[1.8em] w-full whitespace-pre-wrap text-foreground outline-none empty:before:text-foreground-subtle/50 empty:before:content-[attr(data-placeholder)]"
        data-placeholder="Write code..."
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  );
};