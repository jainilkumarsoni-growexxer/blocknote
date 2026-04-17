import pool from '../config/db.js';

export const getUserDocuments = async (userId) => {
  const result = await pool.query(
    `SELECT id, title, updated_at, created_at, share_token, is_public 
     FROM document 
     WHERE user_id = $1 
     ORDER BY updated_at DESC`,
    [userId]
  );
  return result.rows;
};

export const createDocument = async (userId, title = 'Untitled') => {
  const result = await pool.query(
    `INSERT INTO document (user_id, title) 
     VALUES ($1, $2) 
     RETURNING id, title, updated_at, created_at, share_token, is_public`,
    [userId, title]
  );
  return result.rows[0];
};



export const getDocumentById = async (documentId, userId = null) => {
  let query;
  let params;
  if (userId) {
    query = `SELECT id, title, updated_at, created_at, share_token, is_public 
             FROM document 
             WHERE id = $1 AND user_id = $2`;
    params = [documentId, userId];
  } else {
    query = `SELECT id, title, updated_at, created_at, share_token, is_public 
             FROM document 
             WHERE id = $1`;
    params = [documentId];
  }
  const result = await pool.query(query, params);
  return result.rows[0];
};




export const updateDocument = async (documentId, userId, updates) => {
  const { title, is_public, share_token } = updates;
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(title);
  }
  if (is_public !== undefined) {
    setClauses.push(`is_public = $${paramIndex++}`);
    values.push(is_public);
  }
  if (share_token !== undefined) {
    setClauses.push(`share_token = $${paramIndex++}`);
    values.push(share_token);
  }
  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(documentId, userId);
  const result = await pool.query(
    `UPDATE document 
     SET ${setClauses.join(', ')} 
     WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
     RETURNING id, title, updated_at, is_public, share_token`,
    values
  );
  return result.rows[0];
};

export const deleteDocument = async (documentId, userId) => {
  const result = await pool.query(
    `DELETE FROM document WHERE id = $1 AND user_id = $2 RETURNING id`,
    [documentId, userId]
  );
  return result.rows[0];
};