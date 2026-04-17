import pool from '../config/db.js';

export const validateShareToken = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({ message: 'Share token required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, is_public FROM document WHERE share_token = $1',
      [token]
    );
    const document = result.rows[0];
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (!document.is_public) {
      return res.status(403).json({ message: 'Document is not publicly shared' });
    }
    req.documentId = document.id;
    req.isShareToken = true; // Flag for read‑only enforcement
    next();
  } catch (error) {
    next(error);
  }
};