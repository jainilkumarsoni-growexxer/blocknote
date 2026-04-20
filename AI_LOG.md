# AI_LOG.md

This document logs all significant AI interactions during the development of **BlockNote**, a Notion‑style block editor. Each entry captures the problem, the AI‑generated solution, identified issues, and manual refinements. This log demonstrates a clear understanding of the codebase and the reasoning behind critical implementation decisions.

---

## 13 - April - 2026 (Day 1 – Setup & Authentication Foundation)

### Entry 1 – Design System & UI Foundation

**Tool:** Claude

**What I asked for:**  
Set up the frontend with Tailwind CSS and implement the Linear/Modern design system. Provide a reusable component library (`Button`, `Card`, `Input`, `Spinner`) and a multi‑layer ambient background with animated blobs and a grid overlay.

**What it generated:**  
Complete `tailwind.config.js` with custom colors, shadows, keyframes (`float`, `shimmer`), and utility classes. `BackgroundLayer` component using fixed‑position divs for radial gradients, SVG noise, and CSS grid. Base UI components styled with the design tokens.

**What was wrong or missing:**  
- The `Button` component used an `asChild` prop which React does not recognize, causing console errors.  
- The `Card` component applied `overflow-hidden` for the spotlight effect, which clipped absolutely positioned dropdown menus.

**What I changed and why:**  
- Replaced `asChild` with a polymorphic `as` prop (`as: Component = "button"`) to support both native buttons and React Router `Link` components without passing unrecognized DOM attributes.  
- Removed `overflow-hidden` from `Card` and moved the spotlight effect to a separate `::before` pseudo‑element. This allowed dropdown menus to overflow naturally while preserving the hover glow.

---

### Entry 2 – Authentication Backend Setup

**Tool:** Claude

**What I asked for:**  
Implement secure user registration, login, and refresh token endpoints using JWT stored in HTTP‑only cookies. Use parameterized PostgreSQL queries and bcrypt for password hashing.

**What it generated:**  
- `jwt.js` utilities for token generation/verification.  
- `authService.js` with `registerUser` and `loginUser` functions.  
- `authController.js` handling requests and setting cookies via `setAuthCookies`.  
- SQL queries for user creation and lookup.

**What was wrong or missing:**  
The initial refresh token logic did not include token rotation—the same refresh token could be reused indefinitely, creating a security risk.

**What I changed and why:**  
I implemented stateless refresh token rotation: each refresh request issues a **new** refresh token and overwrites the cookie. The old token remains cryptographically valid but is discarded by the client. This limits the window of abuse without requiring a server‑side denylist, aligning with the assignment's simplicity requirement.

---

### Entry 3 – Frontend Auth Integration

**Tool:** DeepSeek

**What I asked for:**  
Integrate the cookie‑based authentication with the React frontend. Create an `AuthProvider`, `useAuth` hook, and Axios interceptor to automatically refresh tokens on 401 responses.

**What it generated:**  
- `api.js` with response interceptor that calls `/auth/refresh` on 401 and retries the original request.  
- `useAuth.jsx` with `login`, `register`, `logout` functions and an effect that calls `getCurrentUser` on mount to restore session.

**What was wrong or missing:**  
- The `getCurrentUser` call on every page load caused unnecessary 401 errors on public pages (Home, Login, Register).  
- The interceptor also attempted to refresh on 401 responses from the `/auth/login` endpoint when credentials were invalid.

**What I changed and why:**  
- Removed the global `getCurrentUser` call. Instead, created a `RequireAuth` wrapper component that verifies the session **only when navigating to protected routes**.  
- Modified the Axios interceptor to skip refresh logic for `/auth/login` and `/auth/register` endpoints, preventing infinite loops during failed login attempts.

---

## 14 - April - 2026 (Day 2 – Core Editor Behavior)

### Entry 4 – Block Components & ContentEditable

**Tool:** DeepSeek

**What I asked for:**  
Create individual block components (`ParagraphBlock`, `Heading1Block`, `Heading2Block`, `TodoBlock`, `CodeBlock`, `DividerBlock`, `ImageBlock`) that handle their own `contentEditable` state and sync with the global block store.

**What it generated:**  
Each block as a `contentEditable` div with `onInput` and `onKeyDown` handlers. Props `onUpdate`, `onEnter`, `onBackspace` to communicate with the parent `EditorContainer`.

