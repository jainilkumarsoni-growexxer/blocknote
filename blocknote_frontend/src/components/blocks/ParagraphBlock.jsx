
import { useRef, useEffect } from "react";
import { getCursorOffset } from "../../utils/editorHelpers";

const MENU_HEIGHT = 260;
const MENU_WIDTH = 224;

export const ParagraphBlock = ({
  block,
  onUpdate,
  onEnter,
  onBackspace,
  onSlashCommand,
  registerRef,
  isMenuOpen, // new prop
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

  const isReallyEmpty = (element) => {
    const text = element.innerText || "";
    return text.trim().length === 0;
  };

  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    onUpdate({ text });
  };

  const handleKeyDown = (e) => {
    console.log("keyDown");

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const text = e.currentTarget.innerText || "";
    const cursorOffset = getCursorOffset(range, ref.current);

    if (e.key === "/" && isReallyEmpty(e.currentTarget) ) {
      console.log(onSlashCommand);
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      let y = rect.bottom + 4;
      if (spaceBelow < MENU_HEIGHT) y = rect.top - MENU_HEIGHT - 80;
      let x = rect.left;
      if (x + MENU_WIDTH > window.innerWidth) x = window.innerWidth - MENU_WIDTH - 8;
      onSlashCommand({ x, y });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onEnter(cursorOffset, text);
    } else if (e.key === "Backspace") {
      const atStart = cursorOffset === 0;
      onBackspace(atStart, text);
    }
  };

  return (
    <div
      ref={ref}
      contentEditable={!isMenuOpen && !readOnly} // Disable editing when menu is open
      suppressContentEditableWarning
      className="min-h-[1.8em] w-full text-base leading-relaxed text-foreground outline-none empty:before:text-foreground-subtle/50 empty:before:content-[attr(data-placeholder)]"
      data-placeholder="Type '/' for commands"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    />
  );
};