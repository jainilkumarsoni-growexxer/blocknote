
import { useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { getCursorOffset } from "../../utils/editorHelpers";

const MENU_HEIGHT = 260;
const MENU_WIDTH = 224;

export const TodoBlock = ({
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
  const checked = block.content.checked || false;

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

  const toggleCheck = () => {
    if (readOnly) return;
    onUpdate({ ...block.content, checked: !checked });
  };

  const handleInput = (e) => {
    if (readOnly) return;
    const text = e.currentTarget.innerText;
    onUpdate({ ...block.content, text });
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
    <div className="flex items-start gap-3">
      <button
        onClick={toggleCheck}
        disabled={readOnly}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-accent bg-accent text-white"
            : "border-border bg-transparent"
        } ${!readOnly && "hover:border-border-hover"}`}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </button>
      <div
        ref={ref}
        contentEditable={!isMenuOpen && !readOnly}
        suppressContentEditableWarning
        className={`min-h-[1.8em] w-full text-base leading-relaxed outline-none ${
          checked ? "text-foreground-muted line-through" : "text-foreground"
        } ${
          !readOnly
            ? "empty:before:text-foreground-subtle/50 empty:before:content-[attr(data-placeholder)]"
            : ""
        }`}
        data-placeholder="To-do"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};