**What was wrong or missing:**  
The initial `TodoBlock` and `CodeBlock` did not correctly prevent the slash menu from appearing. The `/` key detection used `range.startOffset` which is unreliable when the cursor is inside a nested text node (e.g., after deleting content).

**What I changed and why:**  
Created a shared `getCursorOffset` utility that uses a `TreeWalker` to compute the exact character offset relative to the entire block text, regardless of DOM structure. Applied this to all text blocks. This ensures slash detection and Enter splitting work correctly even with formatting or after backspace operations.

---

### Entry 5 – Enter Mid‑Block Split (Required Entry)

**Tool:** Claude

**What I asked for:**  
Implement the Enter key behavior: when pressed in the middle of a block, split the text—content before the cursor stays, content after moves to a new paragraph block below. Zero text loss, cursor moves to the start of the new block.

**What it generated:**  
`handleEnter` in `EditorContainer` that sliced the text using `cursorOffset`, updated the current block with `beforeText`, and created a new block with `afterText`.

**What was wrong or missing:**  
The `cursorOffset` passed from the block components was incorrectly calculated. Using `range.startOffset` alone failed when the cursor was inside a `<span>` or text node child, causing text loss or duplication.

**What I changed and why:**  
I replaced the offset calculation in every text block with the `getCursorOffset` helper (see Entry 4). This ensured the split point was exact. Additionally, I modified `handleEnter` to always create a **paragraph** block for the split content, regardless of the original block type, to maintain consistent behavior. After creation, `focusAfterUpdate` places the cursor at the start of the new block.

---

### Entry 6 – Slash Command Menu & Text Bleed Prevention

**Tool:** DeepSeek

**What I asked for:**  
Implement a slash command menu that opens when `/` is pressed at the start of an empty block. The characters `/heading` must **not** appear in the block content. Pressing Escape should dismiss the menu and leave the block empty. Selecting a type should clear the content.

**What it generated:**  
`SlashMenu` component positioned near the cursor. In `ParagraphBlock`, `handleKeyDown` called `preventDefault()` on `/` and opened the menu, but the browser still inserted the character before the event was fully canceled.

**What was wrong or missing:**  
Despite `preventDefault()`, the `/` character sometimes appeared. After selecting a type, the block content was not cleared. The menu did not filter as the user typed because the query was not being captured.

**What I changed and why:**  
I introduced a `slashMode` state in each text block. When `/` is pressed and the block is empty, `slashMode` becomes `true`. In this mode, `handleInput` captures typed characters into a `slashQuery` state and **immediately resets the `innerText` to empty**, preventing any visible text. The query is passed up to `EditorContainer`, which updates the `SlashMenu` filter. Pressing Escape exits slash mode and clears the query. Selecting a block type calls `changeBlockType`, which resets the content. This fully eliminates text bleed.

---

## 15 - April - 2026 (Day 3 – Drag & Drop, Order Index)

### Entry 7 – Drag‑and‑Drop Reordering

**Tool:** Claude

**What I asked for:**  
Add drag‑and‑drop reordering using `@dnd-kit/sortable`. Each block should have a drag handle that appears on hover. The new order must persist to the backend.

**What it generated:**  
`EditorContainer` wrapped with `DndContext` and `SortableContext`. `BlockRenderer` integrated `useSortable`. `handleDragEnd` used `arrayMove` to reorder the blocks array.

**What was wrong or missing:**  
The drag overlay appeared far away from the cursor horizontally due to the left margin on the block container. The cursor did not change to `grabbing` during drag.

**What I changed and why:**  
- Added a `isOverlay` prop to `BlockRenderer` that removes the left margin (`ml-0`) and adds a stronger shadow, making the overlay align perfectly with the cursor.  
- Added global CSS `.dnd-dragging * { cursor: grabbing !important; }` and applied the class to `document.body` during drag via `handleDragStart`/`handleDragEnd`.

---

### Entry 8 – Order Index Precision & Midpoint Calculation (Required Entry)

**Tool:** DeepSeek

**What I asked for:**  
Implement `order_index` as a FLOAT. When a block is inserted between two others, it should receive the midpoint value. After many reorders, if the gap between two consecutive blocks becomes less than 0.001, re‑normalize by reassigning integer‑spaced values.

