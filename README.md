# BlockNote – A Notion-Style Block Editor

BlockNote is a browser-based document editor where users create documents made of typed blocks. Documents auto-save and can be shared via read-only public links. Think Notion—built entirely from scratch.

**Live URL :** https://blocknote-ws1b.onrender.com/

**GitHub Repository :** https://github.com/jainilkumarsoni-growexxer/blocknote

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [Architecture Decisions](#architecture-decisions)
4. [Known Issues](#known-issues)
5. [Edge Case Decisions](#edge-case-decisions)

---

## 1. Setup Instructions

### 1.1 Prerequisites

* **Node.js** ≥ 18.x
* **PostgreSQL** ≥ 14.x
* **npm** ≥ 9.x or **yarn** ≥ 1.22.x
* (Optional) **Docker** and **Docker Compose**

---

### 1.2 Local Development Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/blocknote.git
cd blocknote
```

---

#### Step 2: Database Setup

Create a PostgreSQL database named `blocknote_db` (or any name you prefer).

**Using psql:**

```bash
psql -U postgres
CREATE DATABASE blocknote_db;
\q
```

Run schema:

```bash
psql -U postgres -d blocknote_db -f blocknote_backend/sql/schema.sql
```

**Using pgAdmin:**

* Create database → `blocknote_db`
* Open Query Tool → paste `backend/sql/schema.sql` → Execute

Schema includes:

* `user`
* `document`
* `block`

With:

* indexes
* foreign keys
* `order_index` as `DOUBLE PRECISION` (fractional ordering support)

---

#### Step 3: Backend Configuration

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

* DB_PASSWORD
* JWT_SECRET
* JWT_REFRESH_SECRET

Run server:

```bash
npm run dev
```

Expected output:

```
✅ Connected to PostgreSQL database
🚀 Server running on http://localhost:5000
```

---

#### Step 4: Frontend Configuration

```bash
cd ../frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 1.3 Running with Docker Compose

```bash
docker-compose up -d
```

This will:

* Start PostgreSQL container
* Start backend server
* Serve frontend via Nginx

---

## 2. Environment Variables

### Backend (`blocknote_backend/.env.example`)

| Variable               | Required | Default      | Description                       |
| ---------------------- | -------- | ------------ | --------------------------------- |
| PORT                   | No       | 5000         | Express port                      |
| NODE_ENV               | No       | development  | Production enables secure cookies |
| DB_HOST                | Yes      | localhost    | DB host                           |
| DB_PORT                | Yes      | 5432         | DB port                           |
| DB_USER                | Yes      | postgres     | DB user                           |
| DB_PASSWORD            | Yes      | —            | DB password                       |
| DB_NAME                | Yes      | blocknote_db | DB name                           |
| JWT_SECRET             | Yes      | —            | Access token secret               |
| JWT_REFRESH_SECRET     | Yes      | —            | Refresh token secret              |
| JWT_EXPIRES_IN         | No       | 15m          | Access TTL                        |
| JWT_REFRESH_EXPIRES_IN | No       | 7d           | Refresh TTL                       |

---

### Frontend (`blocknote_frontend/.env.example`)

| Variable     | Required | Description  |
| ------------ | -------- | ------------ |
| VITE_API_URL | Yes      | API base URL |

---

## 3. Architecture Decisions

### 3.1 Frontend

**React + Vite**
Fast dev with HMR and optimized builds.

**Tailwind CSS**
Used for modern UI (dark theme, gradients, shadows).

**@dnd-kit**
Accessible drag-and-drop with smooth animations.

**Custom contentEditable system**

* Cursor tracking via TreeWalker
* Enter → split blocks
* Backspace → merge blocks
* Prevent default browser DOM mutations
* Focus management

**State Management**

* Custom hooks: `useBlocks`, `useDocuments`, `useAuth`
* Optimistic updates
* Debounced auto-save
* Axios interceptors for token refresh

---

### 3.2 Backend

**Express.js**
Minimal and flexible.

**PostgreSQL (pg driver)**

* Raw SQL
* Parameterized queries (`$1`, `$2`)
* Transactions for atomic operations

**JWT + HTTP-only cookies**

* Secure
* Prevent XSS
* SameSite=Strict for CSRF protection

**REST API**

* `/auth`
* `/documents`
* `/blocks`
* Ownership checks on all write routes

---

### 3.3 Why No ORM?

* Needed precise control over `order_index`
* Midpoint calculation required
* ORM abstraction would complicate logic
* Raw SQL gives full control + performance

---

### 3.4 Authentication Flow

1. Register → hash password
2. Login → issue tokens + cookies
3. Requests → accessToken cookie used
4. Refresh → new tokens issued
5. Logout → cookies cleared

---

## 4. Known Issues

| Issue                     | Impact            | Notes                     |
| ------------------------- | ----------------- | ------------------------- |
| Slash menu overflow       | UI overflow       | Edge screens              |
| No syntax highlighting    | Plain code blocks | Out of scope              |
| No image upload           | URL only          | Spec limitation           |
| Mobile DnD issues         | Poor UX           | Desktop-focused           |
| No collaboration          | Single user only  | Not required              |
| Renormalization edge case | Precision loss    | Only triggered on reorder |

---

## 5. Edge Case Decisions

### Enter mid-block split

* Uses TreeWalker for accurate cursor offset
* Splits content exactly
* Moves remaining text to new block
* Cursor placed correctly

---

### Backspace on first block

* No action
* Prevents empty document state

---

### Backspace with non-text previous block

* Deletes current block
* No merge (invalid structure)

---

### Slash menu text bleed

* Uses `slashMode`
* Prevents text rendering
* Captures input separately
* Fully controlled UI state

---

### Order index precision

* Uses midpoint formula:

```
(prev + next) / 2
```

* Renormalize when gap < 0.001
* Reset to: 0,1,2,3...

---

### Share token read-only

* Middleware blocks all writes
* Enforced server-side (secure)

---

### Auto-save race condition

* Debounce (1s)
* AbortController
* Versioning system
* Prevents stale overwrite

---

### Document ownership

* Query: `WHERE id = $1 AND user_id = $2`
* Returns 403 if mismatch
* Applied everywhere

---

## License

This project was created as part of an internship assignment and is not licensed for general use.

