/**
 * Calculates the cursor offset relative to the entire text content of a contenteditable element,
 * even when the cursor is inside nested text nodes.
 * 
 * @param {Range} range - The current selection range
 * @param {HTMLElement} container - The contenteditable container element
 * @returns {number} - The character offset from the start of the container's text
 */
export const getCursorOffset = (range, container) => {
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(container);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
};