**What it generated:**  
Initial suggestion used integer `order_index` values (0, 1, 2). Midpoint calculation was provided for inserting new blocks. A `renormalizeOrderIndexes` function was included in `useBlocks`.

**What was wrong or missing:**  
- **Integers first:** The AI initially proposed integers; I corrected this to enforce `DOUBLE PRECISION` in the database and use midpoints from the start.  
- The drag‑and‑drop handler recalculated `order_index` for **all** blocks using original values, causing inversion when moving blocks across each other (e.g., moving block 2 to position 4 resulted in wrong relative ordering).

**What I changed and why:**  
I rewrote `handleDragEnd` to update **only the moved block's `order_index`** using the midpoint of its new neighbors. All other blocks keep their existing values. This guarantees the visual order matches the numeric order. The `reorderBlocks` function triggers `renormalizeOrderIndexes` after every reorder, which checks the gap condition and reassigns 0.0, 1.0, 2.0… when needed. This meets the edge‑case requirement precisely.

---

### Entry 9 – Auto‑save with Race Condition Prevention

**Tool:** Claude

**What I asked for:**  
Documents must save automatically 1 second after the user stops typing. Stale writes must not overwrite newer content. Use `AbortController` or server‑side versioning.

**What it generated:**  
`useAutosave` hook with `debounceMs`, `AbortController`, and a `versionRef`. The `triggerSave` function cleared previous timeouts and aborted in‑flight requests before scheduling a new save.

**What was wrong or missing:**  
The `updateBlock` function in `useBlocks` still made an immediate `PATCH /blocks/:id` call on every keystroke, completely bypassing the debounced batch save. The status indicator showed "Saving…" immediately on every keystroke even though the actual batch request was debounced.

**What I changed and why:**  
- Removed the API call from `updateBlock`—it now only updates local state optimistically.  
- Modified `useAutosave` to collect all changed blocks and send them via `POST /blocks/batch` after the debounce period.  
- Adjusted the status indicator: "Saved" remains during the debounce window; "Saving…" appears only while the network request is in‑flight. This provides accurate feedback and prevents race conditions.

---

## 16 - April - 2026 (Day 4 – Sharing & Read‑Only View)

### Entry 10 – Share Token Generation & Public Toggle

**Tool:** DeepSeek

**What I asked for:**  
Add a "Share" button that opens a modal. The owner can toggle public access and generate a shareable link. The link should point to `/share/:token`.

**What it generated:**  
`ShareButton` component with modal, toggle switch, and copy functionality. Backend endpoints `GET`, `POST`, `PATCH /api/documents/:id/share`.

**What was wrong or missing:**  
The `POST` endpoint was missing initially, causing 404 errors when generating a link. The toggle UI was basic and the knob overflowed the track.

**What I changed and why:**  
- Added the missing `generateShareLink` controller and route.  
- Redesigned the toggle with proper dimensions (`h-5 w-9`, knob `h-4 w-4`), `overflow-hidden`, and a smooth `translate-x` transition. Added descriptive labels ("Anyone with the link can view" / "Only you can access") for clarity.

---

### Entry 11 – Read‑Only Shared View & UI Consistency

**Tool:** Claude

**What I asked for:**  
Create a public `ShareViewPage` that displays the document in read‑only mode. The UI should match the editor page: a fixed title inside a bordered, scrollable box with backdrop blur.

**What it generated:**  
`ShareViewPage` with `BackgroundLayer` and a `ReadOnlyEditor` component that rendered blocks using `BlockRenderer`.

**What was wrong or missing:**  
The shared view still showed interactive elements (drag handles, add/delete buttons, hover borders) and placeholders ("Type '/' for commands") in empty blocks. The image block displayed an edit button on hover.

**What I changed and why:**  
- Added a `readOnly` prop to `BlockRenderer` and all block components. When true, `contentEditable` is disabled, drag handles and action buttons are hidden, hover borders are removed, and empty blocks display no placeholder.  
- Modified `ImageBlock` to hide the edit button when `readOnly={true}`.  
- This provides a clean, view‑only experience that exactly mirrors the editor's visual style without exposing any edit controls.

---

### Entry 12 – Share Token Read‑Only at API Level (Required Entry)

**Tool:** DeepSeek

**What I asked for:**  
Enforce read‑only access for share tokens at the API level. A `POST /blocks` request using a share token must be rejected by the server.

