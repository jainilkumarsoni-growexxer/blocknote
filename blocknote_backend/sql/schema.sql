-- BlockNote Database Schema
-- PostgreSQL 14+

-- Enable UUID extension for share token generation (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: user
-- Stores registered user accounts
-- ============================================================
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: document
-- Stores document metadata, ownership, and sharing settings
-- ============================================================
CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    share_token VARCHAR(64) UNIQUE,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: block
-- Stores individual blocks of a document.
-- order_index is DOUBLE PRECISION (FLOAT) for fractional ordering.
-- content is JSONB for flexible block-specific data.
-- ============================================================
CREATE TABLE block (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES document(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES block(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_index DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Indexes for Performance
-- ============================================================
CREATE INDEX idx_document_user_id ON document(user_id);
CREATE INDEX idx_block_document_id ON block(document_id);
CREATE INDEX idx_block_order ON block(document_id, order_index);
CREATE INDEX idx_document_share_token ON document(share_token);

-- ============================================================
-- Optional: Trigger to auto-update document.updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_updated_at
    BEFORE UPDATE ON document
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
