
import { useRef, useEffect } from "react";
import { getCursorOffset } from "../../utils/editorHelpers";

const MENU_HEIGHT = 260;
const MENU_WIDTH = 224;

const HeadingBlock = ({
  block,
  onUpdate,
  onEnter,
  onBackspace,
  onSlashCommand,
  registerRef,
  level,
  isMenuOpen,
  readOnly = false,
}) => {
  const ref = useRef(null);
  const Tag = level === 1 ? "h1" : "h2";
  const sizeClasses = {
    1: "text-3xl font-semibold tracking-tight",
    2: "text-2xl font-semibold tracking-tight",
  };

  useEffect(() => {
    if (ref.current) {
      registerRef(ref.current);
      const currentText = block.content.text || "";
      if (ref.current.innerText !== currentText) {
        ref.current.innerText = currentText;
      }
    }
    return () => registerRef(null);
  }, [registerRef, block.content.text]);

  useEffect(() => {
    const el = ref.current;
    if (!el || readOnly) return;
    const handleKeyUp = (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (el.innerText.trim() === "" && el.innerHTML !== "") {
          el.innerHTML = "";
        }
      }
    };
    el.addEventListener("keyup", handleKeyUp);
    return () => el.removeEventListener("keyup", handleKeyUp);
  }, [readOnly]);

  const handleInput = (e) => {
    if (readOnly) return;
    const text = e.currentTarget.innerText;
    onUpdate({ text });
  };

  const isReallyEmpty = (element) => {
    const text = element.innerText || "";
    return text.trim().length === 0;
  };

  const handleKeyDown = (e) => {
    if (readOnly) return;
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const text = e.currentTarget.innerText || "";
    const cursorOffset = getCursorOffset(range, ref.current);

    if (e.key === "/" && isReallyEmpty(e.currentTarget) && !isMenuOpen) {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      let y = rect.bottom + 4;
      if (spaceBelow < MENU_HEIGHT) y = rect.top - MENU_HEIGHT - 85;
      let x = rect.left;
      if (x + MENU_WIDTH > window.innerWidth) x = window.innerWidth - MENU_WIDTH - 30;
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
    <Tag
      ref={ref}
      contentEditable={!isMenuOpen && !readOnly}
      suppressContentEditableWarning
      className={`${sizeClasses[level]} w-full text-foreground outline-none ${
        !readOnly
          ? "empty:before:text-foreground-subtle/50 empty:before:content-[attr(data-placeholder)]"
          : ""
      }`}
      data-placeholder={`Heading ${level}`}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    />
  );
};

export const Heading1Block = (props) => <HeadingBlock {...props} level={1} />;
export const Heading2Block = (props) => <HeadingBlock {...props} level={2} />;