**What it generated:**  
`validateShareToken` middleware that checks the token, sets `req.documentId` and `req.isShareToken`. Suggested blocking write endpoints based on `req.isShareToken`.

**What was wrong or missing:**  
The middleware was created, but the block routes did not actually use it to reject writes. A determined user could still modify blocks via direct API calls.

**What I changed and why:**  
I added a `blockWritesForShareToken` middleware that returns 403 if `req.isShareToken` is true. I applied this middleware to all block write routes (`POST`, `PATCH`, `DELETE`, `/batch`, `/reorder`). This ensures read‑only enforcement is not bypassed, fulfilling the security requirement.

---

## 17 - April - 2026 (Day 5 – Polish & Edge Cases)

### Entry 13 – Cross‑Account Document Access Protection (Required Entry)

**Tool:** Claude

**What I asked for:**  
Ensure that `GET /documents/:id` verifies the document belongs to the requesting user. Cross‑account access must return 403.

**What it generated:**  
SQL queries with `WHERE user_id = $1` clauses. Suggested a middleware to verify ownership.

**What was wrong or missing:**  
The generated code for `getDocumentById` allowed calling without a `userId` parameter, which could be exploited in some controller actions. Not all document‑related endpoints had the check.

**What I changed and why:**  
**Manual coding decision:** I chose to manually audit every document and block controller. I refactored `getDocumentById` to require `userId` for all authenticated requests and created a reusable `verifyDocumentOwnership` helper that throws a 403 if the document is not owned by `req.userId`. I applied this helper in every protected endpoint. I did not rely solely on AI because security flaws in ownership checks could lead to data leaks, which would be a critical failure in evaluation.

---

### Entry 14 – Code Block Newline Behavior

**Tool:** DeepSeek

**What I asked for:**  
In `CodeBlock`, pressing `Enter` should insert a newline (`\n`) without creating a new block. `Shift+Enter` should create a new paragraph block below.

**What it generated:**  
`handleKeyDown` logic that called `onEnter` for `Enter` (creating a new block) and inserted two spaces for `Tab`.

**What was wrong or missing:**  
The AI did not distinguish between `Enter` and `Shift+Enter`. Inserting a newline via `document.createTextNode('\n')` was unreliable—the cursor did not move to the new line consistently.

**What I changed and why:**  
- Modified the key handler: `Enter` without Shift calls `document.execCommand('insertLineBreak')` (a reliable, native method for `contentEditable`) and stays within the code block.  
- `Shift+Enter` calls `onEnter`, which creates a new paragraph block.  
- This provides the expected code‑editor behavior while maintaining consistency with other blocks.

---

### Entry 15 – Backspace on Empty Block Focus Behavior

**Tool:** Claude

**What I asked for:**  
When Backspace is pressed at the start of an empty block, the block should be deleted and the cursor should move to the **end** of the previous block.

**What it generated:**  
`handleBackspace` logic that deleted the empty block and called `focusBlockEnd(prevBlockId)`.

**What was wrong or missing:**  
The `focusBlockEnd` function used a simple `range.setStart(element, 0)` which placed the cursor at the start of the previous block, not the end. The error occurred because the element sometimes contained multiple text nodes.

**What I changed and why:**  
I rewrote `focusBlockEnd` to use a `TreeWalker` that finds the **last text node** within the element and sets the cursor at its length. If no text node exists, it falls back to the element start. This guarantees the cursor lands after all visible content, providing the expected Notion‑like behavior.

---

## Summary of Manual Coding Decisions

| Date | Reason |
|------|--------|
| 14-04-2026 | **Enter split cursor offset :** AI's `range.startOffset` was unreliable; I wrote a `TreeWalker`‑based helper to accurately measure cursor position across nested DOM nodes. |
| 15-04-2026 | **Drag reorder logic :** AI's batch recalculation caused inversions; I implemented single‑block midpoint insertion to preserve ordering integrity. |
| 16-04-2026 | **Cross‑account protection:** I manually verified and hardened all ownership checks because security flaws could not be left to AI‑generated assumptions. |
| 17-04-2026 | **Backspace focus behavior:** AI's initial focus function was incorrect; I rewrote it using a `TreeWalker` to reliably place the cursor at the end of the previous block. |

All other code was generated with AI assistance and then carefully reviewed, tested, and refined to meet the assignment's strict edge‑case requirements.
