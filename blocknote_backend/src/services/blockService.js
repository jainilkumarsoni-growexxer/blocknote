import pool from '../config/db.js';


export const getBlocksByDocumentId = async (documentId) => {
  const result = await pool.query(
    `SELECT id, document_id, type, content, order_index, parent_id, created_at 
     FROM block 
     WHERE document_id = $1 
     ORDER BY order_index ASC`,
    [documentId]
  );
  return result.rows;
};


export const createBlock = async (documentId, blockData) => {
  const { type, content = {}, order_index, parent_id = null } = blockData;
  const result = await pool.query(
    `INSERT INTO block (document_id, type, content, order_index, parent_id) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, document_id, type, content, order_index, parent_id, created_at`,
    [documentId, type, content, order_index, parent_id]
  );
  return result.rows[0];
};




export const updateBlock = async (blockId, updates) => {
  const { type, content, order_index } = updates;
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (type !== undefined) {
    setClauses.push(`type = $${paramIndex++}`);
    values.push(type);
  }
  if (content !== undefined) {
    setClauses.push(`content = $${paramIndex++}`);
    values.push(JSON.stringify(content));
  }
  if (order_index !== undefined) {
    setClauses.push(`order_index = $${paramIndex++}`);
    values.push(order_index);
  }

  if (setClauses.length === 0) return null;

  values.push(blockId);
  const result = await pool.query(
    `UPDATE block SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
};


export const deleteBlock = async (blockId) => {
  const result = await pool.query('DELETE FROM block WHERE id = $1 RETURNING id', [blockId]);
  return result.rows[0];
};


export const batchUpdateBlocks = async (documentId, blocks, version) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const block of blocks) {
      await client.query(
        `UPDATE block SET content = $1, order_index = $2 WHERE id = $3 AND document_id = $4`,
        [JSON.stringify(block.content), block.order_index, block.id, documentId]
      );
    }
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


export const reorderBlocks = async (documentId, blocks) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const block of blocks) {
      await client.query(
        `UPDATE block SET order_index = $1 WHERE id = $2 AND document_id = $3`,
        [block.order_index, block.id, documentId]
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};